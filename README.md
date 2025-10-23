# Consorcio

Consorcio
backend/
├── src/
│ ├── app.module.ts # Módulo raíz que importa todos los módulos
│ ├── main.ts # Punto de entrada
│ ├── common/ # Código compartido (guards, interceptors, utils)
│ │ ├── guards/
│ │ ├── interceptors/
│ │ └── utils/
│ ├── shared/ # Servicios y módulos compartidos (ej. autenticación, logging, prisma)
│ │ ├── modules/ # Módulos compartidos (Auth, Permissions, Logs, Prisma)
│ │ └── services/ # Servicios comunes (si aplica)
│ ├── tenants/ # Lógica específica por empresa (multi-tenant)
│ │ ├── tenant.guard.ts # Guard para identificar el tenant
│ │ ├── tenant.service.ts # Servicio para manejar tenants
│ │ └── tenant.module.ts # Módulo para tenants
│ ├── modules/ # Módulos por empresa o modelo de negocio
│ │ ├── empresa-a/ # Empresa A (ej. e-commerce)
│ │ │ ├── entities/ # Entidades específicas (ej. Product, Order)
│ │ │ ├── services/ # Servicios (ej. ProductService)
│ │ │ ├── controllers/ # Controladores (ej. ProductController)
│ │ │ └── empresa-a.module.ts
│ │ ├── empresa-b/ # Empresa B (ej. SaaS)
│ │ │ ├── entities/ # Entidades específicas (ej. Subscription, Invoice)
│ │ │ ├── services/
│ │ │ ├── controllers/
│ │ │ └── empresa-b.module.ts
│ │ └── ... # Más empresas según sea necesario
│ ├── config/ # Configuraciones (DB, env)
│ └── dto/ # Data Transfer Objects compartidos
├── test/ # Pruebas
├── dist/ # Build output
└── package.json

Prisma
├── prisma/
│ ├── schema.prisma # Modelo de datos (reemplaza a las entidades TypeORM)
│ └── seed.ts # Script de seed
