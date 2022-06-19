const parseString = (string: string) => {
  let parsedString = string.replace(/Ą/g, 'A')
  parsedString = parsedString.replace(/Ć/g, 'C')
  parsedString = parsedString.replace(/Ę/g, 'E')
  parsedString = parsedString.replace(/Ł/g, 'L')
  parsedString = parsedString.replace(/Ń/g, 'N')
  parsedString = parsedString.replace(/Ó/g, 'O')
  parsedString = parsedString.replace(/Ś/g, 'S')
  parsedString = parsedString.replace(/Ż/g, 'Z')
  parsedString = parsedString.replace(/Ź/g, 'Z')

  parsedString = parsedString.replace(/ą/g, 'a')
  parsedString = parsedString.replace(/ć/g, 'c')
  parsedString = parsedString.replace(/ę/g, 'e')
  parsedString = parsedString.replace(/ł/g, 'l')
  parsedString = parsedString.replace(/ń/g, 'n')
  parsedString = parsedString.replace(/ó/g, 'o')
  parsedString = parsedString.replace(/ś/g, 's')
  parsedString = parsedString.replace(/ż/g, 'z')
  parsedString = parsedString.replace(/ź/g, 'z')

  return parsedString
}

export default parseString
