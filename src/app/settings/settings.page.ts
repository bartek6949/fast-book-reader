import {Component, OnInit, WritableSignal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule, RangeChangeEventDetail} from '@ionic/angular';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem, IonLabel, IonList, IonRange,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {RouterModule} from "@angular/router";
import {arrowBack} from "ionicons/icons";
import {addIcons} from "ionicons";
import {SettingsService} from "../domain/settings/settings.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, FormsModule, IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar, RouterModule, IonItem, IonRange, IonLabel, IonList]
})
export class SettingsPage{
  readSpeed: WritableSignal<number>;
  wordsOnPage: WritableSignal<number>;

  constructor(private settingsService: SettingsService) {
    addIcons({arrowBack});
    this.readSpeed = this.settingsService.getWPM();
    this.wordsOnPage = this.settingsService.getWOP();
  }

  updateWPM(value:CustomEvent<RangeChangeEventDetail>): void {
    this.settingsService.updateWPM(value.detail.value as number);
  }

  updateWOP(value:CustomEvent<RangeChangeEventDetail>): void {
    this.settingsService.updateWOP(value.detail.value as number);
  }
}
