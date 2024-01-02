import { Injectable } from '@angular/core';

import * as PDFJS from 'pdfjs-dist';
// @ts-ignore
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'
import {ParsedBook} from "./parsed-book";
PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

@Injectable({
  providedIn: 'root'
})
export class ReaderService {

  constructor() { }

  async getParsedBook(pdf: File): Promise<ParsedBook> {
    const loadingTask = PDFJS.getDocument({ url: URL.createObjectURL(pdf) });
    const pdfDocument = await loadingTask.promise;
    return new ParsedBook(pdfDocument, pdf);
  }
}
