import { Controller, Post, Get, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dtos/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  async findAll(@Query('skip') skip = 0, @Query('take') take = 10) {
    return this.productService.getAllProducts(skip, take);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.productService.deleteProduct(id);
    return { message: 'Product deleted successfully' };
  }

  // Message pattern for microservice communication
  @MessagePattern({ cmd: 'get_product' })
  async handleGetProduct(data: { id: string }) {
    return this.productService.getProductById(data.id);
  }

  @MessagePattern({ cmd: 'reduce_stock' })
  async handleReduceStock(data: { productId: string; quantity: number }) {
    await this.productService.reduceStock(data.productId, data.quantity);
    return { success: true };
  }
}
