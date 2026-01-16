# Mini E-Commerce Microservices Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Infrastructure (Docker)
```bash
npm run docker:up
```

This will start:
- RabbitMQ (Port 5672, Management UI: 15672)
- PostgreSQL for User Service (Port 5436)
- PostgreSQL for Product Service (Port 5433)
- PostgreSQL for Order Service (Port 5434)
- PostgreSQL for Payment Service (Port 5435)

### 3. Generate Prisma Clients
```bash
npm run prisma:generate
```

### 4. Run Database Migrations
```bash
npm run prisma:migrate:user
npm run prisma:migrate:product
npm run prisma:migrate:order
npm run prisma:migrate:payment
```

### 5. Start All Microservices
```bash
npm run start:all
```

## 🔑 Environment Variables

Create a `.env` file in the root directory (already created):
```env
USER_DATABASE_URL=postgresql://postgres:postgres@localhost:5436/user_db
PRODUCT_DATABASE_URL=postgresql://postgres:postgres@localhost:5433/product_db
ORDER_DATABASE_URL=postgresql://postgres:postgres@localhost:5434/order_db
PAYMENT_DATABASE_URL=postgresql://postgres:postgres@localhost:5435/payment_db
RABBITMQ_URL=amqp://localhost:5672
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## 📡 API Testing

### 1. Register a User
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Save the JWT token from the response!

### 3. Create Product (Requires JWT)
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "stock": 50,
    "category": "Electronics"
  }'
```

### 4. Get All Products (No auth required)
```bash
curl http://localhost:3000/api/products
```

### 5. Create Order (Requires JWT)
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userId": "YOUR_USER_ID",
    "items": [
      {
        "productId": "PRODUCT_ID",
        "quantity": 2,
        "price": 999.99
      }
    ]
  }'
```

## 🗄️ Database Management

### Prisma Studio (Database GUI)
Open separate Prisma Studio instances for each service:

```bash
# User Service DB (Port 5555)
npm run prisma:studio:user

# Product Service DB (Port 5556)
npm run prisma:studio:product

# Order Service DB (Port 5557)
npm run prisma:studio:order

# Payment Service DB (Port 5558)
npm run prisma:studio:payment
```

## 🛠️ Useful Commands

```bash
# Start infrastructure
npm run docker:up

# Stop infrastructure
npm run docker:down

# Generate Prisma clients
npm run prisma:generate

# Run migrations for specific service
npm run prisma:migrate:user
npm run prisma:migrate:product
npm run prisma:migrate:order
npm run prisma:migrate:payment

# Start all services
npm run start:all

# Start individual services
npm run start:gateway
npm run start:user
npm run start:product
npm run start:order
npm run start:payment
```

## 🔍 Access Points

- **API Gateway**: http://localhost:3000
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)
- **Prisma Studio (User)**: http://localhost:5555
- **Prisma Studio (Product)**: http://localhost:5556
- **Prisma Studio (Order)**: http://localhost:5557
- **Prisma Studio (Payment)**: http://localhost:5558

## 🏗️ Architecture

```
┌─────────────────┐
│   API Gateway   │  ← HTTP REST API (Port 3000)
│   (Port 3000)   │     JWT Authentication
└────────┬────────┘
         │
         ├── RabbitMQ Message Queue ──┐
         │                            │
    ┌────┴─────┬──────────┬──────────┴────────┐
    │          │          │                   │
┌───▼────┐ ┌──▼─────┐ ┌──▼──────┐ ┌─────────▼──┐
│  User  │ │Product │ │  Order  │ │  Payment   │
│Service │ │Service │ │ Service │ │  Service   │
│        │ │        │ │         │ │            │
│Prisma  │ │Prisma  │ │ Prisma  │ │  Prisma    │
└───┬────┘ └───┬────┘ └────┬────┘ └─────┬──────┘
    │          │           │            │
┌───▼────┐ ┌──▼─────┐ ┌───▼──────┐ ┌───▼────────┐
│User DB │ │Product │ │ Order DB │ │ Payment DB │
│:5432   │ │DB:5433 │ │  :5434   │ │   :5435    │
└────────┘ └────────┘ └──────────┘ └────────────┘
```

## ✅ Tech Stack

- ✅ **NestJS** + **TypeScript**
- ✅ **Prisma** + **PostgreSQL**
- ✅ **JWT** + **Passport** (Authentication)
- ✅ **RabbitMQ** (Message Broker)
- ✅ **Docker** + **Docker Compose**
- ✅ **API Gateway Pattern**
- ✅ **Monorepo Architecture**
