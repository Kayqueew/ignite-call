import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import { AuthError, ConnectBox, ConnectItem, Container, Header } from './styles'
import { ArrowRight, Check } from 'phosphor-react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function COnnectCalendar() {
  // async function handleRegister(data: registerFormData) {}
  const session = useSession()
  const router = useRouter()

  // se nessa variavel estiver a mensagem de erro na urrl
  // !! para tranformar em booleano, true ou false
  const hasAuthError = !!router.query.error // mensagem se erro caso o usuario nao conseda as permições necessaria

  // o session.status vai verificar se o usuario estar conectado
  const isSignedIn = session.status === 'authenticated'

  async function handleConnectCalendar() {
    // metodo signin que vem da biblioteca next-auth e passando o provider que é o google
    // para conectar com o google
    await signIn('google', { callbackUrl: '/register/connect-calendar' })
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Conecte sua agenda!</Heading>
        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </Text>
        <MultiStep size={4} currentStep={2} />
      </Header>

      <ConnectBox>
        <ConnectItem>
          <Text>Google Calendar</Text>
          {isSignedIn ? (
            <Button size="sm" disabled>
              Conectado
              <Check />
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleConnectCalendar}
            >
              Conectar
              <ArrowRight />
            </Button>
          )}
        </ConnectItem>

        {/* se nao tiver a autenticação */}
        {hasAuthError && (
          <AuthError size="sm">
            Falha ao se conectar ao Google, verifique se você habilitou as
            permissões de acesso ao Google Calendar.
          </AuthError>
        )}

        <Button type="submit" disabled={!isSignedIn}>
          {/* o button vai estar desabilitado caso o usuario nao esteja conectado */}
          Próximo passo
          <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  )
}
