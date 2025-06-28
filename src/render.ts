import { render } from "./deps.ts";
import type { Book, Quote } from "./types.ts";

const QUOTES_TEMPLATE = await Deno.readTextFile(
  "./src/templates/quotes.html.mustache",
);
const INDEX_TEMPLATE = await Deno.readTextFile(
  "./src/templates/index.html.mustache",
);
const READ_TEMPLATE = await Deno.readTextFile(
  "./src/templates/read.html.mustache",
);

const COMMON_HEADERS = await Deno.readTextFile("./src/templates/headers.html");

export class Render {
  quotes(quotes: Quote[]) {
    return render(QUOTES_TEMPLATE, {
      quotes,
      COMMON_HEADERS,
    });
  }
  index() {
    return render(INDEX_TEMPLATE, {
      COMMON_HEADERS,
    });
  }
  read(books: Book[]) {
    return render(READ_TEMPLATE, {
      COMMON_HEADERS,
      read: books.map((book) => {
        return { ...book, title: "Testing" };
      }),
    });
  }
}
