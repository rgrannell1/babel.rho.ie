import { assert, assertEquals, assertThrows } from '@std/assert'
import { paramsToPosition, positionToParams } from '../src/state.ts'
import { indexToPosition } from '../src/position.ts'
import { TOTAL_PAGES } from '../src/constants.ts'

Deno.test('positions round-trip through URL parameters', () => {
  for (const index of [0n, 262_399n, TOTAL_PAGES / 7n, TOTAL_PAGES - 1n]) {
    const position = indexToPosition(index)
    assertEquals(paramsToPosition(positionToParams(position)), position)
  }
})

Deno.test('the URL stays a sane size even for the deepest hexagon', () => {
  const params = positionToParams(indexToPosition(TOTAL_PAGES - 1n))
  const length = params.toString().length
  assert(length < 3_100, `URL params were ${length} chars`)
})

Deno.test('malformed parameters are rejected', () => {
  assertThrows(() => paramsToPosition('hexagon=NOT!VALID&wall=1&shelf=1&volume=1&page=1'))
  assertThrows(() => paramsToPosition('wall=1&shelf=1&volume=1&page=1'))
  assertThrows(() => paramsToPosition('hexagon=0&wall=9&shelf=1&volume=1&page=1'))
})
