import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { OrderModule } from './order.module';
import { GlobalExceptionFilter } from '@mini-e-commerce/common';

async function bootstrap() {
  // Create main HTTP app
  const app = await NestFactory.create(OrderModule);

  // Create microservice
  const microservice = app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: process.env.ORDER_SERVICE_QUEUE || 'order_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  // Add global filters and pipes
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Start both HTTP and microservice
  await app.startAllMicroservices();
  const port = process.env.ORDER_SERVICE_PORT || 3003;
  await app.listen(port);

  console.log(`✅ Order Service running on http://localhost:${port}`);
  console.log('🟡 Order Service connected to RabbitMQ');
}

bootstrap().catch((error) => {
  console.error('❌ Error starting Order Service:', error);
  process.exit(1);
});
