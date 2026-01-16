import { IsNotEmpty, IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @IsOptional()
  @IsString()
  transactionId?: string;
}

export class UpdatePaymentDto {
  status?: string;
  transactionId?: string;
  notes?: string;
}

export class PaymentResponseDto {
  id: string;
  orderId: string;
  amount: number;
  paymentMethod: string;
  status: string;
  transactionId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
