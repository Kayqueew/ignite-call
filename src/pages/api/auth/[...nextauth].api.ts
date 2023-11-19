import { PrismaAdapter } from '@/lib/auth/prisma-adapter'
import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'

// essa parte o proprio nextauth vai acessar e nao a gente
// NextAuthOptions tipagem do typescript
export function buildNextAuthOptions(
  req: NextApiRequest,
  res: NextApiResponse,
): NextAuthOptions {
  return {
    // apartir de agora o nextauth vai saber como que ele vai persistir com as informações do usuario no banco de dados, ele vai uasr o metodo que foi criado
    adapter: PrismaAdapter(req, res),

    providers: [
      GoogleProvider({
        // ta enviando a variavel do google
        clientId: process.env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        authorization: {
          // para fazer a validação do caledario do google e para o usuario altorizar o uso do calendario, qualquer duvida ler a documentção
          params: {
            scope:
              'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar',
          },
        },

        // esse metodo tem acesso ao perfil do usuario
        // esse profile server para mapiar os campos internos do nextauth do usuario com o perfil que foi retornado do google
        profile: (profile: GoogleProfile) => {
          // vai retornar os dados que eu quero acessar da conta do usuario no google
          return {
            id: profile.sub,
            name: profile.name,
            username: '',
            email: profile.email,
            avatar_url: profile.picture,
          }
        },
      }),
    ],

    // são varias funcoes que sao chamadas em momento comuns em processo de autenticaçao
    callbacks: {
      // essa função signIn é chamada assim que o usuario logou na aplicação
      async signIn({ account }) {
        // account.scope é exatamente as permissões que o usuario deu
        // includes() é a permissão que estou querendo
        // se o accont.scope nao me deu permissão
        if (
          !account?.scope?.includes('https://www.googleapis.com/auth/calendar')
        ) {
          // se nao foi permitido vai retonar para pagina do connect-calendar pelo urrl,   pode passar outra pagina de erro se quiser
          return '/register/connect-calendar/?error=permissions'
        }

        // return true é pq tem a permissão
        return true
      },

      // para ter acesso a toda informação do usuario salvo no banco de dados
      async session({ session, user }) {
        return {
          ...session,
          user,
        }
      },
    },
  }
}
// agora temos acesso ao req e res e precisamos levar isso para o prisma adapter
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, buildNextAuthOptions(req, res))
}
