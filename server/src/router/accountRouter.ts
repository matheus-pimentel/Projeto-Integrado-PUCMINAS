import { FastifyInstance } from "fastify";
import { AccountsController } from "../controllers/AccountsController";
import { authenticate } from "../plugins/authenticate";

export async function accountRouter(fastify: FastifyInstance) {
  const accountsController = new AccountsController();

  fastify.get(
    "/accounts/",
    {
      onRequest: [authenticate],
    },
    accountsController.getUserAccounts
  );
}
