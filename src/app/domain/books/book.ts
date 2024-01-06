import {computed, Signal, signal, WritableSignal} from "@angular/core";

export type Page = { page: number, start: number, end: number }

export type Pages = Page[]

export class Book {
  #position: WritableSignal<number> = signal(0);

  constructor(
    private _id: string,
    private _title: string,
    private _createdAt: Date = new Date(),
    private _length: number = 0,
    position: number = 0,
    private _pages: Pages = [],
  ) {
    this.#position.update(_ => position);
  }

  get position(): WritableSignal<number> {
    return this.#position;
  }

  get progress(): Signal<number> {
    return computed(() => {
      return this.#position() / this._length;
    });
  }

  get pages(): Pages {
    return this._pages;
  }


  get id(): string {
    return this._id;
  }

  get length(): number {
    return this._length;
  }

  get title(): string {
    return this._title;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

   getContent(p: number, content: string[]): string[] {
    const page = this.pages[p]
    return content.slice(page.start, page.end);
  }

  toJSON() {
    return {
      id: this._id,
      title: this._title,
      createdAt: this._createdAt,
      length: this._length,
      position: this.#position(),
      pages: this._pages,
    }
  }

  static fromJSON(json: any):Book {
    return new Book(
      json.id,
      json.title,
      json.createdAt,
      json.length,
      json.position,
      json.pages
    );
  }
}
