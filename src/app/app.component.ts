// External Imports
import { AdMob } from "@ionic-native/admob";
import {
  AlertController,
  Nav,
  Platform,
  LoadingController,
  ToastController
} from "ionic-angular";
import { Component, ViewChild, Pipe, PipeTransform } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { Push, PushObject, PushOptions } from "@ionic-native/push";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Network } from "@ionic-native/network";
import { Subscription } from "rxjs/Subscription";
import { RateService } from "../providers/rate-service/rate-service";
// App Imports
import { LoginPage } from "../pages/login/login";
import { PostpageFirst } from "../pages/postpageFirst/postpageFirst";
import { Postpagenotify } from "../pages/postpagenotify/postpagenotify";
import { TipsService } from "../providers/tips-service";
@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  gform;
  gender;
  rootPage: any = PostpageFirst;
  pages: Array<{ title: string; component: any }>;
  connected: Subscription;
  disconnected: Subscription;
  constructor(
    public platform: Platform,
    public RateService: RateService,
    public alertCtrl: AlertController,
    public push: Push,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public AdMob: AdMob,
    public tipsService: TipsService,
    public toast: ToastController,
    private network: Network
  ) {
    this.initializeApp();
    this.RateService.promptForRating();
    this.gform = new FormGroup({
      gender: new FormControl({ value: "male", disabled: false })
    });

    // for ads in the app
    platform.ready().then(() => {
      let options = {
        adId: "ca-app-pub-7071565575097936/4327122006",
        isTesting: false
      };

      let optionsA = {
        adId: "ca-app-pub-7071565575097936/5566687883"
      };

      // for video ads
      //  AdMob.prepareInterstitial(optionsA)
      // .then(() => { AdMob.showInterstitial(); });

      AdMob.createBanner(options).then(() => {
        AdMob.showBanner(8);
      });
      // this.initPushNotification();
    });
  }

  doSubmit(event) {
    console.log("Submitting form", this.gform.value);
    event.preventDefault();
  }
// CHANGE HERE 
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      // this.statusBar.overlaysWebView(true);
      // this.statusBar.backgroundColorByHexString('#bba1d0');//yoga
      // this.statusBar.backgroundColorByHexString('#c3696b');// recipie
      //  this.statusBar.backgroundColorByHexString('#2cb26d');//fitness
      //  this.statusBar.backgroundColorByHexString('#815da2');//Beauty
      this.statusBar.backgroundColorByHexString("#4ec3ea"); //my tips

      this.splashScreen.hide();
    });
  }
  initPushNotification() {
    if (!this.platform.is("cordova")) {
      console.warn(
        "Push notifications not initialized. Cordova is not available - Run in physical device"
      );
      return;
    }

    const options: any = {
      android: {
        senderID: "543595891066"
      },
      ios: {
        alert: "true",
        badge: false,
        sound: "true"
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);
    pushObject.on("registration").subscribe((data: any) => {
      this.tipsService.pushSetup(data.registrationId);
      //TODO - send device token to server
    });

    pushObject.on("notification").subscribe((data: any) => {
      //if user using app and push notification comes
      if (data.additionalData.foreground) {
        // if application open, show popup
        let confirmAlert = this.alertCtrl.create({
          title: data.title,
          message: data.message,
          buttons: [
            {
              text: "Ignore",
              role: "cancel"
            },
            {
              text: "View",
              handler: () => {
                this.nav.push(Postpagenotify, {
                  postValue: data.additionalData,
                  title: data.title
                });
              }
            }
          ]
        });
        confirmAlert.present();
      } else {
        this.nav.push(Postpagenotify, {
          postValue: data.additionalData,
          title: data.title
        });
      }
    });

    pushObject
      .on("error")
      .subscribe(error => console.error("Error with Push plugin", error));
  }

  displayNetworkUpdate(connectionState: string) {
    let networkType = this.network.type;
    this.toast
      .create({
        message: `You are now ${connectionState} via ${networkType}`,
        duration: 3000,
        position: "middle",
        showCloseButton: false,
        cssClass: "Toast modifyFav"
      })
      .present();
  }
}
