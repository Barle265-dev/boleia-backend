import { FastifyInstance } from "fastify";
import { sendRideMessageController } from "../controllers/messages/sendRideMessageController";
import { listRideMessagesController } from "../controllers/messages/listRideMessagesController";
import { sendFreightMessageController } from "../controllers/messages/sendFreightMessageController";
import { listFreightMessagesController } from "../controllers/messages/listFreightMessagesController";
import { verifyJWT } from "middware/verify-jwt";

export async function messageRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  // Mensagens de boleia
  app.post("/rides/:rideId/messages", sendRideMessageController);
  app.get("/rides/:rideId/messages", listRideMessagesController);

  // Mensagens de frete
  app.post("/freights/:freightId/messages", sendFreightMessageController);
  app.get("/freights/:freightId/messages", listFreightMessagesController);
}
