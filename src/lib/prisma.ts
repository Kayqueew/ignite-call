import { PrismaClient } from '@prisma/client'

// arquivo para acessar o schema.prisma
export const prisma = new PrismaClient({
  log: ['query'], // pra ver se ta tudo certo com o prisma no log
})

// nao precisa passar qualquer informação de conexão com o banco de dados tipo: url, posta, usuario e senha
// pq o prisma ele vai entender automaticamento essa informações de conexão do banco de dados apartir do arquivo .env
