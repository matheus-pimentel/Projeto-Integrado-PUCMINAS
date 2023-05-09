import { FastifyInstance } from "fastify";
import { MovementsController } from "../controllers/MovementsController";
import { authenticate } from "../plugins/authenticate";

export async function movementRouter(fastify: FastifyInstance) {
  const movementsController = new MovementsController();

  fastify.get(
    "/movements/agg",
    {
      onRequest: [authenticate],
    },
    movementsController.getMovementsAgg
  );

  fastify.get(
    "/movements/:skip",
    {
      onRequest: [authenticate],
    },
    movementsController.getUserMovements
  );

  fastify.post(
    "/movements/",
    {
      onRequest: [authenticate],
    },
    movementsController.createMovement
  );

  fastify.post(
    "/movements/:id",
    {
      onRequest: [authenticate],
    },
    movementsController.updateMovement
  );

  fastify.delete(
    "/movements/:id",
    {
      onRequest: [authenticate],
    },
    movementsController.deleteMovement
  );
}
