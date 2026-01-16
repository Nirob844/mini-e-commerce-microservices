import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { PaymentModule } from './payment.module';
import { GlobalExceptionFilter } from '@mini-e-commerce/common';

async function bootstrap() {
  // Create main HTTP app
  const app = await NestFactory.create(PaymentModule);

  // Create microservice
  const microservice = app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: process.env.PAYMENT_SERVICE_QUEUE || 'payment_queue',
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
  const port = process.env.PAYMENT_SERVICE_PORT || 3004;
  await app.listen(port);

  console.log(`✅ Payment Service running on http://localhost:${port}`);
  console.log('🟣 Payment Service connected to RabbitMQ');
}

bootstrap().catch((error) => {
  console.error('❌ Error starting Payment Service:', error);
  process.exit(1);
});
