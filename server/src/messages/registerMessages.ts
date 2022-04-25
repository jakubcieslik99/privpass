import { config } from '../config/utilities'

const registerSendCodeMessage = (to: string, code: string) => {
  return {
    from: `PercPASS 🛡️ <${config.NOREPLY_ADDRESS}>`,
    to,
    subject: '🔐 Potwierdź pierwsze logowanie w serwisie PercPASS 🛡️',
    text: `Twój jednorazowy kod logowania w serwisie PercPASS, ważny 5 minut to: ${code}`,
    html: `Twój jednorazowy kod logowania w serwisie PercPASS, ważny 5 minut to: <h2>${code}</h2>`,
  }
}

export { registerSendCodeMessage }
