// Search: build a full page containing the sought text, then run the
// cipher backwards to find where that page lives.

import { ALPHABET, ALPHABET_SIZE, CHARS_PER_PAGE } from './constants.ts'
import { decrypt } from './cipher.ts'
import { textToPage } from './page.ts'
import { randomBelow } from './bignum.ts'

// Map arbitrary text onto the 28-symbol alphabet: lowercase, strip
// diacritics, turn sentence punctuation into full stops, and drop the rest.
export function normalise(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[!?;:]/g, '.')
    .split('')
    .filter((char) => ALPHABET.includes(char) || /\s/.test(char))
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
}

// Place the text at a random offset on a page of random characters, and
// return the page number it decrypts from, plus the page text itself.
export async function findText(
  raw: string,
): Promise<{ index: bigint; offset: number; normalised: string }> {
  const normalised = normalise(raw)
  if (normalised.length === 0) {
    throw new RangeError('nothing searchable in that text')
  }
  if (normalised.length > CHARS_PER_PAGE) {
    throw new RangeError(`text is longer than a page (${CHARS_PER_PAGE} characters)`)
  }
  const offset = Number(randomBelow(BigInt(CHARS_PER_PAGE - normalised.length + 1)))
  const chars = new Array<string>(CHARS_PER_PAGE)
  for (let slot = 0; slot < CHARS_PER_PAGE; slot++) {
    chars[slot] = ALPHABET[Number(randomBelow(ALPHABET_SIZE))]
  }
  for (let slot = 0; slot < normalised.length; slot++) {
    chars[offset + slot] = normalised[slot]
  }
  const index = await decrypt(textToPage(chars.join('')))
  return { index, offset, normalised }
}

// How many pages of the Library contain the text: (positions it can start
// at) × (free choices for the remaining characters).
export function pagesContaining(textLength: number): bigint {
  const free = CHARS_PER_PAGE - textLength
  return BigInt(free + 1) * ALPHABET_SIZE ** BigInt(free)
}
