import { UpdateUserDTO } from "../../types";
import { prisma } from "../../../libs/prisma";
import { userNotFound } from "error/httpsError";

export async function updateProfileService(
  userId: string,
  data: UpdateUserDTO
) {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });
    if (!user) {
      throw userNotFound();
    }

    const update = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        address: data.address,
        phone: data.phone,
        gender: data.gender,
      },
    });

    return update;
  } catch (error) {
    throw error;
  }
}
