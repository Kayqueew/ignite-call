import { Heading, Text } from '@ignite-ui/react'
import Image from 'next/image'
import { Container, Hero, Preview } from './styles'
// heading é utilizado quando um texto é h1, h2, h3, h4. se quiser trocar  é só passar o as=''

import previewImage from '../../assets/app-preview.png'
import { ClaimUsernameForm } from './components/ClaimUsernameForm'

export default function Home() {
  return (
    <Container>
      <Hero>
        <Heading size="4xl">Agendamento descomplicado</Heading>
        <Text size="xl">
          Conecte seu calendário e permita que as pessoas marquem agendamentos
          no seu tempo livre.
        </Text>

        <ClaimUsernameForm />
      </Hero>

      <Preview>
        <Image
          src={previewImage}
          height={400} // a maior altura possivel dessa imagem, aqui nao trabalha a altura que deseja mostrar em tela, pra ele entender qual é a maior resulução
          quality={100} // padrão é 80, assim ela vai voltar pra 100
          priority // pra imagem carregar com prioridade pq é a primeira coisa que carrega quando entra no site
          alt={'Calendário simbolizando aplicação em funcionamento'}
        />
      </Preview>
    </Container>
  )
}
