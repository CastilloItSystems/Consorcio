# Autenticación con JWT

Este sistema implementa autenticación basada en JWT (JSON Web Tokens) en NestJS.

## Características

- ✅ Login con email y contraseña
- ✅ Contraseñas encriptadas con bcrypt
- ✅ Tokens JWT con expiración configurable
- ✅ Guard para proteger rutas
- ✅ Soporte para roles de usuario
- ✅ Rastreo de último login
- ✅ Estado de usuario activo/inactivo

## Configuración

### 1. Variables de Entorno

Asegúrate de tener estas variables en tu archivo `.env`:

```env
# JWT Secret (cambia esto en producción)
JWT_SECRET=your-super-secret-jwt-key

# El token expira en 1 hora (configurable en auth.module.ts)
```

Para generar una clave segura en Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Crear un Usuario de Prueba

El proyecto incluye un seed que crea un usuario admin:

```bash
npm run prisma:seed
```

**Credenciales de prueba:**

- Email: `admin@ejemplo.com`
- Contraseña: `password123`

## Uso de la API

### Login

**Endpoint:** `POST /auth/login`

**Request:**

```json
{
  "email": "admin@ejemplo.com",
  "password": "password123"
}
```

**Response (200 OK):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": "cmh2woama00007qfybgn9ahxr",
    "email": "admin@ejemplo.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }
}
```

### Usar el Token

Para acceder a rutas protegidas, incluye el token en el header `Authorization`:

```bash
curl -H "Authorization: Bearer <token>" http://localhost:4000/protected-route
```

## Proteger Rutas

### Proteger un Controller Completo

```typescript
import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  // Todas las rutas están protegidas
}
```

### Proteger Métodos Específicos

```typescript
import { Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Get()
@UseGuards(JwtAuthGuard)
async getProducts() {
  // Solo accesible con token válido
}
```

### Acceder al Usuario Autenticado

```typescript
import { UseGuards, Get } from '@nestjs/common';
import { User } from './common/decorators/user.decorator';

@Get('profile')
@UseGuards(JwtAuthGuard)
async getProfile(@User() user) {
  return user;
}
```

## Estructura de Carpetas

```
src/auth/
├── auth.module.ts          # Módulo principal
├── auth.service.ts         # Lógica de autenticación
├── auth.controller.ts      # Endpoints
├── guards/
│   └── jwt-auth.guard.ts  # Guard para proteger rutas
├── strategies/
│   └── jwt.strategy.ts     # Estrategia de validación JWT
└── dto/
    ├── login.dto.ts        # DTO para login
    └── auth-response.dto.ts # DTO para respuesta
```

## Flujo de Autenticación

1. Usuario envía email y contraseña al endpoint `/auth/login`
2. AuthService verifica las credenciales:
   - ✓ Usuario existe
   - ✓ Usuario activo
   - ✓ Contraseña coincide
3. Si son válidas:
   - ✓ Actualiza `lastLogin`
   - ✓ Genera JWT con payload (id, email, role)
   - ✓ Retorna token y datos del usuario
4. Cliente guarda el token
5. En solicitudes posteriores, el token se envía en el header `Authorization`
6. JwtStrategy valida el token y carga el usuario

## Campos de Usuario para Escalabilidad

El modelo User incluye estos campos:

- `id`: ID único (CUID)
- `email`: Email único
- `firstName`: Nombre
- `lastName`: Apellido
- `password`: Contraseña encriptada
- `role`: Rol del usuario (admin, user, etc.)
- `isActive`: Estado de la cuenta
- `lastLogin`: Último login registrado
- `createdAt`: Fecha de creación
- `updatedAt`: Última actualización

Estos campos permiten fácilmente:

- Agregar más roles en el futuro
- Desactivar usuarios sin eliminarlos
- Rastrear actividad
- Implementar auditoría

## Próximas Mejoras (Opcional)

- [ ] Refresh tokens
- [ ] Register endpoint
- [ ] Password recovery
- [ ] Two-factor authentication
- [ ] OAuth2 integration
- [ ] Rate limiting en login
- [ ] Audit logs
