import { Injectable } from '@angular/core';
import {BookParser} from "./book-parser";

import * as PDFJS from 'pdfjs-dist/legacy/build/pdf';

// @ts-ignore
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
//PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const workerCodeURL = URL.createObjectURL(new Blob(
  ['importScripts("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.js")'],
  { type: 'text/javascript' }
)) //same origin policy for worker urls
const p = PDFJS.GlobalWorkerOptions.workerPort = new Worker(workerCodeURL);
URL.revokeObjectURL(workerCodeURL)
p.addEventListener('DocException', it => console.warn(it))


@Injectable({
  providedIn: 'root'
})
export class ReaderService {

  constructor() { }

  async getParsedBook(pdf: File): Promise<BookParser> {
    const loadingTask = PDFJS.getDocument({
      url: URL.createObjectURL(pdf),
      stopAtErrors: false,
      enableXfa: true,
      disableFontFace: true,
      useSystemFonts: true,
    });

    const pdfDocument = await loadingTask.promise;

    return new BookParser(pdfDocument, pdf);
  }
}
