import { assert, assertEquals, assertThrows } from '@std/assert'
import {
  hexagonToTorus,
  indexToPosition,
  positionToIndex,
  torusToHexagon,
} from '../src/position.ts'
import {
  TORUS_COLUMNS,
  TORUS_FLOORS,
  TORUS_ROWS,
  TOTAL_HEXAGONS,
  TOTAL_PAGES,
} from '../src/constants.ts'

Deno.test('index zero is hexagon 0, wall 1, shelf 1, volume 1, page 1', () => {
  assertEquals(indexToPosition(0n), { hexagon: 0n, wall: 1, shelf: 1, volume: 1, page: 1 })
})

Deno.test('positions round-trip through indices', () => {
  for (const index of [0n, 1n, 409n, 410n, 262_399n, 262_400n, TOTAL_PAGES / 7n, TOTAL_PAGES - 1n]) {
    assertEquals(positionToIndex(indexToPosition(index)), index)
  }
})

Deno.test('the final hexagon really is ragged', () => {
  const last = indexToPosition(TOTAL_PAGES - 1n)
  assertEquals(last.hexagon, TOTAL_HEXAGONS - 1n)
  // The next slot in that hexagon is past the end of the Library.
  assertThrows(() => positionToIndex({ ...last, page: last.page + 1 }), RangeError)
})

Deno.test('bad positions are rejected', () => {
  assertThrows(() => positionToIndex({ hexagon: 0n, wall: 5, shelf: 1, volume: 1, page: 1 }))
  assertThrows(() => positionToIndex({ hexagon: TOTAL_HEXAGONS, wall: 1, shelf: 1, volume: 1, page: 1 }))
})

Deno.test('torus axes cover all hexagons and are roughly cubical', () => {
  assert(TORUS_FLOORS * TORUS_ROWS * TORUS_COLUMNS >= TOTAL_HEXAGONS)
  // Columns exceed floors by at most one part in a thousand.
  assert(TORUS_COLUMNS >= TORUS_FLOORS)
  assert((TORUS_COLUMNS - TORUS_FLOORS) * 1000n < TORUS_FLOORS)
})

Deno.test('torus coordinates round-trip', () => {
  for (const hexagon of [0n, 1n, TOTAL_HEXAGONS / 2n, TOTAL_HEXAGONS - 1n]) {
    assertEquals(torusToHexagon(hexagonToTorus(hexagon)), hexagon)
  }
})
