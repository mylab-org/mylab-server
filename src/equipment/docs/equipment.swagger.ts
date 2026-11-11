import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { MessageResponseDto } from '../../common/dto/response/message.response.dto.js';
import { EquipmentResponseDto } from '../dto/response/equipment.response.dto.js';
import { RentalResponseDto } from '../dto/response/rental.response.dto.js';
import { EquipmentPurchaseResponseDto } from '../dto/response/equipment-purchase.response.dto.js';
import { CreateEquipmentRequestDto } from '../dto/request/create-equipment.request.dto.js';
import { UpdateEquipmentRequestDto } from '../dto/request/update-equipment.request.dto.js';
import { DeleteEquipmentsRequestDto } from '../dto/request/delete-equipments.request.dto.js';
import { RentalRequestDto } from '../dto/request/rental.request.dto.js';
import { CreateEquipmentPurchaseRequestDto } from '../dto/request/create-equipment-purchase.request.dto.js';
import { ReviewEquipmentPurchasesRequestDto } from '../dto/request/review-equipment-purchases.request.dto.js';

const labIdParam = ApiParam({ name: 'labId', description: '연구실 ID', type: Number });
const equipmentIdParam = ApiParam({ name: 'equipmentId', description: '비품 ID', type: Number });
const rentalIdParam = ApiParam({ name: 'rentalId', description: '대여 ID', type: Number });
const unauthorized = ApiResponse({ status: 401, description: '인증 실패' });
const notInLab = ApiResponse({ status: 404, description: '연구실에 소속되지 않은 사용자' });
const adminOnly = ApiResponse({ status: 403, description: '권한 없음 (교수/랩장만 가능)' });

export function ApiGetEquipments() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '비품 목록 조회',
      description:
        '연구실 비품 목록. 각 비품에 진행 중이거나 예정된 대여(반납 일시가 지나지 않은 것)가 대여 일시순으로 포함됨. 구성원 누구나 조회 가능.',
    }),
    labIdParam,
    ApiResponse({ status: 200, description: '조회 성공', type: [EquipmentResponseDto] }),
    unauthorized,
    notInLab,
  );
}

export function ApiCreateEquipment() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '비품 등록',
      description: '교수 or 랩장만 가능. 등록 시 대여 활성화 상태.',
    }),
    labIdParam,
    ApiBody({ type: CreateEquipmentRequestDto }),
    ApiResponse({ status: 201, description: '등록 성공', type: EquipmentResponseDto }),
    ApiResponse({ status: 400, description: '유효성 검사 실패' }),
    unauthorized,
    adminOnly,
    notInLab,
  );
}

export function ApiUpdateEquipment() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '비품 수정',
      description:
        '교수 or 랩장만 가능. 보낸 필드만 수정됨. 대여 활성화 스위치는 isRentable로 변경.',
    }),
    labIdParam,
    equipmentIdParam,
    ApiBody({ type: UpdateEquipmentRequestDto }),
    ApiResponse({ status: 200, description: '수정 성공', type: MessageResponseDto }),
    ApiResponse({ status: 400, description: '유효성 검사 실패' }),
    unauthorized,
    adminOnly,
    ApiResponse({ status: 404, description: '연구실에 소속되지 않은 사용자 / 존재하지 않는 비품' }),
  );
}

export function ApiDeleteEquipments() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '비품 삭제 (여러 개)',
      description:
        '교수 or 랩장만 가능. 체크한 비품을 한 번에 삭제. 해당 비품의 대여 기록도 함께 삭제됨.',
    }),
    labIdParam,
    ApiBody({ type: DeleteEquipmentsRequestDto }),
    ApiResponse({ status: 200, description: '삭제 성공', type: MessageResponseDto }),
    unauthorized,
    adminOnly,
    ApiResponse({ status: 404, description: '연구실에 소속되지 않은 사용자 / 삭제할 비품 없음' }),
  );
}

export function ApiCreateRental() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '비품 대여',
      description:
        '구성원 누구나 가능. 반납 일시는 대여 일시 이후, 지난 시간 불가(5분 여유), 최대 30일. 같은 비품의 다른 대여와 시간이 겹치면 409.',
    }),
    labIdParam,
    equipmentIdParam,
    ApiBody({ type: RentalRequestDto }),
    ApiResponse({ status: 201, description: '대여 성공', type: RentalResponseDto }),
    ApiResponse({ status: 400, description: '대여 기간 오류 / 대여 비활성화된 비품' }),
    unauthorized,
    ApiResponse({ status: 404, description: '연구실에 소속되지 않은 사용자 / 존재하지 않는 비품' }),
    ApiResponse({ status: 409, description: '대여 시간 겹침' }),
  );
}

export function ApiUpdateRental() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '대여 시간 변경',
      description: '본인 대여만 변경 가능. 기간 규칙과 겹침 검사는 대여와 동일.',
    }),
    labIdParam,
    equipmentIdParam,
    rentalIdParam,
    ApiBody({ type: RentalRequestDto }),
    ApiResponse({ status: 200, description: '변경 성공', type: RentalResponseDto }),
    ApiResponse({ status: 400, description: '대여 기간 오류' }),
    unauthorized,
    ApiResponse({ status: 403, description: '본인 대여가 아님' }),
    ApiResponse({ status: 404, description: '연구실에 소속되지 않은 사용자 / 존재하지 않는 대여' }),
    ApiResponse({ status: 409, description: '대여 시간 겹침' }),
  );
}

export function ApiDeleteRental() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '대여 취소', description: '본인 또는 교수/랩장 가능.' }),
    labIdParam,
    equipmentIdParam,
    rentalIdParam,
    ApiResponse({ status: 200, description: '취소 성공', type: MessageResponseDto }),
    unauthorized,
    ApiResponse({ status: 403, description: '본인 대여가 아니고 교수/랩장도 아님' }),
    ApiResponse({ status: 404, description: '연구실에 소속되지 않은 사용자 / 존재하지 않는 대여' }),
  );
}

export function ApiGetMyRentals() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '내 대여 목록',
      description:
        '내가 대여 중이거나 예정된 대여 목록 (대여 일시순). 비품 대여 화면 상단 "내 대여 시간" 표시용.',
    }),
    labIdParam,
    ApiResponse({ status: 200, description: '조회 성공', type: [RentalResponseDto] }),
    unauthorized,
    notInLab,
  );
}

export function ApiCreateEquipmentPurchase() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '비품 구매 신청',
      description: '구성원 누구나 가능. 대기(PENDING) 상태로 등록됨.',
    }),
    labIdParam,
    ApiBody({ type: CreateEquipmentPurchaseRequestDto }),
    ApiResponse({ status: 201, description: '신청 성공', type: EquipmentPurchaseResponseDto }),
    ApiResponse({ status: 400, description: '유효성 검사 실패' }),
    unauthorized,
    notInLab,
  );
}

export function ApiGetEquipmentPurchases() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '비품 구매 신청 목록',
      description:
        '교수/랩장은 연구실 전체 신청, 그 외는 본인 신청만 조회. status로 필터 (PENDING: 신청 내역, APPROVED: 승인 내역). 최신순.',
    }),
    labIdParam,
    ApiResponse({ status: 200, description: '조회 성공', type: [EquipmentPurchaseResponseDto] }),
    ApiResponse({ status: 400, description: '잘못된 status 값' }),
    unauthorized,
    notInLab,
  );
}

export function ApiReviewEquipmentPurchases() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '비품 구매 신청 승인/반려 (여러 개)',
      description:
        '교수 or 랩장만 가능. 체크한 신청을 한 번에 승인/반려. 대기(PENDING) 상태인 신청만 변경되고, 변경된 개수를 반환.',
    }),
    labIdParam,
    ApiBody({ type: ReviewEquipmentPurchasesRequestDto }),
    ApiResponse({
      status: 200,
      description: '처리 성공',
      schema: { example: { updatedCount: 2 } },
    }),
    ApiResponse({ status: 400, description: '유효성 검사 실패' }),
    unauthorized,
    adminOnly,
    notInLab,
  );
}

export function ApiDeleteEquipmentPurchase() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '비품 구매 신청 취소',
      description: '본인 신청이고 대기(PENDING) 상태일 때만 가능.',
    }),
    labIdParam,
    ApiParam({ name: 'requestId', description: '신청 ID', type: Number }),
    ApiResponse({ status: 200, description: '취소 성공', type: MessageResponseDto }),
    unauthorized,
    ApiResponse({ status: 404, description: '연구실에 소속되지 않은 사용자 / 존재하지 않는 신청' }),
    ApiResponse({ status: 409, description: '이미 승인/반려된 신청' }),
  );
}
