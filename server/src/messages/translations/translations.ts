import { AvailableLanguages, availableLanguages } from '../../constants/AvailableLanguages.js'
import en from './en.json' assert { type: 'json' }
import pl from './pl.json' assert { type: 'json' }

export const tr = (key: string, language: AvailableLanguages): string => {
  let langData: { [key: string]: string } = {}

  switch (language) {
    case availableLanguages[0]:
      langData = en
      break
    case availableLanguages[1]:
      langData = pl
      break
    default:
      langData = en
  }

  return langData[key]
}
