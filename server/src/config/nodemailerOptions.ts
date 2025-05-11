import nodemailer from 'nodemailer'
import { config } from './utilities.js'

const transporter = nodemailer.createTransport({
  pool: true,
  host: config.SMTP_HOST,
  port: 465,
  secure: true,
  auth: { user: config.SMTP_USERNAME, pass: config.SMTP_PASSWORD },
})

export default transporter
