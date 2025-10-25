# 🔐 AUTENTICACIÓN JWT - RESUMEN TÉCNICO

## 📦 Estructura del Módulo

```
src/auth/
├── 📄 auth.module.ts              # Módulo principal con configuración JWT
├── 📄 auth.service.ts             # Lógica de negocio (login, validación)
├── 📄 auth.controller.ts          # Endpoint POST /auth/login
├── dto/
│   ├── 📄 login.dto.ts            # Validación: email + password
│   └── 📄 auth-response.dto.ts    # Respuesta: token + usuario
├── guards/
│   └── 📄 jwt-auth.guard.ts       # Guard para proteger rutas
└── strategies/
    └── 📄 jwt.strategy.ts         # Validación de JWT (Passport)
```

## 🔄 Flujo Completo

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (Frontend)                        │
│  [Usuario ingresa email y contraseña en formulario]         │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ├─→ POST /auth/login
                   │   {email, password}
                   │
┌──────────────────▼──────────────────────────────────────────┐
│              AUTH CONTROLLER                                 │
│  - Recibe request                                           │
│  - Valida DTO (email format, password length)              │
│  - Llama AuthService.login()                               │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│              AUTH SERVICE                                    │
│  1. Busca usuario por email en BD                          │
│  2. Verifica usuario existe y está activo                  │
│  3. Compara password (bcrypt) con hash en BD              │
│  4. Actualiza lastLogin                                    │
│  5. Crea payload JWT (id, email, role)                    │
│  6. Firma JWT con JWT_SECRET (1 hora expiry)              │
│  7. Retorna token + datos usuario                         │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│                 RESPUESTA (200 OK)                          │
│ {                                                            │
│   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", │
│   "token_type": "Bearer",                                   │
│   "expires_in": 3600,                                       │
│   "user": {                                                 │
│     "id": "cmh2woama00007qfybgn9ahxr",                     │
│     "email": "admin@ejemplo.com",                          │
│     "firstName": "Admin",                                  │
│     "lastName": "User",                                    │
│     "role": "admin"                                        │
│   }                                                        │
│ }                                                           │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────┴──────────────┐
        │                         │
        ▼ Cliente guarda token    ▼
                            (Próxima solicitud)

┌──────────────────────────────────────────────────────────────┐
│          GET /products (ruta protegida)                      │
│  Headers: Authorization: Bearer <token>                      │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│              JWT AUTH GUARD                                  │
│  - Intercepta request                                       │
│  - Verifica que existe Authorization header                │
│  - Extrae token después de "Bearer"                        │
│  - Pasa a JwtStrategy                                      │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│              JWT STRATEGY (Passport)                         │
│  1. Verifica firma JWT con JWT_SECRET                      │
│  2. Valida que token no está expirado                      │
│  3. Extrae payload (id, email, role)                       │
│  4. Llama AuthService.validateUser(id)                     │
│  5. Verifica usuario existe y está activo                  │
│  6. Adjunta usuario al request (req.user)                 │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────┴──────────────┐
        │                         │
        ▼ Válido                  ▼ Inválido/Expirado
        │                         │
    ✅ Acceso                    ❌ 401 Unauthorized
       permitido
```

## 🔐 Seguridad Implementada

| Aspecto            | Implementación                              |
| ------------------ | ------------------------------------------- |
| **Contraseñas**    | Encriptadas con bcrypt (10 rounds)          |
| **JWT**            | Firmado con secreto en variables de entorno |
| **Expiración**     | 1 hora configurada en auth.module.ts        |
| **Validación**     | Email y contraseña validados en DTOs        |
| **Estado Usuario** | Solo usuarios activos pueden login          |
| **Headers**        | HTTPS en producción recomendado             |
| **CORS**           | Configurar en main.ts si es necesario       |

## 📊 Base de Datos - Modelo User

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique              # Email único para login
  firstName String   @map("first_name")
  lastName  String   @map("last_name")
  password  String                        # Hash bcrypt
  role      String   @default("user")     # admin, user, moderator, etc.
  isActive  Boolean  @default(true)       # Soft delete sin eliminar
  lastLogin DateTime? @map("last_login")  # Auditoría
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
  @@index([email])
}
```

## 🚀 Uso en Controladores

### Proteger Rutas Individuales

```typescript
@Controller('api')
export class MyController {
  @Get('public')
  publicRoute() {
    return 'Acceso público';
  }

  @Get('private')
  @UseGuards(JwtAuthGuard)
  privateRoute(@User() user) {
    return `Hola ${user.email}`;
  }
}
```

### Proteger Controlador Completo

```typescript
@Controller('api')
@UseGuards(JwtAuthGuard)
export class MyController {
  // Todas las rutas requieren JWT
  @Get()
  getData(@User() user) { ... }

  @Post()
  createData(@User() user) { ... }
}
```

## 📝 Endpoints

| Método | Ruta            | Autenticación | Descripción              |
| ------ | --------------- | ------------- | ------------------------ |
| POST   | `/auth/login`   | ❌ Pública    | Iniciar sesión           |
| GET    | `/auth/profile` | ✅ Requerida  | Obtener perfil (ejemplo) |

## 🎯 Próximas Integraciones

```typescript
// 1. En ProductsModule
@Post()
@UseGuards(JwtAuthGuard)
create(@Body() dto: CreateProductDto, @User() user) {
  // user.id, user.role disponibles
}

// 2. En UsersModule
@Get('me')
@UseGuards(JwtAuthGuard)
getProfile(@User() user) {
  return this.usersService.findOne(user.id);
}

// 3. Con decorador personalizado
@Get()
@UseGuards(JwtAuthGuard)
getData(@CurrentUser() user: User) {
  return user;
}
```

## 🔧 Configuración en Variables de Entorno

```env
# JWT
JWT_SECRET=your-super-secret-key-min-32-chars-recomendado
JWT_EXPIRY=1h              # En auth.module.ts: { expiresIn: '1h' }

# Base de datos
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Aplicación
NODE_ENV=development
PORT=4000
```

## ✅ Checklist de Seguridad

- [x] Contraseñas hasheadas (bcrypt)
- [x] JWT con firma segura
- [x] Token con expiración
- [x] Validación de entrada (DTOs)
- [x] Guard para rutas protegidas
- [x] Manejo de errores (no expone información sensible)
- [x] Validación de usuario activo
- [ ] HTTPS en producción
- [ ] Rate limiting en /auth/login
- [ ] Refresh tokens (opcional)
- [ ] Audit logging (opcional)

---

**Último actualizado:** 2025-10-23  
**Estado:** ✅ Producción Ready
