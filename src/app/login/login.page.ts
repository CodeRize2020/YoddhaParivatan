import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController, Platform } from '@ionic/angular';
import { RegistrationService } from '../Registration/registration.service';
import { AppComponent } from '../app.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Observable';
import { Network } from '@ionic-native/network/ngx';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  // Goble declaration
  //#region 
  baseUrl = "https://yoddha.coderize.in/";
  Get_loginCitizen = "checkCitizen/";
  changeValue: any = "Citizen";

  mobileno: number;
  password: string;
  data: any;
  toast: any;
  isRegister: boolean;
  isloggedIn: any;

  // Insert Local Db
  Name: string = "";
  MobileNo: number = null;
  Password: string = "";
  Email: string;
  ParentID: string;
  User_Type: string;
  UserID: string;

  //#endregion


  // Consutructor
  //#region 
  constructor(private router: Router,
    public toastController: ToastController,
    public citizenService: RegistrationService,
    private http: HttpClient,
    public appcom: AppComponent,
    public loadingController: LoadingController,
    private network: Network,
    private translate: TranslateService, 
    private platform: Platform,
  ) {
      let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
        this.showToast(this.translate.instant("There may be a problem in your internet connection. Please Check a Connection and try again!"))
      });
      disconnectSubscription.unsubscribe();
    
    if (AppComponent.isLoggedIn_2 == false) {
      this.isRegister = JSON.parse(localStorage.getItem('isRegister'));
      this.isloggedIn = JSON.parse(localStorage.getItem('isloggedIn'));
      console.log("Dashboard Checking" + this.isRegister, this.isloggedIn);
    }
    else {
      var msg = this.translate.instant("You are already Logged In");
      this.showToast(msg);
      var nav = this.router.navigate(["/home"]);
    }
  }
  //#endregion


  // All Extra Fuctionality
  //#region 

  //  present Loading method use for loader show when location featching
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: this.translate.instant('Please wait while we check your Details...'),
      translucent: true,
      duration : 30000,
    });
    return await loading.present();
  }

  // OnInit Function
  ngOnInit() {
  }
  //#endregion



  // Validate User Fuction check login button click user valid or not using this fuction
  //#region 
  ValidateUser(frmObject) {
      // user input values variable
      var mobile1 = frmObject.mobileno;
      var password1 = frmObject.password;
      // present loader
      this.presentLoading();
      // get api for get citizen details
      this.http.get(this.baseUrl + this.Get_loginCitizen + mobile1 + '/' + password1)
        .subscribe(
          (res: any) => {
            this.data = res;
           // console.log("res==>>", this.data); 
            this.Email = this.data.Email;
            this.Name = this.data.Name;
            this.MobileNo = this.data.MobileNo;
            this.UserID = this.data.UserID;
            // check response get NA or not
            // if (this.data[0].MobileNo == frmObject.mobileno && this.data[0].Password == frmObject.password) {
            if (this.data !== "NA") {
              // if get response dismiss loader
              this.loadingController.dismiss().catch(() => {});             
              // change value of isLogin or isRegister and response save in local Storge
              this.isloggedIn = true;
              this.isRegister = true;
              localStorage.setItem("isloggedIn", JSON.stringify(this.isloggedIn));
              localStorage.setItem("isRegister", JSON.stringify(this.isRegister));
              localStorage.setItem("MobileNo", JSON.stringify(this.MobileNo));
              localStorage.setItem("Name", JSON.stringify(this.Name));
              localStorage.setItem("UserID", JSON.stringify(this.UserID));
              localStorage.setItem("Password", JSON.stringify(frmObject.password));
              localStorage.setItem("Email", JSON.stringify(this.Email));
              AppComponent.isLoggedIn_2 = true; // Using App component variable set isLogging True
              this.showToast(this.translate.instant("You are successfully logged in"));
              this.router.navigate(["/home"]);
            }
            else if (this.data == "NA") {
              this.loadingController.dismiss().catch(() => {});             
              AppComponent.isLoggedIn_2 = false; // Using App component variable set isLogging False
              this.showToast(this.translate.instant("Invalid Credentials"));
            }
          },
          // if respose of server side get any error catch error and show
          catchError((err: HttpErrorResponse) => {
            this.loadingController.dismiss().catch(() => {});             
            this.showToast(this.translate.instant("Server Error. Please try after sometime."));
            return Observable.throw(err.message || "server error");
          }));
  }
  //#endregion


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

}
