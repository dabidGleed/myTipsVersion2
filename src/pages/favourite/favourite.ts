// External Imports
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController, Platform } from 'ionic-angular';

// App Imports
import { Filter } from '../../pipes/filter';
import { Postpage } from '../postpage/postpage';
import { TipsService } from '../../providers/tips-service';

@IonicPage()
@Component({
  selector: 'page-favourite',
  templateUrl: 'favourite.html',
})

export class Favourite {
  tips;
  category;
  fav;
  favourites:any=[];
  categories;
  cate;
  cateName;
  categoryid;
  searchTerm;
 currentCategoryId;
  public search = false;

  // Class Constructor
  constructor(
    public loading: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public tipsService: TipsService
  ) {
    this.loadCategory();
    // CHANGE HERE
     this.currentCategoryId = this.tipsService.currentCategoryId;
    // for single category
    // this.categoryid = this.tipsService.categoryid;
    
    this.loadFavourites();
  }

  // For loading the Categories
  loadCategory() {
     var val = this;
     let loader = this.loading.create({
      content: 'Getting latest entries...',
    });
    loader.present().then(() => {
      this.tipsService.loadCategory()
        .then(data => {
          this.cate = data;
          this.cate.forEach(function (element) {
            if(element.id == val.categoryid ){
                val.cateName = element.name;
            }
          })
          loader.dismiss();
        });
    });
  }

  // For loading the Favourites
  loadFavourites() {
        var val = this;
    
    console.log("favourites");
    let loader = this.loading.create({
      content: 'Getting latest entries...',
    });
    loader.present().then(() => {
      this.tipsService.loadFavourites()
        .then(data => {
          this.fav = data;
          console.log( this.fav);
            val.favourites = [];
           this.fav.forEach(function (element) {
                // For single category
                // if (element.category == val.cateName) {
                //  val.favourites.push(element);
                // }

                // For All Categories
                val.favourites.push(element);
           })
          // this.favourites.reverse();
          loader.dismiss();
        });
    });
  }

  // To load Individual Post in Post Page
  callPost(value) {
    this.navCtrl.push(Postpage, {
      postValue: value
    });
  }

  // For Category name
  getCategory(catVal) {
    var nameret;
    this.categories.forEach(function (element) {
      if (element.id == catVal) {
        nameret = element.name;
      }
    });
    return nameret;
  }

  // To Render the Content till 30 Letters 
  renderContent(textVal) {
    return textVal.slice(0, 30) + "...";
  }

  // To show search box
  showSearch() {
    this.search = true;
  }

  // To hide search box
  hideSearch() {
    this.search = false;
    this.searchTerm = "";
    // this.setFilteredItems();
  }

  // search Filter
  public setFilteredItems() {
    this.favourites = this.tipsService.filterItems(this.searchTerm, this.category);
  }

  //for page auto reload 
  ionViewDidEnter() {
    this.loadFavourites();
  }
}
