import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

import { Favourite } from './favourite';

@NgModule({
  declarations: [
    Favourite,
  ],
  imports: [
    IonicModule.forRoot(Favourite),
  ],
  exports: [
    Favourite
  ]
})
export class FavouriteModule {}
