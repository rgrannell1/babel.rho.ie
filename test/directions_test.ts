import { assert, assertEquals } from '@std/assert'
import { displacement, formatDistance, formatDuration, walkSeconds } from '../src/directions.ts'
import { torusToHexagon } from '../src/position.ts'
import { TORUS_COLUMNS, TORUS_ROWS } from '../src/constants.ts'

Deno.test('the origin needs no directions', () => {
  assertEquals(displacement(0n), [])
})

Deno.test('one hexagon east is 5.2 metres east', () => {
  const legs = displacement(1n)
  assertEquals(legs, [{ direction: 'east', hexagons: 1n, decimetres: 52n }])
})

Deno.test('past the halfway point the short way is backwards', () => {
  const nearlyAround = torusToHexagon({ floor: 0n, row: 0n, column: TORUS_COLUMNS - 1n })
  assertEquals(displacement(nearlyAround), [
    { direction: 'west', hexagons: 1n, decimetres: 52n },
  ])
  const oneRowBack = torusToHexagon({ floor: 0n, row: TORUS_ROWS - 2n, column: 0n })
  assertEquals(displacement(oneRowBack), [
    { direction: 'south', hexagons: 2n, decimetres: 104n },
  ])
})

Deno.test('distances scale from metres to light-years', () => {
  assertEquals(formatDistance(52n), '5.2 m')
  assertEquals(formatDistance(10_000_000n), '1000 km')
  assert(formatDistance(94_607_304_725_808_000n * 3n).startsWith('3 light-years'))
})

Deno.test('walking times scale from minutes to universe-ages', () => {
  assertEquals(walkSeconds(50_000n), 3_600n) // 5 km at 5 km/h
  assertEquals(formatDuration(3_600n), '60 minutes')
  const crossing = formatDuration(walkSeconds(94_607_304_725_808_000n * 10n ** 100n))
  assert(crossing.includes('ages of the universe'), crossing)
})
