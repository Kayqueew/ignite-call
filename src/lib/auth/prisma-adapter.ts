/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Adapter } from 'next-auth/adapters'
import { prisma } from '../prisma'
import { destroyCookie, parseCookies } from 'nookies' // metodo para buscar todos os cookies
import { NextApiRequest, NextApiResponse } from 'next'

// adapters é um intermedio, um ponto de conecsão entre o backend da nossa aplicação e o banco de dados do prisma por exemplo, o adapters prover varios metodos pra manipular dados, criar dados pra que nossa aplicação possa chamr esses metodos
// vamos precisar mudar um pouco, pq se na aplicação nao estivesse o processo de criar o usuario antes de fazer o login nao precisaria mudar nada no adapters da biblioteca, só usario o adapters do prisma e o resto ia fazer sozinho, vou criar o meu proprio adapters
// aproveitando que vamos criar o nosso proprio adapters podemos escolher quais campo eu quero salvar no banco de dados, mudar o nome, diferende se estivesse usando o adapters padrão do prisma eu nao conseguiria fazer tudo isso pq ele tem a sua propria definição
// req e res veio do user/index.api.ts onde é criado o usuario
// req e res veio pq é preciso acessar o cookies para pegar a id que esta salvo nele e só possivel acessar o cookies com o req e res
export function PrismaAdapter(
  req: NextApiRequest,
  res: NextApiResponse,
): Adapter {
  return {
    async createUser(user) {
      // vai enviar o req pra acessar os cookies e buscar a id dentro do cookies
      // agora o userIdOnCookies tem o id do usuario
      const { '@ignitecall:userId': userIdOnCookies } = parseCookies({ req })

      // se nao tiver o id no cookies
      if (!userIdOnCookies) {
        throw new Error('User ID not found on cookies')
      }

      const prismaUser = await prisma.user.update({
        where: {
          id: userIdOnCookies,
        },
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      })

      // metodo para apagar o cookies, depois que já foi salvo no banco de dados nao vai precisar mais do cookies
      destroyCookie({ res }, '@ignitecall:userId', {
        path: '/',
      })

      return {
        id: prismaUser.id,
        name: prismaUser.name,
        username: prismaUser.username,
        email: prismaUser.email!,
        emailVerified: null,
        avatar_url: prismaUser.avatar_url!,
      }
    },

    // recebe um id e precisa retonar um usuario
    async getUser(id) {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      })

      // se nao encontrar o user
      if (!user) {
        return null
      }

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatar_url: user.avatar_url!,
      }

      // ! = pra dizer que vai ser preenchido const email: string | undefined = user.email?.toLowerCase();
    },

    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        return null
      }

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatar_url: user.avatar_url!,
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const account = await prisma.account.findUnique({
        where: {
          // provider_provider_account_id é a soma do providerAccountId e do provider e a soma desse dois forma um compo unico
          provider_provider_account_id: {
            provider,
            provider_account_id: providerAccountId,
          },
        },
        include: {
          user: true,
        },
      })

      if (!account) {
        return null
      }

      const { user } = account

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatar_url: user.avatar_url!,
      }
    },

    async updateUser(user) {
      const prismaUser = await prisma.user.update({
        where: {
          id: user.id!,
        },
        // os dados que eu quero atualizar
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      })

      return {
        id: prismaUser.id,
        name: prismaUser.name,
        username: prismaUser.username,
        email: prismaUser.email!,
        emailVerified: null,
        avatar_url: prismaUser.avatar_url!,
      }
    },

    async linkAccount(account) {
      // linkAccount é quando o usuario loga com alguma provider diferente, ele já tinha uma conta nova com google e agora ta logando com github
      // vai criar uma conta nova no mesmo id com as mesma informações
      await prisma.account.create({
        data: {
          user_id: account.userId,
          type: account.type,
          provider: account.provider,
          provider_account_id: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
        },
      })
    },

    async createSession({ sessionToken, userId, expires }) {
      await prisma.session.create({
        data: {
          user_id: userId,
          expires,
          session_token: sessionToken,
        },
      })

      return {
        userId,
        sessionToken,
        expires,
      }
    },

    async getSessionAndUser(sessionToken) {
      const prismaSession = await prisma.session.findUnique({
        where: {
          session_token: sessionToken,
        },
        include: {
          user: true,
        },
      })

      if (!prismaSession) {
        return null
      }

      const { user, ...session } = prismaSession

      return {
        session: {
          userId: session.user_id,
          expires: session.expires,
          sessionToken: session.session_token,
        },
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email!,
          emailVerified: null,
          avatar_url: user.avatar_url!,
        },
      }
    },

    async updateSession({ sessionToken, userId, expires }) {
      const prismaSession = await prisma.session.update({
        where: {
          session_token: sessionToken,
        },
        // os dados que eu quero atualizar
        data: {
          expires,
          user_id: userId,
        },
      })

      return {
        sessionToken: prismaSession.session_token,
        userId: prismaSession.user_id,
        expires: prismaSession.expires,
      }
    },

    async deleteSession(sessionToken) {
      await prisma.session.delete({
        where: {
          session_token: sessionToken,
        },
      })
    },
  }
}
