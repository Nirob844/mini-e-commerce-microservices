import { IsNotEmpty, IsNumber, IsString, IsArray, Min, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsArray()
  items: OrderItemDto[];

  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class OrderItemDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;
}

export class UpdateOrderDto {
  shippingAddress?: string;
  notes?: string;
  status?: string;
}

export class OrderResponseDto {
  id: string;
  userId: string;
  items: OrderItemDto[];
  totalAmount: number;
  status: string;
  shippingAddress?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
