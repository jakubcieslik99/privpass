import path from 'path'
import { fileURLToPath } from 'url'
import { promises as fs } from 'fs'
import { AvailableLanguages, availableLanguages } from '../../constants/AvailableLanguages.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const loadJSON = async (filePath: string) => {
  const data = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(data)
}

const en = await loadJSON(path.resolve(__dirname, './en.json'))
const pl = await loadJSON(path.resolve(__dirname, './pl.json'))

export const tr = (key: string, language: AvailableLanguages): string => {
  // eslint-disable-next-line no-useless-assignment
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
