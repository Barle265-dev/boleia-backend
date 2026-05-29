import { prisma } from "../../../libs/prisma";

export async function removeUserService(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const removeUser = await prisma.user.update({
    where: { id },
    data: { isBlocked: true },
  });

  return removeUser;
}
