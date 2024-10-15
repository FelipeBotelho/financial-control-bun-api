import Elysia, { t } from 'elysia'
import { db } from '../../db/connection'
import { UnauthorizedError } from './errors/unauthorized-error'
import { createId } from '@paralleldrive/cuid2'
import { authLinks } from '../../db/schema'
import { env } from '../../env'
import { useResend } from '../../lib/resend'
import { useNodeMailer } from '../../lib/nodemailer'

export const sendAuthenticationLink = new Elysia().post(
  '/authenticate',
  async ({ body }) => {
    const { email } = body
    const userFromEmail = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.email, email)
      },
    })
    if (!userFromEmail) {
      return new UnauthorizedError()
    }
    const authLinkCode = createId()
    await db.insert(authLinks).values({
      userId: userFromEmail.id,
      code: authLinkCode,
    })

    const authLink = new URL('/auth-links/authenticate', env.API_BASE_URL)
    authLink.searchParams.set('code', authLinkCode)
    authLink.searchParams.set('redirect', env.AUTH_REDIRECT_URL)

    if (env.REAL_SEND_EMAIL) {
      await useResend(email, authLink.toString())
    } else {
      await useNodeMailer(email, authLink.toString())
    }
  },
  {
    body: t.Object({
      email: t.String({ format: 'email' }),
    }),
  },
)
