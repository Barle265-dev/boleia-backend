import { FastifyInstance } from "fastify";

import { verifyJWT } from "middware/verify-jwt";
import { sendRideMessageController } from "./sendRideMessageController";
import { listRideMessagesController } from "./listRideMessagesController";
import { sendFreightMessageController } from "./sendFreightMessageController";
import { listFreightMessagesController } from "./listFreightMessagesController";

export async function messageRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  // Mensagens de boleia
  app.post("/rides/:rideId/messages", sendRideMessageController);
  app.get("/rides/:rideId/messages", listRideMessagesController);

  // Mensagens de frete
  app.post("/freights/:freightId/messages", sendFreightMessageController);
  app.get("/freights/:freightId/messages", listFreightMessagesController);
}
