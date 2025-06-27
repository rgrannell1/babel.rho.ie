import config from "./config.ts";

export class OpenLibraryClient {
  // as requested
  userAgent() {
    return `${config.OPENAPI_APPLICATION}:${config.OPENAPI_EMAIL}`;
  }
}
