import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

import { CategoryList } from './category-list';

@NgModule({
  declarations: [
    CategoryList,
  ],
  imports: [
    IonicModule.forRoot(CategoryList),
  ],
  exports: [
    CategoryList
  ]
})
export class CategoryListModule {}
