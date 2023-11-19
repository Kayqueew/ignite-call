import { globalCss } from '@ignite-ui/react'
/* import { Roboto } from 'next/font/google'

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
  })
 */
export const globalStyles = globalCss({
  '*': {
    boxSizing: 'border-box',
    padding: 0,
    margin: 0,
  },

  body: {
    backgroundColor: '$gray900',
    color: '$gray100',
    '-webkit-font-smoothing': 'antialiased',
  },
})
