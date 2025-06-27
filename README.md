# babel.rgrannell.xyz

This Goodreads-replacement stores:

- Books / Literature I've read
- Ones I'd like to read
- My current progress through literature
- Blogs I've read (via content-based highlighting)
- Highlights from each book
- Quotations

It sources data from other data-sources, rather than relying on manual curation.
It interfaces with Kindle highlights and Kobo highlights. Ideally it's POSSE, so
I can publish back to Goodreads (through the public API is not supported
anymore).

Literature is political and personal, so the site has to be at least as secure
from public view as Goodreads. On the other hand, the ability to share is
important.

## Architecture

- Local CLI-based build process
- Protected behind a single basic-auth password
- Reads from Kobo Sqlite
- Reads from Kindle's text file
- Reads a simple, single text file for reading / read details & personal
  metadata (toml?).
- Tag support (set + KV)
- Static, read-only website
- Supports Goodreads import
- Metadata-gathering component uses public APIs to fetch key book metadata
  (cover, author). Support for manual overrides as this data won't always be
  accurate.
- Local caching of this information
- Support for highlight & quote sharing (text-fragments links? hash-based
  content-ids + a key? tbd)
- SSR
- Activity feed
- PWA with prefetch, MPA but hopefully with smooth load changes?

## TODO

- set up yaml schema
