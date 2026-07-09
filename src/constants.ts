// Every tunable constant in the Library lives here, and only here.

import { ceilDiv, icbrt } from './bignum.ts'

// Page geometry (Borges: 410 pages of 40 lines, 80 characters each).
export const PAGES_PER_BOOK = 410
export const LINES_PER_PAGE = 40
export const CHARS_PER_LINE = 80
export const CHARS_PER_PAGE = LINES_PER_PAGE * CHARS_PER_LINE // 3,200

// The 28 orthographic symbols: the English alphabet, space, full stop.
export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz .'
export const ALPHABET_SIZE = BigInt(ALPHABET.length) // 28n

// Room geometry (Bloch ch. 5: 640 books per hexagon).
export const WALLS_PER_HEXAGON = 4
export const SHELVES_PER_WALL = 5
export const VOLUMES_PER_SHELF = 32
export const BOOKS_PER_HEXAGON =
  WALLS_PER_HEXAGON * SHELVES_PER_WALL * VOLUMES_PER_SHELF // 640
export const PAGES_PER_HEXAGON = BOOKS_PER_HEXAGON * PAGES_PER_BOOK // 262,400

// Totals. PAGES_PER_HEXAGON has prime factors (5², 41) that TOTAL_PAGES
// lacks, so the division is never exact: the final hexagon is partly empty.
export const TOTAL_PAGES = ALPHABET_SIZE ** BigInt(CHARS_PER_PAGE)
export const TOTAL_HEXAGONS = ceilDiv(TOTAL_PAGES, BigInt(PAGES_PER_HEXAGON))

// Torus layout: floors × rows × columns ≥ TOTAL_HEXAGONS, each axis near
// the cube root so the Library is roughly cubical. It wraps in all three
// directions; the handful of cells past the final hexagon are empty.
export const TORUS_FLOORS = icbrt(TOTAL_HEXAGONS)
export const TORUS_ROWS = TORUS_FLOORS
export const TORUS_COLUMNS = ceilDiv(TOTAL_HEXAGONS, TORUS_FLOORS * TORUS_ROWS)

// Physical dimensions (Bloch ch. 5: hexagon side ≈ 3 m). Distance maths
// runs in BigInt decimetres to avoid floats.
export const HEXAGON_WIDTH_METRES = 5.2 // flat-to-flat
export const FLOOR_HEIGHT_METRES = 3.5
export const HEXAGON_WIDTH_DECIMETRES = BigInt(Math.round(HEXAGON_WIDTH_METRES * 10))
export const FLOOR_HEIGHT_DECIMETRES = BigInt(Math.round(FLOOR_HEIGHT_METRES * 10))

// A brisk librarian, on stairs or corridor alike.
export const WALKING_METRES_PER_HOUR = 5_000

// The page shown when no address is given: Claudius, Hamlet III.iii.
export const DEFAULT_QUOTE = [
  'My words fly up, my thoughts remain below:',
  'Words without thoughts never to heaven go.',
]

// Fixed public cipher key: addresses must render the same page forever.
// Changing this constant relocates every page in the Library.
export const CIPHER_KEY = 'babel.rgrannell.xyz/v1'
