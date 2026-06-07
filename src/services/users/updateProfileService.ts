import { prisma } from "../../../libs/prisma";
import { userNotFound } from "../../error/httpsError";
import { UpdateUserDto } from "../../types";

export async function updateProfileService(userId: string, data: UpdateUserDto) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) {
    throw userNotFound();
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      photoUrl: data.photoUrl,
      role: data.role,
    },
    include: {
      vehicles: true,
      documents: true,
      Permissions: { include: { Permission: true } },
    },
  });

  const { password, ...safeUser } = updated;
  return safeUser;
}
