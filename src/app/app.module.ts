//external imports
import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { IonicStorageModule } from "@ionic/storage";
import { Calendar } from "@ionic-native/calendar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Device } from "@ionic-native/device";
import { Push } from "@ionic-native/push";
import { GooglePlus } from "@ionic-native/google-plus";
// import { Facebook } from "@ionic-native/facebook";
import { StatusBar } from "@ionic-native/status-bar";
import { Keyboard } from "@ionic-native/keyboard";
import { Network } from "@ionic-native/network";
import { NgCalendarModule } from "ionic2-calendar";
import { SocialSharing } from "@ionic-native/social-sharing";
import { AppRate } from "@ionic-native/app-rate";
import { YoutubeVideoPlayer } from "@ionic-native/youtube-video-player";
import { AdMob } from "@ionic-native/admob";
// import firebase from 'firebase';
// internal imports
import { LoginPage } from "../pages/login/login";
import { CommentsPage } from "../pages/comments/comments";
import { ReplyCommentPage } from "../pages/reply-comment/reply-comment";
import { MyApp } from "./app.component";
import { HomePage } from "../pages/home/home";
import { CategoryList } from "../pages/category-list/category-list";
import { PostListPage } from "../pages/post-list-page/post-list-page";
import { Favourite } from "../pages/favourite/favourite";
import { Male } from "../pages/male/male";
import { Female } from "../pages/female/female";
import { All } from "../pages/all/all";
import { Postpage } from "../pages/postpage/postpage";
import { Postpagenotify } from "../pages/postpagenotify/postpagenotify";
import { vendorDetails } from "../pages/vendorDetails/vendorDetails";
import { EventsPage } from "../pages/events/events";
import { VendorTipsNewPage } from "../pages/vendor-tips-new/vendor-tips-new";
import { PostpageFirst } from "../pages/postpageFirst/postpageFirst";
import { TipsService } from "../providers/tips-service";
import { ParallaxHeader } from "../components/parallax-header/parallax-header";
import { OrderByPipe } from "../pipes/orderBy";
import { Filter } from "../pipes/filter";
import { RateService } from "../providers/rate-service/rate-service";
// import { SliderPage } from '../pages/slider-page/slider-page';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CategoryList,
    Male,
    Female,
    PostListPage,
    Postpagenotify,
    All,
    Postpage,
    ParallaxHeader,
    PostpageFirst,
    VendorTipsNewPage,
    Favourite,
    vendorDetails,
    // pipes
    Filter,
    OrderByPipe,
    LoginPage,
    CommentsPage,
    ReplyCommentPage,
    EventsPage
    // SliderPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    NgCalendarModule,
    IonicModule.forRoot(MyApp, {
      tabsPlacement: "top",
      tabsHideOnSubPages: "true"
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PostListPage,
    CategoryList,
    Postpagenotify,
    Male,
    Female,
    All,
    Postpage,
    vendorDetails,
    PostpageFirst,
    VendorTipsNewPage,
    Favourite,
    LoginPage,
    CommentsPage,
    ReplyCommentPage,
    EventsPage
    // SliderPage
  ],
  providers: [
    StatusBar,
    TipsService,
    RateService,
    SplashScreen,
    SocialSharing,
    Device,
    YoutubeVideoPlayer,
    AdMob,
    Network,
    AppRate,
    GooglePlus,
    // Facebook,
    Push,
    Calendar,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Keyboard
  ]
})
export class AppModule { }
