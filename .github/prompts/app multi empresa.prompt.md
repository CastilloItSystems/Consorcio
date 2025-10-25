---
mode: agent
---

**Situación**

Estás desarrollando una aplicación SaaS multi-tenant con Next.js 16.0.0 en el frontend (usando Tailwind CSS 4) y NestJS 11.x en el backend (con Prisma 6.18.0 como ORM). La aplicación debe soportar múltiples empresas donde cada una puede tener modelos de negocio completamente diferentes, y los usuarios pueden tener acceso controlado a una o múltiples empresas con diferentes niveles de permisos. La arquitectura debe ser altamente escalable y preparada para crecer significativamente.

**Tarea**

El asistente debe diseñar y proporcionar una arquitectura completa de proyecto que incluya:

1. Estructura de carpetas detallada para ambos repositorios (frontend y backend)
2. Modelo de base de datos con Prisma que soporte multi-tenancy, usuarios, empresas y control de acceso basado en roles (RBAC)
3. Implementación de autenticación y autorización usando JWT con NestJS Guards
4. Patrón de diseño para módulos dinámicos por empresa que permita diferentes modelos de negocio
5. Estrategia de aislamiento de datos entre empresas (tenant isolation)
6. Configuración de middleware y contexto para identificación de tenant

**Objetivo**

El asistente debe diseñar y proporcionar una arquitectura completa de proyecto que incluya:

1. Estructura de carpetas detallada para ambos repositorios (frontend y backend)
2. Modelo de base de datos con Prisma que soporte multi-tenancy, usuarios, empresas y control de acceso basado en roles (RBAC)
3. Implementación de autenticación y autorización usando JWT con NestJS Guards
4. Patrón de diseño para módulos dinámicos por empresa que permita diferentes modelos de negocio
5. Estrategia de aislamiento de datos entre empresas (tenant isolation)
6. Configuración de middleware y contexto para identificación de tenant

**Objetivo**

Crear una base de código robusta, mantenible y escalable que permita agregar nuevas empresas con lógica de negocio personalizada sin afectar el código existente, siguiendo principios SOLID y patrones de arquitectura empresarial como Domain-Driven Design (DDD) y arquitectura modular.

**Conocimiento**

- La aplicación debe soportar que un usuario pertenezca a múltiples empresas simultáneamente
- Cada empresa puede requerir módulos, funcionalidades y reglas de negocio completamente diferentes
- Se debe implementar un sistema de permisos granular que permita diferentes roles por empresa
- La solución debe considerar el aislamiento de datos entre empresas para seguridad y compliance
- Se debe usar Prisma con PostgreSQL como base de datos principal
- El frontend debe usar App Router de Next.js 16 con Server Components donde sea apropiado
- Se debe implementar autenticación con refresh tokens y manejo de sesiones
- La arquitectura debe permitir escalar horizontalmente agregando microservicios específicos por empresa en el futuro
