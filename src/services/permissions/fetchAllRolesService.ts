import { prisma } from "../../libs/prisma";

export async function fetchAllPermissionsService() {
  const permissions = await prisma.permission.findMany();

  return permissions;
}
