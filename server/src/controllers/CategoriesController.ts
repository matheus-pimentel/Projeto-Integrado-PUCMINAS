import { FastifyReply, FastifyRequest } from "fastify";
import { CategoriesService } from "../services/CategoriesService";

class CategoriesController {
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const categoriesService = new CategoriesService();

    try {
      const categories = await categoriesService.getAll(request.user.sub);

      return categories;
    } catch (err: any) {
      return {
        message: err.message,
      };
    }
  }
}

export { CategoriesController };
