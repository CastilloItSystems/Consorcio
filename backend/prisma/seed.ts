import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hash para la contraseña "password123"
  const hashedPassword = await bcrypt.hash('password123', 10);
  // Create companies (tenants)
  const prismaAny = prisma as any;

  // Create companies (tenants) idempotently
  let companyA = await prismaAny.company.findFirst({
    where: { OR: [{ slug: 'empresa-a' }, { name: 'Empresa A' }] },
  });
  if (!companyA) {
    companyA = await prismaAny.company.create({
      data: {
        name: 'Empresa A',
        slug: 'empresa-a',
        themeColor: 'blue',
        themeName: 'Tech',
        darkModeDefault: false,
      },
    });
  }

  let companyB = await prismaAny.company.findFirst({
    where: { OR: [{ slug: 'empresa-b' }, { name: 'Empresa B' }] },
  });
  if (!companyB) {
    companyB = await prismaAny.company.create({
      data: {
        name: 'Empresa B',
        slug: 'empresa-b',
        themeColor: 'pink',
        themeName: 'Creative',
        darkModeDefault: false,
      },
    });
  }

  // Create permissions (idempotent)
  let permManageUsers = await prismaAny.permission.findFirst({
    where: { key: 'users.manage' },
  });
  if (!permManageUsers) {
    permManageUsers = await prismaAny.permission.create({
      data: { key: 'users.manage', name: 'Manage users' },
    });
  }

  let permViewProducts = await prismaAny.permission.findFirst({
    where: { key: 'products.view' },
  });
  if (!permViewProducts) {
    permViewProducts = await prismaAny.permission.create({
      data: { key: 'products.view', name: 'View products' },
    });
  }

  // Create roles (idempotent)
  let adminRole = await prismaAny.role.findFirst({ where: { name: 'admin' } });
  if (!adminRole) {
    adminRole = await prismaAny.role.create({
      data: { name: 'admin', description: 'Company administrator' },
    });
  }

  let memberRole = await prismaAny.role.findFirst({
    where: { name: 'member' },
  });
  if (!memberRole) {
    memberRole = await prismaAny.role.create({
      data: { name: 'member', description: 'Regular company user' },
    });
  }

  // Link role permissions (idempotent)
  const baseRolePerms = [
    { roleId: adminRole.id, permissionId: permManageUsers.id },
    { roleId: adminRole.id, permissionId: permViewProducts.id },
    { roleId: memberRole.id, permissionId: permViewProducts.id },
  ];
  for (const rp of baseRolePerms) {
    const exists = await prismaAny.rolePermission.findFirst({
      where: { roleId: rp.roleId, permissionId: rp.permissionId },
    });
    if (!exists) {
      await prismaAny.rolePermission.create({ data: rp });
    }
  }

  // Create user and membership (idempotent)
  let user = await prisma.user.findUnique({
    where: { email: 'admin@ejemplo.com' },
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'admin@ejemplo.com',
        firstName: 'Admin',
        lastName: 'User',
        password: hashedPassword,
        isActive: true,
      },
    });
    console.log('Seed: usuario creado:', user.email);
  } else {
    console.log('Seed: usuario ya existe:', user.email);
  }

  // Create membership linking user to companyA as admin (idempotent)
  const existingMembership = await prismaAny.membership.findFirst({
    where: { userId: user.id, companyId: companyA.id },
  });
  if (!existingMembership) {
    await prismaAny.membership.create({
      data: {
        userId: user.id,
        companyId: companyA.id,
        roleId: adminRole.id,
      },
    });
    console.log(
      'Seed: membership creado para',
      user.email,
      '->',
      companyA.slug,
    );
  } else {
    console.log(
      'Seed: membership ya existe para',
      user.email,
      '->',
      companyA.slug,
    );
  }

  // Create a sample product for companyB to show tenant-scoped data (idempotent)
  const existingProduct = await prismaAny.product.findFirst({
    where: { name: 'Sample Product', companyId: companyB.id },
  });
  if (!existingProduct) {
    await prismaAny.product.create({
      data: {
        name: 'Sample Product',
        description: 'Producto de ejemplo para company B',
        // Use string for decimal to avoid runtime Decimal import issues in the seed script
        price: '9.99',
        stock: 100,
        companyId: companyB.id,
      },
    });
  }

  console.log('Seed: usuario creado:', user.email, 'company:', companyA.slug);

  console.log('Seed: Iniciando creación de superadmin...');

  // --- Superadmin: usuario con acceso a todo (idempotente) ---
  const superEmail = 'superadmin@consorcio.com';
  const superPlain = 'superadmin';

  // create or get super role
  console.log('Seed: Buscando role superadmin...');
  let superRole = await prismaAny.role.findFirst({
    where: { name: 'superadmin' },
  });
  console.log('Seed: Role superadmin encontrado:', superRole ? 'SI' : 'NO');
  if (!superRole) {
    superRole = await prismaAny.role.create({
      data: {
        name: 'superadmin',
        description: 'Super administrator with full access',
      },
    });
    console.log('Seed: role superadmin creado');
  }

  // create super user if not exists
  console.log('Seed: Buscando super user...');
  let superUser = await prisma.user.findUnique({
    where: { email: superEmail },
  });
  console.log('Seed: Super user encontrado:', superUser ? 'SI' : 'NO');
  if (!superUser) {
    const hashedSuper = await bcrypt.hash(superPlain, 10);
    superUser = await prisma.user.create({
      data: {
        email: superEmail,
        firstName: 'Super',
        lastName: 'Admin',
        password: hashedSuper,
        isActive: true,
      },
    });
    console.log('Seed: usuario superadmin creado:', superEmail);
  }

  // ensure superRole has all permissions
  const allPerms = await prismaAny.permission.findMany();
  const missingRolePerms = [];
  for (const p of allPerms) {
    const exists = await prismaAny.rolePermission.findFirst({
      where: { roleId: superRole.id, permissionId: p.id },
    });
    if (!exists)
      missingRolePerms.push({ roleId: superRole.id, permissionId: p.id });
  }
  if (missingRolePerms.length) {
    await prismaAny.rolePermission.createMany({ data: missingRolePerms });
    console.log('Seed: asignadas permisos al role superadmin');
  }

  // ensure superUser has membership in all companies
  const companies = await prismaAny.company.findMany();
  if (companies.length === 0) {
    const c = await prismaAny.company.create({
      data: {
        name: 'Consorcio',
        slug: 'consorcio',
        themeColor: 'purple',
        themeName: 'Aurora',
        darkModeDefault: false,
      },
    });
    companies.push(c);
  }

  for (const c of companies) {
    const m = await prismaAny.membership.findFirst({
      where: { userId: superUser.id, companyId: c.id },
    });
    if (!m) {
      await prismaAny.membership.create({
        data: { userId: superUser.id, companyId: c.id, roleId: superRole.id },
      });
      console.log('Seed: membership superadmin -> company', c.slug);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
