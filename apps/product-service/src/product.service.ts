import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
} from './dtos/product.dto';
import { NotFoundException } from '@mini-e-commerce/common';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.prisma.product.create({
      data: createProductDto,
    });
    return product;
  }

  async getProductById(id: string): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product', id);
    }

    return product;
  }

  async getAllProducts(skip: number = 0, take: number = 10) {
    const products = await this.prisma.product.findMany({
      skip,
      take,
    });

    const total = await this.prisma.product.count();

    return {
      data: products,
      total,
      skip,
      take,
    };
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product', id);
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });

    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product', id);
    }

    await this.prisma.product.delete({
      where: { id },
    });
  }

  async reduceStock(productId: string, quantity: number): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product', productId);
    }

    if (product.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });
  }
}
