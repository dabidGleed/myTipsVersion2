import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Device } from '@ionic-native/device';

@Injectable()
export class TipsService {

  // public categoryid = '59203194f0d7cc0400f47a8c'; //fitness // CHANGE HERE 
  // public categoryid = '590ae2c04702ee04008c73e6'; //yoga
  // public categoryid = '5953911baae5b15d7a15d1de'; //recipie
  // public categoryid = '5920319cf0d7cc0400f47a8d';//beauty

  public data;
  public runningPostVal;
  dataArray: any;
  cate;
  public currentCategoryId;

  public fav: any;
  val;
  public currentCategory;
  public genderSpecVal;
  reload = true;
  public genderServ = 'male';
  constructor(public http: Http, private device: Device) {
    console.log('Hello TipsService Provider');
  }

  //for intial loading of alltips 
  load(skip, limit) {
    if (this.data && this.reload == false) {
      this.reload = true;
      return Promise.resolve(this.data);
    } else {
      return new Promise(resolve => {
        this.http.get('http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/all/tips?skip=' + skip + '&limit=' + limit)
          .map(res => res.json())
          .subscribe(data => {
            this.data = data;
            resolve(this.data);
          });
      });
    }
  }

  // loading categorywise tips
  categoryWiseTips(skip, limit, categoryId) {
    if (this.data && this.reload == false) {
      // already loaded data
      this.reload = true;
      return Promise.resolve(this.data);
    } else {

      // don't have the data yet
      return new Promise(resolve => {
        // We're using Angular HTTP provider to request the data,
        // then on the response, it'll map the JSON data to a parsed JS object.
        // Next, we process the data and resolve the promise with the new data.
        this.http.get('http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/tips/' + categoryId + '/tipsAll?skip=' + skip + '&limit=' + limit)
          .map(res => res.json())
          .subscribe(data => {
            // we've got back the raw data, now generate the core schedule data
            // and save the data for later reference
            // this.data = data;
            this.data = data;
            resolve(this.data);
          });
      });
    }
  }

  //SOcial Login
 socialLogin(data) {
    return new Promise(resolve => {
      this.http.post('http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/socialUser/create',data)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });

  }

  //for gender filter 
  filterGender(dataVal) {
    var serve = this.genderServ;
    console.log(this.genderServ);
    return dataVal.filter((tip) => {
      if (tip.genderSpecific.length == 1) {
        if (tip.genderSpecific[0].toLowerCase().indexOf(serve.toLowerCase()) > -1) {
          console.log('tester');
          return tip;
        }
      } else {
        return tip;
      }
    });
  }

  // fot like tips
  likeTip(tipId, userId) {
    return new Promise(resolve => {
      this.http.post('http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/tips/like/' + tipId + '/' + userId, '')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });

  }

  // for push notifications
  pushSetup(deviceTokenVal) {
    return new Promise(resolve => {
      var device = this.getDeviceDetails();
      var body = {
        userId: device,
        deviceToken: deviceTokenVal,
        appType: 'all'
        // appType: this.categoryid // CHANGE HERE
      }
      this.http.post('http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/user/map', body)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });

  }

  // search for alltips 
  search(str, skip, limit) {
    if (this.data && this.reload == false) {
      this.reload = true;
      return Promise.resolve(this.data);
    } else {
      return new Promise(resolve => {
        this.http.get('http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/tips/' + str + '/searchTips?skip=' + skip + '&limit=' + limit)
          .map(res => res.json())
          .subscribe(data => {
            this.data = data;
            resolve(this.data);
          });
      });
    }
  }

  getDeviceDetails() {
    return this.device.uuid;
  }

  //for favourite tips
  favTip(tipId, userId) {
    return new Promise(resolve => {
      this.http.post('http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/tips/favorite/' + tipId + '/' + userId, '')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });

  }


  filterItems(searchTerm, category) {
    return this.data.filter((tip) => {
      if (tip.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
        return tip;
      }
    });
  }

  //for get gender
  getGender(gval) {
    this.genderServ = gval;
    this.reload = false;
  }
  //for get current Category
  getcurrentCategory(currentcatg) {
    this.currentCategory = currentcatg;
  }

  //for load category
  loadCategory() {
    console.log('category');
    if (this.cate) {
      return Promise.resolve(this.cate);
    } else {
      return new Promise(resolve => {
        this.http.get('http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/category/list/all')
          .map(res => res.json())
          .subscribe(data => {
            this.cate = data;
            resolve(this.cate);
          });
      });
    }
  }

  // for load favourites
  loadFavourites() {
    var userVal = this.getDeviceDetails();
    if(!userVal){
      userVal = '12345';
    }
    console.log('category');
    return new Promise(resolve => {
      this.http.get('http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/tips/' + userVal + '/favourites')
        .map(res => res.json())
        .subscribe(data => {
          this.fav = data;
          resolve(this.fav);
        });
    });
  }

  // for categorywise Search
  searchCategoryWise(categoryId, str, skip, limit) {
    if (this.data && this.reload == false) {
      this.reload = true;
      return Promise.resolve(this.data);
    } else {
      return new Promise(resolve => {
        this.http.get('http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/tips/' + categoryId + '/' + str + '/categoryTipsSearch?skip=' + skip + '&limit=' + limit)
          .map(res => res.json())
          .subscribe(data => {
            this.data = data;
            resolve(this.data);
          });
      });
    }
  }

  // for to get vendor details
  public vendorDetails(userId) {
    return new Promise(resolve => {
      this.http.get('http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/user/' + userId + '/updateUser')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        }, err => {
          resolve(err);
        });
    });
  }

  // to get vandor
  public getVendor(vendorID) {
    return new Promise(resolve => {
      this.http.get('http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/user/' + vendorID + '/listUser')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        }, err => {
          resolve(err);
        });
    });
  }

  // to get alltips
  public allTips(userId, skip, limit) {
    return new Promise(resolve => {
      this.http.get('http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/tips/' + userId + '/list/allUser?skip=' + skip + '&limit=' + limit)
        .map(res => res.json())
        .subscribe(data => {
          this.dataArray = data;
          resolve(this.dataArray);
        }
        );
    });
  }

  // to get vies count
  public views(tipId, userId) {
    return new Promise(resolve => {
      this.http.get('http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/tips/' + tipId + '/' + userId + '/tipViews')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        }, err => {
          resolve(err);
        });
    });
  }


  // for searchVendorWise tips
  searchVendorWise(userId, str, skip, limit) {
    if (this.data && this.reload == false) {
      this.reload = true;
      return Promise.resolve(this.data);
    } else {
      return new Promise(resolve => {
        this.http.get('http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/tips/' + userId + '/' + str + '/userWiseTipsSearch?skip=' + skip + '&limit=' + limit)
          .map(res => res.json())
          .subscribe(data => {
            this.data = data;
            resolve(this.data);
          });
      });
    }
  }

  // for adding comment through tipid
  comment(tipId, data) {
    return new Promise(resolve => {
      this.http.post('http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/tips/add/' + tipId + '/comment', data)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }

  // reply commemt for commentid
  replyComment(commentId, data) {
    return new Promise(resolve => {
      this.http.post('http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/tips/' + commentId + '/listReplyComments', data)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });

  }

  // for getting comment list
  commentList(tipId) {
    return new Promise(resolve => {
      this.http.get('http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/tips/' + tipId + '/listComments')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        }, err => {
          resolve(err);
        });
    });
  }
}
