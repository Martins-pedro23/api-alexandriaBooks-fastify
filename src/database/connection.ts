import mongoose from "mongoose";

const connection = process.env.MONGO_CONNECTION as string;

mongoose
  .connect(connection)
  .then(() => {
    console.log("Conectado a base de dados");
  })
  .catch((error) => {
    console.log("Error ao conectar a base de dados", error);
  });
