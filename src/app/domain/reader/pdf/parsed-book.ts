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
    const pages = this.pdfDocument.numPages;
    this.allPages.update(_ => pages);
    let content: string[] = [];
    for (let i = 1; i <= pages; i++) {
      console.log("Parsing page " + i);
      const page = await this.pdfDocument.getPage(i)
      const textContent = await page.getTextContent();
      const pageContent = textContent.items.map((item: any) => item.str.split(" "));
      content = content.concat(...pageContent);

      page.cleanup()
      this.currentPage.update(_ => i);
    }
    await this.pdfDocument.cleanup();
    return content;
  }

}
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
