import { Component, OnInit } from '@angular/core';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HomePage } from './home/home.page';
import { Routes, Router } from '@angular/router';
import { timer } from 'rxjs'
import { RegistrationService } from './Registration/registration.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Network } from '@ionic-native/network/ngx';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  isLoggedIn: any;
  isRegister: any;
  UserID: any;
  Name_2: any;
  MobileNo_2: any;
  Email_2: any;
  UserID_2: any;
  User_Type_2: any;
  Password_2: any;
  public static isLoggedIn_2 = false;
  isRegister_2: any;
  showSplash = true;
  showBtnLogin: boolean = true;
  currentUser: any;
  Name: any;
  MobileNo: any;
  Email: any;
  ParentID: any;
  User_Type: any;
  Password: any;
  changeStatus;
  toast: Promise<void>;
  shareLink: any;
  isloggedIn: boolean;
  subscribe: any;

  userRes: any[];
  Version: any;
  AppVer = HomePage.AppVersion;




  public appPages = [
    {
      title: 'Registration',
      url: '/citizen',
      icon: 'person-add'
    },

    {
      title: 'Feedback',
      url: '/feedback',
      icon: 'paper-plane'
    }
  ];

  public routes: Routes = [
    {
      path: 'home',
      component: HomePage,
      children: [
        {
          path: 'relocation',
          children: [
            {
              path: '',
              loadChildren: './Migration/migration.module'
            }
          ]
        },
        {
          path: 'routine-safety',
          redirectTo: './Safety/routine-safety/routine-safety.module',
          pathMatch: 'full'
        }
      ]
    }
  ];
  navigate: { title: string; url: string; icon: string; }[];


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public router: Router,
    public citizenService: RegistrationService,
    private alertController: AlertController,
    private socialSharing: SocialSharing,
    public toastController: ToastController,
    public register: RegistrationService,
    private network: Network,
    private translate: TranslateService,

  ) {
    this.platform.backButton.subscribeWithPriority(6666666, () => {
      if (window.confirm(this.translate.instant("Do you really want to Exit the App"))) {
        navigator["app"].exitApp();
      }
      else {
        window.history.back();
      }

    });
    platform.ready().then(() => {
      this.hideSplashScreen();

    });
  }
  hideSplashScreen() {
    if (this.splashScreen) {
      setTimeout(() => {
        this.splashScreen.hide();
      }, 100);
    }
    this.initializeApp();
  }





  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      timer(3000).subscribe(() => this.showSplash = false);
    });


    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.showToast(this.translate.instant("There may be a problem in your internet connection. Please Check a Connection and Please try again!"))
    });
    disconnectSubscription.unsubscribe();



    this.register.getVer().subscribe((data) => {
      this.Version = data;
     // console.log("Ver", this.AppVer + this.Version)
      if (this.AppVer == this.Version) {
        //Check any data available in local db 
        if (localStorage.getItem("Name") === null) {
          //If available then not available creat db & insert record
          localStorage.clear();
          this.isRegister = false;
          this.isloggedIn = false;
          localStorage.setItem("isRegister", JSON.stringify(this.isRegister));
          localStorage.setItem("isloggedIn", JSON.stringify(this.isloggedIn));
          this.router.navigate(['/policy']); // Policy Page calling method
          this.getShare();
        }
        else {
          //If available then get isRegistr field and assign vale to existing field
          this.isRegister = JSON.parse(localStorage.getItem('isRegister'));
          this.isloggedIn = JSON.parse(localStorage.getItem('isloggedIn'));
          AppComponent.isLoggedIn_2 = this.isloggedIn;
        }
        this.isRegister = JSON.parse(localStorage.getItem('isRegister'));
        this.isloggedIn = JSON.parse(localStorage.getItem('isloggedIn'));

      }
      else {
        this.router.navigate(['/update-page']);
        // this.UpdateAlert();
      }
    })
  }




  //Get Share URL Function
  getShare() {
    //If there is any change in the item then disable the enableTrainingTab flag
    this.register.getShareLink().subscribe((data) => {
      this.shareLink = data;
      // console.log( "in Get Talukas  " + this.shareLink);
      localStorage.setItem("ShareLinkUrl", JSON.stringify(this.shareLink));
      this.shareLink = JSON.parse(localStorage.getItem('ShareLinkUrl'));
    });
  }



  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }

  CheckLogin_Migration() {
    if (AppComponent.isLoggedIn_2 == true) {

      this.router.navigate(['/relocation']);

    } else {
      this.presentAlert();
    }
  }
  CheckLogin_Checkup() {
    if (AppComponent.isLoggedIn_2 == true) {
      this.router.navigate(['/routine-safety']);
    } else {
      this.presentAlert();
    }
  }

  backButtonEvent() {
    window.history.back();
  }


  async presentAlert() {
    const alert = await this.alertController.create({
      header: this.translate.instant('Registration Alert'),
      message: this.translate.instant('Please Register or Login to completely access the application features.'),
      buttons: [
        {
          text: this.translate.instant('Okay'),
          handler: () => {
            this.router.navigate(['/home']);
          }
        }
      ],
      backdropDismiss: false,

    });

    await alert.present();
  }

  async presentAlertLogout() {
    const alert = await this.alertController.create({
      header: this.translate.instant('Alert'),
      message: this.translate.instant('Are you sure you want to logout?'),
      buttons: [
        {
          text: this.translate.instant('Okay'),
          handler: () => {
            this.isloggedIn = false;
            localStorage.setItem("isloggedIn", JSON.stringify(this.isloggedIn));
            AppComponent.isLoggedIn_2 = false;
            this.userRes = [];
            //localStorage.clear();
            this.showToast(this.translate.instant("You have been successfully logged out!"));
            this.router.navigate(['/home']);
          }
        },
        {
          text: this.translate.instant('Cancel'),
          handler: () => {
            this.isloggedIn = true;
            AppComponent.isLoggedIn_2 = true;
            localStorage.setItem("isloggedIn", JSON.stringify(this.isloggedIn));
            this.router.navigate(['/home']);
          }
        }
      ],
      backdropDismiss: false,

    });

    await alert.present();
  }


  Logout() {
    if (AppComponent.isLoggedIn_2 == false) {
      this.router.navigate(['/login']);
    } else {
      //logout function
      this.presentAlertLogout();
    }
  }





  SocialShare() {
    this.shareLink = JSON.parse(localStorage.getItem('ShareLinkUrl'));
    // this is the complete list of currently supported params you can pass to the plugin (all optional)
    var options = {
      message: 'I recommend Yoddha Parivartan app for Migration. Please download and share it using this play store link for Android.', // not supported on some apps (Facebook, Instagram)
      //subject: 'Panademic', // fi. for email
      // files: ['', ''], // an array of filenames either locally or remotely
      url: this.shareLink,
      //url: 'https://play.google.com/store/apps/details?id=io.coder.farming',
      // chooserTitle: 'Pick an app', // Android only, you can override the default share sheet title
      //appPackageName: 'yoddha.coderize.in', // Android only, you can provide id of the App you want to share with
      // iPadCoordinates: '0,0,0,0' //IOS only iPadCoordinates for where the popover should be point.  Format with x,y,width,height
    };

    this.socialSharing.shareWithOptions(options);
    console.log("Url", this.shareLink);
  }

  get getLoginStatus() {
    var retVal = "Login"
    if (AppComponent.isLoggedIn_2) {
      retVal = "LogOut";
    }
    //console.log("Check Status",retVal);
    return retVal;
  }


  // Toster Method
  //#region 
  showToast(msg: string) {
    this.toast = this.toastController.create({
      message: msg,
      position: 'bottom',
      duration: 4000,
      buttons: [this.translate.instant('Cancel')],
      animated: true,
      keyboardClose: true,
      cssClass: "my-custom-class",
    }).then((toastData) => {
      //  console.log(toastData);
      toastData.present();
    });
  }
  //#endregionendregion
}
















