// External Imports
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController, Platform } from 'ionic-angular';

// App Imports
import { All } from '../all/all';
import { Favourite } from '../favourite/favourite';
import { OrderByPipe } from '../../pipes/orderBy';
import { PostListPage } from '../post-list-page/post-list-page';
import { PostpageFirst } from '../postpageFirst/postpageFirst';
import { TipsService } from '../../providers/tips-service';

@IonicPage()
@Component({
  selector: 'page-category-list',
  templateUrl: 'category-list.html'
})

export class CategoryList {
  categories;
  currentCategory;

  // Class Constructor
  constructor(
    public loading: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public tipsService: TipsService
  ) {

    //for initial loading 
    this.loadCategory();

    platform.ready().then(() => {
      platform.registerBackButtonAction(() => this.myHandlerFunction());
    })
    
  }

  // Hardware Back button to load Categories Page 
  myHandlerFunction() {
    this.navCtrl.push(PostpageFirst);
  };

  //To load the Favourites Page 
  FavouritePage() {
    this.navCtrl.push(Favourite);
  }
  //onclick to PostpageFirst page
  postPagefirst() {
    this.navCtrl.push(PostpageFirst);
  }

  // For loading the Categories
  loadCategory() {
    let loader = this.loading.create({
      content: 'Getting latest entries...',
    });
    loader.present().then(() => {
      this.tipsService.loadCategory()
        .then(data => {
          this.categories = data;
          this.categories.reverse();
          loader.dismiss();
        });
    });
  }

  // Sends Category name to the Inner Post Page
  setCategory(categ, categid, genderSpecific) {
    this.tipsService.currentCategory = categ;
    this.tipsService.currentCategoryId = categid;
    this.tipsService.genderSpecVal = genderSpecific;
    if (genderSpecific) {
      this.navCtrl.push(PostListPage);
    }
    else {
      this.navCtrl.push(All);
    }

    console.log(this.tipsService.currentCategory);
  }

}
