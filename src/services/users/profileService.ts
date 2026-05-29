import { prisma } from "../../../libs/prisma";
import { userNotFound } from "error/httpsError";

export async function profileService(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        Role: true,
        Permissions: {
          include: {
            Permission: true,
          },
        },
      },
    });
    if (!user) {
      throw userNotFound();
    }
    const { password, ...safeUser } = user;

    return safeUser;
  } catch (error) {
    throw error;
  }
}
