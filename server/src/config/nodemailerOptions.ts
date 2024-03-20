import nodemailer from 'nodemailer'
import { config } from './utilities.js'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.GMAIL_ADDRESS,
    pass: config.GMAIL_PASSWORD,
  },
})

export default transporter
