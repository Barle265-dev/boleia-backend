import { LoginDTO } from "../../types";
import { prisma } from "../../libs/prisma";
import { compare } from "bcrypt";
import { badCredentials, userNotFound } from "../../error/httpsError";

export async function loginService(data: LoginDTO) {
  const userExists = await prisma.user.findUnique({
    where: { email: data.email },
    include: {
      Permissions: {
        include: {
          Permission: true,
        },
      },
    },
  });

  if (!userExists) {
    throw userNotFound();
  }

  const comparePassword = await compare(data.password, userExists.password);
  if (!comparePassword) {
    throw badCredentials();
  }

  const { password, ...safeUser } = userExists;
  return safeUser;
}
