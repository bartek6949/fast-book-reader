import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
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

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, FormsModule, IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar, RouterModule, IonItem, IonRange, IonLabel, IonList]
})
export class SettingsPage{
  readSpeed: number = 300;

  constructor() {
    addIcons({arrowBack});
  }

}
