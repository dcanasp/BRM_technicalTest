import { Module } from '@nestjs/common';
import { DatabaseModule } from './Infrastructure/Persistence/Database.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PurchasesModule } from './purchases/purchases.module';

@Module({
  imports: [
    DatabaseModule,
    ProductsModule,
    UsersModule,
    AuthModule,
    PurchasesModule,
  ],
})
export class AppModule { }
