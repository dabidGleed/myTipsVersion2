import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

import { vendorDetails } from './vendorDetails';

@NgModule({
  declarations: [
    vendorDetails,
  ],
  imports: [
    IonicModule.forRoot(vendorDetails),
  ],
  exports: [
    vendorDetails
  ]
})
export class vendorDetailsModule { }
