import { render } from '@react-email/components'
import nodemailer from 'nodemailer'
import { AuthenticationMagicLinkTemplate } from './templates/authentication-magic-link'
export const useNodeMailer = async (email: string, authLink: string) => {
  const account = await nodemailer.createTestAccount()
  const mail = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    debug: true,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  })
  const emailHtml = await render(
    AuthenticationMagicLinkTemplate({
      userEmail: email,
      authLink: authLink.toString(),
    }),
  )
  const info = await mail.sendMail({
    from: {
      name: 'Financial Control',
      address: 'fala@fbrdev.tech',
    },
    to: email,
    html: emailHtml,
  })
  console.log(nodemailer.getTestMessageUrl(info))
}
