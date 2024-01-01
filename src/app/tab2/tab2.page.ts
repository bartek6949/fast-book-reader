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
import {caretBack, playCircle, arrowBack} from "ionicons/icons";
import {Book} from "../domain/books/book";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonBackButton, IonButtons, IonFooter, IonTabs, IonTabBar, IonTabButton, IonIcon, AsyncPipe, NgIf, NgForOf, NgClass, RouterLink]
})
export class Tab2Page {

  book: Book|undefined;
  textContent: string[] = ["Loading..."];
  progress!: Signal<number>;
  position: Signal<number> = signal(0);
  loaded = false;

  constructor(
    private readerService: ReaderService,
    private bookService: BooksService,
    private router: ActivatedRoute,
    ) {
    addIcons({caretBack, playCircle, arrowBack})
    this.loadContent();
  }

  private async loadContent() {
    const book = this.bookService.getBook(this.router.snapshot.params['id']);
    if (!book) {
      return;
    }
    this.book = book;
    const parsedBookContent = await this.readerService.getParsedBook(book.content);

    this.textContent = await parsedBookContent.getContent();

    this.position = book.position;
    this.progress = computed(() => {
      const progress = book.progress();
       return Math.ceil(progress*100);
      }
    );
    this.loaded = true;
  }

  updatePosition(i: number) {
    this.book?.position.update(_ => i);
  }
}
