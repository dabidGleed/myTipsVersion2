// External Imports
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController, Platform, ToastController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Storage } from '@ionic/storage';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { AlertController } from 'ionic-angular';
import { ModalController, ViewController } from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar';

// App Imports
import { LoginPage } from '../login/login';
import { CommentsPage } from '../comments/comments';
import { EventsPage } from '../events/events';
import { PostListPage } from '../post-list-page/post-list-page';
import { vendorDetails } from '../vendorDetails/vendorDetails';
import { TipsService } from '../../providers/tips-service';
@IonicPage()
@Component({
  selector: 'page-postpage',
  templateUrl: 'postpage.html',
  providers: [TipsService]
})

export class Postpage {
  public tips = [];
  slides = [1, 2, 3, 4];
  tip;
  iconValue = true;
  deviceId;
  val;
  videoUrl;
  category = "";
  categoryid;
  videoUrlVideo: any = '';
  private user: any = {
    userDetails: {}
  };
  mySlideOptions = {
    pager: true
  };
  // Class Constructor
  constructor(
    public alertCtrl: AlertController,
    public loading: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public tipsService: TipsService,
    public toastCtrl: ToastController,

    private domSanitizer: DomSanitizer,
    private sharingVar: SocialSharing,
    private storage: Storage,
    private youtube: YoutubeVideoPlayer,
    public modalCtrl: ModalController,
    private calend: Calendar
  ) {
    // this.loadTips();
    // let date:any = Date.now();
    // let date2:any =  new Date(2017,7,10,0,0,0,0);

    this.category = this.tipsService.currentCategory;
    this.deviceId = tipsService.getDeviceDetails();
    this.videoUrl = "";
    this.tip = navParams.get("postValue");

    //get vendor image
    this.tipsService.getVendor(this.tip.userId)
      .then(
      data => {
        //  console.log(this.userId);
        this.user = data[0];
        if (!this.user.userDetails) {
          this.user.userDetails = {
            image: ''
          }
        }
      }
      )
    console.log(this.tip);

    // for videos
    this.videoUrlVideo = this.domSanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + this.tip.videos[0]);

    platform.ready().then(() => {
      platform.registerBackButtonAction(() => this.myHandlerFunction());
    })
    this.view();
  }

  // on click to vendor details page
  vendorDetails(value) {
    this.navCtrl.push(vendorDetails, {
      userData: this.user
    });
    //  this.storage.get('user').then((val)=> {
    //       console.log(val);
    //       alert(val);
    //      });
    this.showConfirm();
  }

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

  // Hardware Back button to load Categories Page 
  myHandlerFunction() {
    this.navCtrl.pop();
  };

  // For loading the Tips
  // loadTips() {
  //   let loader = this.loading.create({
  //     content: 'Getting latest entries...',
  //   });
  //   loader.present().then(() => {
  //     this.tipsService.load(0,10)
  //       .then(data => {
  //         this.tips = data;
  //         loader.dismiss();
  //       });
  //   });
  // }

  // To Like a Post
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
    };

  this.tipsService.likeTip(id, this.deviceId)
      .then(data => {

      });
  }
  comments;
  commentCount(tip) {
    
    if (!this.deviceId) {
      this.deviceId = "12345";
    }
    // localStorage.removeItem("commentVal");
    if (tip.comments && tip.comments.length != 0) {
      
      return tip.comments.length;
    }
    else {
      return 0;
    }
   
  }
  
  // To view a post
  view() {
    var listView = this.tip.views;

    var numVal = this.iconView(listView);
    console.log(numVal + "views");
    if (!this.deviceId) {
      this.deviceId = "12345";
    }
    if (numVal.length != 1) {
      listView.push({ userId: this.deviceId });
      this.tipsService.views(this.tip.id, this.deviceId)
        .then(data => {
        });
    }

  }

  // To Favourite a Post
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
    let toast = this.toastCtrl.create({
      message: this.favMessage,
      duration: 1000,
      position: 'middle',
      showCloseButton: false,
      dismissOnPageChange: true,
      cssClass: 'Toast modifyFav'
    });
    toast.present();
  }


  // playVideo(videoId) {
  //   this.youtube.openVideo(videoId[0]);
  // }
  // 



  // Active and Inactive functionality of Like Button
  iconLike(tipList): any {
    if (!this.deviceId) {
      this.deviceId = "12345";
    }
    return tipList.filter(tip => tip.userId == this.deviceId);
  }

  // Active and Inactive functionality of Favourite Button
  iconFav(tipList): any {
    if (!this.deviceId) {
      this.deviceId = "12345";
    }
    return tipList.filter(tip => tip.userId == this.deviceId);
  }

  // for view
  iconView(tipList): any {
    if (!this.deviceId) {
      this.deviceId = "12345";
    }
    return tipList.filter(tip => tip.userId == this.deviceId);
  }

  // Conversion to Server Date to Local Date
  changeDate(dateVal) {
    let b = new Date(dateVal).toDateString().split(' ');
    return b[1] + " " + b[2] + " " + b[3];
  }

  // For Default Image
  changeImage(image) {
    if (image.length == 0) {
      return "assets/images/noImage.png";
    } else {
      return image[0];
    }
  }

  //register as vendor popup
  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Register as a Vendor',
      cssClass: 'custom-alert',
      message: 'Would you like to share your tips?',
      buttons: [
        {
          text: 'Register',
          handler: () => {
            console.log('Register clicked');
          }
        },
        {
          text: 'Later',
          handler: () => {
            let date: any = Date.now();
            // set a key/value
            this.storage.set('date', date + 604800000);// current date + 7days
            // console.log('Later clicked');
            console.log(date + 604800000);
          }
        }
      ]
    });
    // Or to get a key/value pair
    this.storage.get('date').then((val) => {
      if (!val || val <= Date.now()) {
        confirm.present();
      }
      
    });

  }

  
  
  presentProfileModal() {
    var a = localStorage.getItem('user');
    if (!a) {
      this.ProfileModal();
    } else {
      // if(a == '12345678'){
      let CommentsPageModule = this.modalCtrl.create(CommentsPage, { tipId: this.tip.id });
      CommentsPageModule.present();
      CommentsPageModule.onDidDismiss(data => {
        // Do things with data coming from modal, for instance :
        this.tipsService.commentList(this.tip.id).then(data => {
          this.comments = data;
          this.tip.comments = this.comments;
          // console.log(this.comments.length+'/'+this.tip.comments);
          this.commentCount(this.tip);
          console.log("COMMENT API");
        });
      });
      
    }
  
  }

  ProfileModal() {
    let LoginPageModule = this.modalCtrl.create(LoginPage);
    LoginPageModule.present();
  }
  // events(){
  //   this.navCtrl.push(EventsPage);
  // }

  addEvent(title) {
    var startDate = new Date(); // beware: month 0 = january, 11 = december
    var endDate = new Date();
    var eventLocation = "";
    var notes = "";
    return this.calend.createEventInteractively(title, eventLocation, notes, startDate, endDate);
  }
  
  scheduleEvents(title) {
    this.calend.hasReadWritePermission().then((result) => {
      if (result === false) {
        this.calend.requestReadWritePermission().then((v) => {
          this.addEvent(title);
        }, (r) => {
          console.log("Rejected");
        })
      }
      else {
        this.addEvent(title);
      }
    })
  }
}
