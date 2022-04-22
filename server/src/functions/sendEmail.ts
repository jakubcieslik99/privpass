import createError from 'http-errors'
import { config, log } from '../config/utilities'
import transporter from '../config/nodemailerOptions'

const sendEmail = (message: { to: string; subject: string; text: string; html: string }) => {
  return new Promise<void>((resolve, reject) => {
    const mailOptions = {
      from: config.NOREPLY_ADDRESS,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
    }

    transporter.sendMail(mailOptions, error => {
      if (error) {
        log.error(error)
        return reject(createError(500, 'Błąd serwera.'))
      }
      return resolve()
    })
  })
}

export default sendEmail

/*const sendEmail = async (message: { to: string; subject: string; text: string; html: string }) => {
  const mailOptions = {
    from: config.NOREPLY_ADDRESS,
    to: message.to,
    subject: message.subject,
    text: message.text,
    html: message.html,
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    log.error(error)
  }

  await transporter.sendMail(mailOptions, error => {
    if (error) {
      log.error(error)
    }
  })
}*/
