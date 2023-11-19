import { Button, Text, TextInput } from '@kayque-ignite-ui/react'
import { Form, FormAnnotation } from './styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras.' }) // assim o input tem que ter no minimo 3 caracteres
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário pode ter apenas letra e hifens.',
    }) // regras de escrita para o nome do usuario, "^" = como ele deve começãr, "a-z" todas as letras, "\\" = ou, "-" = é permitido o -, "+" = pode conter um ou mais letra iguais, "$" = ele deve terminar com letras ou -, "i" = case insensitive
    .transform((username) => username.toLowerCase()), // mesmo que o usuario coloque o nome com letra maiuscula quando inviar vai vim com letra minuscula, "username" = é ali que vai receber o valor do input, pode colocar qualquer nome
})

type ClaimUsernameFormDate = z.infer<typeof claimUsernameFormSchema> // basicamente ele ta tranformando a estrura do zod para typescript

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted }, // erro dos usuario falidado com shema// pode ser usado para recuperar as mensagem de erro do zod
  } = useForm<ClaimUsernameFormDate>({
    resolver: zodResolver(claimUsernameFormSchema), // usando o schema pra ele saber como deve validar o usuario
  })

  const router = useRouter() // pra fazer o redirecionamento da pagina

  async function handleClaimUsername(data: ClaimUsernameFormDate) {
    const { username } = data // username vindo de dentro de data

    await router.push(`/register?username=${username}`) // ele retonar uma promisse, pq ele demora um pouco pra redirecionar o usuario
    // quando uma função demora pra executar como o push, coloca o await o estado de disabled={isSubmitted} vai durar até que o redirecionamento esteja completo
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          size="sm"
          prefix="ignite.com/"
          placeholder="seu-usuario"
          {...register('username')}
        />
        <Button size="sm" type="submit" disabled={isSubmitted}>
          Reserver
          <ArrowRight />
        </Button>
      </Form>

      <FormAnnotation>
        <Text size="sm">
          {errors.username
            ? errors.username.message // se existir um erro vai mostra as menssagem de erro do zod validação
            : 'Digite o nome do usuário'}
        </Text>
      </FormAnnotation>
    </>
  )
}
