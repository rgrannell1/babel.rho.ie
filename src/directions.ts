// Directions from the origin hexagon (floor 0, row 0, column 0), taking
// the short way around each axis of the torus.

import {
  FLOOR_HEIGHT_DECIMETRES,
  HEXAGON_WIDTH_DECIMETRES,
  TORUS_COLUMNS,
  TORUS_FLOORS,
  TORUS_ROWS,
  WALKING_METRES_PER_HOUR,
} from './constants.ts'
import { hexagonToTorus } from './position.ts'
import { formatMagnitude, MAGNITUDE_DIGITS } from './display.ts'
import { truncationError } from './bignum.ts'

export type Leg = { direction: string; hexagons: bigint; decimetres: bigint }

const LIGHT_YEAR_DECIMETRES = 94_607_304_725_808_000n
const SECONDS_PER_YEAR = 31_557_600n
const UNIVERSE_AGE_YEARS = 13_800_000_000n

function wrapLeg(
  coordinate: bigint,
  axisSize: bigint,
  forward: string,
  backward: string,
  unitDecimetres: bigint,
): Leg {
  const goForward = coordinate * 2n <= axisSize
  const hexagons = goForward ? coordinate : axisSize - coordinate
  return { direction: goForward ? forward : backward, hexagons, decimetres: hexagons * unitDecimetres }
}

export function displacement(hexagon: bigint): Leg[] {
  const { floor, row, column } = hexagonToTorus(hexagon)
  return [
    wrapLeg(floor, TORUS_FLOORS, 'up', 'down', FLOOR_HEIGHT_DECIMETRES),
    wrapLeg(row, TORUS_ROWS, 'north', 'south', HEXAGON_WIDTH_DECIMETRES),
    wrapLeg(column, TORUS_COLUMNS, 'east', 'west', HEXAGON_WIDTH_DECIMETRES),
  ].filter((leg) => leg.hexagons > 0n)
}

export function nearbyHexagonsToSearch(legs: Leg[]): bigint {
  return legs.reduce((count, leg) => {
    const radius = truncationError(leg.hexagons, MAGNITUDE_DIGITS)
    return count * (radius * 2n + 1n)
  }, 1n)
}

// Amounts stay bigint so the UI can typeset them; strings are already exact.
export type QuantityParts = { amount: string | bigint; unit: string }

export function distanceParts(decimetres: bigint): QuantityParts {
  if (decimetres < 10_000n) {
    return { amount: `${Number(decimetres) / 10}`, unit: 'm' }
  }
  if (decimetres < LIGHT_YEAR_DECIMETRES) {
    return { amount: decimetres / 10_000n, unit: 'km' }
  }
  return { amount: decimetres / LIGHT_YEAR_DECIMETRES, unit: 'light-years' }
}

export function formatDistance(decimetres: bigint): string {
  const { amount, unit } = distanceParts(decimetres)
  return `${typeof amount === 'bigint' ? formatMagnitude(amount) : amount} ${unit}`
}

export function walkSeconds(decimetres: bigint): bigint {
  return decimetres * 3_600n / BigInt(WALKING_METRES_PER_HOUR * 10)
}

export function durationParts(
  seconds: bigint,
): QuantityParts & { universeAges?: bigint } {
  if (seconds < 120n) return { amount: seconds, unit: 'seconds' }
  if (seconds < 7_200n) return { amount: seconds / 60n, unit: 'minutes' }
  if (seconds < 172_800n) return { amount: seconds / 3_600n, unit: 'hours' }
  if (seconds < SECONDS_PER_YEAR * 2n) return { amount: seconds / 86_400n, unit: 'days' }
  const years = seconds / SECONDS_PER_YEAR
  if (years < UNIVERSE_AGE_YEARS * 2n) {
    return { amount: years, unit: 'years' }
  }
  return { amount: years, unit: 'years', universeAges: years / UNIVERSE_AGE_YEARS }
}

export function formatDuration(seconds: bigint): string {
  const { amount, unit, universeAges } = durationParts(seconds)
  const head = `${typeof amount === 'bigint' ? formatMagnitude(amount) : amount} ${unit}`
  if (universeAges === undefined) {
    return head
  }
  return `${head} — ${formatMagnitude(universeAges)} ages of the universe`
}
