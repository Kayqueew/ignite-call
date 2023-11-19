import { styled, Heading, Text } from '@ignite-ui/react'

export const Container = styled('div', {
  maxWidth: 'calc(100vw - (100vw - 1300px) / 2)',
  marginLeft: 'auto',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  gap: '$20',
  overflow: 'hidden',
})

export const Hero = styled('div', {
  maxWidth: 480,
  padding: '0 $10',

  // assim consegue estilizar o heading, ">" pra ele aplicar somenter nesse componente, pq se tiver outro heading vai herdar tbm
  [` > ${Heading}`]: {
    '@media(max-width: 600px)': {
      fontSize: '$6xl',
    },
  },

  [` > ${Text}`]: {
    marginTop: '$2',
    color: '$gray200',
  },
})

export const Preview = styled('div', {
  paddingRight: '$8',
  overflow: 'hidden',

  '@media(max-width: 600px': {
    display: 'none',
  },
})
