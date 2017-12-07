import { Component } from "@angular/core";
import { NavController, Content, NavParams } from "ionic-angular";
import { ModalController, ViewController } from "ionic-angular";
import { LoadingController, Platform, ToastController } from 'ionic-angular';
import { Renderer } from "@angular/core";
import { ViewChild } from "@angular/core";
import { Keyboard } from "@ionic-native/keyboard";
import { Storage } from "@ionic/storage";
import { TipsService } from "../../providers/tips-service";
import { LoginPage } from "../login/login";
import { ReplyCommentPage } from "../reply-comment/reply-comment";

@Component({
  selector: "page-comments",
  templateUrl: "comments.html"
})

export class CommentsPage {

  tip;
  data;
  deviceId;
  comment: any = {};
  comments: any;
  @ViewChild(Content) content: Content;
  @ViewChild("focusInputf") myInputB;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    private storage: Storage,
    public renderer: Renderer,
    public viewCtrl: ViewController,
    private keyboard: Keyboard,
    public tipsService: TipsService,
    public modalCtrl: ModalController
  ) {
    this.tip = navParams.get("tipId");
    this.getComments(this.tip);
    this.deviceId = tipsService.getDeviceDetails();
    this.renderer.setElementClass(
      viewCtrl.pageRef().nativeElement,
      "comments",
      true
    );
        platform.ready().then(() => {
      platform.registerBackButtonAction(() => this.myHandlerFunction());
    })
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad CommentsPage");
  }

  // Hardware Back button to load Categories Page 
  myHandlerFunction() {
    this.navCtrl.pop();
  };

  commentBox() {
    this.keyboard.close();
  }
  addComments(comment) {
    console.log("i am working");
    console.log(comment);
    // localStorage.setItem("user",'12345');
    var a: any = localStorage.getItem("user");
    var dataVal = { commentText: comment, userId: a };
    this.tipsService.comment(this.tip, dataVal).then(data => {
      this.comment.commentText = "";
      this.getComments(this.tip);
      console.log(data);
    });
  }

  ProfileModal() {
    let LoginPageModule = this.modalCtrl.create(LoginPage);
    LoginPageModule.present();
  }
  getComments(tipId) {     
    this.tipsService.commentList(tipId).then(data => {
      this.comments = data;
      this.comments.reverse();
      this.scrollToTop();
    });
  }

  presentProfileModal(commentId, repliesList) {
    let ReplyCommentPageModule = this.modalCtrl.create(ReplyCommentPage, {
      commentId: commentId,
      replies: repliesList
    });
    ReplyCommentPageModule.present();
  }

  scrollToTop() {
    this.content.scrollToTop();
  }
  
  // Conversion to Server Date to Local Date
  changeDate(dateVal) {
    let b = new Date(dateVal).toDateString().split(" ");
    if (dateVal!) {
      return b[1] + " " + b[2] + " " + b[3];
    } else {
      return "Just Now";
    }
  }
}
