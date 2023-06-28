import { config } from "dotenv";
config();
import { fastify } from "./app";

if (!process.env.PORT) {
  process.exit(1);
}

const port = parseInt(process.env.PORT) || 3001;

const start = async () => {
  await fastify.listen({port: port}, (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });
};

start();
