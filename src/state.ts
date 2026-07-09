// URL ↔ position, via a cycle codec. The hexagon rides in the URL as a
// base-36 string (~3,000 characters); the rest are small integers.

import { createCodec } from 'cycle'
import { fromBase36, toBase36 } from './bignum.ts'
import type { Position } from './position.ts'
import {
  PAGES_PER_BOOK,
  SHELVES_PER_WALL,
  VOLUMES_PER_SHELF,
  WALLS_PER_HEXAGON,
} from './constants.ts'

const codec = createCodec({
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
  return codec.encode({
    hexagon: toBase36(position.hexagon),
    wall: position.wall,
    shelf: position.shelf,
    volume: position.volume,
    page: position.page,
  })
}

export function paramsToPosition(params: string | URLSearchParams): Position {
  const state = codec.decode(params)
  return {
    hexagon: fromBase36(state.hexagon as string),
    wall: state.wall as number,
    shelf: state.shelf as number,
    volume: state.volume as number,
    page: state.page as number,
  }
}
