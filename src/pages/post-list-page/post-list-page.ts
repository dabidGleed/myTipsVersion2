// External Imports
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

// App Imports
import { All } from '../all/all';
import { Female } from '../female/female';
import { Male } from '../male/male';

@IonicPage()
@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Tabs</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content>
    </ion-content>
`})

export class TabIconTextContentPage {
  isAndroid: boolean = false;
}

@Component({
  template: `
    <ion-tabs preloadTabs="false" animation="none">
      <ion-tab tabTitle="All"  [root]="tab1"></ion-tab>
      <ion-tab tabTitle="Male"  [root]="tab2"></ion-tab>
       <ion-tab tabTitle="Female"  [root]="tab3"></ion-tab>
    </ion-tabs>`
})

export class PostListPage {
  tab1: any;
  tab2: any;
  tab3: any;

  // Class Constructor
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.tab1 = All;
    this.tab2 = Male;
    this.tab3 = Female;
  }

}
