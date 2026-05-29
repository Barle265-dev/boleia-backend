import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { acceptPassengerService } from "../../services/rides/acceptPassengerService";

export async function acceptPassengerController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = z.object({ id: z.uuid() }).parse(request.params);

  const schema = z.object({
    passengerId: z.uuid(),
  });

  const { passengerId } = schema.parse(request.body);
  const ride = await acceptPassengerService(id, passengerId, request.user.id);

  return reply.send(ride);
}
