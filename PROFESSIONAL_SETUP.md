# Mini E-Commerce Microservices

A professional, production-ready e-commerce microservices architecture built with NestJS, RabbitMQ, and Prisma ORM.

## 📋 Project Overview

This is a comprehensive microservices architecture for an e-commerce platform with the following components:

- **API Gateway**: Central entry point for all client requests (Port 3000)
- **User Service**: Manages user authentication, profiles, and data (Port 3001)
- **Product Service**: Handles product catalog, inventory, and management (Port 3002)
- **Order Service**: Manages order creation, tracking, and history (Port 3003)
- **Payment Service**: Processes payments and transactions (Port 3004)

## 🏗️ Architecture

### Tech Stack

- **Framework**: NestJS 11.0+
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Message Queue**: RabbitMQ
- **Validation**: class-validator, class-transformer
- **Authentication**: JWT with Passport.js
- **Package Manager**: Yarn

### Directory Structure

```
apps/
├── api-gateway/           # API Gateway service
│   └── src/
│       ├── api-gateway.module.ts
│       ├── api-gateway.controller.ts
│       └── main.ts
├── user-service/          # User management service
│   └── src/
│       ├── user.module.ts
│       ├── user.controller.ts
│       ├── user.service.ts
│       ├── prisma.service.ts
│       └── dtos/
│           └── user.dto.ts
├── product-service/       # Product catalog service
│   └── src/
│       ├── product.module.ts
│       ├── product.controller.ts
│       ├── product.service.ts
│       ├── prisma.service.ts
│       └── dtos/
│           └── product.dto.ts
├── order-service/         # Order management service
│   └── src/
│       ├── order.module.ts
│       ├── order.controller.ts
│       ├── order.service.ts
│       ├── prisma.service.ts
│       └── dtos/
│           └── order.dto.ts
└── payment-service/       # Payment processing service
    └── src/
        ├── payment.module.ts
        ├── payment.controller.ts
        ├── payment.service.ts
        ├── prisma.service.ts
        └── dtos/
            └── payment.dto.ts

libs/
├── common/                # Shared utilities and types
    └── src/
        ├── exceptions/        # Custom exception classes
        │   ├── app.exception.ts
        │   ├── validation.exception.ts
        │   └── not-found.exception.ts
        ├── dtos/              # Shared DTOs
        │   └── response.dto.ts
        ├── filters/           # Global exception filters
        │   └── global-exception.filter.ts
        ├── logger/            # Logging service
        │   └── logger.service.ts
        └── index.ts

prisma/                   # Prisma schema files (one per service)
├── user-schema.prisma
├── product-schema.prisma
├── order-schema.prisma
└── payment-schema.prisma
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 12+
- RabbitMQ 3.12+
- Docker (optional, for containerized setup)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mini-e-commerce-microservices
```

2. Install dependencies:
```bash
yarn install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start Docker services (if using Docker):
```bash
docker-compose up -d
```

5. Generate Prisma clients:
```bash
yarn prisma:generate
```

6. Run database migrations:
```bash
yarn prisma:migrate:user
yarn prisma:migrate:product
yarn prisma:migrate:order
yarn prisma:migrate:payment
```

## 📦 Available Scripts

### Development

```bash
# Start all services in watch mode (concurrently)
yarn start:all

# Start individual services
yarn start:gateway    # API Gateway
yarn start:user       # User Service
yarn start:product    # Product Service
yarn start:order      # Order Service
yarn start:payment    # Payment Service

# Start in debug mode
yarn start:debug
```

### Production

```bash
# Build the project
yarn build

# Start production build
yarn start:prod
```

### Database

```bash
# Generate Prisma clients for all services
yarn prisma:generate

# Run migrations
yarn prisma:migrate:user
yarn prisma:migrate:product
yarn prisma:migrate:order
yarn prisma:migrate:payment

# Open Prisma Studio (UI for database)
yarn prisma:studio:user      # Port 5555
yarn prisma:studio:product   # Port 5556
yarn prisma:studio:order     # Port 5557
yarn prisma:studio:payment   # Port 5558
```

### Testing & Linting

```bash
# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Generate coverage report
yarn test:cov

# Run e2e tests
yarn test:e2e

# Lint and format code
yarn lint
yarn format
```

### Docker

```bash
# Start all services with Docker
yarn docker:up

# Stop all services
yarn docker:down
```

## 📚 API Endpoints

### API Gateway (http://localhost:3000/api)

- `GET /health` - Health check
- `GET /info` - Service information

### User Service (http://localhost:3001/api/users)

- `POST /` - Create user
- `GET /` - Get all users (paginated)
- `GET /:id` - Get user by ID
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user

**Message Patterns:**
- `{ cmd: 'get_user' }` - Get user by ID
- `{ cmd: 'validate_user' }` - Validate user credentials

### Product Service (http://localhost:3002/api/products)

- `POST /` - Create product
- `GET /` - Get all products (paginated)
- `GET /:id` - Get product by ID
- `PUT /:id` - Update product
- `DELETE /:id` - Delete product

**Message Patterns:**
- `{ cmd: 'get_product' }` - Get product by ID
- `{ cmd: 'reduce_stock' }` - Reduce product stock

### Order Service (http://localhost:3003/api/orders)

- `POST /` - Create order
- `GET /` - Get all orders (paginated)
- `GET /user/:userId` - Get user's orders
- `GET /:id` - Get order by ID
- `PUT /:id` - Update order
- `DELETE /:id` - Delete order

**Message Patterns:**
- `{ cmd: 'get_order' }` - Get order by ID
- `{ cmd: 'create_order' }` - Create order
- `{ cmd: 'get_user_orders' }` - Get user's orders

### Payment Service (http://localhost:3004/api/payments)

- `POST /` - Create payment
- `GET /` - Get all payments (paginated)
- `GET /order/:orderId` - Get payment by order ID
- `GET /:id` - Get payment by ID
- `PUT /:id` - Update payment
- `DELETE /:id` - Delete payment

**Message Patterns:**
- `{ cmd: 'get_payment' }` - Get payment by ID
- `{ cmd: 'process_payment' }` - Process payment
- `{ cmd: 'get_payment_by_order' }` - Get payment by order ID

## 🔐 Error Handling

The application uses a global exception filter that provides consistent error responses:

```json
{
  "success": false,
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "errors": {},
  "timestamp": "2024-01-16T10:30:00.000Z",
  "path": "/api/users"
}
```

Custom exceptions:
- `AppException` - Base exception class
- `ValidationException` - Validation errors (400)
- `NotFoundException` - Resource not found (404)

## 📖 Request/Response Format

### Success Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": { /* response data */ },
  "timestamp": "2024-01-16T10:30:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "errors": { /* field errors */ },
  "timestamp": "2024-01-16T10:30:00.000Z",
  "path": "/api/users"
}
```

## 🔄 Microservice Communication

Services communicate with each other using RabbitMQ message patterns:

```typescript
// Sending a message from one service to another
this.client.send({ cmd: 'get_product' }, { id: productId }).toPromise();

// Handling message patterns
@MessagePattern({ cmd: 'get_product' })
async handleGetProduct(data: { id: string }) {
  return this.productService.getProductById(data.id);
}
```

## 🗄️ Database Setup

Each service has its own database schema managed by Prisma:

1. **User Service Schema**: Manages users, authentication, and profiles
2. **Product Service Schema**: Manages products, inventory, and categories
3. **Order Service Schema**: Manages orders and order items
4. **Payment Service Schema**: Manages payments and transactions

To create a new migration:

```bash
# For User Service
cd apps/user-service
npx prisma migrate dev --name migration_name --schema=../../prisma/user-schema.prisma
```

## 🛡️ Best Practices Implemented

- ✅ **Proper Error Handling**: Global exception filter with custom exceptions
- ✅ **Input Validation**: DTOs with class-validator decorators
- ✅ **Async/Await**: Clean asynchronous code patterns
- ✅ **Microservice Pattern**: RabbitMQ for inter-service communication
- ✅ **Database Abstraction**: Prisma ORM for type-safe database queries
- ✅ **Environment Configuration**: Centralized env file management
- ✅ **Code Organization**: Layered architecture (Controller → Service → Prisma)
- ✅ **CORS Support**: Configured for development and production
- ✅ **Global Validation Pipes**: Input data validation at gateway level
- ✅ **Hybrid Services**: Both HTTP and microservice transports

## 📝 Environment Variables

See `.env` file for all available configuration options:

```env
# API Gateway
GATEWAY_PORT=3000

# Microservices
USER_SERVICE_PORT=3001
PRODUCT_SERVICE_PORT=3002
ORDER_SERVICE_PORT=3003
PAYMENT_SERVICE_PORT=3004

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@localhost:5672

# Databases
DATABASE_URL_USER=postgresql://...
DATABASE_URL_PRODUCT=postgresql://...
DATABASE_URL_ORDER=postgresql://...
DATABASE_URL_PAYMENT=postgresql://...

# Security
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
```

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Find and kill process using port
lsof -i :3000
kill -9 <PID>
```

### RabbitMQ Connection Errors
- Ensure RabbitMQ is running: `docker-compose up -d rabbitmq`
- Check connection string in `.env`
- Verify credentials match your RabbitMQ setup

### Database Connection Errors
- Ensure PostgreSQL is running
- Verify DATABASE_URL in `.env` for each service
- Run migrations: `yarn prisma:migrate:*`

### Module Not Found Errors
- Clear build cache: `rm -rf dist node_modules`
- Reinstall dependencies: `yarn install`
- Regenerate Prisma clients: `yarn prisma:generate`

## 📞 Support

For issues and questions, please create an issue in the repository.

## 📄 License

UNLICENSED - All rights reserved
