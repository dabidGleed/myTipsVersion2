import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { Male } from './male';

@NgModule({
  declarations: [
    Male,
  ],
  imports: [
    IonicModule.forRoot(Male),
  ],
  exports: [
    Male
  ]
})
export class MaleModule { }
