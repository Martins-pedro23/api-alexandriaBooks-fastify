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

  async updateUser(req: FastifyRequest, res: FastifyReply) {}
  async deleteUser(req: FastifyRequest, res: FastifyReply) {}
}
export default new UserController();
