import { assert, assertEquals } from '@std/assert'
import { findText, normalise, pagesContaining } from '../src/search.ts'
import { encrypt } from '../src/cipher.ts'
import { pageToText } from '../src/page.ts'
import { ALPHABET_SIZE, CHARS_PER_PAGE } from '../src/constants.ts'

Deno.test('normalise maps text onto the alphabet', () => {
  assertEquals(normalise('Hello, World!'), 'hello world.')
  assertEquals(normalise('Café — déjà vu?'), 'cafe deja vu.')
  assertEquals(normalise('B0RG3S'), 'brgs')
  assertEquals(normalise('hello '), 'hello ')
})

Deno.test('found pages really contain the text', async () => {
  const sought = 'the library is unlimited and periodic'
  const { index, offset } = await findText(sought)
  const text = pageToText(await encrypt(index))
  assertEquals(text.slice(offset, offset + sought.length), sought)
})

Deno.test('two searches for the same text find different pages', async () => {
  const first = await findText('babel')
  const second = await findText('babel')
  assert(first.index !== second.index)
})

Deno.test('the count of containing pages is astronomical but finite', () => {
  assertEquals(pagesContaining(CHARS_PER_PAGE), 1n)
  const count = pagesContaining(5)
  assertEquals(count, BigInt(CHARS_PER_PAGE - 5 + 1) * ALPHABET_SIZE ** BigInt(CHARS_PER_PAGE - 5))
})
