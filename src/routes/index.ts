import { FastifyInstance } from "fastify";
import { freightRoutes } from "../controllers/freights/freight.routes";
import { permissionRoutes } from "./permission.routes";
import { rideRoutes } from "../controllers/rides/ride.routes";
import { uploadRoutes } from "./upload.routes";
import { userRoutes } from "../controllers/users/user.routes";
import { notificationRoutes } from "../controllers/notifications/notification.routes";
import { vehicleRoutes } from "../controllers/vehicles/vehicle.routes";
import { messageRoutes } from "../controllers/messages/message.routes";

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
