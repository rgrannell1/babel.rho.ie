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
