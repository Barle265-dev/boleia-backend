import { prisma } from "../../libs/prisma";

export async function listNotificationsService(userId: string) {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { timestamp: "desc" },
  });

  return notifications;
}
