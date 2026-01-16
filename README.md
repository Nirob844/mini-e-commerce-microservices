# Mini E-Commerce Microservices

A complete microservices architecture built with NestJS and RabbitMQ for e-commerce applications.

## 🏗️ Architecture

This project follows a microservices architecture with the following services:

- **API Gateway** (Port 3000) - Entry point for all client requests
- **User Service** - User authentication and management
- **Product Service** - Product catalog management
- **Order Service** - Order processing and management
- **Payment Service** - Payment processing (mocked)

All services communicate via **RabbitMQ** message broker.

## 📁 Project Structure

```
mini-e-commerce-microservices/
├── apps/
│   ├── api-gateway/         # HTTP REST API Gateway
│   ├── user-service/        # User microservice
│   ├── product-service/     # Product microservice
│   ├── order-service/       # Order microservice
│   └── payment-service/     # Payment microservice
├── docker-compose.yml       # RabbitMQ setup
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start RabbitMQ:
```bash
npm run docker:up
```

RabbitMQ Management UI: http://localhost:15672 (guest/guest)

3. Start all microservices:
```bash
npm run start:all
```

Or start services individually:
```bash
npm run start:gateway  # API Gateway
npm run start:user     # User Service
npm run start:product  # Product Service
npm run start:order    # Order Service
npm run start:payment  # Payment Service
```

## 📡 API Endpoints

### User Service (via Gateway)
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/:id` - Get user by ID
- `GET /api/users` - Get all users

### Product Service (via Gateway)
- `POST /api/products` - Create product
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Order Service (via Gateway)
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/user/:userId` - Get user orders
- `GET /api/orders` - Get all orders

## 🧪 Testing the API

### 1. Register a User
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","name":"John Doe","password":"pass123"}'
```

### 2. Get Products
```bash
curl http://localhost:3000/api/products
```

### 3. Create an Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "1",
    "items": [
      {"productId": "1", "quantity": 2, "price": 999.99}
    ]
  }'
```

## 🛠️ Available Scripts

- `npm run start:all` - Start all microservices concurrently
- `npm run start:gateway` - Start API Gateway
- `npm run start:user` - Start User Service
- `npm run start:product` - Start Product Service
- `npm run start:order` - Start Order Service
- `npm run start:payment` - Start Payment Service
- `npm run docker:up` - Start RabbitMQ with Docker
- `npm run docker:down` - Stop RabbitMQ
- `npm run build` - Build all services
- `npm run lint` - Lint code

## 🔧 Technologies Used

- **NestJS** - Progressive Node.js framework
- **RabbitMQ** - Message broker for inter-service communication
- **TypeScript** - Type-safe JavaScript
- **Docker** - Containerization

## 📚 Learning Resources

This project demonstrates:
- ✅ Microservices architecture
- ✅ Event-driven communication with RabbitMQ
- ✅ API Gateway pattern
- ✅ Service isolation and independence
- ✅ Message patterns with NestJS
- ✅ Monorepo structure

## 🎯 Next Steps

- Add database integration (PostgreSQL/MongoDB)
- Implement JWT authentication
- Add API documentation (Swagger)
- Implement event-driven patterns
- Add logging and monitoring
- Write unit and integration tests
- Add Docker containerization for all services

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
