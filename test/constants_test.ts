import { assert, assertEquals } from '@std/assert'
import {
  ALPHABET,
  BOOKS_PER_HEXAGON,
  PAGES_PER_HEXAGON,
  TOTAL_HEXAGONS,
  TOTAL_PAGES,
} from '../src/constants.ts'

Deno.test('the alphabet has 28 distinct symbols', () => {
  assertEquals(ALPHABET.length, 28)
  assertEquals(new Set(ALPHABET).size, 28)
})

Deno.test('room geometry matches Bloch', () => {
  assertEquals(BOOKS_PER_HEXAGON, 640)
  assertEquals(PAGES_PER_HEXAGON, 262_400)
})

Deno.test('the final hexagon is partly empty (divisibility problem)', () => {
  const pagesPerHexagon = BigInt(PAGES_PER_HEXAGON)
  assert(TOTAL_PAGES % pagesPerHexagon !== 0n)
  assert(TOTAL_HEXAGONS * pagesPerHexagon >= TOTAL_PAGES)
  assert((TOTAL_HEXAGONS - 1n) * pagesPerHexagon < TOTAL_PAGES)
})

Deno.test('the Library holds 28^3200 pages, about 10^4630', () => {
  assertEquals(TOTAL_PAGES.toString().length, 4631)
})
