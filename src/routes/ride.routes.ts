import { FastifyInstance } from "fastify";

import { createRideController } from "../controllers/rides/createRideController";
import { listRidesController } from "../controllers/rides/listRidesController";
import { getRideController } from "../controllers/rides/getRideController";
import { updateRideController } from "../controllers/rides/updateRideController";
import { cancelRideController } from "../controllers/rides/cancelRideController";
import { requestJoinRideController } from "../controllers/rides/requestJoinRideController";
import { acceptPassengerController } from "../controllers/rides/acceptPassengerController";
import { rateRideController } from "../controllers/rides/rateRideController";
import { verifyJWT } from "middware/verify-jwt";

export async function rideRoutes(app: FastifyInstance) {
  // Rotas públicas
  app.get("/rides", listRidesController);
  app.get("/rides/:id", getRideController);

  // Rotas autenticadas
  app.post("/rides", { onRequest: [verifyJWT] }, createRideController);
  app.put("/rides/:id", { onRequest: [verifyJWT] }, updateRideController);
  app.patch(
    "/rides/:id/cancel",
    { onRequest: [verifyJWT] },
    cancelRideController,
  );
  app.post(
    "/rides/:id/request-join",
    { onRequest: [verifyJWT] },
    requestJoinRideController,
  );
  app.post(
    "/rides/:id/accept-passenger",
    { onRequest: [verifyJWT] },
    acceptPassengerController,
  );
  app.post("/rides/:id/rate", { onRequest: [verifyJWT] }, rateRideController);
}
