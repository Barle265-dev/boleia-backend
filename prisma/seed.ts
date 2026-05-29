import { hash } from "bcrypt";
import { prisma } from "../libs/prisma";
import { randomUUID } from "crypto";
import { Gender, Status, User } from "../src/types";
import { Permissions } from "../src/permissionsTypes";

async function main() {
  const permissionNames = Object.values(Permissions);

  const permissions = await Promise.all(
    permissionNames.map(async (name) =>
      prisma.permission.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  console.log("Permissões criadas:", permissions.length);

  const adminRole = await prisma.role.upsert({
    where: { name: "Administrador" },
    update: {},
    create: { name: "Administrador" },
  });

  console.log("Role criada:", adminRole.name);

  const hashedPassword = await hash("admin", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      id: randomUUID(),
      name: "Joel Oliveira",
      email: "admin@admin.com",
      address: "Assomada",
      gender: Gender.MALE,
      phone: null,
      status: Status.ACTIVE,
      type: "ADMIN",
      password: hashedPassword,
      roleId: adminRole.id,
    },
  });

  console.log("Usuário admin criado:", adminUser.email);

  await prisma.userPermission.createMany({
    data: permissions.map((p) => ({
      userId: adminUser.id,
      permissionId: p.id,
    })),
    skipDuplicates: true,
  });

  console.log("Todas as permissões atribuídas ao Joel!");
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
