// BigInt helpers for Library-scale integers.

export function ceilDiv(numerator: bigint, denominator: bigint): bigint {
  return (numerator + denominator - 1n) / denominator
}

// A uniform random BigInt in [0, limit), by rejection sampling.
export function randomBelow(limit: bigint): bigint {
  if (limit <= 0n) {
    throw new RangeError('limit must be positive')
  }
  const bits = (limit - 1n).toString(2).length
  const byteCount = Math.ceil(bits / 8)
  const excessBits = BigInt(byteCount * 8 - bits)
  while (true) {
    const buffer = new Uint8Array(byteCount)
    crypto.getRandomValues(buffer)
    let candidate = 0n
    for (const byte of buffer) {
      candidate = (candidate << 8n) | BigInt(byte)
    }
    candidate >>= excessBits
    if (candidate < limit) {
      return candidate
    }
  }
}

// Floor of the cube root, by Newton's method.
export function icbrt(value: bigint): bigint {
  if (value < 0n) {
    throw new RangeError('icbrt of a negative number')
  }
  if (value < 2n) {
    return value
  }
  let guess = 1n << BigInt(Math.ceil(value.toString(2).length / 3))
  while (true) {
    const next = (2n * guess + value / (guess * guess)) / 3n
    if (next >= guess) {
      return guess
    }
    guess = next
  }
}

export function toBase36(value: bigint): string {
  return value.toString(36)
}

export function fromBase36(text: string): bigint {
  let acc = 0n
  for (const char of text) {
    const digit = parseInt(char, 36)
    if (Number.isNaN(digit)) {
      throw new Error(`not a base-36 digit: "${char}"`)
    }
    acc = acc * 36n + BigInt(digit)
  }
  return acc
}

// d.ddd…d × 10^exponent form, with `digits` leading digits kept.
export function magnitude(
  value: bigint,
  digits = 20,
): { leading: string; exponent: number } {
  const text = value.toString()
  return { leading: text.slice(0, digits), exponent: text.length - 1 }
}

// The absolute error of truncating `value` to `digits` leading digits.
export function truncationError(value: bigint, digits = 20): bigint {
  const text = value.toString()
  if (text.length <= digits) {
    return 0n
  }
  return value - BigInt(text.slice(0, digits)) * 10n ** BigInt(text.length - digits)
}
