import config from "./config.ts";

export class OpenLibraryClient {
  // as requested
  userAgent() {
    return `${config.OPENAPI_APPLICATION}:${config.OPENAPI_EMAIL}`;
  }

  getCoverURL(isbn: string, size: string = "L") {
    return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`
  }

  async getCover(isbn: string, size: string = "L") {
    const url = this.getCoverURL(isbn, size);
    const response = await fetch(url, {
      headers: {
        "User-Agent": this.userAgent(),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cover for ISBN ${isbn}: ${response.statusText}`);
    }

    return response.blob();
  }
}
