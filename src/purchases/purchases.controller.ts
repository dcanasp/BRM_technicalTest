import { Controller, Post, Body, UseGuards, Request, Get, Param, BadRequestException } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/CreatePurchase.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../Domain/Entities/User.entity';

@Controller('purchases')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  // Route for clients to make a new purchase
  @Post()
  @Roles(UserRole.CLIENT)
  async create(@Request() req, @Body() createPurchaseDto: CreatePurchaseDto) {
    const userId = req.user.id;
    return this.purchasesService.create(userId, createPurchaseDto);
  }

  // Route for clients to view their purchase history
  @Get('history')
  @Roles(UserRole.CLIENT)
  async getPurchaseHistory(@Request() req) {
    const userId = req.user.id;
    return this.purchasesService.findByUser(userId);
  }

  // Route for clients to view a specific invoice
  @Get('history/:purchaseId')
  @Roles(UserRole.CLIENT)
  async getInvoice(@Request() req, @Param('purchaseId') purchaseId: number) {
    const purchase = await this.purchasesService.findOne(purchaseId);
    if (purchase.userId !== req.user.id) {
        throw new BadRequestException('You are not authorized to view this invoice.');
    }
    return purchase;
  }

  // Route for administrators to view all purchases
  @Get()
  @Roles(UserRole.ADMIN)
  async getAllPurchases() {
    return this.purchasesService.findAll();
  }
}