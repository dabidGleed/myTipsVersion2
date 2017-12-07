// external imports
import { AppRate } from '@ionic-native/app-rate';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { LoadingController, Platform, ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Searchbar, Content } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ViewChild } from '@angular/core';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';

// App Imports
import { CategoryList } from '../category-list/category-list';
import { Favourite } from '../favourite/favourite';
import { OrderByPipe } from '../../pipes/orderBy';
import { Postpage } from '../postpage/postpage';
import { RateService } from '../../providers/rate-service/rate-service';
import { TipsService } from '../../providers/tips-service';

@Component({
  selector: 'page-vendor-tips-new',
  templateUrl: 'vendor-tips-new.html',
})
export class VendorTipsNewPage {

  @ViewChild(Content) content: Content;
  @ViewChild('focusInput') myInput;
  public tips: any = [];
  id;
  valNum = 0;
  categoryid;
  mySlideOptions = { pager: true };
  iconValue = true;
  deviceId;
  tip;
  Name;
  userId;
  vendorId;
  videoUrl;
  individual = true;
  viewCount;
  public search = false;
  searchTerm = "";
  category = "";
  connected: Subscription;
  disconnected: Subscription;

  // Class Constructor
  constructor(
    public loading: LoadingController,
    public navCtrl: NavController,
    public platform: Platform,
    public tipsService: TipsService,
    public toast: ToastController,
    public RateService: RateService,
    public navParams: NavParams,

    private sharingVar: SocialSharing,
    private youtube: YoutubeVideoPlayer,
    private domSanitizer: DomSanitizer,
    private keyboard: Keyboard,
    private appRate: AppRate,
    private network: Network
  ) {

    this.loadTips();
    this.deviceId = tipsService.getDeviceDetails();
    this.videoUrl = "";
    this.Name = navParams.get("Name");
    // for all categories
    //  this.userId = this.tipsService.allTips();
    this.vendorId = navParams.get("userId");
    console.log(this.vendorId + "this.vendorId");
    platform.ready().then(() => {
      platform.registerBackButtonAction(() => this.myHandlerFunction());

      // AppRate End
      document.addEventListener('onAdLoaded', function (data) {
        let temp: any = data;
        if (temp.adType == 'native') {
          document.getElementById('adIcon').setAttribute("src", temp.adRes.icon.url);
          document.getElementById('adCover').setAttribute("src", temp.adRes.coverImage.url);
          document.getElementById('adTitle').innerHTML = temp.adRes.title;
          document.getElementById('adBody').innerHTML = temp.adRes.body;
          document.getElementById('adSocialContext').innerHTML = temp.adRes.socialContext;
          document.getElementById('adBtn').innerHTML = temp.adRes.buttonText
        }
      })
    })
    
  }

  //for videos
  video(value) {
    return this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + value);
  }
  // Hardware Back button to Exit the Application
  myHandlerFunction() {
    if (this.valNum == 0) {
      let toast = this.toast.create({
        message: 'Double Click back button to exit My Tips!',
        duration: 2000,
        showCloseButton: false,
        dismissOnPageChange: true,
        position: 'middle',
        cssClass: 'Toast modify'
      });
      toast.present();
      this.valNum = 1;
      var temp = this;
      this.id = setInterval(function () {
        temp.valNum = 0;
        clearInterval(temp.id);
      }, 1000);
    } else {
      this.platform.exitApp();
    }
  };

  // To Share the Tips
  otherShare(tip) {
    this.sharingVar.share("My Tips",
      tip.title,
      tip.images[0],
      "https://play.google.com/store/apps/details?id=com.gleed.mytips&hl=en"
    )
      .then(() => {

      },
      () => {
      })
  }

  // for show search  
  showSearch() {
    this.search = true;
    setTimeout(() => {
      this.myInput.setFocus();
    }, 150);
  }

  // for hide search
  hideSearch() {
    this.search = false;
    this.searchTerm = "";
    this.loadTips();
    this.content.scrollToTop();
  }

  //search for categorywise items
  searchItems() {
    this.keyboard.close();
    this.content.scrollToTop();
    var userId = this.vendorId;
    this.tipsService.searchVendorWise(this.vendorId, this.searchTerm, 0, 10)
      .then(data => {
        let b = [];
        data.forEach(element => {
          if (element.userId == userId) {
            b.push(element);
          }
        });
        this.tips = b;
      });

  }

  // Infinite scroll
  doInfinite(infiniteScroll) {
    var b = this.tips;
    console.log("Load more data " + this.tips.length);


    if (!this.search) {
      //     // for all categories
      //    this.tipsService.allTips(this.userId,0,20)

      this.tipsService.allTips(this.vendorId, this.tips.length, 10)
        .then(dataArray => {
          var data: any = dataArray;
          data.forEach(element => {
            (b.push(element));
          });
          console.log(this.tips);
          infiniteScroll.complete();
        })
    }
    else {
      this.tipsService.searchVendorWise(this.vendorId, this.searchTerm, this.tips.length, 10)
        .then(data => {
          data.forEach(element => {
            (b.push(element));
          });
          console.log(this.tips);
          infiniteScroll.complete();
        });
    }
  }

  // To Render the Content till 80 Letters
  renderContent(textVal) {
    return textVal.slice(0, 10) + "...";
  }

  // navigation to Postpage
  callPost(value) {
    this.navCtrl.push(Postpage, {
      postValue: value
    });
  }

  // for load tips
  loadTips() {

    let loader = this.loading.create({
      content: 'Getting latest entries...',
    });
    loader.present().then(() => {
      // for all categories
      this.tipsService.allTips(this.vendorId, 0, 10)
        // this.tipsService.categoryWiseTips(0,10,this.categoryid)
        .then(data => {
          this.tips = data;
          loader.dismiss();
          console.log("this is loading");
          var id = setInterval(function () {
            clearInterval(id);
          }, 3000);
        });
    });
  }

  // for like post
  likePost(id, listlike, numVal) {
    if (!this.deviceId) {
      this.deviceId = "12345";
    }
    if (numVal == 1) {
      listlike.forEach(element => {
        if (element.userId == this.deviceId) {
          listlike.splice(listlike.indexOf(element), 1);
        }
      });
    } else {
      listlike.push({ userId: this.deviceId });
    }
    this.tipsService.likeTip(id, this.deviceId)
      .then(data => {
      });
  }

  //for favourite post
  favMessage = '';
  favoritePost(id, listfav, numVal) {
    if (!this.deviceId) {
      this.deviceId = "12345";
    }
    if (numVal == 1) {
      listfav.forEach(element => {
        if (element.userId == this.deviceId) {
          listfav.splice(listfav.indexOf(element), 1);
        }
      });
      this.favMessage = 'Removed from Favourites';
    } else {
      listfav.push({ userId: this.deviceId });

      this.favMessage = 'Added to Favourites';
    }
    this.tipsService.favTip(id, this.deviceId)
      .then(data => {
      });
    let toast = this.toast.create({
      message: this.favMessage,
      duration: 1000,
      position: 'middle',
      showCloseButton: false,
      dismissOnPageChange: true,
      cssClass: 'Toast modifyFav'
    });
    toast.present();
  }

  //for like
  iconLike(tipList): any {
    if (!this.deviceId) {
      this.deviceId = "12345";
    }
    return tipList.filter(tip => tip.userId == this.deviceId);
  }

  // for favourite
  iconFav(tipList): any {
    if (!this.deviceId) {
      this.deviceId = "12345";
    }
    return tipList.filter(tip => tip.userId == this.deviceId);
  }

  // for date
  changeDate(dateVal) {
    let b = new Date(dateVal);
    let c = b.toDateString();
    let d = c.split(' ');
    return d[1] + " " + d[2] + " " + d[3];
  }

  //for default image
  changeImage(image) {
    if (image.length == 0) {
      return "assets/images/noImage.png";
    } else {
      return image[0];
    }
  }

  //for gender specification
  gender(data, gen) {
    if (data.length == 0 || data.length == 2) {
      return true;
    }
    else if (data.length == 1) {
      if (data[0] == gen) {
        return true;
      }
      else {
        return false;
      }
    }
  }

  // for network connection
  displayNetworkUpdate(connectionState: string) {
    let networkType = this.network.type
    this.toast.create({
      message: `You are now ${connectionState} via ${networkType}`,
      duration: 2000,
      showCloseButton: false,
      dismissOnPageChange: true,
      position: 'middle',
      cssClass: 'Toast modify'
    }).present();
  }

  ionViewDidEnter() {
    this.network.onConnect().subscribe(data => {
      this.loadTips();
      this.displayNetworkUpdate(data.type);
    }, error => {
      this.toast.create({
        message: `No internet connection found!!`,
        duration: 2000,
        showCloseButton: false,
        dismissOnPageChange: true,
        position: 'middle',
        cssClass: 'Toast modify'
      }).present();
    });

    this.network.onDisconnect().subscribe(data => {
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));
  }
}

