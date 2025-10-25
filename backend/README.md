# Consorcio Backend

Backend desarrollado con NestJS y Prisma siguiendo las mejores prácticas de arquitectura modular.

## Estructura del Proyecto

```
src/
├── main.ts                 # Punto de entrada de la aplicación
├── app.module.ts           # Módulo principal
├── app.controller.ts       # Controlador principal
├── app.service.ts          # Servicio principal
├── common/                 # Código compartido
│   ├── decorators/         # Decorators personalizados
│   ├── filters/           # Filtros de excepción
│   ├── guards/            # Guards de autenticación
│   ├── interceptors/      # Interceptors
│   └── pipes/             # Pipes de validación
├── config/                # Configuraciones
│   └── database.config.ts # Configuración de base de datos
├── database/              # Configuración de Prisma
│   ├── prisma.service.ts  # Servicio de Prisma
│   └── database.module.ts # Módulo de base de datos
├── users/                 # Módulo de usuarios
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dto/
│       ├── create-user.dto.ts
│       └── update-user.dto.ts
└── products/              # Módulo de productos
    ├── products.module.ts
    ├── products.controller.ts
    ├── products.service.ts
    └── dto/
        ├── create-product.dto.ts
        └── update-product.dto.ts
```

## Instalación

```bash
# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
cp .env.example .env

# Editar el archivo .env con tu configuración de base de datos
```

## Dependencias Necesarias

Para que el proyecto funcione completamente, instala las siguientes dependencias:

```bash
# Dependencias principales de Prisma y NestJS
npm install prisma @prisma/client @nestjs/config
npm install class-validator class-transformer @nestjs/mapped-types

# Dependencias de desarrollo
npm install --save-dev prisma
```

## Configuración de Base de Datos con Prisma

1. Asegúrate de tener PostgreSQL instalado y ejecutándose
2. Crea una base de datos llamada `consorcio` (o el nombre que prefieras)
3. Configura la variable `DATABASE_URL` en el archivo `.env`:
   ```
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/consorcio?schema=public"
   ```

## Comandos de Prisma

```bash
# Generar el cliente Prisma (después de instalar dependencias)
npx prisma generate

# Aplicar el schema a la base de datos (desarrollo)
npx prisma db push

# Crear y aplicar migraciones (producción)
npx prisma migrate dev --name init

# Ver la base de datos en el navegador
npx prisma studio

# Reset de la base de datos (solo desarrollo)
npx prisma db push --force-reset
```

## Ejecutar la aplicación

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## Endpoints Disponibles

### Usuarios

- `GET /users` - Obtener todos los usuarios
- `GET /users/:id` - Obtener usuario por ID
- `POST /users` - Crear nuevo usuario
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

### Productos

- `GET /products` - Obtener todos los productos
- `GET /products/:id` - Obtener producto por ID
- `POST /products` - Crear nuevo producto
- `PATCH /products/:id` - Actualizar producto
- `DELETE /products/:id` - Eliminar producto

## Características Implementadas

- ✅ Arquitectura modular de NestJS
- ✅ Configuración con variables de entorno
- ✅ Integración con Prisma ORM
- ✅ DTOs con validación usando class-validator
- ✅ Guards de autenticación básicos
- ✅ Filtros de excepción personalizados
- ✅ Interceptors de transformación
- ✅ Pipes de validación
- ✅ Manejo de errores con NotFoundException
- ✅ Type safety completo con Prisma Client
- ✅ Módulo de base de datos global

## Ventajas de Prisma

- **Type Safety**: Tipos TypeScript generados automáticamente
- **Prisma Studio**: Interfaz gráfica para ver/editar datos
- **Migraciones**: Sistema robusto de control de versiones del schema
- **Query Performance**: Queries optimizadas automáticamente
- **Developer Experience**: Excelente autocompletado y debugging

## Próximos Pasos

1. Instalar dependencias de Prisma
2. Configurar variables de entorno
3. Ejecutar `npx prisma generate`
4. Ejecutar `npx prisma db push`
5. Implementar autenticación JWT
6. Agregar más validaciones
7. Implementar tests unitarios
8. Agregar documentación con Swagger

## Comandos Útiles

```bash
# Ver el estado de las migraciones
npx prisma migrate status

# Formatear el schema de Prisma
npx prisma format

# Validar el schema
npx prisma validate

# Inspeccionar la base de datos existente
npx prisma db pull
```

## Description

This project was generated using the [Nest](https://github.com/nestjs/nest) framework with strict TypeScript configuration for enhanced type safety and code quality.

## TypeScript Strict Mode

This project was created with the `--strict` flag, which enables:

- **strict: true** - Activates all strict type checking options
- **noImplicitAny: true** - Disallows implicit `any` types
- **strictNullChecks: true** - Strict null and undefined checks
- **strictFunctionTypes: true** - Strict function type checking
- **strictBindCallApply: true** - Strict checking for bind, call, and apply methods
- **strictPropertyInitialization: true** - Class properties must be initialized
- **noImplicitReturns: true** - All code paths must return a value
- **noImplicitThis: true** - Disallows `this` with implicit `any` type

These settings help catch more errors at compile time and improve code reliability.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers.

## License

Nest is [MIT licensed](LICENSE).
