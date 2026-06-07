import { FastifyInstance } from "fastify";

import { createVehicleController } from "./createVehicleController";
import { listVehiclesController } from "./listVehiclesController";
import { getVehicleController } from "./getVehicleController";
import { updateVehicleController } from "./updateVehicleController";
import { deleteVehicleController } from "./deleteVehicleController";
import { verifyJWT } from "../../middware/verify-jwt";

export async function vehicleRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post("/vehicles", createVehicleController);
  app.get("/vehicles", listVehiclesController);
  app.get("/vehicles/:id", getVehicleController);
  app.put("/vehicles/:id", updateVehicleController);
  app.delete("/vehicles/:id", deleteVehicleController);
}
