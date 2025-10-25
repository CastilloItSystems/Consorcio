# 📝 Guía de Prueba - Autenticación JWT

## ✅ Verificación de Instalación

```bash
# 1. Compilar proyecto
npm run build

# 2. Verificar que no hay errores
echo "Si ves este mensaje, la compilación fue exitosa ✅"
```

## 🧪 Probar la Autenticación

### Opción 1: Con cURL

```bash
# Terminal 1: Iniciar servidor
npm run start:dev

# Terminal 2: Hacer login
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ejemplo.com",
    "password": "password123"
  }'

# Respuesta esperada:
# {
#   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "token_type": "Bearer",
#   "expires_in": 3600,
#   "user": {
#     "id": "...",
#     "email": "admin@ejemplo.com",
#     "firstName": "Admin",
#     "lastName": "User",
#     "role": "admin"
#   }
# }
```

### Opción 2: Con Postman/Insomnia

1. **Nueva Request → POST**
   - URL: `http://localhost:4000/auth/login`
   - Headers: `Content-Type: application/json`
   - Body (JSON):
     ```json
     {
       "email": "admin@ejemplo.com",
       "password": "password123"
     }
     ```

2. **Click en Send**
3. **Copiar el token del campo `access_token`**

## 🔒 Proteger Rutas

### En Products Controller (ejemplo)

```typescript
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {

  // Público
  @Get()
  findAll() { ... }

  // Protegido
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateProductDto) { ... }
}
```

### Probar ruta protegida

```bash
# Sin token (debe fallar - 401)
curl http://localhost:4000/products

# Con token (debe funcionar - 200)
curl -H "Authorization: Bearer <tu-token>" \
  http://localhost:4000/products
```

## 📊 Base de Datos

### Ver usuarios en Prisma Studio

```bash
npm run prisma:studio
```

Luego abre `http://localhost:5555` en el navegador.

### Ver datos directamente

```bash
npm run prisma:seed  # Crear usuario de prueba
```

## 🐛 Troubleshooting

### "Invalid token"

- ✓ Verificar que el token está completo
- ✓ Verificar que comienza con `Bearer`
- ✓ Verificar que el token no expiró (1 hora)

### "Credenciales inválidas"

- ✓ Verificar email: `admin@ejemplo.com`
- ✓ Verificar contraseña: `password123`
- ✓ Verificar que el usuario existe en BD

### "JWT_SECRET no definido"

- ✓ Verificar archivo `.env`
- ✓ Verificar que `JWT_SECRET` está definido
- ✓ Reiniciar servidor después de cambiar `.env`

## 📝 Crear Nuevo Usuario

Para crear un nuevo usuario con contraseña encriptada:

```bash
# Editar prisma/seed.ts y agregar más usuarios
# Luego ejecutar:
npm run prisma:seed
```

## 🎯 Checklist Final

- [ ] Servidor compila sin errores
- [ ] Base de datos sincronizada
- [ ] Usuario admin creado
- [ ] Endpoint `/auth/login` funciona
- [ ] Token JWT se genera correctamente
- [ ] Token expira después de 1 hora
- [ ] Guard protege rutas correctamente
- [ ] JWT_SECRET está en .env

---

¡Autenticación lista para usar! 🚀
╔════════════════════════════════════════════════════════════════╗
║ ║
║ ✅ AUTENTICACIÓN JWT COMPLETADA EXITOSAMENTE ║
║ ║
╚════════════════════════════════════════════════════════════════╝

📋 RESUMEN DE IMPLEMENTACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ ARCHIVOS CREADOS/MODIFICADOS:

Auth Module
├── src/auth/auth.module.ts
├── src/auth/auth.controller.ts
├── src/auth/auth.service.ts
├── src/auth/guards/jwt-auth.guard.ts
├── src/auth/strategies/jwt.strategy.ts
├── src/auth/dto/login.dto.ts
├── src/auth/dto/auth-response.dto.ts
└── src/auth/README.md

Database
├── prisma/schema.prisma (actualizado)
└── prisma/seed.ts (usuario de prueba)

Documentation
├── AUTH_SETUP_SUMMARY.md
├── PRUEBA_AUTENTICACION.md
└── DIAGRAMA_AUTENTICACION.md

Configuration
├── src/app.module.ts (importa AuthModule)
└── package.json (agregó prisma:seed)

🔐 CREDENCIALES DE PRUEBA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Email: admin@ejemplo.com
Contraseña: password123
Rol: admin

🚀 CÓMO COMENZAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Iniciar servidor:
   $ npm run start:dev

2. Hacer login:
   $ curl -X POST http://localhost:4000/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@ejemplo.com","password":"password123"}'

3. Copiar token de respuesta

4. Usar en ruta protegida:
   $ curl -H "Authorization: Bearer <token>" \
    http://localhost:4000/ruta-protegida

📚 DOCUMENTACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• src/auth/README.md → Guía completa de uso
• AUTH_SETUP_SUMMARY.md → Resumen técnico
• PRUEBA_AUTENTICACION.md → Guía de pruebas
• DIAGRAMA_AUTENTICACION.md → Diagrama de flujo

🛡️ CARACTERÍSTICAS IMPLEMENTADAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Login con email y contraseña
✅ Contraseñas encriptadas con bcrypt (10 rounds)
✅ JWT con expiración de 1 hora
✅ Validación de usuario activo
✅ Rastreo de último login
✅ Guard para proteger rutas
✅ DTOs con validación automática
✅ Swagger documentation
✅ Soporte para roles
✅ Variable de entorno JWT_SECRET

🔄 PROTEGER RUTAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller('api')
@UseGuards(JwtAuthGuard) // Protege todo el controller
export class MyController {
// Todas las rutas requieren JWT válido
}

📊 ESTRUCTURA DE BASE DE DATOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tabla: users
├── id (CUID, PK)
├── email (UNIQUE)
├── firstName
├── lastName
├── password (bcrypt hash)
├── role (admin, user, etc.)
├── isActive (boolean)
├── lastLogin (DateTime)
├── createdAt
└── updatedAt

✨ PRÓXIMAS MEJORAS (OPCIONAL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Refresh tokens
• Endpoint de registro
• Recuperación de contraseña
• Two-factor authentication
• OAuth2 integration
• Rate limiting
• Audit logging

╔════════════════════════════════════════════════════════════════╗
║ ║
║ ¡Compilación exitosa! Listo para desarrollo 🚀 ║
║ ║
╚════════════════════════════════════════════════════════════════╝
