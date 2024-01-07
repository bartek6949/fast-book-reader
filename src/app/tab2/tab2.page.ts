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
import {ExploreContainerComponent} from '../explore-container/explore-container.component';
import {ReaderService} from "../domain/reader/pdf/reader.service";
import {BooksService} from "../domain/books/books.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {addIcons} from "ionicons";
import {caretBack, playCircle, arrowBack, copy} from "ionicons/icons";
import {Book, Pages} from "../domain/books/book";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {CdkVirtualForOf, CdkVirtualScrollViewport, ScrollingModule} from "@angular/cdk/scrolling";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonBackButton, IonButtons, IonFooter, IonTabs, IonTabBar, IonTabButton, IonIcon, AsyncPipe, NgIf, NgForOf, NgClass, RouterLink, ScrollingModule, CdkVirtualScrollViewport, CdkVirtualForOf]
})
export class Tab2Page {

  book: Book|undefined;
  textContent: string[] = ["Loading..."];
  progress!: Signal<number>;
  position: Signal<number> = signal(0);
  loaded = false;

  constructor(
    private bookService: BooksService,
    private router: ActivatedRoute,
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

    this.position = book.position;
    this.progress = computed(() => {
      const progress = book.progress();
       return Math.ceil(progress*100);
      }
    );
    this.loaded = true;
  }

  updatePosition(e: Event) {
    const selection = (<any>window).getSelection();
    const range = selection.getRangeAt(0);
    console.log({p:range, e:e});
    console.log({w: this.getTextContent2().slice(range.startOffset, range.endOffset)})
    this.book?.position.update(_ => 10);
  }

  update(p: number) {
    this.book?.position.update(_ => p);
  }
  public getTextContent2() {
    const r = [...this.textContent];
    r[this.book?.position() || 0] = '<span class="selected">' + r[this.book?.position() || 0] + '</span>';
    return r.join(' ');
  }
}
