import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

import { Postpage } from './postpage';

@NgModule({
  declarations: [
    Postpage,
  ],
  imports: [
    IonicModule.forRoot(Postpage),
  ],
  exports: [
    Postpage
  ]
})
export class PostpageModule { }
