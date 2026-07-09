// Stepping through the Library. The index wraps at both ends: the Library
// is unlimited and periodic.

import {
  PAGES_PER_BOOK,
  PAGES_PER_HEXAGON,
  SHELVES_PER_WALL,
  TOTAL_PAGES,
  VOLUMES_PER_SHELF,
} from './constants.ts'

export const STEP_UNITS = {
  page: 1n,
  volume: BigInt(PAGES_PER_BOOK),
  shelf: BigInt(VOLUMES_PER_SHELF * PAGES_PER_BOOK),
  wall: BigInt(SHELVES_PER_WALL * VOLUMES_PER_SHELF * PAGES_PER_BOOK),
  hexagon: BigInt(PAGES_PER_HEXAGON),
} as const

export type StepUnit = keyof typeof STEP_UNITS

export function step(index: bigint, unit: StepUnit, direction: 1 | -1): bigint {
  const delta = STEP_UNITS[unit] * BigInt(direction)
  return (index + delta + TOTAL_PAGES) % TOTAL_PAGES
}

// Lexical step: jump to the START of the next or previous unit (page 1 of
// the next volume, first page of the previous shelf, …), carrying upward
// like an odometer and wrapping at the Library's ends.
export function stepLexical(index: bigint, unit: StepUnit, direction: 1 | -1): bigint {
  const size = STEP_UNITS[unit]
  const lastBlock = (TOTAL_PAGES - 1n) / size
  let block = index / size + BigInt(direction)
  if (block < 0n) block = lastBlock
  if (block > lastBlock) block = 0n
  return block * size
}
