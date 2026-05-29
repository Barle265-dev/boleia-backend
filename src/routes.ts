import { FastifyInstance } from "fastify";
import { notificationRoutes } from "routes/notification.routes";
import { permissionRoutes } from "routes/permission.routes";
import { userRoutes } from "routes/user.routes";

export async function appRoutes(app: FastifyInstance) {
  app.register(userRoutes);
  app.register(permissionRoutes);
  app.register(notificationRoutes);
}
