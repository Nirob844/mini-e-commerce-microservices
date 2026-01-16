import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { UserModule } from './user.module';
import { GlobalExceptionFilter } from '@mini-e-commerce/common';

async function bootstrap() {
  // Create main HTTP app
  const app = await NestFactory.create(UserModule);

  // Create microservice
  const microservice = app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: process.env.USER_SERVICE_QUEUE || 'user_queue',
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
  const port = process.env.USER_SERVICE_PORT || 3001;
  await app.listen(port);

  console.log(`✅ User Service running on http://localhost:${port}`);
  console.log('🔵 User Service connected to RabbitMQ');
}

bootstrap().catch((error) => {
  console.error('❌ Error starting User Service:', error);
  process.exit(1);
});
