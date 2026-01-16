import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderDto } from './dtos/order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get()
  async findAll(@Query('skip') skip = 0, @Query('take') take = 10) {
    return this.orderService.getAllOrders(skip, take);
  }

  @Get('user/:userId')
  async findByUser(
    @Param('userId') userId: string,
    @Query('skip') skip = 0,
    @Query('take') take = 10,
  ) {
    return this.orderService.getOrdersByUserId(userId, skip, take);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.updateOrder(id, updateOrderDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.orderService.deleteOrder(id);
    return { message: 'Order deleted successfully' };
  }

  // Message pattern for microservice communication
  @MessagePattern({ cmd: 'get_order' })
  async handleGetOrder(data: { id: string }) {
    return this.orderService.getOrderById(data.id);
  }

  @MessagePattern({ cmd: 'create_order' })
  async handleCreateOrder(data: CreateOrderDto) {
    return this.orderService.createOrder(data);
  }

  @MessagePattern({ cmd: 'get_user_orders' })
  async handleGetUserOrders(data: { userId: string; skip?: number; take?: number }) {
    return this.orderService.getOrdersByUserId(data.userId, data.skip, data.take);
  }
}
