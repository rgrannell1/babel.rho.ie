import { assert, assertEquals } from '@std/assert'
import { decrypt, encrypt } from '../src/cipher.ts'
import { TOTAL_PAGES } from '../src/constants.ts'

Deno.test('encrypt and decrypt are inverse', async () => {
  for (const index of [0n, 1n, 2n, 12345n, TOTAL_PAGES / 3n, TOTAL_PAGES - 1n]) {
    assertEquals(await decrypt(await encrypt(index)), index)
    assertEquals(await encrypt(await decrypt(index)), index)
  }
})

// Pinned vector: if this test fails, the key or construction changed and
// every shared address in the wild has been silently relocated. Never
// update this pin — bump the key version and migrate instead.
Deno.test('position zero maps to its pinned page, forever', async () => {
  const text = (await encrypt(0n)).toString()
  assertEquals(text.length, 4631)
  assert(text.startsWith('19483046962982233732'))
  const digest = new Uint8Array(
    await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)),
  )
  const hex = Array.from(digest).map((byte) => byte.toString(16).padStart(2, '0')).join('')
  assertEquals(hex, '2174685180e9cb6846b7c1cdd08b464c9d27b46afc4779f3c8c573051a2480d7')
})

Deno.test('adjacent positions land on wildly different pages', async () => {
  const first = await encrypt(1000n)
  const second = await encrypt(1001n)
  const gap = first > second ? first - second : second - first
  // The gap should be Library-scale: within a few orders of magnitude of
  // the whole space, not anywhere near "adjacent".
  assert(gap.toString().length > TOTAL_PAGES.toString().length - 10)
})
