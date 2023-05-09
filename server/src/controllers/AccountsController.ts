import { FastifyReply, FastifyRequest } from "fastify";
import { AccountsService } from "../services/AccountsService";

class AccountsController {
  async getUserAccounts(request: FastifyRequest, reply: FastifyReply) {
    const accountsService = new AccountsService();

    try {
      const accounts = await accountsService.getUserAccounts(request.user.sub);

      return accounts;
    } catch (err: any) {
      return {
        message: err.message,
      };
    }
  }
}

export { AccountsController };
