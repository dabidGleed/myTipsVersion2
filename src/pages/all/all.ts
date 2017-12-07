// External Imports
import { Component, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IonicPage, NavController } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { LoadingController, Platform, Content } from 'ionic-angular';
import { NavParams, MenuController } from 'ionic-angular';
import { ViewChild } from '@angular/core';

// App Imports
import { CategoryList } from '../category-list/category-list';
import { Filter } from '../../pipes/filter';
import { Postpage } from '../postpage/postpage';

import { PostpageFirst } from '../postpageFirst/postpageFirst';
import { TipsService } from '../../providers/tips-service';

@IonicPage()
@Component({
  selector: 'page-all',
  templateUrl: 'all.html'
})

export class All {
  @ViewChild(Content) content: Content;
  @ViewChild('focusInput') myInput;
  public tips: any = [];
  category = "";
  categoryid;
  videoUrl;
  genderSpecVal = true;
  searchTerm = "";
  public search = false;

  // Class Constructor
  constructor(
    public loading: LoadingController,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public tipsService: TipsService,

    private domSanitizer: DomSanitizer,
    private keyboard: Keyboard
  ) {

    // for initial loading 
    this.loadTips();
    this.category = this.tipsService.currentCategory;
    this.categoryid = this.tipsService.currentCategoryId;
    this.genderSpecVal = this.tipsService.genderSpecVal;
    this.videoUrl = "";
    console.log(this.tipsService.currentCategory);
    platform.ready().then(() => {
      platform.registerBackButtonAction(() => this.myHandlerFunction());
    })
    
  }

  //for videos
  video(value) {
    return this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + value);
  }
  // Hardware Back button to load Categories Page
  myHandlerFunction() {
    this.navCtrl.push(CategoryList);
  };

  // To load Individual Post in Post Page
  callPost(value) {
    this.navCtrl.push(Postpage, {
      postValue: value
    });
  }

  // To Render the Content till 80 Letters
  renderContent(textVal) {
    return textVal.slice(0, 80) + "...";
  }

  // To show search box
  showSearch() {
    this.search = true;
    setTimeout(() => {
      this.myInput.setFocus();
    }, 150);
  }

  // To hide search box
  hideSearch() {
    this.search = false;
    this.searchTerm = "";
    this.loadTips();
    this.content.scrollToTop();
  }

  // To load Tips again
  onPageWillEnter() {
    this.loadTips();
  }

  // Infinite scroll
  doInfinite(infiniteScroll) {
    var b = this.tips;
    console.log("Load more data " + this.tips.length);
    if (!this.search) {
      this.tipsService.categoryWiseTips(this.tips.length, 10, this.categoryid)
        .then(data => {
          data.forEach(element => {
            (b.push(element));
          });
          console.log(this.tips);
          infiniteScroll.complete();

        });
    }
    else {
      this.tipsService.searchCategoryWise(this.categoryid, this.searchTerm, this.tips.length, 10)
        .then(data => {
          data.forEach(element => {
            (b.push(element));
          });
          console.log(this.tips);
          infiniteScroll.complete();
        });
    }

  }

  // For loading the Tips
  loadTips() {
    let loader = this.loading.create({
      content: 'Getting latest entries...',
    });

    loader.present().then(() => {
      console.log(this.category);
      this.tipsService.categoryWiseTips(0, 10, this.categoryid)
        .then(data => {
          this.tips = data;
          console.log(data);
          loader.dismiss();
        });
    });
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

  // Icon Gender Filter
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

  // Back to Category Page
  backToCategory() {
    this.navCtrl.push(CategoryList);
  }

  //for serach the category wise items in searchbox
  searchItems() {
    this.keyboard.close();
    this.content.scrollToTop();
    this.tipsService.searchCategoryWise(this.categoryid, this.searchTerm, 0, 10)
      .then(data => {
        this.tips = data;
      });
  }

}
