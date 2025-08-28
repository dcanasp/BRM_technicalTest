import { Module } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Purchase } from 'src/Domain/Entities/Purchase.entity';
import { PurchaseItem } from 'src/Domain/Entities/PurchaseItem.entity';
import { Product } from 'src/Domain/Entities/Product.entity';

@Module({
  imports: [SequelizeModule.forFeature([Purchase, PurchaseItem,Product])],
  providers: [PurchasesService],
  controllers: [PurchasesController]
})
export class PurchasesModule {}
