import { assertEquals } from '@std/assert'
import { step, stepLexical } from '../src/navigate.ts'
import { indexToPosition, positionToIndex } from '../src/position.ts'
import { TOTAL_PAGES } from '../src/constants.ts'

Deno.test('stepping a page moves one slot', () => {
  assertEquals(step(0n, 'page', 1), 1n)
  assertEquals(indexToPosition(step(0n, 'volume', 1)).volume, 2)
  assertEquals(indexToPosition(step(0n, 'shelf', 1)).shelf, 2)
  assertEquals(indexToPosition(step(0n, 'wall', 1)).wall, 2)
  assertEquals(indexToPosition(step(0n, 'hexagon', 1)).hexagon, 1n)
})

Deno.test('the Library wraps at both ends', () => {
  assertEquals(step(0n, 'page', -1), TOTAL_PAGES - 1n)
  assertEquals(step(TOTAL_PAGES - 1n, 'page', 1), 0n)
})

Deno.test('lexical steps start at page 1 and carry like an odometer', () => {
  const midVolume = positionToIndex({ hexagon: 5n, wall: 2, shelf: 3, volume: 7, page: 200 })
  assertEquals(
    indexToPosition(stepLexical(midVolume, 'volume', 1)),
    { hexagon: 5n, wall: 2, shelf: 3, volume: 8, page: 1 },
  )
  assertEquals(
    indexToPosition(stepLexical(midVolume, 'volume', -1)),
    { hexagon: 5n, wall: 2, shelf: 3, volume: 6, page: 1 },
  )
  const lastVolume = positionToIndex({ hexagon: 5n, wall: 2, shelf: 5, volume: 32, page: 9 })
  assertEquals(
    indexToPosition(stepLexical(lastVolume, 'volume', 1)),
    { hexagon: 5n, wall: 3, shelf: 1, volume: 1, page: 1 },
  )
  assertEquals(
    indexToPosition(stepLexical(midVolume, 'hexagon', 1)),
    { hexagon: 6n, wall: 1, shelf: 1, volume: 1, page: 1 },
  )
  // The Library's ends wrap in both directions.
  assertEquals(stepLexical(TOTAL_PAGES - 1n, 'volume', 1), 0n)
  const lastBlockStart = stepLexical(0n, 'volume', -1)
  assertEquals(stepLexical(lastBlockStart, 'volume', 1), 0n)
})

Deno.test('a step out and back returns home', () => {
  for (const unit of ['page', 'volume', 'shelf', 'wall', 'hexagon'] as const) {
    assertEquals(step(step(12345n, unit, 1), unit, -1), 12345n)
  }
})
