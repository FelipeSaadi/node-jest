import server from "./server";
import dotenv from 'dotenv'

dotenv.config()

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
})