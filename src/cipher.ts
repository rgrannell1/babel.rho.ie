// The keyed pseudorandom permutation position ↔ page over the Library.
//
// A balanced Feistel network over Z_M × Z_M with M = 28^1600, so the domain
// is exactly TOTAL_PAGES = M² and every position maps to exactly one page.
// The round function is SHA-256 expanded in counter mode. This is not
// security-grade cryptography — it only needs to be pattern-free and fixed.

import { ALPHABET_SIZE, CHARS_PER_PAGE, CIPHER_KEY, TOTAL_PAGES } from './constants.ts'

const HALF_MODULUS = ALPHABET_SIZE ** BigInt(CHARS_PER_PAGE / 2)
const ROUNDS = 10
// Bytes per round output: enough to cover HALF_MODULUS, plus 8 spare bytes
// so the (mod M) reduction bias is negligible.
const ROUND_BYTES = Math.ceil((CHARS_PER_PAGE / 2) * Math.log2(Number(ALPHABET_SIZE)) / 8) + 8

const utf8 = new TextEncoder()

function bigintToBytes(value: bigint): Uint8Array {
  const hex = value.toString(16)
  const padded = hex.length % 2 === 0 ? hex : '0' + hex
  const bytes = new Uint8Array(padded.length / 2)
  for (let index = 0; index < bytes.length; index++) {
    bytes[index] = parseInt(padded.slice(index * 2, index * 2 + 2), 16)
  }
  return bytes
}

function bytesToBigint(bytes: Uint8Array): bigint {
  let acc = 0n
  for (const byte of bytes) {
    acc = (acc << 8n) | BigInt(byte)
  }
  return acc
}

// F(half, round): expand SHA-256(key ‖ round ‖ counter ‖ half) until
// ROUND_BYTES are gathered, then reduce mod M.
async function roundFunction(half: bigint, round: number): Promise<bigint> {
  const halfBytes = bigintToBytes(half)
  const chunks: Uint8Array[] = []
  let gathered = 0
  for (let counter = 0; gathered < ROUND_BYTES; counter++) {
    const message = new Uint8Array([
      ...utf8.encode(CIPHER_KEY),
      round,
      counter,
      ...halfBytes,
    ])
    const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', message))
    chunks.push(digest)
    gathered += digest.length
  }
  const combined = new Uint8Array(gathered)
  let offset = 0
  for (const chunk of chunks) {
    combined.set(chunk, offset)
    offset += chunk.length
  }
  return bytesToBigint(combined.subarray(0, ROUND_BYTES)) % HALF_MODULUS
}

// Position index → page number.
export async function encrypt(index: bigint): Promise<bigint> {
  if (index < 0n || index >= TOTAL_PAGES) {
    throw new RangeError('index outside the Library')
  }
  let left = index / HALF_MODULUS
  let right = index % HALF_MODULUS
  for (let round = 0; round < ROUNDS; round++) {
    const mixed = (left + await roundFunction(right, round)) % HALF_MODULUS
    left = right
    right = mixed
  }
  return left * HALF_MODULUS + right
}

// Page number → position index.
export async function decrypt(pageNumber: bigint): Promise<bigint> {
  if (pageNumber < 0n || pageNumber >= TOTAL_PAGES) {
    throw new RangeError('page number outside the Library')
  }
  let left = pageNumber / HALF_MODULUS
  let right = pageNumber % HALF_MODULUS
  for (let round = ROUNDS - 1; round >= 0; round--) {
    const unmixed = (right - await roundFunction(left, round) + HALF_MODULUS * HALF_MODULUS) %
      HALF_MODULUS
    right = left
    left = unmixed
  }
  return left * HALF_MODULUS + right
}
