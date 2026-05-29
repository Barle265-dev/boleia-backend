import { hash } from "bcrypt";
import { Status, UpdateUserDTO, User } from "../../types";
import { prisma } from "../../../libs/prisma";
import { userNotFound } from "error/httpsError";

export async function updateUserService(id: string, data: UpdateUserDTO) {
  try {
    const hashedPassword = data.password
      ? await hash(data.password, 10)
      : undefined;

    const user = await prisma.user.findFirst({
      where: { id },
    });
    if (!user) {
      throw userNotFound();
    }

    if (data.permissionIds) {
      await prisma.userPermission.deleteMany({
        where: { userId: user.id },
      });
    }

    const update = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.name,
        email: data.email,
        address: data.address,
        phone: data.phone,
        gender: data.gender,
        status: data.status || Status.ACTIVE,
        type: data.type || User.EXTERNAL,
        password: hashedPassword,
        roleId: data.roleId,
        Permissions: data.permissionIds
          ? {
              createMany: {
                data: data.permissionIds.map((permissionId) => ({
                  permissionId,
                })),
              },
            }
          : undefined,
      },
      include: {
        Permissions: {
          include: { Permission: true },
        },
      },
    });

    return update;
  } catch (error) {
    throw error;
  }
}
