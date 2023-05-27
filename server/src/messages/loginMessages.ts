import { config } from '../config/utilities'
import { AvailableLanguages } from '../constants/AvailableLanguages'
import { tr } from './translations/translations'

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
