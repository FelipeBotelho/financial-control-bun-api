import { Resend } from 'resend'
import { env } from '../env'
import { AuthenticationMagicLinkTemplate } from './templates/authentication-magic-link'

export const useResend = async (email: string, authLink: string) => {
  const resend = new Resend(env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'Financial Control <fala@fbrdev.tech>',
    to: email,
    subject: '[Financial Control] Link para login',
    react: AuthenticationMagicLinkTemplate({
      userEmail: email,
      authLink: authLink.toString(),
    }),
  })
}
