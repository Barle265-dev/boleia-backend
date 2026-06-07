import { hash } from "bcrypt";
import { prisma } from "../../../libs/prisma";
import { randomUUID } from "crypto";
import { UserDto, UserRole } from "../../types";

export async function registerService(data: UserDto) {
  const userExists = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (userExists) {
    throw { statusCode: 409, message: "Email já está em uso." };
  }

  const hashedPassword = await hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      photoUrl: data.photoUrl,
      role: data.role || UserRole.PASSENGER,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      photoUrl: true,
      role: true,
      isVerified: true,
      joinedAt: true,
    },
  });

  return user;
}
