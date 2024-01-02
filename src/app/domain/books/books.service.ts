import {Injectable, signal, WritableSignal} from '@angular/core';
import {Book} from "./book";
import { v1 as uuidv1 } from 'uuid';
import { Storage } from '@ionic/storage-angular';
import {ReaderService} from "../reader/pdf/reader.service";
import {ParsedBook} from "../reader/pdf/parsed-book";

@Injectable(
  {providedIn: 'root'}
)
export class BooksService {
  private books :WritableSignal<Book[]> = signal([]);
  private storage: Storage | null = null;

  currentLoadedBook: WritableSignal<ParsedBook|null> = signal(null)

  constructor(
    private storageService: Storage,
    private readerService: ReaderService,
  ) {
    this.init()
  }

  async init() {
    console.log("Initializing storageService");
    this.storage = await this.storageService.create();
    const books = await this.storage.get('books');
    if (books) {
      const parsedBooks = books.map((book: any) => Book.fromJSON(book));
      this.books.update(_ => parsedBooks);
    }

    setInterval(async () => {
      //TODO refactor
      if(!this.storage) {
        throw new Error("Storage not initialized");
      }
      console.log("Saving to storage");
     await this.saveToStorage();
    }, 5000);
  }

  async addBook(file: File) {
    if(!this.storage) {
      throw new Error("Storage not initialized");
    }

    const parsedBookContent = await this.readerService.getParsedBook(file);
    this.currentLoadedBook.update(_ => parsedBookContent);
    const data = await parsedBookContent.parse();
    const length = data.length;

    const newBook = new Book(
      uuidv1(),
      file.name,
      new Date(),
      length,
      0,
    );

    this.books.update(books => [...books, newBook]);
    await this.saveToStorage();
    await this.storage.set(newBook.id, data);
  }

  private async saveToStorage() {
    if(!this.storage) {
      throw new Error("Storage not initialized");
    }
    await this.storage.set('books', this.books().map(book => book.toJSON()));
  }

  getBooks() {
    return this.books.asReadonly();
  }

  getBook(id: string): Book | undefined {
    return this.books().find(book => book.id === id);
  }

  async removeBook(id: string) {
    this.books.update(books => books.filter(book => book.id !== id));
    await this.saveToStorage();
    if(!this.storage) {
      throw new Error("Storage not initialized");
    }
    await this.storage.remove(id);
  }

  async getContent(book: Book): Promise<string[]> {
    const data = await this.storage?.get(book.id);
    return data || ["empty"];
  }
}
