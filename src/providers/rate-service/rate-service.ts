import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import { AppRate } from "@ionic-native/app-rate";
import { Platform } from "ionic-angular";

@Injectable()
export class RateService {
  constructor(
    public http: Http,
    public platform: Platform,
    private appRate: AppRate
  ) {
    console.log("Hello RateServiceProvider Provider");

    platform.ready().then(() => {
      this.appRate.preferences = {
        storeAppURL: {
          ios: "849930087",
          android: "market://details?id=com.gleed.mytips",
          windows: "ms-windows-store://review/?ProductId=<store_id>"
        },
        usesUntilPrompt: 2,
        useCustomRateDialog: true,
        customLocale: {
          title: "Rate Us... Pretty Please?",
          message: "Without ratings we starve =(",
          cancelButtonLabel: "Pass",
          rateButtonLabel: "Rate it!",
          laterButtonLabel: "Ask Later"
        }
      };
    });
  }
  //for rating
  promptForRating() {
    this.appRate.promptForRating(false);
  }
}
