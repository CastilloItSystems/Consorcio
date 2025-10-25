# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a monorepo containing a multi-tenant SaaS application with:
- **Backend**: NestJS + Prisma + PostgreSQL (port 4000)
- **Frontend**: Next.js 16 + React 19 + TailwindCSS (port 3000)

## Development Commands

### Backend (`backend/`)

```bash
# Setup
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL

# Prisma database commands
npm run prisma:generate        # Generate Prisma client
npm run prisma:db:push         # Push schema to DB (development)
npm run prisma:migrate:dev     # Create and apply migration
npm run prisma:migrate:reset   # Reset database
npm run prisma:studio          # Open database GUI
npm run prisma:seed           # Seed test data

# Development
npm run start:dev             # Start with hot-reload
npm run start:debug           # Start with debugger

# Build & production
npm run build
npm run start:prod

# Code quality
npm run lint                  # Lint with ESLint
npm run format                # Format with Prettier

# Testing
npm run test                  # Run unit tests
npm run test:watch            # Run tests in watch mode
npm run test:cov              # Run with coverage
npm run test:e2e              # Run end-to-end tests
npm run test:debug            # Debug tests
```

### Frontend (`frontend/`)

```bash
# Setup
npm install

# Development
npm run dev                   # Start development server

# Build & production
npm run build
npm run start

# Code quality
npm run lint                  # Lint with ESLint
```

### Test Authentication

```bash
# From backend directory
./test-auth.sh                # Automated auth flow test
```

## Architecture

### Multi-Tenant Architecture

The application implements **row-level multi-tenancy** with tenant isolation at the database level:

- **Tenant Identification**: Via `x-tenant-id` header, subdomain, or JWT claim
- **TenantMiddleware**: Extracts tenant context from request and attaches to `req.tenant`
- **TenantContext**: Request-scoped provider that makes tenant ID/slug available throughout the request
- **TenantPrismaService**: Request-scoped proxy that automatically injects `companyId` filters into Prisma queries for tenant-scoped models (e.g., `Product`)
- **TenantInterceptor**: Global interceptor that initializes tenant context from request

### Authentication System

**JWT-based authentication with refresh tokens:**

- **Access tokens**: Short-lived (1 hour), JWT format, includes `sub` (user ID), `email`, and optionally `tenantId` and `role`
- **Refresh tokens**: Long-lived (30 days), stored as hashed records in DB with composite format `{id}.{raw}`
- **Token rotation**: On refresh, old token is revoked and new one issued
- **Cookie-based refresh**: Refresh tokens sent as HttpOnly cookies
- **Multi-tenant login**: Pass optional `tenantId` in login to receive tenant-scoped JWT

**Test credentials:**
- Email: `admin@ejemplo.com`
- Password: `password123`

### Database Schema

**Core models:**
- `User`: Base user entity (email, password, firstName, lastName, isActive, lastLogin)
- `Company`: Tenant entity (name, slug)
- `Membership`: Many-to-many linking users to companies with roles
- `Role` & `Permission`: RBAC system with role-permission mapping
- `RefreshToken`: Stored refresh tokens with expiry and revocation
- `Product`: Tenant-scoped resource (optional `companyId`)

**Key relationships:**
- User → Membership → Company (user can belong to multiple companies)
- Membership → Role → RolePermission → Permission (tenant-scoped RBAC)
- User → RefreshToken (one user, many refresh tokens)

### Backend Structure

```
src/
├── main.ts                     # Entry point, Swagger setup, CORS config
├── app.module.ts               # Root module with tenant interceptor
├── auth/                       # Authentication module
│   ├── auth.service.ts         # Login, refresh, logout, validation
│   ├── auth.controller.ts      # /auth/login, /auth/refresh, /auth/logout
│   ├── strategies/jwt.strategy.ts
│   ├── guards/jwt-auth.guard.ts
│   └── dto/                    # Login, auth-response, refresh DTOs
├── common/
│   ├── middleware/tenant.middleware.ts    # Tenant identification
│   ├── interceptors/tenant.interceptor.ts # Tenant context initialization
│   └── providers/tenant.context.ts        # Request-scoped tenant provider
├── database/
│   ├── prisma.service.ts       # Singleton Prisma client
│   ├── tenant-prisma.service.ts # Request-scoped tenant-aware proxy
│   └── database.module.ts      # Global database module
├── users/                      # Users CRUD module
└── products/                   # Products CRUD module (tenant-scoped)
```

### Frontend Structure

```
app/
├── layout.tsx                  # Root layout
├── page.tsx                    # Home page
├── login/page.tsx              # Login page
└── test-refresh/page.tsx       # Refresh token test page
lib/
├── api.ts                      # API client with auth interceptors
└── auth.ts                     # Auth helpers
```

## API Documentation

Swagger UI available at: `http://localhost:4000/api/docs`

## Important Patterns

### Protecting Routes with JWT

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller('api/protected')
@UseGuards(JwtAuthGuard)
export class ProtectedController {
  // All routes require valid JWT
}
```

### Accessing Tenant Context

```typescript
import { TenantContext } from './common/providers/tenant.context';

@Injectable()
export class MyService {
  constructor(private tenantContext: TenantContext) {}

  async getData() {
    const tenantId = this.tenantContext.getTenantId();
    // Use tenantId in queries
  }
}
```

### Using Tenant-Aware Prisma

```typescript
import { TenantPrismaService } from './database/tenant-prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: TenantPrismaService) {}

  async findAll() {
    // Automatically filtered by tenant
    return this.prisma.client.product.findMany();
  }
}
```

### Non-Tenant Operations

For operations that should NOT be tenant-scoped (e.g., user management, company lookup), inject `PrismaService` instead of `TenantPrismaService`.

## Environment Variables

### Backend (`.env`)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/consorcio"
DIRECT_URL="postgresql://user:password@localhost:5432/consorcio"
JWT_SECRET="your-super-secret-jwt-key"
PORT=4000
```

### Frontend

Frontend typically reads from backend API via environment-specific configuration.

## TypeScript Configuration

Backend uses **strict mode** enabled (`--strict` flag):
- All strict type checking options enabled
- No implicit `any` types
- Strict null checks
- Strict function types
- Class properties must be initialized

## Notes

- Always run `npm run prisma:generate` after modifying `prisma/schema.prisma`
- Use `npm run prisma:studio` to inspect/edit database visually
- Backend runs on port 4000, frontend on port 3000
- CORS configured for `http://localhost:3000` and `http://localhost:3001`
- When adding tenant-scoped models, add model name to `TenantPrismaService.tenantModels` Set
