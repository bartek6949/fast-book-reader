import {PDFDocumentProxy} from "pdfjs-dist";
import {computed, signal} from "@angular/core";
import {Pages} from "../../books/book";
import "../../../pkg/string";
export class ParsedBookContent {
  constructor(public content: string[],
              public pages: Pages) {
  }
}

export class BookParser {
  currentPage = signal(0)
  allPages = signal(1)
  progress = computed(() => this.currentPage() / this.allPages())

  constructor(private pdfDocument: PDFDocumentProxy, private pdf: File) {

  }

  name(): string {
    return this.pdf.name;
  }

  public async parse(): Promise<ParsedBookContent> {
    let content: string[] = [];
    const pages = this.pdfDocument.numPages;
    const pagesInfo: Pages = [];
    this.allPages.update(_ => pages);

    //TODO ad async load pages...
    for (let i = 1; i <= pages; i++) {
      try {
        console.log("Parsing page " + i);
        const page = await this.pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        const pageContent:string[][] = textContent.items.map((item: any) => item.str.escape().split(" "));
        const cleared:string[] = ([] as string[]).concat(...pageContent).map(it =>  it.trim()).filter(it => it.length > 0)

        content.push(...cleared)

        pagesInfo.push({
          page: i,
          start: content.length - cleared.length,
          end: content.length
        });

        page.cleanup()

        this.currentPage.update(_ => i);
      } catch (e) {
        console.error(e);
      }
    }
    await this.pdfDocument.cleanup();
    return new ParsedBookContent(
      content,
      pagesInfo
    );
  }

}
