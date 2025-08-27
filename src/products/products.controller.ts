import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, SetMetadata } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/CreateProduct.dto';
import { UpdateProductDto } from './dto/UpdateProduct.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/Domain/Entities/User.entity';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard) // Protect all routes in this controller
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @SetMetadata('roles', [UserRole.ADMIN])
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @SetMetadata('roles', [UserRole.ADMIN, UserRole.CLIENT])
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':lotNumber')
  @SetMetadata('roles', [UserRole.ADMIN, UserRole.CLIENT])
  findOne(@Param('lotNumber') lotNumber: string) {
    return this.productsService.findOne(lotNumber);
  }

  @Patch(':lotNumber')
  @SetMetadata('roles', [UserRole.ADMIN])
  update(@Param('lotNumber') lotNumber: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(lotNumber, updateProductDto);
  }

  @Delete(':lotNumber')
  @SetMetadata('roles', [UserRole.ADMIN])
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('lotNumber') lotNumber: string) {
    return this.productsService.remove(lotNumber);
  }
}