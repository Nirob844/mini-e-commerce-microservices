import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller()
export class ApiGatewayController {
  @Get('health')
  health(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        gateway: 'running',
        userService: 'connected',
        productService: 'connected',
        orderService: 'connected',
        paymentService: 'connected',
      },
    });
  }

  @Get('info')
  info() {
    return {
      name: 'Mini E-Commerce Microservices',
      version: '1.0.0',
      description: 'Professional e-commerce microservices architecture',
      services: [
        {
          name: 'User Service',
          path: '/api/users',
          port: 3001,
        },
        {
          name: 'Product Service',
          path: '/api/products',
          port: 3002,
        },
        {
          name: 'Order Service',
          path: '/api/orders',
          port: 3003,
        },
        {
          name: 'Payment Service',
          path: '/api/payments',
          port: 3004,
        },
      ],
    };
  }
}
