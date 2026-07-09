import { assert, assertEquals } from '@std/assert'
import { exactPage, findText, normalise, pagesContaining } from '../src/search.ts'
import { encrypt } from '../src/cipher.ts'
import { pageToText } from '../src/page.ts'
import { ALPHABET_SIZE, CHARS_PER_PAGE, DEFAULT_QUOTE } from '../src/constants.ts'

Deno.test('normalise maps text onto the alphabet', () => {
  assertEquals(normalise('Hello, World!'), 'hello world.')
  assertEquals(normalise('Café — déjà vu?'), 'cafe deja vu.')
  assertEquals(normalise('B0RG3S'), 'brgs')
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

Deno.test('the default quote sits on its own lines of a blank page', async () => {
  const index = await exactPage(DEFAULT_QUOTE)
  const text = pageToText(await encrypt(index))
  assert(text.startsWith('my words fly up my thoughts remain below.'))
  assertEquals(text.slice(80, 122), 'words without thoughts never to heaven go.')
  assertEquals(text.slice(160).trim(), '')
  // Deterministic: the same quote always finds the same page.
  assertEquals(await exactPage(DEFAULT_QUOTE), index)
})

Deno.test('the count of containing pages is astronomical but finite', () => {
  assertEquals(pagesContaining(CHARS_PER_PAGE), 1n)
  const count = pagesContaining(5)
  assertEquals(count, BigInt(CHARS_PER_PAGE - 5 + 1) * ALPHABET_SIZE ** BigInt(CHARS_PER_PAGE - 5))
})
