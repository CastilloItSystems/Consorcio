# Correcciones al Sistema de Refresh Token

## 📋 Resumen de Cambios

Se ha corregido completamente el flujo de refresh token para que funcione correctamente con **rotación automática de tokens**, siguiendo las mejores prácticas de seguridad.

## 🔧 Problemas Corregidos

### 1. **Frontend - api.ts**

**Problema**: `attemptRefresh()` enviaba `null` en el body y no manejaba el nuevo refresh token rotado.

**Solución**:

- Cambiado de `null` a `{}` en el body de la petición
- Agregados logs de debug para mejor trazabilidad
- Documentación clara de que el backend actualiza la cookie automáticamente

### 2. **Frontend - AuthProvider.tsx**

**Problema**: Lógica redundante de refresh en el bootstrap, causando múltiples llamadas innecesarias.

**Solución**:

- Simplificado el flujo de bootstrap
- Eliminadas llamadas manuales a `/auth/refresh`
- Se confía en el interceptor automático de `api.ts` para manejar 401

### 3. **Backend - auth.controller.ts**

**Problema**: Configuración de cookies con `sameSite: 'none'` en desarrollo, causando problemas con CORS.

**Solución**:

- Configuración dinámica: `sameSite: 'lax'` en desarrollo, `'none'` en producción
- Consistencia entre `login` y `refresh`
- Validación de que al menos uno de cookie o body contenga el refresh_token
- Comentarios mejorados

### 4. **Backend - refresh-token.dto.ts**

**Problema**: DTO requería `refresh_token` como campo obligatorio, impidiendo el uso de cookies.

**Solución**:

- Campo `refresh_token` ahora es opcional (`@IsOptional()`)
- Validación en el controlador para asegurar que llegue por cookie o body
- Documentación actualizada en Swagger

## 🔄 Flujo Correcto del Refresh Token

```
1. Usuario hace login
   ├─ Backend genera access_token + refresh_token
   ├─ access_token enviado en response JSON
   └─ refresh_token guardado en cookie httpOnly

2. Access token expira → Request devuelve 401
   ├─ api.ts detecta 401
   ├─ Llama automáticamente a /auth/refresh
   ├─ Backend valida refresh_token de la cookie
   ├─ Backend REVOCA el refresh_token viejo
   ├─ Backend genera NUEVO refresh_token + access_token
   ├─ Backend guarda nuevo refresh_token en cookie httpOnly
   ├─ Frontend recibe y guarda nuevo access_token
   └─ Request original se reintenta con nuevo token

3. Siguiente expiración
   └─ Se repite paso 2 con el nuevo refresh_token
```

## ✅ Ventajas de la Implementación

1. **Seguridad mejorada**:

   - Refresh tokens en cookies httpOnly (no accesibles desde JS)
   - Rotación automática (cada uso genera nuevo token)
   - Tokens viejos revocados inmediatamente

2. **Experiencia de usuario**:

   - Sesión persistente sin re-login
   - Transición transparente al renovar tokens
   - Manejo automático de expiración

3. **Mantenibilidad**:
   - Lógica centralizada en `api.ts`
   - Sin duplicación de código
   - Logs de debug para troubleshooting

## 🧪 Cómo Probar

### Prueba Automatizada

```bash
cd backend
./test-refresh-token.sh
```

Este script valida:

- ✓ Login correcto
- ✓ Primer refresh funciona
- ✓ Token es rotado (ID cambia)
- ✓ Segundo refresh funciona con token rotado
- ✓ Token viejo es rechazado (revocado)
- ✓ Access token es válido

### Prueba Manual en el Frontend

1. Hacer login en la aplicación
2. Esperar a que expire el access_token (o modificar su tiempo de expiración a 10s para pruebas)
3. Hacer una petición que requiera autenticación
4. Observar en las DevTools:
   - Network tab: ver la petición 401 seguida del refresh automático
   - Application > Cookies: ver que `refresh_token` se actualiza
   - Console: logs de "Token refreshed successfully"

## 📝 Configuración Recomendada

### Tiempos de Expiración

```typescript
// En backend/src/auth/auth.service.ts
ACCESS_TOKEN: 15 minutos (actual: configurado en JWT module)
REFRESH_TOKEN: 30 días (actual: 1000 * 60 * 60 * 24 * 30)
```

### Variables de Entorno

```env
NODE_ENV=development  # o 'production'
JWT_SECRET=tu_secreto_aqui
JWT_EXPIRES_IN=15m
```

### CORS

```typescript
// backend/src/main.ts
app.enableCors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true, // ⚠️ CRÍTICO para cookies
});
```

## 🔒 Consideraciones de Seguridad

1. **En Producción**:

   - Usar HTTPS siempre (`secure: true`)
   - `sameSite: 'none'` requiere HTTPS
   - Configurar dominios específicos en CORS

2. **Protección contra ataques**:

   - Token rotation previene replay attacks
   - httpOnly previene XSS
   - Expiración corta del access_token limita ventana de ataque
   - Revocación inmediata del refresh_token usado

3. **Logout seguro**:
   - Revoca el refresh_token en BD
   - Limpia cookie en el cliente
   - Limpia access_token de memoria

## 📚 Referencias

- [RFC 6749 - OAuth 2.0](https://tools.ietf.org/html/rfc6749)
- [OWASP - JWT Security Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [NestJS Authentication](https://docs.nestjs.com/security/authentication)

## ✨ Estado Final

✅ Refresh token funcionando correctamente  
✅ Rotación automática implementada  
✅ Cookies httpOnly seguras  
✅ Manejo de errores robusto  
✅ Tests disponibles  
✅ Documentación completa
