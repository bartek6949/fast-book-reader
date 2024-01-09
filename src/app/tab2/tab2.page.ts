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
    setTimeout(() =>
      (<any>document).querySelector(".selected").scrollIntoView()
  , 1);
  }

  updatePosition($event: any) {

    const selection = (<any>window).getSelection();
    console.log($event, selection);

    let addP = 0;
    let node = selection.anchorNode.previousSibling;

    if(!node && selection.anchorNode.parentNode.nodeName === "SPAN") {
      return;
    }

    let longText = "";

    while (node){
      longText += node.textContent
      node = node.previousSibling;
    }

    longText += selection.anchorNode.textContent.substring(0, selection.baseOffset);

    addP = longText.split(" ").length-1;

    this.book?.position.update(_ => addP);
  }

}
