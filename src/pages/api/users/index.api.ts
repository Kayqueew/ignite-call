import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'nookies'

enum HTTP_METHODS {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

const SECONDS_A_WEEK = 60 * 60 * 24 * 7

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== HTTP_METHODS.POST) {
    return res.status(405).end()
  }
  const { name, username } = req.body

  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (userExists) {
    return res.status(400).json({
      message: 'Username already taken.',
    })
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  })

  setCookie({ res }, '@ignitecall:userId', user.id, {
    maxAge: SECONDS_A_WEEK,
    path: '/',
  })

  return res.status(201).json(user)
}

// req server pra acessar
// res que é da respostar server pra modificar
