import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ProductModule } from './product.module';
import { GlobalExceptionFilter } from '@mini-e-commerce/common';

async function bootstrap() {
  // Create main HTTP app
  const app = await NestFactory.create(ProductModule);

  // Create microservice
  const microservice = app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: process.env.PRODUCT_SERVICE_QUEUE || 'product_queue',
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
  const port = process.env.PRODUCT_SERVICE_PORT || 3002;
  await app.listen(port);

  console.log(`✅ Product Service running on http://localhost:${port}`);
  console.log('🟢 Product Service connected to RabbitMQ');
}

bootstrap().catch((error) => {
  console.error('❌ Error starting Product Service:', error);
  process.exit(1);
});
