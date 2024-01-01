import {Injectable, signal, WritableSignal} from '@angular/core';
import {Book} from "./book";
import { v1 as uuidv1 } from 'uuid';
import { Storage } from '@ionic/storage-angular';
import {ReaderService} from "../reader/pdf/reader.service";

@Injectable(
  {providedIn: 'root'}
)
export class BooksService {
  private books :WritableSignal<Book[]> = signal([]);
  private storage: Storage | null = null;

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
    const length = await parsedBookContent.getLength();


    const newBook = new Book(
      uuidv1(),
      file.name,
      file,
      new Date(),
      length,
      0,
    );

    this.books.update(books => [...books, newBook]);
    await this.saveToStorage();
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
  }
}
