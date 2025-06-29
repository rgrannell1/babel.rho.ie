export interface Book {
  id: string;
  rating?: string;
  shelves?: string[];
  tags?: string[];
  notes?: string[];
  review?: string;
  readDates?: string[];
  progress?: string[];
}

export interface Quote {
  source: string;
  text: string;
}

export interface UserInfo {
  currentlyReading: Book[];
  read: Book[];
  quotes: Quote[];
}

export interface GoodreadsBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  isbn13: string;
  rating: string;
  pages: string;
  status: string;
  dateRead?: string;
}

export interface Cover {
  url: string;
  isbn: string;
  isbn13: string;
  content: Uint8Array;
}
