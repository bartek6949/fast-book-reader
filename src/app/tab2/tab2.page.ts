import {Component, computed, signal, Signal} from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {BooksService} from "../domain/books/books.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {addIcons} from "ionicons";
import {caretBack, playCircle, arrowBack, copy, add} from "ionicons/icons";
import {Book, Pages} from "../domain/books/book";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {CdkVirtualForOf, CdkVirtualScrollViewport, ScrollingModule} from "@angular/cdk/scrolling";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import "../pkg/string";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons, IonFooter, IonTabs, IonTabBar, IonTabButton, IonIcon, AsyncPipe, NgIf, NgForOf, NgClass, RouterLink, ScrollingModule, CdkVirtualScrollViewport, CdkVirtualForOf],
})
export class Tab2Page {

  book: Book | undefined;
  textContent: string[] = ["Loading..."];
  progress!: Signal<number>;
  position: Signal<number> = signal(0);
  loaded = false;
  textContentToDisplay?: Signal<SafeHtml> = undefined;

  constructor(
    private bookService: BooksService,
    private router: ActivatedRoute,
    private sanitized: DomSanitizer,
  ) {
    addIcons({caretBack, playCircle, arrowBack})
    this.loadContent();
  }

  private async loadContent() {
    const book = this.bookService.getBook(this.router.snapshot.params['id']);
    if (!book) {
      setTimeout(() => this.loadContent(), 500);
      return;
    }
    this.book = book;
    this.textContent = await this.bookService.getContent(book);

    this.textContentToDisplay = computed(() => {
      const text = [...this.textContent]
      text[this.position()] = `<span class="selected">${text[this.position()]}</span>`
      return this.sanitized.bypassSecurityTrustHtml(text.join(' '));
    })

    this.position = book.position;
    this.progress = computed(() => {
        const progress = book.progress();
        return Math.ceil(progress * 100);
      }
    );
    this.loaded = true;
  }

  updatePosition($event: any) {
    console.log($event);
    const selection = (<any>window).getSelection();
    debugger;
    const range = selection.getRangeAt(0);
    console.log(range);
    let context;
    let addP = 0;
    if (range.startContainer.previousElementSibling != null) {
      //should find after position
      context = [...this.textContent].slice(this.position() + 1);
      addP = this.position() + 1;
    } else if (range.startContainer.parentElement.nodeName === 'SPAN') {
      return;
    } else {
      //should find begin from start
      context = this.textContent;
      addP = 0;
    }

    console.log({
      addP,
      a: range.getClientRects(),
      o:range.startOffset,
      start: {s: range.startContainer.previousElementSibling, o: range.startOffset},
      s: range.startContainer,
      text: this.textContent.slice(8459, 8459+50),
    });

    let offset = 1;

    for (let elem of context) {
      offset += elem.unescape().length + 1;

      if (offset >= range.startOffset) {
        this.book?.position.update(_ => addP);
        console.log({addP});
        break
      }
      addP++;
    }
  }

}
