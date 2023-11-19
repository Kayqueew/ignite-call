// arquivo de definição de tipos, ele server para sobre escrever tipagem de bibliotecas
// vai trocar o nome do schema.prisma
// ex: trocar o image para avatar_url

import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    name: string
    email: string
    username: string
    avatar_url: string
  }
}
