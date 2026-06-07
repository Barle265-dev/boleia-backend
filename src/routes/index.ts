import { FastifyInstance } from "fastify";
import { freightRoutes } from "../controllers/freights/freight.routes.js";
import { permissionRoutes } from "./permission.routes.js";
import { rideRoutes } from "../controllers/rides/ride.routes.js";
import { uploadRoutes } from "./upload.routes.js";
import { userRoutes } from "../controllers/users/user.routes.js";
import { notificationRoutes } from "../controllers/notifications/notification.routes.js";
import { vehicleRoutes } from "../controllers/vehicles/vehicle.routes.js";
import { messageRoutes } from "../controllers/messages/message.routes.js";

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
