import { Controller, Post, Get, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dtos/payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPayment(createPaymentDto);
  }

  @Get()
  async findAll(@Query('skip') skip = 0, @Query('take') take = 10) {
    return this.paymentService.getAllPayments(skip, take);
  }

  @Get('order/:orderId')
  async findByOrder(@Param('orderId') orderId: string) {
    return this.paymentService.getPaymentByOrderId(orderId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.paymentService.getPaymentById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentService.updatePayment(id, updatePaymentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.paymentService.deletePayment(id);
    return { message: 'Payment deleted successfully' };
  }

  // Message pattern for microservice communication
  @MessagePattern({ cmd: 'get_payment' })
  async handleGetPayment(data: { id: string }) {
    return this.paymentService.getPaymentById(data.id);
  }

  @MessagePattern({ cmd: 'process_payment' })
  async handleProcessPayment(data: {
    orderId: string;
    amount: number;
    paymentMethod: string;
  }) {
    return this.paymentService.processPayment(
      data.orderId,
      data.amount,
      data.paymentMethod,
    );
  }

  @MessagePattern({ cmd: 'get_payment_by_order' })
  async handleGetPaymentByOrder(data: { orderId: string }) {
    return this.paymentService.getPaymentByOrderId(data.orderId);
  }
}
