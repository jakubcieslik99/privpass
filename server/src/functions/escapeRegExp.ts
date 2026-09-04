// the search keyword is user input - it has to be matched literally, not as a pattern
const escapeRegExp = (keyword: string) => keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export { escapeRegExp }
