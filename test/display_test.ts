import { assert, assertEquals } from '@std/assert'
import { collapseAddress, formatMagnitude, shelfErrorRadius } from '../src/display.ts'
import { TOTAL_HEXAGONS } from '../src/constants.ts'

Deno.test('small numbers are shown exactly, large ones in magnitude form', () => {
  assertEquals(formatMagnitude(0n), '0')
  assertEquals(formatMagnitude(42n), '42')
  assertEquals(
    formatMagnitude(31234567891234567891234n),
    '3.1234567891234567891 × 10^22',
  )
})

Deno.test('the deepest hexagon formats plausibly', () => {
  const formatted = formatMagnitude(TOTAL_HEXAGONS - 1n)
  assert(formatted.includes('× 10^462'), formatted)
})

Deno.test('shelf error radius is rounding error times twenty shelves', () => {
  assertEquals(shelfErrorRadius(10n ** 30n + 7n), 0n) // exact below 40 digits
  const hexagon = 10n ** 50n + 7n
  assertEquals(shelfErrorRadius(hexagon), (hexagon - 10n ** 50n) * 20n)
})

Deno.test('addresses collapse to head and tail', () => {
  assertEquals(collapseAddress('short'), 'short')
  assertEquals(collapseAddress('abcdefghijklmnopqrstuvwxyz'), 'abcdefgh…uvwxyz')
})
