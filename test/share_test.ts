// The full shared-link flow: a search builds a URL, and anyone opening that
// URL lands on the same page with the searched text actually on it. findText
// places the text at random, so the link must carry both position and text —
// re-searching on the recipient's side would land on a different page.

import { assertEquals, assertStringIncludes } from '@std/assert'
import { findText } from '../src/search.ts'
import { indexToPosition, positionToIndex } from '../src/position.ts'
import { paramsToState, stateToParams } from '../src/state.ts'
import { encrypt } from '../src/cipher.ts'
import { pageToText } from '../src/page.ts'

Deno.test('a shared search link reproduces the found page, text included', async () => {
  // The sharer searches; the app puts position and text in the URL.
  const { index, normalised } = await findText('Words without thoughts never to heaven go.')
  const url = '?' + stateToParams({ position: indexToPosition(index), text: normalised }).toString()

  // The recipient opens the link: same page, same search text.
  const shared = paramsToState(url.slice(1))
  assertEquals(positionToIndex(shared.position), index)
  assertEquals(shared.text, normalised)

  // And the page at that address really contains the text, so the
  // highlight has something to bold.
  const pageText = pageToText(await encrypt(positionToIndex(shared.position)))
  assertStringIncludes(pageText, normalised)
})
