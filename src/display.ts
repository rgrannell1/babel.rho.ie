// Human-readable renderings of Library-scale numbers.

import { magnitude, truncationError } from './bignum.ts'
import { SHELVES_PER_WALL, WALLS_PER_HEXAGON } from './constants.ts'

export const MAGNITUDE_DIGITS = 30
// The hexagon location gets double precision.
export const HEXAGON_MAGNITUDE_DIGITS = 40

// "3.1234567891234567891 × 10^4470"; small numbers are shown exactly.
export function formatMagnitude(value: bigint): string {
  const { leading, exponent } = magnitude(value, MAGNITUDE_DIGITS)
  if (exponent < MAGNITUDE_DIGITS) {
    return value.toString()
  }
  return `${leading[0]}.${leading.slice(1)} × 10^${exponent}`
}

// How many shelves sit inside the displayed hexagon magnitude's rounding
// error — so it must truncate at the same precision as the display.
export function shelfErrorRadius(hexagon: bigint): bigint {
  const SHELVES_PER_HEXAGON = BigInt(WALLS_PER_HEXAGON * SHELVES_PER_WALL)
  return truncationError(hexagon, HEXAGON_MAGNITUDE_DIGITS) * SHELVES_PER_HEXAGON
}

// LaTeX form of formatMagnitude, for KaTeX: "3.1234… \times 10^{4470}".
export function magnitudeLatex(value: bigint, digits = MAGNITUDE_DIGITS): string {
  const { leading, exponent } = magnitude(value, digits)
  if (exponent < digits) {
    return value.toString()
  }
  return `${leading[0]}.${leading.slice(1)} \\times 10^{${exponent}}`
}

// One-significant-figure text for "about" quantities: "2 × 10^1526".
export function roundMagnitude(value: bigint): string {
  const text = value.toString()
  if (text.length <= 2) {
    return text
  }
  let leading = Math.round(Number(text.slice(0, 2)) / 10)
  let exponent = text.length - 1
  if (leading === 10) {
    leading = 1
    exponent += 1
  }
  if (exponent < 4) {
    return (BigInt(leading) * 10n ** BigInt(exponent)).toString()
  }
  return `${leading} × 10^${exponent}`
}

// One-significant-figure LaTeX for "about" quantities: "2 \times 10^{1526}".
export function roundMagnitudeLatex(value: bigint): string {
  return roundMagnitude(value).replace('×', '\\times ').replace(/\^(.+)$/, '^{$1}')
}

// "k7f2q9d3…x03mz2" — head and tail of a long address.
export function collapseAddress(address: string, head = 8, tail = 6): string {
  if (address.length <= head + tail + 1) {
    return address
  }
  return `${address.slice(0, head)}…${address.slice(-tail)}`
}
