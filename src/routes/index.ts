import { FastifyInstance } from 'fastify';
import userRoutes from './user.routes';

async function routes(fastify: FastifyInstance) {
    fastify.register(userRoutes);
}



export default routes;