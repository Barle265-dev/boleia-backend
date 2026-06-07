import { hash } from "bcrypt";
import { prisma } from "../../../libs/prisma";
import { userNotFound } from "../../error/httpsError";
import { UserRole } from "../../types";

type UserUpdatePayload = {
  name?: string;
  email?: string;
  password?: string;
  phone?: string | null;
  photoUrl?: string | null;
  role?: UserRole;
  isVerified?: boolean;
  isBlocked?: boolean;
  permissionIds?: string[];
};

export async function updateUserService(id: string, data: UserUpdatePayload) {
  const user = await prisma.user.findFirst({
    where: { id },
  });

  if (!user) {
    throw userNotFound();
  }

  const hashedPassword = data.password ? await hash(data.password, 10) : undefined;

  if (data.permissionIds) {
    await prisma.userPermission.deleteMany({
      where: { userId: user.id },
    });
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      photoUrl: data.photoUrl,
      role: data.role,
      isVerified: data.isVerified,
      isBlocked: data.isBlocked,
      password: hashedPassword,
      Permissions: data.permissionIds
        ? {
            createMany: {
              data: data.permissionIds.map((permissionId: string) => ({ permissionId })),
              skipDuplicates: true,
            },
          }
        : undefined,
    },
    include: {
      vehicles: true,
      documents: true,
      Permissions: {
        include: { Permission: true },
      },
    },
  });

  const { password, ...safeUser } = updated;
  return safeUser;
}
