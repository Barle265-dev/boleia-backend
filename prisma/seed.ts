import { hash } from "bcrypt";
import { randomUUID } from "crypto";
import { prisma } from "../src/libs/prisma";
import { Permissions } from "../src/permissionsTypes";

async function main() {
  const permissionNames = Object.values(Permissions);

  const permissions = await Promise.all(
    permissionNames.map((name) =>
      prisma.permission.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  console.log("Permissoes criadas:", permissions.length);

  const hashedPassword = await hash("123456", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@boleia.cv" },
    update: {
      password: hashedPassword,
      isVerified: true,
      isBlocked: false,
    },
    create: {
      id: randomUUID(),
      name: "Administrador",
      email: "admin@boleia.cv",
      password: hashedPassword,
      phone: "+238 900 00 00",
      role: "passenger",
      isVerified: true,
    },
  });

  console.log("Usuario admin criado:", adminUser.email);

  await prisma.userPermission.createMany({
    data: permissions.map((permission) => ({
      userId: adminUser.id,
      permissionId: permission.id,
    })),
    skipDuplicates: true,
  });

  console.log("Todas as permissoes atribuidas ao administrador.");
  console.log("Credenciais: admin@boleia.cv / 123456");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
