import { config } from "dotenv";
config();
import { fastify } from "./app";

const port = process.env.PORT || 3001;

console.log("Iniciando servidor");

const start =  () => {
    try{
         fastify.listen(port, (error, address) => {
            if(error){
                console.log("Erro:", error);
                process.exit(1);
            }
            console.log(`Server is running on port ${port}`);
        })
    }catch(error){
        console.log("Erro:", error);
    }
}

start();