import { FastifyInstance } from "fastify";
import mongoose from "mongoose";

const connection = process.env.MONGO_CONNECTION as string;

async function connect(fastify: FastifyInstance) {
  mongoose
    .connect(connection)
    .then(() => {
      fastify.log.info("Conectado a base de dados");
    })
    .catch((error) => {
      fastify.log.error(error);
    });
}

export default connect;
