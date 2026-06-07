import { FastifyInstance } from "fastify";

import { createRideController } from "./createRideController";
import { listRidesController } from "./listRidesController";
import { getRideController } from "./getRideController";
import { updateRideController } from "./updateRideController";
import { cancelRideController } from "./cancelRideController";
import { requestJoinRideController } from "./requestJoinRideController";
import { acceptPassengerController } from "./acceptPassengerController";
import { rateRideController } from "./rateRideController";
import { verifyJWT } from "../../middware/verify-jwt";

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
