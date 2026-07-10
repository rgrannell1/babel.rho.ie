// @ts-types="npm:@types/mithril@^2"
import m from 'mithril'
import katex from 'katex'
import { encrypt } from './cipher.ts'
import { pageToText } from './page.ts'
import { CHARS_PER_LINE, DEFAULT_QUOTE, LINES_PER_PAGE, TOTAL_PAGES } from './constants.ts'
import { hexagonToFloorAddress, indexToPosition, type Position, positionToIndex } from './position.ts'
import { step, type StepUnit } from './navigate.ts'
import { findText, normalise, pagesContaining } from './search.ts'
import {
  displacement,
  distanceParts,
  durationParts,
  nearbyHexagonsToSearch,
  walkSeconds,
} from './directions.ts'

function TeX(latex: string) {
  return m.trust(katex.renderToString(latex, { throwOnError: false }))
}

function TeXAmount(amount: string | bigint) {
  return TeX(typeof amount === 'bigint' ? magnitudeLatex(amount) : amount)
}
import { paramsToPosition, positionToParams } from './state.ts'
import { randomBelow, toBase36 } from './bignum.ts'
import { collapseAddress, MAGNITUDE_DIGITS, magnitudeLatex, roundMagnitudeLatex } from './display.ts'

declare const ABOUT_TEXT_URL: string

const state = {
  position: null as Position | null,
  lines: [] as string[],
  expanded: { hexagon: false, floor: false },
}

type RouteUpdate = 'none' | 'push' | 'replace'

function positionUrl(position: Position) {
  return '?' + positionToParams(position).toString()
}

function clearPositionUrl() {
  history.replaceState(null, '', globalThis.location.pathname)
}

async function showPosition(position: Position, routeUpdate: RouteUpdate) {
  state.position = position
  state.expanded = { hexagon: false, floor: false }
  if (routeUpdate === 'push') {
    history.pushState(null, '', positionUrl(position))
  } else if (routeUpdate === 'replace') {
    history.replaceState(null, '', positionUrl(position))
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
    showPosition(position, 'none')
  } catch {
    // No (or broken) address: search for the default quote immediately so
    // the page, address, and directions are visible on first load.
    state.position = null
    state.lines = []
    searchState.input = DEFAULT_QUOTE.join(' ')
    searchState.found = null
    searchState.error = ''
    runSearch()
  }
}

function randomPage() {
  searchState.input = ''
  searchState.found = null
  searchState.error = ''
  searchState.sequence++ // cancel any in-flight search
  showPosition(indexToPosition(randomBelow(TOTAL_PAGES)), 'push')
}

// The about text lives in the Library, of course. Load it into the search
// field and let the search find one of its pages.
let aboutText: string | null = null

async function showAbout() {
  if (aboutText === null) {
    const response = await fetch(ABOUT_TEXT_URL)
    aboutText = (await response.text()).trim()
  }
  searchState.input = aboutText
  runSearch()
}

function stepTo(unit: StepUnit, direction: 1 | -1) {
  if (state.position === null) return
  const index = step(positionToIndex(state.position), unit, direction)
  showPosition(indexToPosition(index), 'push')
}

const searchState = {
  input: '',
  error: '',
  found: null as { normalised: string; count: bigint; seconds: string } | null,
  sequence: 0,
}

function fitSearchTextarea(textarea: HTMLTextAreaElement) {
  textarea.style.height = 'auto'
  textarea.style.height = `${textarea.scrollHeight}px`
}

// Fires on every keystroke; the sequence guard drops stale results so a
// slow early search can't overwrite a later one.
async function runSearch() {
  const sequence = ++searchState.sequence
  if (normalise(searchState.input).length === 0) {
    // Cleared: back to no page selected.
    searchState.found = null
    searchState.error = ''
    state.position = null
    state.lines = []
    clearPositionUrl()
    return
  }
  try {
    const started = performance.now()
    const { index, normalised } = await findText(searchState.input)
    const seconds = ((performance.now() - started) / 1000).toFixed(1)
    if (sequence !== searchState.sequence) return
    searchState.found = {
      normalised,
      count: pagesContaining(normalised.length),
      seconds,
    }
    searchState.error = ''
    showPosition(indexToPosition(index), 'replace')
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
      oncreate: (vnode: m.VnodeDOM) => fitSearchTextarea(vnode.dom as HTMLTextAreaElement),
      onupdate: (vnode: m.VnodeDOM) => fitSearchTextarea(vnode.dom as HTMLTextAreaElement),
      oninput: (event: InputEvent) => {
        const textarea = event.target as HTMLTextAreaElement
        searchState.input = textarea.value
        fitSearchTextarea(textarea)
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
    m('span.address-label', label),
    m(
      'code.address',
      {
        title: state.expanded[label] ? 'click to collapse' : 'click to expand',
        onclick: () => state.expanded[label] = !state.expanded[label],
      },
      state.expanded[label] ? encoded : collapseAddress(encoded),
    ),
  ])
}

function SectionLabel(text: string) {
  return m('h2.section-label', text)
}

function RoundAmount(amount: string | bigint) {
  return typeof amount === 'bigint' ? TeX(roundMagnitudeLatex(amount)) : amount
}

function MagnitudeApprox(amount: bigint) {
  return amount.toString().length > MAGNITUDE_DIGITS ? '≈ ' : ''
}

function RoundApprox(amount: string | bigint) {
  return typeof amount === 'bigint' && amount.toString().length > 2 ? '≈ ' : ''
}

function PositionPanel(position: Position) {
  const { hexagon, wall, shelf, volume, page } = position
  const address = hexagonToFloorAddress(hexagon)
  return m('section.position', [
    SectionLabel('address'),
    m('div.locus', [`wall ${wall}, shelf ${shelf}, volume ${volume}, `, m('em', 'page'), ` ${page}`]),
    AddressRow('hexagon', address.hexagon),
    AddressRow('floor', address.floor),
  ])
}

function DirectionsPanel(position: Position) {
  const legs = displacement(position.hexagon)
  if (legs.length === 0) {
    return m('section.directions', [
      SectionLabel('directions'),
      'you are at the origin hexagon, on the ground floor',
    ])
  }
  const total = legs.reduce((sum, leg) => sum + leg.decimetres, 0n)
  const nearby = nearbyHexagonsToSearch(legs)
  const vertical = legs.find((leg) => leg.direction === 'up' || leg.direction === 'down')
  const horizontal = legs.filter((leg) => leg !== vertical)
  const distance = distanceParts(total)
  const walk = durationParts(walkSeconds(total))
  return m('section.directions', [
    SectionLabel('directions'),
    vertical && m('div', [
      m('em.verb', vertical.direction === 'up' ? 'climb' : 'descend'),
      ' ',
      MagnitudeApprox(vertical.hexagons),
      TeXAmount(vertical.hexagons),
      ' floors',
    ]),
    horizontal.map((leg) =>
      m('div', [
        m('em.verb', 'walk'),
        ' ',
        MagnitudeApprox(leg.hexagons),
        TeXAmount(leg.hexagons),
        ` hexagons ${leg.direction}`,
      ])
    ),
    m('div.distance-summary', [
      RoundApprox(distance.amount),
      RoundAmount(distance.amount),
      ` ${distance.unit} away `,
      m('span.aside', [
        '(',
        RoundApprox(walk.amount),
        RoundAmount(walk.amount),
        ` ${walk.unit} at a quick pace)`,
      ]),
    ]),
    nearby > 1n && m('div.search-radius', [
      'our directions are imprecise. search ',
      RoundApprox(nearby),
      RoundAmount(nearby),
      ' nearby hexagons',
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
    const { position } = state
    return m('main', [
      m('h1', 'The Library of Babel'),
      m('nav', [
        m('button', { onclick: randomPage }, 'random page'),
        ' ',
        m('button', { onclick: showAbout }, 'about'),
      ]),
      SearchBox(),
      position !== null && [
        PositionPanel(position),
        DirectionsPanel(position),
        m(
          'div.book-header',
          `wall ${position.wall} · shelf ${position.shelf} · volume ${position.volume}`,
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
        m('div.page-number', `· ${position.page} ·`),
      ],
    ])
  },
}

m.mount(document.body, PageView)
globalThis.addEventListener('popstate', syncFromUrl)
syncFromUrl()
