import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

import { All } from './all';

@NgModule({
  declarations: [
    All
  ],
  imports: [
    IonicModule.forRoot(All),
  ],
  exports: [
    All
  ]
})
export class AllModule { }
