import "./database/connection"
import Fastify from "fastify";
import routes from "./routes/index";
import cors from "cors";


const fastify = Fastify({ logger: true });
fastify.register(routes);

export { fastify };
