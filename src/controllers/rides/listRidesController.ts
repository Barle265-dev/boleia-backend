import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { listRidesService } from "../../services/rides/listRidesService";

export async function listRidesController(request: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    origin: z.string().optional(),
    destination: z.string().optional(),
  });

  const query = schema.parse(request.query);
  const rides = await listRidesService(query);

  return reply.send(rides);
}
