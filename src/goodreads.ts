
import { parseCSV } from "./deps.ts";
import type { GoodreadsBook } from "./types.ts";

export class GoodreadsClient {
  private csvPath: string;

  constructor(csvPath: string = "data/goodreads_library_export.csv") {
    this.csvPath = csvPath;
  }

  normaliseRecord(book: Record<string, string>): GoodreadsBook {
    let rating = ''
    if (book['My Rating']) {
      const ratingNumber = parseInt(book["My Rating"] ?? "0", 10) || 0;
      rating = "⭐".repeat(ratingNumber);
    }
    const isbnMatch = (book["ISBN"] || "").match(/"(\d+)"/);
    const isbn = isbnMatch ? isbnMatch[1] : "";

    const isbn13Match = (book["ISBN13"] || "").match(/"(\d+)"/);
    const isbn13 = isbn13Match ? isbn13Match[1] : "";

    return {
      id: book['Book Id'],
      title: book['Title'],
      author: book['Author'],
      isbn,
      isbn13,
      rating,
      pages: book['Number of Pages'],
      status: book['Exclusive Shelf'],
      dateRead: book['Date Read'],
    };
  }

  async* readCSV(): AsyncGenerator<GoodreadsBook, void, unknown> {
    const csvContent = await Deno.readTextFile(this.csvPath);
    const records = parseCSV(csvContent, {
      skipFirstRow: false
    });

    const headers = records[0] as string[];

    for (let ith = 1; ith < records.length; ith++) {
      const row = records[ith] as string[];
      const record: Record<string, string> = {};

      for (let jth = 0; jth < headers.length; jth++) {
        record[headers[jth]] = row[jth] || "";
      }

      yield this.normaliseRecord(record);
    }
  }
}
