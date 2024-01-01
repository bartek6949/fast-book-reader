import {PDFDocumentProxy} from "pdfjs-dist";

export class ParsedBook {
  constructor(private pdfDocument: PDFDocumentProxy) {

  }

  public async getLength(): Promise<number> {
    const content = await this.getContent();
    return content.length;
  }

  public async getContent(): Promise<string[]> {
    const pages = this.pdfDocument.numPages;
    let content: string[] = [];
    for(let i = 1; i <= pages; i++) {
      console.log("Parsing page " + i);
      const page = await this.pdfDocument.getPage(i)
      const textContent = await page.getTextContent();
      const pageContent = textContent.items.map((item:any) => item.str.split(" "));
      content = content.concat(...pageContent);
      page.cleanup()
    }
    await this.pdfDocument.cleanup();
    return content;
  }

}
