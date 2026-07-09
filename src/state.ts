// URL ↔ position, via a cycle codec. The public address uses floor plus a
// floor-local hexagon, both as base-36 strings; the rest are small integers.

import { createCodec } from 'cycle'
import { fromBase36, toBase36 } from './bignum.ts'
import { floorAddressToHexagon, hexagonToFloorAddress, type Position } from './position.ts'
import {
  PAGES_PER_BOOK,
  SHELVES_PER_WALL,
  VOLUMES_PER_SHELF,
  WALLS_PER_HEXAGON,
} from './constants.ts'

const addressCodec = createCodec({
  type: 'object',
  required: ['floor', 'hexagon', 'wall', 'shelf', 'volume', 'page'],
  properties: {
    floor: { type: 'string', pattern: '^[0-9a-z]+$' },
    hexagon: { type: 'string', pattern: '^[0-9a-z]+$' },
    wall: { type: 'integer', minimum: 1, maximum: WALLS_PER_HEXAGON },
    shelf: { type: 'integer', minimum: 1, maximum: SHELVES_PER_WALL },
    volume: { type: 'integer', minimum: 1, maximum: VOLUMES_PER_SHELF },
    page: { type: 'integer', minimum: 1, maximum: PAGES_PER_BOOK },
  },
})

const legacyCodec = createCodec({
  type: 'object',
  required: ['hexagon', 'wall', 'shelf', 'volume', 'page'],
  properties: {
    hexagon: { type: 'string', pattern: '^[0-9a-z]+$' },
    wall: { type: 'integer', minimum: 1, maximum: WALLS_PER_HEXAGON },
    shelf: { type: 'integer', minimum: 1, maximum: SHELVES_PER_WALL },
    volume: { type: 'integer', minimum: 1, maximum: VOLUMES_PER_SHELF },
    page: { type: 'integer', minimum: 1, maximum: PAGES_PER_BOOK },
  },
})

export function positionToParams(position: Position): URLSearchParams {
  const address = hexagonToFloorAddress(position.hexagon)
  return addressCodec.encode({
    floor: toBase36(address.floor),
    hexagon: toBase36(address.hexagon),
    wall: position.wall,
    shelf: position.shelf,
    volume: position.volume,
    page: position.page,
  })
}

export function paramsToPosition(params: string | URLSearchParams): Position {
  const search = typeof params === 'string' ? new URLSearchParams(params) : params
  if (!search.has('floor')) {
    const state = legacyCodec.decode(search)
    return {
      hexagon: fromBase36(state.hexagon as string),
      wall: state.wall as number,
      shelf: state.shelf as number,
      volume: state.volume as number,
      page: state.page as number,
    }
  }
  const state = addressCodec.decode(search)
  return {
    hexagon: floorAddressToHexagon({
      floor: fromBase36(state.floor as string),
      hexagon: fromBase36(state.hexagon as string),
    }),
    wall: state.wall as number,
    shelf: state.shelf as number,
    volume: state.volume as number,
    page: state.page as number,
  }
}
