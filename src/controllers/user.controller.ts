import e from "cors";
import User from "../models/user.model";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

class UserController {
  async getAllUsers(req: any, res: any) {
    try {
      const users = await User.find();
      res.status(200).send(users);
    } catch (error) {
      res.status(500).send({ message: "Erro ao listar usuários" });
    }
  }

  async getUserById(req: any, res: any) {
    try {
      const userId = req.params.id;
      console.log(userId);
      const user = await User.findOne({ _id: userId });
      return user;
    } catch (error) {
      res.status(500).send({ message: "Erro ao listar usuários" });
    }
  }

  async createUser(req: any, res: any) {
    try {
      const { name, email, password } = req.body;
      const criptoPassword = bcrypt.hashSync(password, 10);
      if (!name) return res.status(400).send({ message: "Nome é obrigatório" });
      if (!email)
        return res.status(400).send({ message: "Email é obrigatório" });
      if (!password)
        return res.status(400).send({ message: "Senha é obrigatório" });
      const user = await User.create({ name, email, password: criptoPassword });
      return user;
    } catch (error) {
      res.status(500).send({ message: "Erro ao criar o usuário" });
    }
  }

  async login(req: any, res: any) {
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
          res.send({ token });
        }
      }
      return res.status(401).send({ message: "Usuário ou senha inválidos" });
    } catch (error) {
      res.status(400).send({ message: "Erro ao efetuar login" });
    }
  }

  async updateUser(req: any, res: any) {}
  async deleteUser(req: any, res: any) {}
}
export default new UserController();
