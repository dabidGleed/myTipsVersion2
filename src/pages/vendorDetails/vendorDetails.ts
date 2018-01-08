// External Imports
import { Component, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { IonicPage, NavController, NavParams, } from 'ionic-angular';
import { LoadingController, Platform, ToastController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Storage } from '@ionic/storage';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
// App Imports
import { Postpage } from '../postpage/postpage';
import { PostpageFirst } from '../postpageFirst/postpageFirst';
import { PostListPage } from '../post-list-page/post-list-page';
import { TipsService } from '../../providers/tips-service';
import { VendorTipsNewPage } from '../vendor-tips-new/vendor-tips-new';

declare var google;

@IonicPage()
@Component({
  selector: 'page-vendorDetails',
  templateUrl: 'vendorDetails.html',
  providers: [TipsService]
})

export class vendorDetails {
  @ViewChild('map') mapElement: ElementRef;
  userData;
  public tips: any = [];
  private user: any = {
    userDetails: {}
  };

  map: any;

  // Class Constructor
  constructor(
    public loading: LoadingController, public navCtrl: NavController, public tipsService: TipsService, public navParams: NavParams, public platform: Platform, private storage: Storage) {

    this.user = navParams.get("userData");
    console.log(this.user);
    this.loadTips();

  }

  //for rendering the content 
  renderContent(textVal) {
    return textVal.slice(0, 20) + "...";
  }

  address(val) {
    var value = "";
    if (val.address) {
      value += val.address;
    }
    if (val.state) {
      if (value != "") {
        value += ", " + val.state;
      } else {
        value += val.state;
      }
    }
    if (val.country) {
      if (value != "") {
        value += ", " + val.country;
      } else {
        value += val.country;
      }
    }
    return value + ".";
  }

  // for load tips
  loadTips() {
    this.tipsService.allTips(this.user.id, 0, 6)
      .then(data => {
        console.log(data + "data");
        this.tips = data;
      });
  }

  // for default image
  changeImage(image) {
    if (image.length == 0) {
      return "assets/images/noImage.png";
    } else {
      return image[0];
    }
  }

  //for getting vendor tips
  setVendortips(userID, firstName) {
    this.navCtrl.push(VendorTipsNewPage, {
      userId: userID,
      Name: firstName
    });
  }

  // on lcick to Postpage 
  callPost(value) {
    this.navCtrl.push(Postpage, {
      postValue: value
    });
  }

  HomePage() {
    this.navCtrl.push(PostpageFirst);
  }


}
