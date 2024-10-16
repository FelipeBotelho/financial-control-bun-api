import Elysia, { t } from 'elysia'
import dayjs from 'dayjs'
import { eq } from 'drizzle-orm'
import { UnauthorizedError } from './errors/unauthorized-error'
import { auth } from '../auth'
import { db } from '../../db/connection'
import { authLinks } from '../../db/schema'

export const authenticateFromLink = new Elysia().use(auth).get(
  '/auth-links/authenticate',
  async ({ signUser, query, set }) => {
    const { code, redirect } = query

    const authLinkFromCode = await db.query.authLinks.findFirst({
      where(fields, { eq }) {
        return eq(fields.code, code)
      },
    })

    if (!authLinkFromCode) {
      return new UnauthorizedError()
    }

    if (dayjs().diff(authLinkFromCode.createdAt, 'days') > 7) {
      return new UnauthorizedError()
    }

    const userFromLink = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, authLinkFromCode.userId)
      },
    })

    await signUser({
      sub: authLinkFromCode.userId,
      role: userFromLink!.role,
    })

    await db.delete(authLinks).where(eq(authLinks.code, code))

    set.redirect = redirect
  },
  {
    query: t.Object({
      code: t.String(),
      redirect: t.String(),
    }),
  },
)
