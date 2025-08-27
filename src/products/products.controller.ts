import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/CreateProduct.dto';
import { UpdateProductDto } from './dto/UpdateProduct.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':lotNumber')
  findOne(@Param('lotNumber') lotNumber: string) {
    return this.productsService.findOne(lotNumber);
  }

  @Patch(':lotNumber')
  update(@Param('lotNumber') lotNumber: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(lotNumber, updateProductDto);
  }

  @Delete(':lotNumber')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('lotNumber') lotNumber: string) {
    return this.productsService.remove(lotNumber);
  }
}