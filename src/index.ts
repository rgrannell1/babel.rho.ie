import { GoodreadsClient } from "./goodreads.ts";
import { UserInfoReader } from "./readers.ts";
import { Render } from "./render.ts";
import { BabelDatabase } from "./database.ts";
import { OpenLibraryClient } from "./open-library.ts";

const renderer = new Render();

const userInfo = new UserInfoReader("books.yaml");
const userData = await userInfo.read();

const db = new BabelDatabase('babel.db');
const good = new GoodreadsClient();
const openlib = new OpenLibraryClient();

export async function fetchCovers() {
  for (const cover of db.getCovers()) {
    const url = openlib.getCoverURL(cover.isbn || cover.isbn13);

    if (cover.content) {
      continue;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const res = await openlib.getCover(cover.isbn || cover.isbn13);
      const updatedCover = {
        ...cover,
        url: url,
        content: await res.text(),
      }

      db.addCover(updatedCover);
    } catch (err) {
      console.error(err);
      continue;
    }

  }
}

export async function writeDist() {
  await Deno.mkdir("./dist", { recursive: true });

  await Promise.all([
    Deno.writeTextFile("./dist/quotes.html", renderer.quotes(userData.quotes)),
    Deno.writeTextFile("./dist/index.html", renderer.index()),
    Deno.writeTextFile("./dist/books.html", renderer.read(db.read())),
  ]);

  await Deno.mkdir("./dist/css", { recursive: true });
  for await (const file of Deno.readDir("./src/css")) {
    await Deno.copyFile(`./src/css/${file.name}`, `./dist/css/${file.name}`);
  }
}

export async function fromGoodreads() {
  for await (const book of good.readCSV()) {
    db.addGoodreadsBook(book);
  }
}
