import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ApiGatewayModule } from './api-gateway.module';
import { GlobalExceptionFilter } from '@mini-e-commerce/common';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  // Add global filters and pipes
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Set global prefix
  app.setGlobalPrefix('api');

  const port = process.env.GATEWAY_PORT || 3000;
  await app.listen(port);

  console.log(`\n🚀 API Gateway running on http://localhost:${port}/api`);
  console.log(`📚 Documentation: http://localhost:${port}/api/docs\n`);
}

bootstrap().catch((error) => {
  console.error('❌ Error starting API Gateway:', error);
  process.exit(1);
});
