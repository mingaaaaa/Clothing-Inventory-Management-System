import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const MENUS = [
  { key: 'dashboard', label: '仪表盘', path: '/dashboard', icon: 'LayoutDashboard', sort: 1, roles: [UserRole.ADMIN, UserRole.WAREHOUSE_STAFF, UserRole.STORE_MANAGER] },
  { key: 'product-management', label: '商品管理', path: '/dashboard/products', icon: 'Package', sort: 2, roles: [UserRole.ADMIN, UserRole.WAREHOUSE_STAFF] },
  { key: 'order-inbound', label: '入库管理', path: '/dashboard/orders/inbound', icon: 'ArrowDownToLine', sort: 3, roles: [UserRole.ADMIN, UserRole.WAREHOUSE_STAFF] },
  { key: 'order-outbound', label: '出库管理', path: '/dashboard/orders/outbound', icon: 'ArrowUpFromLine', sort: 4, roles: [UserRole.ADMIN, UserRole.WAREHOUSE_STAFF, UserRole.STORE_MANAGER] },
  { key: 'store-management', label: '门店管理', path: '/dashboard/stores', icon: 'Store', sort: 5, roles: [UserRole.ADMIN] },
  { key: 'user-management', label: '用户管理', path: '/dashboard/users', icon: 'Users', sort: 6, roles: [UserRole.ADMIN] },
];

async function main() {
  console.log('Seeding database...');

  // Create menus and role-menu mappings
  for (const menuData of MENUS) {
    const menu = await prisma.menu.upsert({
      where: { key: menuData.key },
      update: { label: menuData.label, path: menuData.path, icon: menuData.icon, sort: menuData.sort },
      create: { key: menuData.key, label: menuData.label, path: menuData.path, icon: menuData.icon, sort: menuData.sort },
    });

    for (const role of menuData.roles) {
      await prisma.roleMenu.upsert({
        where: { role_menuId: { role, menuId: menu.id } },
        update: {},
        create: { role, menuId: menu.id },
      });
    }
  }

  // Create admin user
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash,
      realName: '系统管理员',
      role: UserRole.ADMIN,
      status: 'ACTIVE',
    },
  });

  // Create warehouse staff user
  const staffHash = await bcrypt.hash('staff123', 10);
  await prisma.user.upsert({
    where: { username: 'staff' },
    update: {},
    create: {
      username: 'staff',
      passwordHash: staffHash,
      realName: '仓库员工',
      role: UserRole.WAREHOUSE_STAFF,
      status: 'ACTIVE',
    },
  });

  // Create store manager user (needs a store first)
  const store = await prisma.store.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: '示例门店',
      address: '上海市南京路100号',
      latitude: 31.2304,
      longitude: 121.4737,
      phone: '021-12345678',
    },
  });

  const managerHash = await bcrypt.hash('manager123', 10);
  await prisma.user.upsert({
    where: { username: 'manager' },
    update: {},
    create: {
      username: 'manager',
      passwordHash: managerHash,
      realName: '门店经理',
      role: UserRole.STORE_MANAGER,
      status: 'ACTIVE',
      storeId: store.id,
    },
  });

  console.log('Seed completed!');
  console.log('Users created:');
  console.log('  admin / admin123 (ADMIN)');
  console.log('  staff / staff123 (WAREHOUSE_STAFF)');
  console.log('  manager / manager123 (STORE_MANAGER)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
