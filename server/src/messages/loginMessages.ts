import { config } from '../config/utilities.js'
import { AvailableLanguages } from '../constants/AvailableLanguages.js'
import { tr } from './translations/translations.js'

const loginSendCodeMessage = (to: string, code: string, language: AvailableLanguages) => {
  return {
    from: `PrivPASS 🔐 <${config.NOREPLY_ADDRESS}>`,
    to,
    subject: `🛡️ ${tr('loginMessageSubject', language)} 🔐`,
    text: `${tr('loginMessageBody', language)} ${code}`,
    html: `${tr('loginMessageBody', language)} <h2>${code}</h2>`,
  }
}

export { loginSendCodeMessage }
