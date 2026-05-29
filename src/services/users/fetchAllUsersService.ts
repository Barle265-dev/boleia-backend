import { SortOrder, User } from "types";
import { prisma } from "../../../libs/prisma";
import { Prisma } from "generated/prisma";

interface FilterUser {
  name?: string;
  email?: string;
  role?: string[];
  type?: User[];
  page: number;
  perPage: number;
  sorterBy: "name" | "email";
  sorterOrder: SortOrder;
}

export async function fetchAllUsersService(params: FilterUser) {
  const { page, perPage, sorterBy, sorterOrder, email, name, type, role } =
    params;

  const skip = (page - 1) * perPage;
  const take = perPage;
  const orderBy = { [sorterBy]: sorterOrder };

  const where: Prisma.UserWhereInput = {
    ...((name && { name: { contains: name, mode: "insensitive" } }) || {}),
    ...((email && { email: { contains: email, mode: "insensitive" } }) || {}),
    ...(type && {
      type: { in: type },
    }),
    ...(role?.length && {
      Role: {
        name: {
          in: role,
        },
      },
    }),
  };

  const [users, count] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        Role: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);
  return {
    users,
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
