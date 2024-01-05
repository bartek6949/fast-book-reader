import {PDFDocumentProxy} from "pdfjs-dist";
import {computed, signal} from "@angular/core";

export class ParsedBook {
  currentPage = signal(0)
  allPages = signal(1)
  progress = computed(() => this.currentPage() / this.allPages())

  constructor(private pdfDocument: PDFDocumentProxy, private pdf: File) {

  }

  name(): string {
    return this.pdf.name;
  }

  public async parse(): Promise<string[]> {
    let content: string[] = [];
    const pages = this.pdfDocument.numPages;
    this.allPages.update(_ => pages);

    //TODO ad async load pages...
    for (let i = 1; i <= pages; i++) {
      try {
        console.log("Parsing page " + i);
        const page = await this.pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        const pageContent = textContent.items.map((item: any) => item.str.split(" "));
        content = content.concat(...pageContent);

        page.cleanup()

        this.currentPage.update(_ => i);
      } catch (e) {
        console.error(e);
      }
    }
    await this.pdfDocument.cleanup();
    return content.filter(it => it.trim().length > 0)
  }

}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
