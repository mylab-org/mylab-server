import { Injectable } from '@nestjs/common';
import { EquipmentRequestStatus, Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CommonException } from '../common/exceptions/common.exception.js';
import { EQUIPMENT_ERRORS } from './constants/equipment.error.js';
import { CreateEquipmentRequestDto } from './dto/request/create-equipment.request.dto.js';
import { UpdateEquipmentRequestDto } from './dto/request/update-equipment.request.dto.js';
import { DeleteEquipmentsRequestDto } from './dto/request/delete-equipments.request.dto.js';
import { RentalRequestDto } from './dto/request/rental.request.dto.js';
import { CreateEquipmentPurchaseRequestDto } from './dto/request/create-equipment-purchase.request.dto.js';
import { GetEquipmentPurchasesRequestDto } from './dto/request/get-equipment-purchases.request.dto.js';
import { ReviewEquipmentPurchasesRequestDto } from './dto/request/review-equipment-purchases.request.dto.js';
import { EquipmentResponseDto } from './dto/response/equipment.response.dto.js';
import { RentalResponseDto } from './dto/response/rental.response.dto.js';
import { EquipmentPurchaseResponseDto } from './dto/response/equipment-purchase.response.dto.js';

const MAX_RENTAL_DAYS = 30;
const RENTAL_START_GRACE_MS = 5 * 60 * 1000;

const rentalSelect = {
  id: true,
  equipment_id: true,
  user_id: true,
  start_at: true,
  end_at: true,
  equipments: { select: { name: true } },
  users: { select: { name: true } },
} satisfies Prisma.equipment_rentalsSelect;

type RentalRow = Prisma.equipment_rentalsGetPayload<{ select: typeof rentalSelect }>;

const purchaseInclude = {
  requester: { select: { name: true } },
} satisfies Prisma.equipment_requestsInclude;

type PurchaseRow = Prisma.equipment_requestsGetPayload<{ include: typeof purchaseInclude }>;

@Injectable()
export class EquipmentService {
  constructor(private prisma: PrismaService) {}

  // 비품 목록 조회 (진행 중/예정 대여 포함)
  async getEquipments(userId: number, labId: number): Promise<EquipmentResponseDto[]> {
    await this.chkUserInLab(userId, labId);

    const equipments = await this.prisma.equipments.findMany({
      where: { lab_id: BigInt(labId) },
      orderBy: { created_at: 'asc' },
      include: {
        equipment_rentals: {
          where: { end_at: { gt: new Date() } },
          orderBy: { start_at: 'asc' },
          select: rentalSelect,
        },
      },
    });

    return equipments.map((equipment) => ({
      equipmentId: Number(equipment.id),
      name: equipment.name,
      imageUrl: equipment.image_url,
      isRentable: equipment.is_rentable,
      rentals: equipment.equipment_rentals.map((rental) => this.toRentalResponse(rental)),
    }));
  }

  // 비품 등록
  async createEquipment(
    userId: number,
    labId: number,
    dto: CreateEquipmentRequestDto,
  ): Promise<EquipmentResponseDto> {
    await this.chkUserPermission(userId, labId);

    const equipment = await this.prisma.equipments.create({
      data: {
        lab_id: BigInt(labId),
        name: dto.name,
        image_url: dto.imageUrl,
        created_by: BigInt(userId),
      },
    });

    return {
      equipmentId: Number(equipment.id),
      name: equipment.name,
      imageUrl: equipment.image_url,
      isRentable: equipment.is_rentable,
      rentals: [],
    };
  }

  // 비품 수정 (이름, 사진, 대여 활성화)
  async updateEquipment(
    userId: number,
    labId: number,
    equipmentId: number,
    dto: UpdateEquipmentRequestDto,
  ): Promise<{ message: string }> {
    await this.chkUserPermission(userId, labId);
    await this.findEquipmentOrThrow(labId, equipmentId);

    await this.prisma.equipments.update({
      where: { id: BigInt(equipmentId) },
      data: {
        name: dto.name,
        image_url: dto.imageUrl,
        is_rentable: dto.isRentable,
      },
    });

    return { message: '비품 정보가 수정되었습니다.' };
  }

  // 비품 삭제 (여러 개)
  async deleteEquipments(
    userId: number,
    labId: number,
    dto: DeleteEquipmentsRequestDto,
  ): Promise<{ message: string }> {
    await this.chkUserPermission(userId, labId);

    const result = await this.prisma.equipments.deleteMany({
      where: { id: { in: dto.equipmentIds.map((id) => BigInt(id)) }, lab_id: BigInt(labId) },
    });

    if (result.count === 0) {
      throw new CommonException(EQUIPMENT_ERRORS.EQUIPMENT_NOT_FOUND);
    }

    return { message: `비품 ${result.count}개가 삭제되었습니다.` };
  }

  // 대여 신청
  async createRental(
    userId: number,
    labId: number,
    equipmentId: number,
    dto: RentalRequestDto,
  ): Promise<RentalResponseDto> {
    await this.chkUserInLab(userId, labId);
    const equipment = await this.findEquipmentOrThrow(labId, equipmentId);
    if (!equipment.is_rentable) {
      throw new CommonException(EQUIPMENT_ERRORS.EQUIPMENT_NOT_RENTABLE);
    }

    const { startAt, endAt } = this.validateRentalPeriod(dto);

    const rental = await this.prisma.$transaction(
      async (tx) => {
        await this.chkRentalConflict(tx, equipmentId, startAt, endAt);
        return tx.equipment_rentals.create({
          data: {
            equipment_id: BigInt(equipmentId),
            user_id: BigInt(userId),
            start_at: startAt,
            end_at: endAt,
          },
          select: rentalSelect,
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    return this.toRentalResponse(rental);
  }

  // 대여 시간 변경 (본인만)
  async updateRental(
    userId: number,
    labId: number,
    equipmentId: number,
    rentalId: number,
    dto: RentalRequestDto,
  ): Promise<RentalResponseDto> {
    await this.chkUserInLab(userId, labId);
    const rental = await this.findRentalOrThrow(labId, equipmentId, rentalId);
    if (rental.user_id !== BigInt(userId)) {
      throw new CommonException(EQUIPMENT_ERRORS.NOT_RENTAL_OWNER);
    }

    const { startAt, endAt } = this.validateRentalPeriod(dto);

    const updated = await this.prisma.$transaction(
      async (tx) => {
        await this.chkRentalConflict(tx, equipmentId, startAt, endAt, rentalId);
        return tx.equipment_rentals.update({
          where: { id: BigInt(rentalId) },
          data: { start_at: startAt, end_at: endAt },
          select: rentalSelect,
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    return this.toRentalResponse(updated);
  }

  // 대여 취소/반납 (본인 또는 교수/랩장)
  async deleteRental(
    userId: number,
    labId: number,
    equipmentId: number,
    rentalId: number,
  ): Promise<{ message: string }> {
    const role = await this.chkUserInLab(userId, labId);
    const rental = await this.findRentalOrThrow(labId, equipmentId, rentalId);
    if (rental.user_id !== BigInt(userId) && !this.isAdmin(role)) {
      throw new CommonException(EQUIPMENT_ERRORS.NOT_RENTAL_OWNER);
    }

    await this.prisma.equipment_rentals.delete({ where: { id: BigInt(rentalId) } });

    return { message: '대여가 취소되었습니다.' };
  }

  // 내 대여 목록 (진행 중/예정)
  async getMyRentals(userId: number, labId: number): Promise<RentalResponseDto[]> {
    await this.chkUserInLab(userId, labId);

    const rentals = await this.prisma.equipment_rentals.findMany({
      where: {
        user_id: BigInt(userId),
        end_at: { gt: new Date() },
        equipments: { lab_id: BigInt(labId) },
      },
      orderBy: { start_at: 'asc' },
      select: rentalSelect,
    });

    return rentals.map((rental) => this.toRentalResponse(rental));
  }

  // 비품 구매 신청
  async createPurchase(
    userId: number,
    labId: number,
    dto: CreateEquipmentPurchaseRequestDto,
  ): Promise<EquipmentPurchaseResponseDto> {
    await this.chkUserInLab(userId, labId);

    const purchase = await this.prisma.equipment_requests.create({
      data: {
        lab_id: BigInt(labId),
        requester_id: BigInt(userId),
        name: dto.name,
        price: dto.price,
        quantity: dto.quantity,
        purchase_link: dto.purchaseLink,
      },
      include: purchaseInclude,
    });

    return this.toPurchaseResponse(purchase);
  }

  // 비품 구매 신청 목록 (교수/랩장은 전체, 그 외는 본인 것만)
  async getPurchases(
    userId: number,
    labId: number,
    query: GetEquipmentPurchasesRequestDto,
  ): Promise<EquipmentPurchaseResponseDto[]> {
    const role = await this.chkUserInLab(userId, labId);

    const purchases = await this.prisma.equipment_requests.findMany({
      where: {
        lab_id: BigInt(labId),
        status: query.status,
        requester_id: this.isAdmin(role) ? undefined : BigInt(userId),
      },
      orderBy: { created_at: 'desc' },
      include: purchaseInclude,
    });

    return purchases.map((purchase) => this.toPurchaseResponse(purchase));
  }

  // 비품 구매 신청 승인/반려 (여러 개)
  async reviewPurchases(
    userId: number,
    labId: number,
    dto: ReviewEquipmentPurchasesRequestDto,
  ): Promise<{ updatedCount: number }> {
    await this.chkUserPermission(userId, labId);

    const result = await this.prisma.equipment_requests.updateMany({
      where: {
        id: { in: dto.requestIds.map((id) => BigInt(id)) },
        lab_id: BigInt(labId),
        status: EquipmentRequestStatus.PENDING,
      },
      data: {
        status: dto.status,
        reviewed_by: BigInt(userId),
        reviewed_at: new Date(),
      },
    });

    return { updatedCount: result.count };
  }

  // 비품 구매 신청 취소 (본인, 대기 중일 때만)
  async deletePurchase(
    userId: number,
    labId: number,
    requestId: number,
  ): Promise<{ message: string }> {
    await this.chkUserInLab(userId, labId);

    const purchase = await this.prisma.equipment_requests.findFirst({
      where: { id: BigInt(requestId), lab_id: BigInt(labId), requester_id: BigInt(userId) },
    });
    if (!purchase) {
      throw new CommonException(EQUIPMENT_ERRORS.REQUEST_NOT_FOUND);
    }
    if (purchase.status !== EquipmentRequestStatus.PENDING) {
      throw new CommonException(EQUIPMENT_ERRORS.REQUEST_ALREADY_REVIEWED);
    }

    await this.prisma.equipment_requests.delete({ where: { id: purchase.id } });

    return { message: '비품 신청이 취소되었습니다.' };
  }

  /* ##### 내장 함수 ##### */

  private async chkUserInLab(userId: number, labId: number): Promise<Role> {
    const member = await this.prisma.lab_members.findFirst({
      where: { user_id: BigInt(userId), lab_id: BigInt(labId), left_at: null },
      select: { role: true },
    });

    if (!member) {
      throw new CommonException(EQUIPMENT_ERRORS.USER_NOT_FOUND_IN_LAB);
    }

    return member.role;
  }

  private async chkUserPermission(userId: number, labId: number): Promise<void> {
    const role = await this.chkUserInLab(userId, labId);

    if (!this.isAdmin(role)) {
      throw new CommonException(EQUIPMENT_ERRORS.PERMISSION_DENIED);
    }
  }

  private isAdmin(role: Role): boolean {
    return role === Role.PROFESSOR || role === Role.LAB_LEADER;
  }

  private async findEquipmentOrThrow(labId: number, equipmentId: number) {
    const equipment = await this.prisma.equipments.findFirst({
      where: { id: BigInt(equipmentId), lab_id: BigInt(labId) },
    });

    if (!equipment) {
      throw new CommonException(EQUIPMENT_ERRORS.EQUIPMENT_NOT_FOUND);
    }

    return equipment;
  }

  private async findRentalOrThrow(labId: number, equipmentId: number, rentalId: number) {
    const rental = await this.prisma.equipment_rentals.findFirst({
      where: {
        id: BigInt(rentalId),
        equipment_id: BigInt(equipmentId),
        equipments: { lab_id: BigInt(labId) },
      },
    });

    if (!rental) {
      throw new CommonException(EQUIPMENT_ERRORS.RENTAL_NOT_FOUND);
    }

    return rental;
  }

  private validateRentalPeriod(dto: RentalRequestDto): { startAt: Date; endAt: Date } {
    const startAt = new Date(dto.startAt);
    const endAt = new Date(dto.endAt);

    if (
      endAt <= startAt ||
      startAt.getTime() < Date.now() - RENTAL_START_GRACE_MS ||
      endAt.getTime() - startAt.getTime() > MAX_RENTAL_DAYS * 86_400_000
    ) {
      throw new CommonException(EQUIPMENT_ERRORS.INVALID_RENTAL_PERIOD);
    }

    return { startAt, endAt };
  }

  private async chkRentalConflict(
    tx: Prisma.TransactionClient,
    equipmentId: number,
    startAt: Date,
    endAt: Date,
    excludeRentalId?: number,
  ): Promise<void> {
    const conflict = await tx.equipment_rentals.findFirst({
      where: {
        equipment_id: BigInt(equipmentId),
        start_at: { lt: endAt },
        end_at: { gt: startAt },
        id: excludeRentalId ? { not: BigInt(excludeRentalId) } : undefined,
      },
      select: { id: true },
    });

    if (conflict) {
      throw new CommonException(EQUIPMENT_ERRORS.RENTAL_TIME_CONFLICT);
    }
  }

  private toRentalResponse(rental: RentalRow): RentalResponseDto {
    return {
      rentalId: Number(rental.id),
      equipmentId: Number(rental.equipment_id),
      equipmentName: rental.equipments.name,
      userId: Number(rental.user_id),
      userName: rental.users.name,
      startAt: rental.start_at,
      endAt: rental.end_at,
    };
  }

  private toPurchaseResponse(purchase: PurchaseRow): EquipmentPurchaseResponseDto {
    return {
      requestId: Number(purchase.id),
      name: purchase.name,
      price: purchase.price,
      quantity: purchase.quantity,
      purchaseLink: purchase.purchase_link,
      status: purchase.status,
      requesterId: Number(purchase.requester_id),
      requesterName: purchase.requester.name,
      reviewedAt: purchase.reviewed_at,
      createdAt: purchase.created_at,
    };
  }
}
