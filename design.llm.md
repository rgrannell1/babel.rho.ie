# design.llm.md — Claude's working notes

Agreed design (mirrors the lines approved for design.md, 2026-07-09):

1. A position is (hexagon, wall 1–4, shelf 1–5, volume 1–32, page 1–410); each hexagon holds 640 books.
2. A book is 1,312,000 characters: 410 pages × 40 lines × 80 characters, over the 25-symbol alphabet (22 letters, space, comma, period).
3. Position ↔ contents is a keyed pseudorandom permutation (format-preserving cipher) — invertible, no pattern between adjacent positions.
4. The bijection is page-level: every possible 3,200-character page (25^3,200) appears exactly once; an address fits in the URL.
5. Position display: ~20-leading-digit magnitude (d.ddd…d × 10^n), the number of shelves inside that approximation's error radius, and the exact address collapsed (k7f2q…AZ2) with expand/copy.
6. Search: normalise input to the 25-symbol alphabet, place at a random offset amid random characters, land on that page; show magnitude-form count of all pages containing the text.
7. Address maps to a fixed 3D layout (floor, row, column) on a 3-torus; directions from the ground-floor origin show displacement up/north/east in real units (hexagon ≈ 5.2 m, floor ≈ 3.5 m), scaling to light-years.
8. All tunable constants in one labelled module: page geometry (410/40/80), alphabet (25), shelves/books per hexagon, hexagon width, floor height, torus axis sizes, cipher key.
9. Cipher key is a fixed public constant; an address renders the same page forever.
10. Random button: uniform over all 25^3,200 pages.
11. Navigation: step prev/next page, volume, shelf, wall, hexagon; all state in the URL.
12. Hexagon count is exactly ⌈25^3,200 / 262,400⌉; the final hexagon is partly empty (Bloch's divisibility problem) and is a visitable location.

Stack (from design.md): esbuild, Mithril, ../../cycle for URL state.

## Implementation plan (not yet approved as design — build-time notes)

### Core maths (pure modules, no UI)

- `constants.ts` — item 8. Torus axes: pick FLOORS × ROWS × COLS ≥ ⌈25^3200 / 262,400⌉,
  each axis ≈ cube root (~10^1,489), exact values computed once and pinned as literals.
- `bigint.ts` — helpers: base-36 encode/decode, decimal magnitude (leading digits + exponent),
  uniform random BigInt below N (rejection sampling over crypto.getRandomValues).
- `cipher.ts` — the PRP over Z_(25^3200):
  - Feistel over a slightly larger power-of-2 domain with cycle-walking back into range,
    OR split-domain Feistel on digit halves (1600 base-25 digits each side),
    round function = SHA-256 (WebCrypto) of (key ‖ round ‖ half), ~8–10 rounds.
  - Must implement both encrypt (index → page-number) and decrypt (page-number → index).
  - Test: round-trip identity on random samples; distinct outputs; fixed vectors pinned.
- `page.ts` — page-number ↔ 3,200-char string over the alphabet (base-25 digits ↔ chars).
- `position.ts` — index ↔ (hexagon, wall, shelf, volume, page) mixed-radix;
  hexagon ↔ (floor, row, col) on the torus; final-hexagon raggedness handled here
  (positions past 25^3200 don't exist; guard navigation).
- `directions.ts` — (floor,row,col) → shortest wrap-around displacement from origin;
  metres → human units ladder (m, km, light-seconds, ly, multiples of observable universe).
- `search.ts` — normalise text → alphabet; random offset + random fill → page string →
  decrypt to index; count formula: (3200 − len + 1) × 25^(3200 − len) approx, magnitude form.

### UI (Mithril)

- Single page view: 40×80 monospace grid; position panel (item 5); directions panel;
  nav steppers (item 11); random button; search box.
- cycle keeps ?address=…&wall=…&shelf=…&vol=…&page=… in the URL (address is the
  ~4,500-char base-36 hexagon name — verify cycle and browsers tolerate it; if the full
  query string is a problem, fall back to location.hash).

### Open implementation questions (raise during build, one at a time)

- Cycle-walking Feistel vs split-digit Feistel (bias vs simplicity).
- Address base: base-36 vs an alphabetic-only base (aesthetics of hexagon names).
- Exact torus axis factorisation.
- Whether wall/shelf/vol/page live inside the one address number or as separate URL params
  (leaning separate: only the hexagon name is huge).

### Slice order (≤~40 lines each, present-observe-adjust)

1. constants + bigint helpers, with tests.
2. page.ts codec (number ↔ text) + tests.
3. cipher.ts encrypt/decrypt + round-trip tests + pinned vectors.
4. position.ts mixed-radix + torus mapping + tests.
5. Minimal Mithril shell: render the page for a hard-coded address.
6. URL state via cycle; random button.
7. Position display panel (magnitude, shelf error radius, collapsed address).
8. Navigation steppers.
9. search.ts + search UI.
10. directions.ts + directions panel.
11. Final hexagon guard rails + the "end of the Library" page.
