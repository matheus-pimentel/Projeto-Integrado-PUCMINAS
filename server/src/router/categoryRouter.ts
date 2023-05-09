import { FastifyInstance } from "fastify";
import { CategoriesController } from "../controllers/CategoriesController";
import { authenticate } from "../plugins/authenticate";

export async function categoryRouter(fastify: FastifyInstance) {
  const categoriesController = new CategoriesController();

  fastify.get(
    "/categories/",
    {
      onRequest: [authenticate],
    },
    categoriesController.getAll
  );
}
