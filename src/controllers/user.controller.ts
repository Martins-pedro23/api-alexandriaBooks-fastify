import e from "cors";
import User from "../models/user.model";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { FastifyReply, FastifyRequest } from "fastify";

class UserController {
  async getAllUsers(req: FastifyRequest, res: FastifyReply) {
    try {
      const users = await User.find();
      res.status(200).send(users);
    } catch (error) {
      res.status(500).send({ message: "Erro ao listar usuários" });
    }
  }

  async createUser(
    req: FastifyRequest<{
      Body: {
        name: string;
        email: string;
        password: string;
      };
    }>,
    res: FastifyReply
  ) {
    try {
      const { name, email, password } = req.body;
      const criptoPassword = bcrypt.hashSync(password, 10);
      if (!name) return res.status(400).send({ message: "Nome é obrigatório" });
      if (!email)
        return res.status(400).send({ message: "Email é obrigatório" });
      if (!password)
        return res.status(400).send({ message: "Senha é obrigatório" });

      const user = await User.create({ name, email, password: criptoPassword });

      return res.status(201).send(user);
    } catch (error) {
      return res.status(500).send({ message: "Erro ao criar o usuário" });
    }
  }

  async login(
    req: FastifyRequest<{
      Body: {
        email: string;
        password: string;
      };
    }>,
    res: FastifyReply
  ) {
    try {
      const { email, password } = req.body;

      if (!email)
        return res.status(400).send({ message: "Email é obrigatório" });
      if (!password)
        return res.status(400).send({ message: "Senha é obrigatório" });

      const login = await User.findOne({ email });

      if (login) {
        const verifyPassword = bcrypt.compareSync(
          password,
          login.password as string
        );
        if (verifyPassword) {
          const token = jwt.sign(
            { id: login._id, email: login.email },
            process.env.JWT_SECRET as string,
            {
              expiresIn: "1d",
            }
          );
          return res.send({ token });
        }
      }
      return res.status(401).send({ message: "Usuário ou senha inválidos" });
    } catch (error) {
      return res.status(400).send({ message: "Erro ao efetuar login" });
    }
  }

  async updateUser(
    req: FastifyRequest<{
      Body: {
        id: string;
        email: string;
        password: string;
        name: string;
      };
    }>,
    res: FastifyReply
  ) {
    const { id, email, name } = req.body;

    if (!id) return res.status(400).send({ message: "Id é obrigatório" });

    try {
      const user = await User.findByIdAndUpdate(id, {
        email,
        name,
      });
      return res.status(200).send(user);
    } catch (error) {
      return res.status(500).send({ message: "Erro ao atualizar o usuário" });
    }
  }

  async updatePassword(
    req: FastifyRequest<{
      Body: {
        id: string;
        oldPassword: string;
        newPassword: string;
        email: string;
      };
    }>,
    res: FastifyReply
  ) {
    const { id, oldPassword, newPassword } = req.body;
    if (!id) return res.status(400).send({ message: "Id é obrigatório" });
    if (!oldPassword)
      return res.status(400).send({ message: "Senha é obrigatório" });
    if (!newPassword)
      return res.status(400).send({ message: "Senha nova é obrigatório" });
    if (oldPassword === newPassword)
      return res
        .status(400)
        .send({ message: "Senha nova não pode ser igual a senha antiga" });

    const login = await User.findById(id);

    if (!login)
      return res.status(400).send({ message: "Usuário não encontrado" });

    const verifyPassword = bcrypt.compareSync(
      oldPassword,
      login.password as string
    );

    if (!verifyPassword)
      return res.status(400).send({ message: "Senha antiga inválida" });

    const criptoPassword = bcrypt.hashSync(newPassword, 10);

    try {
      const user = await User.findByIdAndUpdate(id, {
        password: criptoPassword,
      });
      return res.status(200).send(user);
    } catch (error) {
      return res.status(500).send({ message: "Erro ao atualizar o usuário" });
    }
  }

  async deleteUser(
    req: FastifyRequest<{
      Body: {
        id: string;
        password: string;
      };
    }>,
    res: FastifyReply
  ) {
    const { id, password } = req.body;
    if (!id) return res.status(400).send({ message: "Id é obrigatório" });
    if (!password)
      return res.status(400).send({ message: "Senha é obrigatório" });

    const login = await User.findById(id);

    if (!login)
      return res.status(400).send({ message: "Usuário não encontrado" });

    const verifyPassword = bcrypt.compareSync(
      password,
      login.password as string
    );

    if (!verifyPassword)
      return res.status(400).send({ message: "Senha inválida" });

    try {
      await User.findByIdAndDelete(id);
      return res.status(200).send({ message: "Usuário deletado com sucesso" });
    } catch (error) {
      return res.status(500).send({ message: "Erro ao deletar o usuário" });
    }
  }
}
export default new UserController();
