import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { MovementsService } from "../services/MovementsService";

class MovementsController {
  async getMovementsAgg(request: FastifyRequest, reply: FastifyReply) {
    const movementsService = new MovementsService();

    try {
      const movements = await movementsService.getMovementsAgg(request.user.sub);

      return movements;
    } catch(err: any) {
      return {
        message: err.message
      };
    }
  }

  async getUserMovements(request: FastifyRequest, reply: FastifyReply) {
    const getMovementsBody = z.object({
      skip: z.string().optional(),
    });

    const { skip } = getMovementsBody.parse(request.params);

    const movementsService = new MovementsService();

    try {
      const movements = await movementsService.getUserMovements({
        userId: request.user.sub,
        skip: skip ? Number(skip) : undefined,
      });

      return movements;
    } catch (err: any) {
      return {
        message: err.message,
      };
    }
  }

  async createMovement(request: FastifyRequest, reply: FastifyReply) {
    const createMovementBody = z.object({
      value: z.number(),
      accountId: z.string(),
      categoryId: z.string(),
      observation: z.string().optional(),
      date: z.string().datetime(),
    });

    const { value, accountId, categoryId, observation, date } =
      createMovementBody.parse(request.body);

    const movementsService = new MovementsService();

    try {
      const movement = await movementsService.createMovement({
        value,
        accountId,
        categoryId,
        observation,
        date,
        userId: request.user.sub,
      });

      return movement;
    } catch (err: any) {
      return {
        message: err.message,
      };
    }
  }

  async updateMovement(request: FastifyRequest, reply: FastifyReply) {
    const updateMovementParams = z.object({
      id: z.string(),
    });

    const updateMovementBody = z.object({
      value: z.number(),
      accountId: z.string(),
      categoryId: z.string(),
      observation: z.string().optional(),
      date: z.string().datetime(),
    });

    const { value, accountId, categoryId, observation, date } =
      updateMovementBody.parse(request.body);
    const { id } = updateMovementParams.parse(request.params);

    const movementsService = new MovementsService();

    try {
      const movement = await movementsService.updateMovement({
        id,
        value,
        accountId,
        categoryId,
        observation,
        date,
        userId: request.user.sub,
      });

      return movement;
    } catch (err: any) {
      return {
        message: err.message,
      };
    }
  }

  async deleteMovement(request: FastifyRequest, reply: FastifyReply) {
    const deleteMovementParams = z.object({
      id: z.string(),
    });

    const { id } = deleteMovementParams.parse(request.params);

    const movementsService = new MovementsService();

    try {
      await movementsService.deleteMovement({
        id,
        userId: request.user.sub,
      });

      return {
        message: "Extrato excluído com sucesso!",
      };
    } catch (err: any) {
      return {
        message: err.message,
      };
    }
  }
}

export { MovementsController };
