import { assertEquals, assertThrows } from '@std/assert'
import { pageToText, textToPage } from '../src/page.ts'
import { CHARS_PER_PAGE, TOTAL_PAGES } from '../src/constants.ts'

Deno.test('page zero is all a, the last page all full stops', () => {
  assertEquals(pageToText(0n), 'a'.repeat(CHARS_PER_PAGE))
  assertEquals(pageToText(TOTAL_PAGES - 1n), '.'.repeat(CHARS_PER_PAGE))
})

Deno.test('page numbers round-trip through text', () => {
  for (const pageNumber of [0n, 1n, 27n, 28n, TOTAL_PAGES / 7n, TOTAL_PAGES - 1n]) {
    const text = pageToText(pageNumber)
    assertEquals(text.length, CHARS_PER_PAGE)
    assertEquals(textToPage(text), pageNumber)
  }
})

Deno.test('out-of-range and malformed inputs are rejected', () => {
  assertThrows(() => pageToText(-1n), RangeError)
  assertThrows(() => pageToText(TOTAL_PAGES), RangeError)
  assertThrows(() => textToPage('too short'), RangeError)
  assertThrows(() => textToPage('!'.repeat(CHARS_PER_PAGE)), RangeError)
})
