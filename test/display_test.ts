import { assert, assertEquals } from '@std/assert'
import { collapseAddress, formatMagnitude, roundMagnitude, shelfErrorRadius } from '../src/display.ts'
import { TOTAL_HEXAGONS } from '../src/constants.ts'

Deno.test('small numbers are shown exactly, large ones in magnitude form', () => {
  assertEquals(formatMagnitude(0n), '0')
  assertEquals(formatMagnitude(42n), '42')
  assertEquals(
    formatMagnitude(3123456789123456789123456789123n),
    '3.12345678912345678912345678912 × 10^30',
  )
})

Deno.test('about quantities round to one significant figure', () => {
  assertEquals(roundMagnitude(42n), '42')
  assertEquals(roundMagnitude(196n), '200')
  assertEquals(roundMagnitude(1967n), '2000')
  assertEquals(roundMagnitude(19670141045507392831n * 10n ** 1507n), '2 × 10^1526')
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
