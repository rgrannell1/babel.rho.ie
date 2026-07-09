// A position index (0 ≤ index < TOTAL_PAGES) decomposes mixed-radix into
// (hexagon, wall, shelf, volume, page), and a hexagon number decomposes
// into (floor, row, column) on the torus. Human-facing fields are 1-based.

import {
  PAGES_PER_BOOK,
  PAGES_PER_HEXAGON,
  SHELVES_PER_WALL,
  TORUS_COLUMNS,
  TORUS_FLOORS,
  TORUS_ROWS,
  TOTAL_HEXAGONS,
  TOTAL_PAGES,
  VOLUMES_PER_SHELF,
  WALLS_PER_HEXAGON,
} from './constants.ts'

export type Position = {
  hexagon: bigint
  wall: number // 1..4
  shelf: number // 1..5
  volume: number // 1..32
  page: number // 1..410
}

export type TorusCoordinate = {
  floor: bigint
  row: bigint
  column: bigint
}

const PAGES_PER_SHELF = VOLUMES_PER_SHELF * PAGES_PER_BOOK
const PAGES_PER_WALL = SHELVES_PER_WALL * PAGES_PER_SHELF

export function indexToPosition(index: bigint): Position {
  if (index < 0n || index >= TOTAL_PAGES) {
    throw new RangeError('index outside the Library')
  }
  const hexagon = index / BigInt(PAGES_PER_HEXAGON)
  let rest = Number(index % BigInt(PAGES_PER_HEXAGON))
  const wall = Math.floor(rest / PAGES_PER_WALL)
  rest %= PAGES_PER_WALL
  const shelf = Math.floor(rest / PAGES_PER_SHELF)
  rest %= PAGES_PER_SHELF
  const volume = Math.floor(rest / PAGES_PER_BOOK)
  const page = rest % PAGES_PER_BOOK
  return { hexagon, wall: wall + 1, shelf: shelf + 1, volume: volume + 1, page: page + 1 }
}

export function positionToIndex(position: Position): bigint {
  const { hexagon, wall, shelf, volume, page } = position
  if (
    hexagon < 0n || hexagon >= TOTAL_HEXAGONS ||
    wall < 1 || wall > WALLS_PER_HEXAGON ||
    shelf < 1 || shelf > SHELVES_PER_WALL ||
    volume < 1 || volume > VOLUMES_PER_SHELF ||
    page < 1 || page > PAGES_PER_BOOK
  ) {
    throw new RangeError('no such position')
  }
  const index = hexagon * BigInt(PAGES_PER_HEXAGON) +
    BigInt((wall - 1) * PAGES_PER_WALL + (shelf - 1) * PAGES_PER_SHELF +
      (volume - 1) * PAGES_PER_BOOK + (page - 1))
  if (index >= TOTAL_PAGES) {
    throw new RangeError('past the last shelf of the final hexagon')
  }
  return index
}

export function hexagonToTorus(hexagon: bigint): TorusCoordinate {
  if (hexagon < 0n || hexagon >= TOTAL_HEXAGONS) {
    throw new RangeError('no such hexagon')
  }
  const perFloor = TORUS_ROWS * TORUS_COLUMNS
  return {
    floor: hexagon / perFloor,
    row: (hexagon % perFloor) / TORUS_COLUMNS,
    column: hexagon % TORUS_COLUMNS,
  }
}

export function torusToHexagon(coordinate: TorusCoordinate): bigint {
  const { floor, row, column } = coordinate
  if (
    floor < 0n || floor >= TORUS_FLOORS ||
    row < 0n || row >= TORUS_ROWS ||
    column < 0n || column >= TORUS_COLUMNS
  ) {
    throw new RangeError('coordinate outside the torus')
  }
  const hexagon = floor * TORUS_ROWS * TORUS_COLUMNS + row * TORUS_COLUMNS + column
  if (hexagon >= TOTAL_HEXAGONS) {
    throw new RangeError('an empty cell past the final hexagon')
  }
  return hexagon
}
