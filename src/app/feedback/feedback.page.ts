import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RegistrationService } from '../Registration/registration.service';
import { ToastController, LoadingController, NavController, AlertController, Platform } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

isFeedbackVisible:boolean=true;
 toast: any;
 canSubmit = true;
 Feedback:string;
  UserID: any;
  isloggedIn: any;
  isRegister: any;
  Url: string;
  constructor( public toastController: ToastController,
    public router: Router,
    public Feedbackservice :RegistrationService,
    private alertController:AlertController,
    public loadingController: LoadingController,
    private network: Network,
    private translate: TranslateService, 
    private platform: Platform,
    ) 
  {
  
    this.platform.backButton.subscribeWithPriority(6666666,()=>{
      if(window.confirm(this.translate.instant("Do you really want to Exit the App")))
      {
        navigator["app"].exitApp();
      }
  });
    // this.UserID = JSON.parse(localStorage.getItem('UserID'));
    //     this.isloggedIn = JSON.parse(localStorage.getItem('isloggedIn'));
    //     this.isRegister = JSON.parse(localStorage.getItem('isRegister'));



    //console.log("UserIdCheck"+this.UserID);
   }

   ionViewDidEnter()
      {
        this.UserID = JSON.parse(localStorage.getItem('UserID'));
        this.isloggedIn = JSON.parse(localStorage.getItem('isloggedIn'));
        this.isRegister = JSON.parse(localStorage.getItem('isRegister'));      
      }

    
   NetWorkCheck()
   {
     let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.showToast(this.translate.instant("There may be a problem in your internet connection. Please Check a Connection and try again!"))
     });
     disconnectSubscription.unsubscribe();
   }
   //  present Loading method use for loader show when location featching
//#region
async presentLoading() {
  const loading = await this.loadingController.create({
    message: this.translate.instant('Please wait while we Save your Details...'),    
    translucent: true,
    // duration : 9000,
  });
  return await loading.present();
}
//#endregion

  ngOnInit() {
  }
  addFeedback()
  { 
    this.NetWorkCheck();
    if(this.UserID !== null)
    {
    if(this.isloggedIn == true)
    {
    let AddFeedback: IFeedback = {
      //IFeedback Details
      Feedback : this.Feedback,
      UserID : this.UserID
    };
    this.presentLoading();

    if (this.canSubmit) {
      this.canSubmit = false;
      this.Feedbackservice.PostFeedback(AddFeedback).subscribe(
        res => {
          this.loadingController.dismiss().catch(() => {});             
          this.showToast(this.translate.instant("Feedback Details Saved Successfully!!"));
          this.canSubmit = true;
         this.router.navigate(["/home"]);
        },
        err => {
          this.loadingController.dismiss().catch(() => {});             
          this.showToast(this.translate.instant("Feedback Details failed to Saved. Please try again later..."));
          this.router.navigate(["/home"]);
          this.canSubmit = true;
        }
      );
    }
    else {
      this.loadingController.dismiss().catch(() => {});      
      this.showToast(this.translate.instant("Please Wait while other requests are in process..."));       
      this.router.navigate(["/home"]);
    }

  }
else if (this.isloggedIn == false)
  {
    this.presentAlert();
 }
 else // if user id not found
 {
  this.loadingController.dismiss().catch(() => {});             
    this.showToast(this.translate.instant("Please Register or Login again..."));
    this.isloggedIn = false;
    this.isRegister = false;
    localStorage.setItem("isloggedIn", JSON.stringify(this.isloggedIn));
    localStorage.setItem("isRegister", JSON.stringify(this.isRegister));
  AppComponent.isLoggedIn_2 = false;
      this.router.navigate(['/home']); 
 }
}
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
      keyboardClose : true,
      cssClass: "my-custom-class",
    }).then((toastData) => {
    //  console.log(toastData);
      toastData.present();
    });
  }
  //#endregion


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

}
export interface IFeedback   {
  Feedback: string; 
  UserID:string
  }