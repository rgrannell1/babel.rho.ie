// URL ↔ share state, via a cycle codec. The public address uses floor plus a
// floor-local hexagon, both as base-36 strings; the rest are small integers.
// A search carries its normalised text too, so a shared link reproduces the
// found page with the text highlighted (re-searching would land elsewhere:
// findText places the text at random).

import { createCodec } from 'cycle'
import { fromBase36, toBase36 } from './bignum.ts'
import { floorAddressToHexagon, hexagonToFloorAddress, type Position } from './position.ts'
import {
  CHARS_PER_PAGE,
  PAGES_PER_BOOK,
  SHELVES_PER_WALL,
  VOLUMES_PER_SHELF,
  WALLS_PER_HEXAGON,
} from './constants.ts'

export interface ShareState {
  position: Position
  text?: string
}

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
    text: { type: 'string', pattern: '^[a-z .]+$', maxLength: CHARS_PER_PAGE },
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

export function stateToParams({ position, text }: ShareState): URLSearchParams {
  const address = hexagonToFloorAddress(position.hexagon)
  return addressCodec.encode({
    floor: toBase36(address.floor),
    hexagon: toBase36(address.hexagon),
    wall: position.wall,
    shelf: position.shelf,
    volume: position.volume,
    page: position.page,
    ...text === undefined ? {} : { text },
  })
}

export function paramsToState(params: string | URLSearchParams): ShareState {
  const search = typeof params === 'string' ? new URLSearchParams(params) : params
  if (!search.has('floor')) {
    const state = legacyCodec.decode(search)
    return {
      position: {
        hexagon: fromBase36(state.hexagon as string),
        wall: state.wall as number,
        shelf: state.shelf as number,
        volume: state.volume as number,
        page: state.page as number,
      },
    }
  }
  const state = addressCodec.decode(search)
  return {
    position: {
      hexagon: floorAddressToHexagon({
        floor: fromBase36(state.floor as string),
        hexagon: fromBase36(state.hexagon as string),
      }),
      wall: state.wall as number,
      shelf: state.shelf as number,
      volume: state.volume as number,
      page: state.page as number,
    },
    ...state.text === undefined ? {} : { text: state.text as string },
  }
}
