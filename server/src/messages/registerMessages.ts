import { config } from '../config/utilities'

const registerSendCodeMessage = (to: string, code: string) => {
  return {
    from: `PercPASS 🛡️ <${config.NOREPLY_ADDRESS}>`,
    to,
    subject: '🔐 Potwierdź rejestrację w serwisie PercPASS 🛡️',
    text: `Twój jednorazowy kod rejestracji w serwisie PercPASS, ważny 15 minut to: ${code}`,
    html: `Twój jednorazowy kod rejestracji w serwisie PercPASS, ważny 15 minut to: <h3>${code}</h3>`,
  }
}

export { registerSendCodeMessage }
