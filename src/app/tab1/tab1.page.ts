import {
  AfterViewChecked,
  AfterViewInit,
  Component,
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
  IonLabel, IonText, IonNote, IonFab, IonFabButton, IonItemOptions, IonItemOption, IonItemSliding, IonProgressBar
} from '@ionic/angular/standalone';
import {ExploreContainerComponent} from '../explore-container/explore-container.component';
import {BooksService} from "../domain/books/books.service";
import {Book} from "../domain/books/book";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {addIcons} from 'ionicons';
import {add, chevronForward, trash} from 'ionicons/icons';
import {toObservable} from "@angular/core/rxjs-interop";
import {last, Observable, take} from "rxjs";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonList, IonItem, IonIcon, IonLabel, IonText, IonNote, NgForOf, AsyncPipe, IonFab, IonFabButton, RouterLink, IonItemOptions, IonItemOption, IonItemSliding, NgIf, DatePipe, IonProgressBar],
})
export class Tab1Page {
  public books: Signal<Book[]>;
  @ViewChild('fileInput')
  fileInput!: ElementRef;


  constructor(
    private booksService: BooksService,
  ) {
    this.books = this.booksService.getBooks();
    addIcons({add, chevronForward, trash});

  }


  doFileInput($event: Event) {
    // @ts-ignore
    const files = ($event.target as HTMLInputElement).files ?? [];

    for(let i = 0; i < files.length; i++) {
      this.booksService.addBook(files[i]);
    }

    // clear the input
    this.fileInput.nativeElement.value = "";
  }

  remove(id: string) {
    this.booksService.removeBook(id);
    console.log(this.books())
  }
}
