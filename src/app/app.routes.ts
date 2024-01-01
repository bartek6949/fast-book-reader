import { Routes } from '@angular/router';
import {Tab1Page} from "./tab1/tab1.page";
import {Tab2Page} from "./tab2/tab2.page";
import {Tab3Page} from "./tab3/tab3.page";

export const routes: Routes = [
  {
    path: '',
    component: Tab1Page,
  },
  {
    path: 'book/:id',
    component: Tab2Page,
  },
  {
    path: 'book/:id/read',
    component: Tab3Page,
  },
];
