import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
  PaymentResponseDto,
} from './dtos/payment.dto';
import { NotFoundException } from '@mini-e-commerce/common';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async createPayment(
    createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentResponseDto> {
    const payment = await this.prisma.payment.create({
      data: {
        ...createPaymentDto,
        status: 'PENDING',
      },
    });
    return payment;
  }

  async getPaymentById(id: string): Promise<PaymentResponseDto> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Payment', id);
    }

    return payment;
  }

  async getPaymentByOrderId(orderId: string): Promise<PaymentResponseDto> {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
    });

    if (!payment) {
      throw new NotFoundException('Payment for Order', orderId);
    }

    return payment;
  }

  async getAllPayments(skip: number = 0, take: number = 10) {
    const payments = await this.prisma.payment.findMany({
      skip,
      take,
    });

    const total = await this.prisma.payment.count();

    return {
      data: payments,
      total,
      skip,
      take,
    };
  }

  async updatePayment(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<PaymentResponseDto> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Payment', id);
    }

    const updatedPayment = await this.prisma.payment.update({
      where: { id },
      data: updatePaymentDto,
    });

    return updatedPayment;
  }

  async deletePayment(id: string): Promise<void> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Payment', id);
    }

    await this.prisma.payment.delete({
      where: { id },
    });
  }

  async processPayment(
    orderId: string,
    amount: number,
    paymentMethod: string,
  ): Promise<PaymentResponseDto> {
    // Simulate payment processing
    const transactionId = `TXN_${Date.now()}`;

    const payment = await this.prisma.payment.create({
      data: {
        orderId,
        amount,
        paymentMethod,
        status: 'SUCCESS',
        transactionId,
      },
    });

    return payment;
  }
}
