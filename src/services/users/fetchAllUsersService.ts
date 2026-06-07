import { SortOrder } from "../../types";
import { prisma } from "../../libs/prisma";
import type { Prisma } from "@prisma/client";

interface FilterUser {
  name?: string;
  email?: string;
  role?: string[];
  page: number;
  perPage: number;
  sorterBy: "name" | "email";
  sorterOrder: SortOrder;
}

export async function fetchAllUsersService(params: FilterUser) {
  const { page, perPage, sorterBy, sorterOrder, email, name, role } = params;

  const skip = (page - 1) * perPage;
  const take = perPage;
  const orderBy = { [sorterBy]: sorterOrder };

  const where: Prisma.UserWhereInput = {
    ...((name && { name: { contains: name, mode: "insensitive" } }) || {}),
    ...((email && { email: { contains: email, mode: "insensitive" } }) || {}),
    ...(role?.length && { role: { in: role as any } }),
  };

  const [users, count] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        vehicles: true,
        documents: true,
        Permissions: { include: { Permission: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);
  return {
    users: users.map(({ password, ...user }) => user),
    meta: {
      count,
      page,
      perPage,
      pagination: {
        total: count,
      },
    },
  };
}
