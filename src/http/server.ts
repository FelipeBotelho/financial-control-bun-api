import cors from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { auth } from './auth'
import { sendAuthenticationLink } from './routes/send-authentication-link'

const app = new Elysia()
  .use(
    cors({
      credentials: true,
      allowedHeaders: ['content-type'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
      origin: (request): boolean => {
        const origin = request.headers.get('origin')
        if (!origin) {
          return false
        }
        return true
      },
    }),
  )
  .use(auth)
  .use(sendAuthenticationLink)
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'VALIDATION': {
        set.status = 422
        return error.message
      }
      case 'NOT_FOUND': {
        return new Response(null, { status: 404 })
      }
      default: {
        console.log(error)
        return new Response(null, { status: 500 })
      }
    }
  })

app.listen(3333, () => {
  console.log('Http server running!')
})
