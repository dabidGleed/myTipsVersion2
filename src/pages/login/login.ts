import { Component } from '@angular/core';
import { Renderer } from '@angular/core';
import { ModalController, NavParams, ViewController } from 'ionic-angular'
import { NavController, Content } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GooglePlus } from '@ionic-native/google-plus';
// import { Facebook } from '@ionic-native/facebook';
// import firebase from 'firebase';
import { PostpageFirst } from '../postpageFirst/postpageFirst';
import { TipsService } from '../../providers/tips-service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
// FB_APP_ID: number = 254622585029422;
  data;
  userProfile: any = null;
  constructor(public navCtrl: NavController, public renderer: Renderer, public tipsService: TipsService, public viewCtrl: ViewController, public navParams: NavParams, private storage: Storage, public googlePlus: GooglePlus) {
    this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'my-popup', true);
    //  this.fb.browserInit(this.FB_APP_ID, "v2.10");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }

  doGoogleLogin() {
    let nav = this.navCtrl;
    let env = this;
    let me = this;
    this.googlePlus.login({
      'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': '543595891066-4rm8d1knc6c7urjss1agn07korvdejtp.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': true
    })
      .then(res => {
        var userDetails: any = {
          firstName: res.displayName,
          email: res.email,
          profilePic: res.imageUrl,
          role: "USER",
          socialType: 'GOOGLE'
        };
        // alert(userDetails.firstName);
        // alert(userDetails.profilePic);
        // alert(userDetails.email);
        // alert(userDetails.role);
        this.tipsService.socialLogin(userDetails)
          .then(res => {
            var a: any = res;
            alert(a.id);
            localStorage.setItem('user', a.id);
            localStorage.setItem('name', a.firstName);
            var b = localStorage.getItem('user');
            this.dismiss(this.data);
          }, err => { })
      })
      .catch(err => alert(err + "IT wont work here"));
  }

//   facebookLogin(){
//     this.fb.login(['email']).then( (response) => {
//         const facebookCredential = firebase.auth.FacebookAuthProvider
//             .credential(response.authResponse.accessToken);

//         firebase.auth().signInWithCredential(facebookCredential)
//         .then((success) => {
//             console.log("Firebase success: " + JSON.stringify(success));
//             this.userProfile = success;
//             alert("Firebase success: " + JSON.stringify(success));
//         })
//         .catch((error) => {
//             console.log("Firebase failure: " + JSON.stringify(error));
//             alert("Firebase failure: " + JSON.stringify(error));
//         });

//     }).catch((error) => { alert(JSON.stringify(error) + 'New test') });
// }

  // doFbLogin() {
  //   let permissions = new Array<string>();
  //   let nav = this.navCtrl;
  //   let env = this;
  //   //the permissions your facebook app needs from the user
  //   permissions = ["public_profile"];
  //   this.fb.login(permissions)
  //     .then(function (response) {
  //       let userId = response.authResponse.userID;
  //       let params = new Array<string>();

  //       //Getting name and gender properties
  //       this.fb.api("/me?fields=name,gender", params)
  //         .then(function (user) {
  //           user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
  //           alert(user.name);
  //           alert(userId);
  //           alert( user.email);
  //            alert( user.picture);
  //           //now we have the users info, let's save it in the NativeStorage
  //           var userDetails: any = {
  //             firstName: user.name,
  //             email: user.email,
  //             profilePic: user.picture,
  //             role: "USER",
  //             socialType: 'FACEBOOK'
  //           };

  //           this.tipsService.socialLogin(userDetails)
  //             .then(res => {
  //               var a: any = res;
  //               localStorage.setItem('user', userId);
  //               var b = localStorage.getItem('user');
  //               // alert(b);
  //             })
  //         })

  //     }, function (error) {
  //       alert(error);
  //     });
  // }


}
