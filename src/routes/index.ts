import userController from '../controllers/user.controller';

async function routes(fastify: any, options: any) {
    fastify.get('/', userController.getAllUsers);
    fastify.get('/:id', userController.getUserById);
    fastify.post('/login', userController.login);
    fastify.post('/', userController.createUser);
    fastify.put('/:id', userController.updateUser);
    fastify.delete('/:id', userController.deleteUser);
}

export default routes;