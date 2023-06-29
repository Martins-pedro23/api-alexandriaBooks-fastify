import { FastifyInstance } from 'fastify';
import userController from '../controllers/user.controller';

async function userRoutes(fastify: FastifyInstance) {
    fastify.get('/users', userController.getAllUsers);
    fastify.post('/users/login', userController.login);
    fastify.post('/users', userController.createUser);
    fastify.put('/users', userController.updateUser);
    fastify.put('/users/password', userController.updatePassword);
    fastify.delete('/users:id', userController.deleteUser);
}

export default userRoutes;