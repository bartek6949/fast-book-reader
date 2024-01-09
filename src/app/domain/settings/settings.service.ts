import {Injectable, signal, WritableSignal} from '@angular/core';
import {Storage} from "@ionic/storage-angular";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  worldPerMinute:WritableSignal<number> = signal(200);
  worldsOnPage: WritableSignal<number> = signal(1);
  private storage?: Storage;
  constructor(private storageService: Storage) {
    this.init();
  }

  private async init() {
    this.storage = await this.storageService.create();
    const wpm = await this.storage.get('wpm');
    if (wpm) {
      this.worldPerMinute.update(_ => wpm);
    }
    const wop = await this.storage.get('wop');
    if (wop) {
      this.worldsOnPage.update(_ => wop);
    }
  }

  getWPM(): WritableSignal<number> {
    return this.worldPerMinute;
  }

  getWOP(): WritableSignal<number> {
    return this.worldsOnPage;
  }

  updateWPM(wpm: number) {
    this.worldPerMinute.update(_ => wpm);
    this.saveToStorage();
  }

  updateWOP(wop: number) {
    this.worldsOnPage.update(_ => wop);
    this.saveToStorage();
  }

  async saveToStorage() {
    if(!this.storage) {
      throw new Error("Storage not initialized");
    }
    await this.storage.set('wpm', this.worldPerMinute());
    await this.storage.set('wop', this.worldsOnPage());
  }
}
