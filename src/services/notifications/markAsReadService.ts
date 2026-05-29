import { prisma } from "../../../libs/prisma";

export async function markAsReadService(id: string, userId: string) {
  const notification = await prisma.notification.findUnique({
    where: { id },
  });

  if (!notification) {
    throw { statusCode: 404, message: "Notificação não encontrada." };
  }

  if (notification.userId !== userId) {
    throw { statusCode: 403, message: "Sem permissão para aceder a esta notificação." };
  }

  const updated = await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });

  return updated;
}
