import { FastifyInstance } from "fastify";
import { createFreightController } from "../controllers/freights/createFreightController";
import { listFretistaController } from "../controllers/freights/listFretistaController";
import { listFreightsController } from "../controllers/freights/listFreightsController";
import { getFreightController } from "../controllers/freights/getFreightController";
import { respondFreightController } from "../controllers/freights/respondFreightController";
import { rateFreightController } from "controllers/freights/rateFreightController";
import { verifyJWT } from "middware/verify-jwt";

export async function freightRoutes(app: FastifyInstance) {
  // Listagem pública de fretistas
  app.get("/fretistas", listFretistaController);

  // Rotas autenticadas
  app.post("/freights", { onRequest: [verifyJWT] }, createFreightController);
  app.get("/freights", { onRequest: [verifyJWT] }, listFreightsController);
  app.get("/freights/:id", { onRequest: [verifyJWT] }, getFreightController);
  app.patch(
    "/freights/:id/respond",
    { onRequest: [verifyJWT] },
    respondFreightController,
  );
  app.post("/freights/:id/rate", { onRequest: [verifyJWT] }, rateFreightController);
}
