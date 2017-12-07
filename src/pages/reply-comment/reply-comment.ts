import { Component } from '@angular/core';
import { NavController, Content, NavParams } from 'ionic-angular';
import { ModalController, ViewController } from 'ionic-angular';
import { Renderer } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { TipsService } from '../../providers/tips-service';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-reply-comment',
  templateUrl: 'reply-comment.html',
})
export class ReplyCommentPage {
  commentId;
  data;
  deviceId;
  replyComment: any;
  replyComments: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public renderer: Renderer, public viewCtrl: ViewController, private keyboard: Keyboard, public tipsService: TipsService, public modalCtrl: ModalController) {
    this.commentId = navParams.get("commentId");
    this.replyComments = navParams.get("replies");
     this.replyComments.reverse();
    this.getComments(this.commentId);
    this.deviceId = tipsService.getDeviceDetails();
    this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'comments', true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReplyCommentPage');
  }

  commentBox() {
    this.keyboard.close();
  }

  addComments(comment) {
    var a = localStorage.getItem('user');
    var b = localStorage.getItem('name');
      var dataBlock = { "commentText": comment, "userId": a }
      this.tipsService.replyComment(this.commentId, dataBlock)
        .then(data => {
          var newData = { "commentText": comment, "user":{ "firstName": b } }
          this.replyComment = ""
          this.replyComments[this.replyComments.length] = newData;
        });
  }

  ProfileModal() {
    let LoginPageModule = this.modalCtrl.create(LoginPage);
    LoginPageModule.present();
  }

  getComments(commentId) {
    // this.tipsService.commentList(commentId)
    //   .then(data => { 
    //     this.replyComments= data;
    //   });
  }
  // Conversion to Server Date to Local Date
  changeDate(dateVal) {
    let b = new Date(dateVal).toDateString().split(' ');
    if (dateVal!) {
      return b[1] + " " + b[2] + " " + b[3];
    }
    else {
      return "Just Now";
    }

  }

}
