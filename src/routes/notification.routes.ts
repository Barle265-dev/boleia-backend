import { FastifyInstance } from "fastify";
import { listNotificationsController } from "../controllers/notifications/listNotificationsController";
import { markAsReadController } from "../controllers/notifications/markAsReadController";
import { markAllAsReadController } from "../controllers/notifications/markAllAsReadController";
import { deleteNotificationController } from "../controllers/notifications/deleteNotificationController";
import { verifyJWT } from "../middware/verify-jwt";

export async function notificationRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/notifications", listNotificationsController);
  app.patch("/notifications/:id/read", markAsReadController);
  app.patch("/notifications/read-all", markAllAsReadController);
  app.delete("/notifications/:id", deleteNotificationController);
}
