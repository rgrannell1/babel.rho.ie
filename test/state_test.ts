import { assert, assertEquals, assertThrows } from '@std/assert'
import { paramsToPosition, positionToParams } from '../src/state.ts'
import { indexToPosition } from '../src/position.ts'
import { PAGES_PER_HEXAGON, TORUS_COLUMNS, TORUS_ROWS, TOTAL_PAGES } from '../src/constants.ts'

Deno.test('positions round-trip through URL parameters', () => {
  for (const index of [0n, 262_399n, TOTAL_PAGES / 7n, TOTAL_PAGES - 1n]) {
    const position = indexToPosition(index)
    assertEquals(paramsToPosition(positionToParams(position)), position)
  }
})

Deno.test('URL parameters use floor-local hexagons', () => {
  const globalHexagon = TORUS_ROWS * TORUS_COLUMNS + 7n
  const params = positionToParams(indexToPosition(globalHexagon * BigInt(PAGES_PER_HEXAGON)))
  assertEquals(params.get('floor'), '1')
  assertEquals(params.get('hexagon'), '7')
})

Deno.test('legacy URL parameters with global hexagons still decode', () => {
  assertEquals(
    paramsToPosition('hexagon=7&wall=1&shelf=1&volume=1&page=1'),
    { hexagon: 7n, wall: 1, shelf: 1, volume: 1, page: 1 },
  )
})

Deno.test('the URL stays a sane size even for the deepest hexagon', () => {
  const params = positionToParams(indexToPosition(TOTAL_PAGES - 1n))
  const length = params.toString().length
  assert(length < 3_100, `URL params were ${length} chars`)
})

Deno.test('malformed parameters are rejected', () => {
  assertThrows(() => paramsToPosition('floor=0&hexagon=NOT!VALID&wall=1&shelf=1&volume=1&page=1'))
  assertThrows(() => paramsToPosition('wall=1&shelf=1&volume=1&page=1'))
  assertThrows(() => paramsToPosition('floor=0&hexagon=0&wall=9&shelf=1&volume=1&page=1'))
})
