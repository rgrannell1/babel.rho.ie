import { DB } from "https://deno.land/x/sqlite/mod.ts";
import type { GoodreadsBook, Cover } from "./types.ts";

export class BabelDatabase {
  private db: DB;

  constructor(filename = "goodreads.db") {
    this.db = new DB(filename);
    this.init();
  }

  private init() {
    this.db.execute(`
      create table if not exists goodreads_books (
        id text primary key,
        title text,
        author text,
        isbn text,
        isbn13 text,
        rating text,
        pages text,
        status text,
        dateread text
      )
    `);

    this.db.execute(`
      create table if not exists covers (
        url text,
        isbn text,
        isbn13 text,
        content blob,
        primary key (isbn, isbn13)
      )
    `);
  }

  addGoodreadsBook(book: GoodreadsBook) {
    this.db.query(
      "insert or ignore into goodreads_books (id,title,author,isbn,isbn13,rating,pages,status,dateread) values (?,?,?,?,?,?,?,?,?)",
      [
        book.id,
        book.title,
        book.author,
        book.isbn,
        book.isbn13,
        book.rating,
        book.pages,
        book.status,
        book.dateRead,
      ]
    );

    if (book.isbn || book.isbn13) {
      const existingCover = this.getCover(book.isbn || '', book.isbn13 || '');
      if (!existingCover) {
        this.db.query(
          "insert or ignore into covers (url, isbn, isbn13, content) values (?, ?, ?, ?)",
          ['', book.isbn || '', book.isbn13 || '', null]
        );
      }
    }
  }

  addGoodreadsBooks(books: GoodreadsBook[]) {
    books.forEach((book) => this.addGoodreadsBook(book));
  }

  read(): GoodreadsBook[] {
    const rows = this.db.query(
      "select id, title, author, isbn, isbn13, rating, pages, status, dateread from goodreads_books"
    );
    return rows.map(
      ([id, title, author, isbn, isbn13, rating, pages, status, dateRead]) => ({
        id,
        title,
        author,
        isbn,
        isbn13,
        rating,
        pages,
        status,
        dateRead,
      })
    );
  }

  addCover(cover: Cover): void {
    this.db.query(
      "insert or replace into covers (url, isbn, isbn13, content) values (?, ?, ?, ?)",
      [cover.url, cover.isbn, cover.isbn13, cover.content]
    );
  }

  getCover(isbn: string, isbn13: string): Cover | null {
    const rows = this.db.query(
      "select url, isbn, isbn13, content from covers where isbn = ? and isbn13 = ?",
      [isbn, isbn13]
    );

    if (rows.length === 0) return null;

    const [url, isbnResult, isbn13Result, content] = rows[0];
    return {
      url: url as string,
      isbn: isbnResult as string,
      isbn13: isbn13Result as string,
      content: content as Uint8Array
    };
  }

  getCovers(): Cover[] {
    const rows = this.db.query("select url, isbn, isbn13, content from covers");
    return rows.map(([url, isbn, isbn13, content]) => ({
      url: url as string,
      isbn: isbn as string,
      isbn13: isbn13 as string,
      content: content as Uint8Array
    }));
  }
}