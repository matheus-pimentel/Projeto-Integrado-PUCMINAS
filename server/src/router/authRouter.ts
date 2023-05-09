import fetch from "node-fetch";

import { FastifyInstance } from "fastify";

import { prisma } from "../lib/prisma";
import { z } from "zod";
import { authenticate } from "../plugins/authenticate";
import moment from "moment";

export async function authRouter(fastify: FastifyInstance) {
  fastify.get(
    "/me",
    {
      onRequest: [authenticate],
    },
    async (request, reply) => {
      return { user: request.user };
    }
  );

  fastify.post("/auth/users", async (request, reply) => {
    const createUserBody = z.object({
      accessToken: z.string(),
    });

    const { accessToken } = createUserBody.parse(request.body);

    try {
      const userResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const userData = await userResponse.json();

      const userInfoSchema = z.object({
        id: z.string(),
        email: z.string().email(),
        name: z.string(),
        picture: z.string().url(),
      });

      const userInfo = userInfoSchema.parse(userData);

      let user = await prisma.user.findUnique({
        where: {
          googleId: userInfo.id,
        },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: userInfo.name,
            email: userInfo.email,
            googleId: userInfo.id,
            imageUrl: userInfo.picture,
          },
        });

        await prisma.account.create({
          data: {
            name: "Conta principal",
            institutionId: "645997f90226416ecb694426",
            initialValue: 0,
            totalValue: 0,
            userId: user.id,
            dateTotalValue: moment
              .utc()
              .subtract(6, "months")
              .subtract(3, "hours")
              .toISOString(),
          },
        });
      }

      const token = fastify.jwt.sign(
        {
          name: user.name,
          email: user.email,
          imageUrl: user.imageUrl,
        },
        {
          sub: user.id,
          expiresIn: "7 days",
        }
      );

      return { token };
    } catch (err: any) {
      return { message: err.message };
    }
  });
}
