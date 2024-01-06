import {
  AfterViewChecked,
  AfterViewInit,
  Component, computed,
  ElementRef,
  OnInit,
  Signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonText,
  IonNote,
  IonFab,
  IonFabButton,
  IonItemOptions,
  IonItemOption,
  IonItemSliding,
  IonProgressBar,
  IonModal, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonFooter, IonTabBar, IonTabButton
} from '@ionic/angular/standalone';
import {ExploreContainerComponent} from '../explore-container/explore-container.component';
import {BooksService} from "../domain/books/books.service";
import {Book} from "../domain/books/book";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {addIcons} from 'ionicons';
import {add, chevronForward, trash, settings} from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonList, IonItem, IonIcon, IonLabel, IonText, IonNote, NgForOf, AsyncPipe, IonFab, IonFabButton, RouterLink, IonItemOptions, IonItemOption, IonItemSliding, NgIf, DatePipe, IonProgressBar, IonModal, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonFooter, IonTabBar, IonTabButton],
})
export class Tab1Page {
  public books: Signal<Book[]>;
  @ViewChild('fileInput')
  fileInput!: ElementRef;
  isModalOpen: boolean = false;
  loadingBookName: Signal<string|null>
  loadingBookProgress: Signal<number|null>;


  constructor(
    private booksService: BooksService,
  ) {
    this.books = this.booksService.getBooks();
    addIcons({add, chevronForward, trash, settings});

    this.loadingBookName = computed(() => {
      const book = this.booksService.currentLoadedBook();
      return book ? book.name(): '';
    });

    this.loadingBookProgress = computed(() => {
      const book = this.booksService.currentLoadedBook();
      return book ? book.progress() : 0;
    });

  }


  async doFileInput($event: Event) {
    // @ts-ignore
    const files = ($event.target as HTMLInputElement).files ?? [];
    this.isModalOpen = true;
    for(let i = 0; i < files.length; i++) {
     await this.booksService.addBook(files[i]);
    }

    this.isModalOpen = false;

    // clear the input
    this.fileInput.nativeElement.value = "";
  }

  remove(id: string) {
    this.booksService.removeBook(id);
    console.log(this.books())
  }
}
