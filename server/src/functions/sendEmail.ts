import createError from 'http-errors'
import { log } from '../config/utilities'
import transporter from '../config/nodemailerOptions'

const sendEmail = (message: { from: string; to: string; subject: string; text: string; html: string }) => {
  return new Promise<void>((resolve, reject) => {
    const mailOptions = {
      from: message.from,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
    }

    transporter.sendMail(mailOptions, error => {
      if (error) {
        log.error(error)
        return reject(createError(500, 'Error during sending an email.'))
      }
      return resolve()
    })
  })
}

export default sendEmail
