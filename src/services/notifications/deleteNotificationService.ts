import { prisma } from "../../../libs/prisma";

export async function deleteNotificationService(id: string, userId: string) {
  const notification = await prisma.notification.findUnique({
    where: { id },
  });

  if (!notification) {
    throw { statusCode: 404, message: "Notificação não encontrada." };
  }

  if (notification.userId !== userId) {
    throw { statusCode: 403, message: "Sem permissão para eliminar esta notificação." };
  }

  await prisma.notification.delete({ where: { id } });
}
