// Codec between a page number (0 ≤ n < TOTAL_PAGES) and its 3,200-character
// text: the page number written in base 28, one alphabet symbol per digit.

import { ALPHABET, ALPHABET_SIZE, CHARS_PER_PAGE, TOTAL_PAGES } from './constants.ts'

export function pageToText(pageNumber: bigint): string {
  if (pageNumber < 0n || pageNumber >= TOTAL_PAGES) {
    throw new RangeError('page number outside the Library')
  }
  const chars = new Array<string>(CHARS_PER_PAGE)
  let rest = pageNumber
  for (let index = CHARS_PER_PAGE - 1; index >= 0; index--) {
    chars[index] = ALPHABET[Number(rest % ALPHABET_SIZE)]
    rest /= ALPHABET_SIZE
  }
  return chars.join('')
}

export function textToPage(text: string): bigint {
  if (text.length !== CHARS_PER_PAGE) {
    throw new RangeError(`page text must be exactly ${CHARS_PER_PAGE} characters`)
  }
  let acc = 0n
  for (const char of text) {
    const digit = ALPHABET.indexOf(char)
    if (digit === -1) {
      throw new RangeError(`character not in alphabet: "${char}"`)
    }
    acc = acc * ALPHABET_SIZE + BigInt(digit)
  }
  return acc
}
