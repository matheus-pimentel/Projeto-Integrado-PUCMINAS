import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";

import { indexRouter } from "./router/indexRouter";
import { authRouter } from "./router/authRouter";
import { accountRouter } from "./router/accountRouter";
import { categoryRouter } from "./router/categoryRouter";
import { movementRouter } from "./router/movementRouter";

async function bootstrap() {
    const fastify = Fastify({
      logger: true,
    });

    await fastify.register(cors, {
      origin: true,  
    });

    await fastify.register(jwt, {
      secret: "Rbdvoke09845tw3je8uhfghw3",
    })

    await fastify.register(indexRouter);    
    await fastify.register(authRouter);    
    await fastify.register(accountRouter);
    await fastify.register(categoryRouter);
    await fastify.register(movementRouter);

    await fastify.listen({port: 3005, host: '0.0.0.0'});
}

bootstrap();