import { prisma } from "../../../libs/prisma";

export async function markAllAsReadService(userId: string) {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}
