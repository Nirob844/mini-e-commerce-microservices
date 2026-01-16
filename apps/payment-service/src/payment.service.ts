import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  // Implement your methods here
}
