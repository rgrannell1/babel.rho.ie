import { assertEquals } from '@std/assert'
import { ceilDiv, fromBase36, magnitude, toBase36, truncationError } from '../src/bignum.ts'
import { TOTAL_PAGES } from '../src/constants.ts'

Deno.test('base-36 round-trips, including Library-scale values', () => {
  for (const value of [0n, 1n, 35n, 36n, 1234567890123456789n, TOTAL_PAGES]) {
    assertEquals(fromBase36(toBase36(value)), value)
  }
})

Deno.test('ceilDiv rounds up exactly when needed', () => {
  assertEquals(ceilDiv(10n, 5n), 2n)
  assertEquals(ceilDiv(11n, 5n), 3n)
})

Deno.test('magnitude keeps leading digits and exponent', () => {
  const { leading, exponent } = magnitude(31234567891234567891234n, 20)
  assertEquals(leading, '31234567891234567891')
  assertEquals(exponent, 22)
})

Deno.test('truncationError is the discarded tail', () => {
  assertEquals(truncationError(31234n, 3), 34n)
  assertEquals(truncationError(31234n, 20), 0n)
  const reconstructed = BigInt(magnitude(TOTAL_PAGES).leading) *
      10n ** BigInt(magnitude(TOTAL_PAGES).exponent - 19) +
    truncationError(TOTAL_PAGES)
  assertEquals(reconstructed, TOTAL_PAGES)
})
