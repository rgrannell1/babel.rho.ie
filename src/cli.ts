import { docopt } from "./deps.ts";
import { fromGoodreads, writeDist, fetchCovers } from "./index.ts";

const doc = `
  Babel

   ⬢ ⬢
  ⬢ ⬡ ⬢
   ⬢ ⬢

Usage:
  babel build
  babel from_goodreads
  babel (-h | --help)
  babel --version

Commands:
  build     Build the static website from books.yaml

Options:
  -h --help     Show this screen.
  --version     Show version.
`;

async function main() {
  const args = docopt(doc, { version: "1.0.0" });

  if (args.build) {
    await fetchCovers();
    await writeDist();
  } else if (args.from_goodreads)  {
    await fromGoodreads();
  }
}

if (import.meta.main) {
  main();
}
