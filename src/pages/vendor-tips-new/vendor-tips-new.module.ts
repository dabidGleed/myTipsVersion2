import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendorTipsNewPage } from './vendor-tips-new';

@NgModule({
  declarations: [
    VendorTipsNewPage,
  ],
  imports: [
    IonicPageModule.forChild(VendorTipsNewPage),
  ],
})
export class VendorTipsNewPageModule {}
