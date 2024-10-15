import Elysia, { t, type Static } from 'elysia'
import { UnauthorizedError } from './routes/errors/unauthorized-error'
import jwt from '@elysiajs/jwt'
import { env } from '../env'

const jwtPayloadSchema = t.Object({
  sub: t.String(),
  role: t.String(),
})

export const auth = new Elysia()
  .use(
    jwt({
      name: 'jwt',
      secret: env.JWT_SECRET_KEY,
      schema: jwtPayloadSchema,
    }),
  )
  .derive({ as: 'scoped' }, ({ jwt, cookie: { auth } }) => {
    return {
      signUser: async (payload: Static<typeof jwtPayloadSchema>) => {
        const token = await jwt.sign(payload)
        auth.value = token
        auth.httpOnly = true
        auth.maxAge = 60 * 60 * 24 * 7
        auth.path = '/'
      },
      signOut: async () => {
        auth.remove()
      },
      getCurrentUser: async () => {
        const payload = await jwt.verify(auth.value)
        if (!payload) {
          throw new UnauthorizedError()
        }
        return {
          userId: payload.sub,
          role: payload.role,
        }
      },
    }
  })
