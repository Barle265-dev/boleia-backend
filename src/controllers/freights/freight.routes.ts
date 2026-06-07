import { FastifyInstance } from "fastify";
import { createFreightController } from "./createFreightController";
import { listFretistaController } from "./listFretistaController";
import { listFreightsController } from "./listFreightsController";
import { getFreightController } from "./getFreightController";
import { respondFreightController } from "./respondFreightController";
import { rateFreightController } from "./rateFreightController";
import { verifyJWT } from "../../middware/verify-jwt";

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
  app.post(
    "/freights/:id/rate",
    { onRequest: [verifyJWT] },
    rateFreightController,
  );
}
