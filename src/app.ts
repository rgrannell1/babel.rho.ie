// @ts-types="npm:@types/mithril@^2"
import m from 'mithril'
import katex from 'katex'
import { encrypt } from './cipher.ts'
import { pageToText } from './page.ts'
import { CHARS_PER_LINE, DEFAULT_QUOTE, LINES_PER_PAGE, TOTAL_PAGES } from './constants.ts'
import { hexagonToTorus, indexToPosition, type Position, positionToIndex } from './position.ts'
import { step, type StepUnit } from './navigate.ts'
import { findText, normalise, pagesContaining } from './search.ts'
import { displacement, distanceParts, durationParts, walkSeconds } from './directions.ts'

function TeX(latex: string) {
  return m.trust(katex.renderToString(latex, { throwOnError: false }))
}

function TeXAmount(amount: string | bigint) {
  return TeX(typeof amount === 'bigint' ? magnitudeLatex(amount) : amount)
}
import { paramsToPosition, positionToParams } from './state.ts'
import { randomBelow, toBase36 } from './bignum.ts'
import { collapseAddress, magnitudeLatex } from './display.ts'

const state = {
  position: null as Position | null,
  lines: [] as string[],
  expanded: { hexagon: false, floor: false },
}

async function showPosition(position: Position, pushHistory: boolean) {
  state.position = position
  state.expanded = { hexagon: false, floor: false }
  if (pushHistory) {
    history.pushState(null, '', '?' + positionToParams(position).toString())
  }
  const text = pageToText(await encrypt(positionToIndex(position)))
  state.lines = Array.from(
    { length: LINES_PER_PAGE },
    (_, lineIndex) => text.slice(lineIndex * CHARS_PER_LINE, (lineIndex + 1) * CHARS_PER_LINE),
  )
  m.redraw()
}

function syncFromUrl() {
  try {
    const position = paramsToPosition(globalThis.location.search.slice(1))
    positionToIndex(position) // rejects positions past the final hexagon's last shelf
    showPosition(position, false)
  } catch {
    // No (or broken) address: no page selected. The default quote waits in
    // the search box for the visitor's first move.
    state.position = null
    state.lines = []
    searchState.input = DEFAULT_QUOTE.join(' ')
    searchState.found = null
    searchState.error = ''
    m.redraw()
  }
}

function randomPage() {
  searchState.input = ''
  searchState.found = null
  searchState.error = ''
  searchState.sequence++ // cancel any in-flight search
  showPosition(indexToPosition(randomBelow(TOTAL_PAGES)), true)
}

// The about text lives in the Library, of course. Load it into the search
// field and let the search find one of its pages.
let aboutText: string | null = null

async function showAbout() {
  if (aboutText === null) {
    const response = await fetch('prose.md')
    aboutText = (await response.text()).trim()
  }
  searchState.input = aboutText
  runSearch()
}

function stepTo(unit: StepUnit, direction: 1 | -1) {
  if (state.position === null) return
  const index = step(positionToIndex(state.position), unit, direction)
  showPosition(indexToPosition(index), true)
}

const searchState = {
  input: '',
  error: '',
  found: null as { normalised: string; count: bigint; seconds: string } | null,
  sequence: 0,
}

// Fires on every keystroke; the sequence guard drops stale results so a
// slow early search can't overwrite a later one.
async function runSearch() {
  const sequence = ++searchState.sequence
  if (normalise(searchState.input).length === 0) {
    searchState.found = null
    searchState.error = ''
    return
  }
  try {
    const started = performance.now()
    const { index, normalised } = await findText(searchState.input)
    const seconds = ((performance.now() - started) / 1000).toFixed(1)
    if (sequence !== searchState.sequence) return
    searchState.found = { normalised, count: pagesContaining(normalised.length), seconds }
    searchState.error = ''
    showPosition(indexToPosition(index), false)
  } catch (error) {
    if (sequence !== searchState.sequence) return
    searchState.error = (error as Error).message
    searchState.found = null
    m.redraw()
  }
}

function SearchBox() {
  return m('div.search', [
    m('textarea', {
      rows: 2,
      placeholder: 'find text in the Library…',
      value: searchState.input,
      oninput: (event: InputEvent) => {
        searchState.input = (event.target as HTMLTextAreaElement).value
        runSearch()
      },
    }),
    searchState.error && m('p.search-message', searchState.error),
    searchState.found && m('p.search-message', [
      'found ',
      TeX(magnitudeLatex(searchState.found.count)),
      ` matching pages in ${searchState.found.seconds}s`,
    ]),
  ])
}

function AddressRow(label: 'hexagon' | 'floor', value: bigint) {
  const encoded = toBase36(value)
  return m('div.address-row', [
    `${label} `,
    m(
      'code.address',
      {
        title: state.expanded[label] ? 'click to collapse' : 'click to expand',
        onclick: () => state.expanded[label] = !state.expanded[label],
      },
      state.expanded[label] ? encoded : collapseAddress(encoded),
    ),
    m('button', { onclick: () => navigator.clipboard.writeText(encoded) }, 'copy'),
  ])
}

function SectionLabel(text: string) {
  return m('h2.section-label', text)
}

function PositionPanel() {
  const { hexagon, wall, shelf, volume, page } = state.position
  const { floor } = hexagonToTorus(hexagon)
  return m('section.position', [
    SectionLabel('address'),
    m('div', `wall ${wall}, shelf ${shelf}, volume ${volume}, page ${page}`),
    AddressRow('hexagon', hexagon),
    AddressRow('floor', floor),
  ])
}

function DirectionsPanel() {
  const legs = displacement(state.position.hexagon)
  if (legs.length === 0) {
    return m('section.directions', [
      SectionLabel('directions'),
      'you are at the origin hexagon, on the ground floor',
    ])
  }
  const total = legs.reduce((sum, leg) => sum + leg.decimetres, 0n)
  const vertical = legs.find((leg) => leg.direction === 'up' || leg.direction === 'down')
  const horizontal = legs.filter((leg) => leg !== vertical)
  const distance = distanceParts(total)
  const walk = durationParts(walkSeconds(total))
  return m('section.directions', [
    SectionLabel('directions'),
    vertical && m('div', [
      vertical.direction === 'up' ? 'climb ~' : 'descend ~',
      TeXAmount(vertical.hexagons),
      ' floors',
    ]),
    horizontal.map((leg) =>
      m('div', ['walk ', TeXAmount(leg.hexagons), ` hexagons ${leg.direction}`])
    ),
    m('div.distance-summary', [
      `it's about `,
      TeXAmount(distance.amount),
      ` ${distance.unit} away (`,
      TeXAmount(walk.amount),
      ` ${walk.unit} at a quick pace)`,
    ]),
  ])
}

// The book page, with the found search text in bold. Offsets shift by one
// newline per line when mapping the flat page onto the rendered text.
function BookPage() {
  const joined = state.lines.join('\n')
  const match = searchState.found?.normalised
  const flat = state.lines.join('')
  const start = match ? flat.indexOf(match) : -1
  if (!match || start === -1) {
    return m('pre.page', joined)
  }
  const mapOffset = (offset: number) => offset + Math.floor(offset / CHARS_PER_LINE)
  const from = mapOffset(start)
  const to = mapOffset(start + match.length)
  return m('pre.page', [
    joined.slice(0, from),
    m('strong', joined.slice(from, to)),
    joined.slice(to),
  ])
}

const PageView = {
  view() {
    return m('main', [
      m('h1', 'The Library of Babel'),
      m('nav', [
        m('button', { onclick: randomPage }, 'random page'),
        ' ',
        m('button', { onclick: showAbout }, 'about'),
      ]),
      SearchBox(),
      PositionPanel(),
      DirectionsPanel(),
      m(
        'div.book-header',
        `wall ${state.position.wall} · shelf ${state.position.shelf} · volume ${state.position.volume}`,
      ),
      m('div.book', [
        m('button.page-turn.prev', {
          onclick: () => stepTo('page', -1),
          title: 'previous page',
        }, '‹'),
        BookPage(),
        m('button.page-turn.next', {
          onclick: () => stepTo('page', 1),
          title: 'next page',
        }, '›'),
      ]),
      m('div.page-number', `· ${state.position.page} ·`),
    ])
  },
}

m.mount(document.body, PageView)
globalThis.addEventListener(
  'popstate',
  async () => showPosition(await positionFromUrl(), false),
)
positionFromUrl().then((position) => showPosition(position, false))
