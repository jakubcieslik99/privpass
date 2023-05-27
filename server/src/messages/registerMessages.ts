import { config } from '../config/utilities'
import { AvailableLanguages } from '../constants/AvailableLanguages'
import { tr } from './translations/translations'

const registerSendCodeMessage = (to: string, code: string, language: AvailableLanguages) => {
  return {
    from: `PrivPASS 🔐 <${config.NOREPLY_ADDRESS}>`,
    to,
    subject: `🛡️ ${tr('registerMessageSubject', language)} 🔐`,
    text: `${tr('registerMessageBody', language)} ${code}`,
    html: `${tr('registerMessageBody', language)} <h2>${code}</h2>`,
  }
}

export { registerSendCodeMessage }
