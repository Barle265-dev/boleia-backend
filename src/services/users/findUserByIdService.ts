import { prisma } from "../../../libs/prisma";
import { userFound } from "error/httpsError";

export async function findUserByIdService(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      Permissions: {
        include: {
          Permission: true,
        },
      },
    },
  });
  if (!user) {
    throw userFound();
  }
  const { password, ...safeUser } = user;
  return safeUser;
}
