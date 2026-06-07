import { FastifyInstance } from "fastify";
import { createVehicleController } from "../controllers/vehicles/createVehicleController";
import { listVehiclesController } from "../controllers/vehicles/listVehiclesController";
import { getVehicleController } from "../controllers/vehicles/getVehicleController";
import { updateVehicleController } from "../controllers/vehicles/updateVehicleController";
import { deleteVehicleController } from "../controllers/vehicles/deleteVehicleController";
import { verifyJWT } from "middware/verify-jwt";

export async function vehicleRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post("/vehicles", createVehicleController);
  app.get("/vehicles", listVehiclesController);
  app.get("/vehicles/:id", getVehicleController);
  app.put("/vehicles/:id", updateVehicleController);
  app.delete("/vehicles/:id", deleteVehicleController);
}
