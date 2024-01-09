import {Component, computed, OnDestroy, signal, Signal, WritableSignal} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFooter,
  IonIcon,
  IonTabBar,
  IonTabButton
} from '@ionic/angular/standalone';
import {ReaderService} from "../domain/reader/pdf/reader.service";
import {BooksService} from "../domain/books/books.service";
import {ActivatedRoute, Router} from "@angular/router";
import {addIcons} from "ionicons";
import {playBackCircle, playForwardCircle} from "ionicons/icons";
import {Book} from "../domain/books/book";
import {NgForOf, NgIf} from "@angular/common";
import {SettingsService} from "../domain/settings/settings.service";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonIcon, IonTabBar, IonTabButton, NgForOf, NgIf],
})
export class Tab3Page {
  book: Book | undefined;
  textContent: string[] = ["Loading..."];
  progress!: Signal<number>;
  position: Signal<number> = signal(0);
  loaded = false;
  speed: WritableSignal<number>;
  wop: WritableSignal<number>
  private timer: any;

  constructor(
    private bookService: BooksService,
    private router: ActivatedRoute,
    private routerService: Router,
    private settingsService: SettingsService,
  ) {
    addIcons({playBackCircle, playForwardCircle})
    this.speed = this.settingsService.getWPM();
    this.wop = this.settingsService.getWOP();
  }

  async ionViewWillEnter() {
    await this.loadContent();
  }

  async ionViewDidEnter() {
    let time = new Date().getTime() + 2000; // 2 s start delay

    this.timer = setInterval(() => {
      if (!this.book) {
        return;
      }
      const now = new Date().getTime();

      if (now > time + 60 * 1000 / this.speed()*this.wop()) {
        this.book.position.update(position => {
          if (!this.book) {
            return position;
          }
          if (position > this.book.length) {
            clearInterval(this.timer);
            return position;
          }

          return position + this.wop();
        });
        time = now;
      }

    }, 0.5);
  }

  ionViewWillLeave(): void {
    clearInterval(this.timer);
  }

  private async loadContent() {
    const book = this.bookService.getBook(this.router.snapshot.params['id']);
    if (!book) {
      setTimeout(() => {
        this.loadContent();
      }, 500);
      return;
    }
    this.book = book;
    this.textContent = await this.bookService.getContent(book);

    this.position = book.position;

    this.loaded = true;
  }

  public increase() {
    this.settingsService.updateWPM(Math.min(this.speed() + 10, 1000));
  }

  decrease() {
    this.settingsService.updateWPM(Math.max(this.speed() - 10, 10));
  }

  goBack() {
    this.routerService.navigate(['/', 'book', this.book?.id]);
  }
}
