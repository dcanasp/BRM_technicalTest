import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../Domain/Entities/Product.entity';
import { CreateProductDto } from './dto/CreateProduct.dto';
import { UpdateProductDto } from './dto/UpdateProduct.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  // Create a new product
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const productPayload = {
      ...createProductDto,
      entryDate: new Date(createProductDto.entryDate),
    };

    return this.productModel.create(productPayload as Product);
  }

  // Get all products
  async findAll(): Promise<Product[]> {
    return this.productModel.findAll();
  }

  // Get a single product by lotNumber
  async findOne(lotNumber: string): Promise<Product> {
    const product = await this.productModel.findOne({ where: { lotNumber } });
    if (!product) {
      throw new NotFoundException(`Product with lot number "${lotNumber}" not found.`);
    }
    return product;
  }

  // Update a product
  async update(lotNumber: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(lotNumber); // Re-use findOne for validation

    // Convert entryDate string to Date if it exists
    const updateData = { ...updateProductDto, entryDate: updateProductDto.entryDate ? new Date(updateProductDto.entryDate) : product.entryDate };

    await product.update(updateData);
    return product;
  }

  // Delete a product
  async remove(lotNumber: string): Promise<void> {
    const product = await this.findOne(lotNumber); // Re-use findOne for validation
    await product.destroy();
  }
}