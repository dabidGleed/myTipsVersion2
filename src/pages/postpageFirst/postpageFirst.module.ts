import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

import { PostpageFirst } from './postpageFirst';

@NgModule({
  declarations: [
    PostpageFirst,
  ],
  imports: [
    IonicModule.forRoot(PostpageFirst),
  ],
  exports: [
    PostpageFirst
  ]
})
export class PostpageFirstModule { }
