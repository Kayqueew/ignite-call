import { globalStyles } from '../styles/global'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'

globalStyles()

export default function App({
  Component,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    // SessionProvider é do Oauth do google, duvida? ler a documentação
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
