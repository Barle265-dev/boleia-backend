import { FastifyInstance } from "fastify";
import { freightRoutes } from "routes/freight.routes";
import { messageRoutes } from "routes/message.routes";
import { notificationRoutes } from "routes/notification.routes";
import { permissionRoutes } from "routes/permission.routes";
import { rideRoutes } from "routes/ride.routes";
import { uploadRoutes } from "routes/upload.routes";
import { userRoutes } from "routes/user.routes";
import { vehicleRoutes } from "routes/vehicle.routes";

export async function appRoutes(app: FastifyInstance) {
  app.register(userRoutes);
  app.register(permissionRoutes);
  app.register(notificationRoutes);
  app.register(rideRoutes);
  app.register(vehicleRoutes);
  app.register(messageRoutes);
  app.register(freightRoutes);
  app.register(uploadRoutes);
}
