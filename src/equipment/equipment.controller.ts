import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guards/access-token.guard.js';
import { User } from '../common/decoraters/user.decorator.js';
import { EquipmentService } from './equipment.service.js';
import {
  ApiCreateEquipment,
  ApiCreateEquipmentPurchase,
  ApiCreateRental,
  ApiDeleteEquipmentPurchase,
  ApiDeleteEquipments,
  ApiDeleteRental,
  ApiGetEquipmentPurchases,
  ApiGetEquipments,
  ApiGetMyRentals,
  ApiReviewEquipmentPurchases,
  ApiUpdateEquipment,
  ApiUpdateRental,
} from './docs/equipment.swagger.js';
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

@ApiTags('Equipment')
@UseGuards(AccessTokenGuard)
@Controller('labs/:labId')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get('equipments')
  @ApiGetEquipments()
  getEquipments(
    @User('userId') userId: number,
    @Param('labId', ParseIntPipe) labId: number,
  ): Promise<EquipmentResponseDto[]> {
    return this.equipmentService.getEquipments(userId, labId);
  }

  @Post('equipments')
  @ApiCreateEquipment()
  createEquipment(
    @User('userId') userId: number,
    @Param('labId', ParseIntPipe) labId: number,
    @Body() dto: CreateEquipmentRequestDto,
  ): Promise<EquipmentResponseDto> {
    return this.equipmentService.createEquipment(userId, labId, dto);
  }

  @Delete('equipments')
  @ApiDeleteEquipments()
  deleteEquipments(
    @User('userId') userId: number,
    @Param('labId', ParseIntPipe) labId: number,
    @Body() dto: DeleteEquipmentsRequestDto,
  ): Promise<{ message: string }> {
    return this.equipmentService.deleteEquipments(userId, labId, dto);
  }

  @Patch('equipments/:equipmentId')
  @ApiUpdateEquipment()
  updateEquipment(
    @User('userId') userId: number,
    @Param('labId', ParseIntPipe) labId: number,
    @Param('equipmentId', ParseIntPipe) equipmentId: number,
    @Body() dto: UpdateEquipmentRequestDto,
  ): Promise<{ message: string }> {
    return this.equipmentService.updateEquipment(userId, labId, equipmentId, dto);
  }

  @Post('equipments/:equipmentId/rentals')
  @ApiCreateRental()
  createRental(
    @User('userId') userId: number,
    @Param('labId', ParseIntPipe) labId: number,
    @Param('equipmentId', ParseIntPipe) equipmentId: number,
    @Body() dto: RentalRequestDto,
  ): Promise<RentalResponseDto> {
    return this.equipmentService.createRental(userId, labId, equipmentId, dto);
  }

  @Patch('equipments/:equipmentId/rentals/:rentalId')
  @ApiUpdateRental()
  updateRental(
    @User('userId') userId: number,
    @Param('labId', ParseIntPipe) labId: number,
    @Param('equipmentId', ParseIntPipe) equipmentId: number,
    @Param('rentalId', ParseIntPipe) rentalId: number,
    @Body() dto: RentalRequestDto,
  ): Promise<RentalResponseDto> {
    return this.equipmentService.updateRental(userId, labId, equipmentId, rentalId, dto);
  }

  @Delete('equipments/:equipmentId/rentals/:rentalId')
  @ApiDeleteRental()
  deleteRental(
    @User('userId') userId: number,
    @Param('labId', ParseIntPipe) labId: number,
    @Param('equipmentId', ParseIntPipe) equipmentId: number,
    @Param('rentalId', ParseIntPipe) rentalId: number,
  ): Promise<{ message: string }> {
    return this.equipmentService.deleteRental(userId, labId, equipmentId, rentalId);
  }

  @Get('rentals/me')
  @ApiGetMyRentals()
  getMyRentals(
    @User('userId') userId: number,
    @Param('labId', ParseIntPipe) labId: number,
  ): Promise<RentalResponseDto[]> {
    return this.equipmentService.getMyRentals(userId, labId);
  }

  @Post('equipment-requests')
  @ApiCreateEquipmentPurchase()
  createPurchase(
    @User('userId') userId: number,
    @Param('labId', ParseIntPipe) labId: number,
    @Body() dto: CreateEquipmentPurchaseRequestDto,
  ): Promise<EquipmentPurchaseResponseDto> {
    return this.equipmentService.createPurchase(userId, labId, dto);
  }

  @Get('equipment-requests')
  @ApiGetEquipmentPurchases()
  getPurchases(
    @User('userId') userId: number,
    @Param('labId', ParseIntPipe) labId: number,
    @Query() query: GetEquipmentPurchasesRequestDto,
  ): Promise<EquipmentPurchaseResponseDto[]> {
    return this.equipmentService.getPurchases(userId, labId, query);
  }

  @Patch('equipment-requests/status')
  @ApiReviewEquipmentPurchases()
  reviewPurchases(
    @User('userId') userId: number,
    @Param('labId', ParseIntPipe) labId: number,
    @Body() dto: ReviewEquipmentPurchasesRequestDto,
  ): Promise<{ updatedCount: number }> {
    return this.equipmentService.reviewPurchases(userId, labId, dto);
  }

  @Delete('equipment-requests/:requestId')
  @ApiDeleteEquipmentPurchase()
  deletePurchase(
    @User('userId') userId: number,
    @Param('labId', ParseIntPipe) labId: number,
    @Param('requestId', ParseIntPipe) requestId: number,
  ): Promise<{ message: string }> {
    return this.equipmentService.deletePurchase(userId, labId, requestId);
  }
}
