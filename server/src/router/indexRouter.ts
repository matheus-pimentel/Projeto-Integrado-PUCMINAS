import { FastifyInstance } from "fastify";

export async function indexRouter(fastify: FastifyInstance) { 
  fastify.get("/", async (request, reply) => {
    return "Aplicação Finanças Pessoais!";
  })
}