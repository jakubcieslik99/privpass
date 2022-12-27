import { config } from '../config/utilities'

const loginSendCodeMessage = (to: string, code: string) => {
  return {
    from: `PrivPASS 🔐 <${config.NOREPLY_ADDRESS}>`,
    to,
    subject: '🛡️ Potwierdź logowanie w serwisie PrivPASS 🔐',
    text: `Twój jednorazowy kod logowania w serwisie PrivPASS, ważny 5 minut to: ${code}`,
    html: `Twój jednorazowy kod logowania w serwisie PrivPASS, ważny 5 minut to: <h2>${code}</h2>`,
  }
}

export { loginSendCodeMessage }
