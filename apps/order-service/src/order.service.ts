import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {
  CreateOrderDto,
  UpdateOrderDto,
  OrderResponseDto,
} from './dtos/order.dto';
import { NotFoundException } from '@mini-e-commerce/common';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    const { items, ...orderData } = createOrderDto;

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await this.prisma.order.create({
      data: {
        ...orderData,
        totalAmount,
        status: 'PENDING',
        items: {
          create: items,
        },
      },
      include: {
        items: true,
      },
    });

    return this.mapOrderToResponse(order);
  }

  async getOrderById(id: string): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order', id);
    }

    return this.mapOrderToResponse(order);
  }

  async getOrdersByUserId(userId: string, skip: number = 0, take: number = 10) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      skip,
      take,
      include: {
        items: true,
      },
    });

    const total = await this.prisma.order.count({
      where: { userId },
    });

    return {
      data: orders.map(order => this.mapOrderToResponse(order)),
      total,
      skip,
      take,
    };
  }

  async getAllOrders(skip: number = 0, take: number = 10) {
    const orders = await this.prisma.order.findMany({
      skip,
      take,
      include: {
        items: true,
      },
    });

    const total = await this.prisma.order.count();

    return {
      data: orders.map(order => this.mapOrderToResponse(order)),
      total,
      skip,
      take,
    };
  }

  async updateOrder(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order', id);
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
      include: {
        items: true,
      },
    });

    return this.mapOrderToResponse(updatedOrder);
  }

  async deleteOrder(id: string): Promise<void> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order', id);
    }

    await this.prisma.order.delete({
      where: { id },
    });
  }

  private mapOrderToResponse(order: any): OrderResponseDto {
    return {
      ...order,
      items: order.items || [],
    };
  }
}
