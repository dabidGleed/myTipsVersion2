// External Imports
import { Component, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IonicPage, NavController, Content } from 'ionic-angular';
import { NavParams, MenuController } from 'ionic-angular';
import { LoadingController, Platform } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { ViewChild } from '@angular/core';
// App Imports
import { CategoryList } from '../category-list/category-list';
import { Filter } from '../../pipes/filter';
import { Postpage } from '../postpage/postpage';
import { PostpageFirst } from '../postpageFirst/postpageFirst';
import { TipsService } from '../../providers/tips-service';
import { OrderByPipe } from '../../pipes/orderBy';

@IonicPage()
@Component({
  selector: 'page-male',
  templateUrl: 'male.html'
})

export class Male {
  @ViewChild(Content) content: Content;
  @ViewChild('focusInputA') myInput;
  public tips: any = [];
  searchTerm = "";
  category = "";
  categoryid;
  filterData;
  videoUrl;
  val;

  // Class Constructor
  public search = false;
  constructor(
    public loading: LoadingController,
    public menuCtrl: MenuController,
    public navParams: NavParams,
    public navCtrl: NavController,
    public platform: Platform,
    public tipsService: TipsService,

    private domSanitizer: DomSanitizer,
    private keyboard: Keyboard
  ) {

    this.loadTips();
    // this.category = this.tipsService.currentCategory;
    this.categoryid = this.tipsService.currentCategoryId;
    this.videoUrl = "";
    platform.ready().then(() => {
      platform.registerBackButtonAction(() => this.myHandlerFunction());
    })
    
  }

  // for videos
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

  // Infinite scroll
  doInfinite(infiniteScroll) {
    var b = this.tips;
    console.log("Load more data " + this.filterData.length);
    if (!this.search) {
      this.tipsService.categoryWiseTips(this.filterData.length, 10, this.categoryid)

        .then(data => {
          var c = this.filterGender(data);
          c.forEach(element => {
            (b.push(element));
          });

          data.forEach(element => {
            this.filterData.push(element);
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


  // Load more data on scroll infinite
  loadMoreData() {
    console.log("Test Data");
  }

  // To load Tips again
  onPageWillEnter() {
    this.loadTips();
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
          this.tips = this.filterGender(data);
          this.filterData = data;
          console.log(data);
          loader.dismiss();
        });
    });
  }

  // For Gender Filtering
  filterGender(dataVal) {
    var serve = 'male';
    return dataVal.filter((tip) => {
      if (tip.genderSpecific.length == 1) {
        if (tip.genderSpecific[0].toLowerCase() == serve.toLowerCase()) {
          return tip;
        }
      } else if (tip.genderSpecific.length == 2 || tip.genderSpecific.length == 0) {
        return tip;
      }
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

  // Back to Category Page
  backToCategory() {
    this.navCtrl.push(CategoryList);
  }
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

  searchItems() {
    this.keyboard.close();
    this.content.scrollToTop();
    this.tipsService.searchCategoryWise(this.categoryid, this.searchTerm, 0, 10)
      .then(data => {
        this.tips = data;
      });
  }

}
