import { compare, hash } from "bcrypt";
import { ChangePasswordDTO } from "../../types";
import { prisma } from "../../../libs/prisma";
import { AppError } from "../../error/appError";
import { userNotFound } from "../../error/httpsError";

export async function changePasswordService(
  userId: string,
  data: ChangePasswordDTO
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw userNotFound();
    }

    const comparePassword = await compare(data.old_password, user.password);
    if (!comparePassword) {
      throw new AppError("Palavra passe atual errada", 401);
    }
    if (data.new_password !== data.confirm_password) {
      throw new AppError("As novas palavras passe não coincidem", 401);
    }

    const hashedPassword = await hash(data.new_password, 10);

    const updatePassword = await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    return updatePassword;
  } catch (error) {
    throw error;
  }
}
