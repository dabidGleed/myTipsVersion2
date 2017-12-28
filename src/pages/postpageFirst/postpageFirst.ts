// External Imports
import { AppRate } from '@ionic-native/app-rate';
import { Component } from '@angular/core';
import { Content, Searchbar } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { IonicPage, NavController } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { LoadingController, Platform, ToastController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ViewChild } from '@angular/core';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs/Subscription';
import { ModalController, NavParams, ViewController } from 'ionic-angular';
// App Imports
import { CategoryList } from '../category-list/category-list';
import { Favourite } from '../favourite/favourite';
import { TipsService } from '../../providers/tips-service';
import { RateService } from '../../providers/rate-service/rate-service';
import { Postpage } from '../postpage/postpage';
import { OrderByPipe } from '../../pipes/orderBy';
import { LoginPage } from '../login/login';
// declare var FacebookAds:any;

@IonicPage()
@Component({
  selector: 'page-postpage-first',
  templateUrl: 'postpageFirst.html',
  providers: [TipsService]
})

export class PostpageFirst {

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
    private sharingVar: SocialSharing,
    private youtube: YoutubeVideoPlayer,
    private domSanitizer: DomSanitizer,
    private keyboard: Keyboard,
    private appRate: AppRate,
    private network: Network,
    public modalCtrl: ModalController
  ) {

    this.loadTips();
    this.deviceId = tipsService.getDeviceDetails();
    this.videoUrl = "";

    // CHANGE HERE 
    // for all categories
    this.categoryid = this.tipsService.currentCategoryId;

    // for single category
    // this.categoryid = this.tipsService.categoryid;

    platform.ready().then(() => {
      platform.registerBackButtonAction(() => this.myHandlerFunction());
      // if(FacebookAds){
      //   FacebookAds.createNativeAds('	254622585029422_254624781695869');
      // }
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

  // for videos
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
  ionViewDidLoad() {
    console.log(this.tipsService.data + "data");
    console.log("this.tipsService.data");
  }

  // show search 
  showSearch() {
    this.search = true;
    setTimeout(() => {
      this.myInput.setFocus();
    }, 150);
  }

  // hide search
  hideSearch() {
    this.search = false;
    this.searchTerm = "";
    this.loadTips();
    this.content.scrollToTop();
  }

  // searc for categorywise items
  searchItems() {
    this.keyboard.close();
    this.content.scrollToTop();
    // CHANGE HERE 
    // for all categories
    this.tipsService.search(this.searchTerm,0,10)

    //for single category
    // this.tipsService.searchCategoryWise(this.categoryid, this.searchTerm, this.tips.length, 10)
      .then(data => {
        this.tips = data;
      });

  }

  // Infinite scroll
  doInfinite(infiniteScroll) {
    var b = this.tips;
    console.log("Load more data " + this.tips.length);
    if (!this.search) {

      // CHANGE HERE 
      // for all categories
      this.tipsService.load(this.tips.length, 10)

        //for single category
        // this.tipsService.categoryWiseTips(this.tips.length,10,this.categoryid)
        .then(data => {
          //   console.log(data);
          //   this.tips.push(data.length);
          data.forEach(element => {
            (b.push(element));
          });
          console.log(this.tips);
          infiniteScroll.complete();
        });
    }
    else {
      // for all categories
      this.tipsService.search(this.searchTerm, this.tips.length, 10)

        //for single category
        // this.tipsService.searchCategoryWise(this.categoryid,this.searchTerm,this.tips.length,10)
        .then(data => {
          //   console.log(data);
          //   this.tips.push(data.length);
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
    return textVal.slice(0, 80) + "...";
  }

  // on click to postpage
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
      this.tipsService.load(0, 10)

        //for single category
        // this.tipsService.categoryWiseTips(0,10,this.categoryid)
        .then(data => {
          this.tips = data;
          this.tipsService.data = data;
          //this.tips.reverse();
          loader.dismiss();
          // var a = localStorage.getItem('user');
          // if (!a) {
          //   this.presentProfileModal();
          // }

          console.log("this is loading");
          var id = setInterval(function () {
            clearInterval(id);
          }, 3000);
        });
    });

  }

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

  // To view a post
  viewPost() {
    this.tipsService.views(this.tip.id, this.deviceId)
      .then(data => {
        this.viewCount = data;
        console.log(data);
      });
  }

  // for favourite post
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

  // like functionality
  iconLike(tipList): any {
    if (!this.deviceId) {
      this.deviceId = "12345";
    }
    return tipList.filter(tip => tip.userId == this.deviceId);
  }

  // Fav functionality
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

  // navigation to favourite page
  FavouritePage() {
    this.navCtrl.push(Favourite);
  }

  //for network connection 
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

  //navigation to CategoryListPage
  CategoryListPage() {
    this.navCtrl.push(CategoryList);
  }

  // presentProfileModal() {
  //   let LoginPageModule = this.modalCtrl.create(LoginPage);
  //   LoginPageModule.present();
  // }
}
