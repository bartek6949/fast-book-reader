import {computed, Signal, signal, WritableSignal} from "@angular/core";

export class Book {
  #position: WritableSignal<number> = signal(0);

  constructor(
    private _id: string,
    private _title: string,
    private _content: File,
    private _createdAt: Date = new Date(),
    private _length: number = 0,
    position: number = 0,
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


  get id(): string {
    return this._id;
  }

  get length(): number {
    return this._length;
  }


  get title(): string {
    return this._title;
  }

  get content(): File {
    return this._content;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  toJSON() {
    return {
      id: this._id,
      title: this._title,
      content: this._content,
      createdAt: this._createdAt,
      length: this._length,
      position: this.#position(),
    }
  }

  static fromJSON(json: any):Book {
    return new Book(
      json.id,
      json.title,
      json.content,
      json.createdAt,
      json.length,
      json.position,
    );
  }
}
