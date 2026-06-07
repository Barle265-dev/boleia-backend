import { FastifyInstance } from "fastify";

import { verifyJWT } from "middware/verify-jwt";
import { listNotificationsController } from "./listNotificationsController";
import { markAsReadController } from "./markAsReadController";
import { markAllAsReadController } from "./markAllAsReadController";
import { deleteNotificationController } from "./deleteNotificationController";

export async function notificationRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/notifications", listNotificationsController);
  app.patch("/notifications/:id/read", markAsReadController);
  app.patch("/notifications/read-all", markAllAsReadController);
  app.delete("/notifications/:id", deleteNotificationController);
}
