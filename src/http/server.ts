import cors from '@elysiajs/cors'
import { Elysia } from 'elysia'

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
  .get('/', () => {
    return 'Hello World'
  })

app.listen(3333, () => {
  console.log('Http server running!')
})
