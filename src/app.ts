import connect from "./database/connection";
import Fastify from "fastify";
import routes from "./routes/index";
import cors from "cors";

const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});
fastify.register(routes);

connect(fastify);

export { fastify };
