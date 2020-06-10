import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController, AlertController, Platform } from '@ionic/angular';
import * as $ from 'jquery'; // import Jquery here 
import { HomePage } from 'src/app/home/home.page';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import * as L from "leaflet";
import { SafetyService } from '../safety.service';
import { Network } from '@ionic-native/network/ngx';
import { RegistrationService } from 'src/app/Registration/registration.service';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-routine-safety',
  templateUrl: './routine-safety.page.html',
  styleUrls: ['./routine-safety.page.scss'],
})
export class RoutineSafetyPage implements OnInit {
  isloggedIn: boolean;

  
  
  //contructor method start
  constructor( private router: Router,
    public toastController: ToastController,
    public safetyService :SafetyService,
    public loadingController:LoadingController,   
    public alertController: AlertController,
    private geolocation: Geolocation,
    private network: Network,
    private translate: TranslateService,
    private platform: Platform,

    ) {
      this.platform.backButton.subscribeWithPriority(6666666,()=>{
        if(window.confirm(this.translate.instant("Do you really want to Exit the App")))
        {
          navigator["app"].exitApp();
        }
    });
    }
  // End Constructor   
  //#endregion

  maxDate: string = new Date().toISOString();


  ionViewDidEnter()
  {
    this.UserID = JSON.parse(localStorage.getItem('UserID'));

  
  }

  Onchange(event)
  {
    $("#ed_endtimedate").change(function() {

      var startDate = (document.getElementById('ed_starttimedate') as HTMLTextAreaElement).value;
      var endDate = (document.getElementById('ed_endtimedate') as HTMLTextAreaElement).value;
  
      if ((Date.parse(endDate) <= Date.parse(startDate))) {
        alert("End date should be greater than Start date");
        (document.getElementById('ed_endtimedate') as HTMLTextAreaElement).value;
      }
    });
  }

  Place_lat: any;
  Place_long: any;
  Hosp_Add_lat: any;
  Hosp_Add_long: any;


    ShowHideDiv() {
      $("input[name='Current_Status']").click(function () {
        if ($("#chkNo").is(":checked")) {
          $("#dvPassport").hide();
          $("#dvPassportNot").show(); 
        } else if ($("#chkYes").is(":checked")) {
          $("#dvPassport").show();
          $("#dvPassportNot").hide();
        }
    });
  }



    //#endregion

    NetWorkCheck()
    {
      let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
        this.showToast(this.translate.instant("There may be a problem in your internet connection. Please Check a Connection and try again!"))
      });
      disconnectSubscription.unsubscribe();
    }
    //#region 
    //Global Declaration Common Variables
    isSymptomsVisible: boolean = true;
  
   toast: any;
   canSubmit = true;
  
   isMarkSafeVisible:boolean =true;


    // Location
    isVisitAddressLocationInfoVisible: boolean = false;
 isReadonly() { return true; }
//#endregion

  
 

  //IAddSafety
  Current_Status: string;
  From_Date: any;
  To_Date: any;

  //Global for Current Address 
UserID: string;
Current_lat: any;
Current_long: any;
Current_Loc_Accuracy: any
  
  //ISymptoms
  SymptomID: number;
  Cough: boolean; 
  Cold: boolean; 
  Fever: boolean; 
  RunnyNose: boolean; 
  SoreThroat: boolean; 
  Diarrhea: boolean; 
  Pains: boolean; 
  Breathing: boolean;  
  Fit: boolean; 

  //#endregion
  //#region 
  
// Tab Button Click
//#region 
btn_TestTabClick()
  {
    this.Current_lat;
    this.Current_long;
    this.Hosp_Add_lat=this.Current_lat;
    this.Hosp_Add_long=this.Current_long;
      this.router.navigate(['/test']);
  }
  
  btn_daliyVisitTabClick()
  {
    this.Current_lat;
    this.Current_long;
    this.Place_lat=this.Current_lat;
    this.Place_long=this.Current_long;
   this.router.navigate(['/daily-visit']);
  }
  btn_routinSafetyTabClick()
  {
      this.router.navigate(['/routine-safety']);
  }
//#endregion



 //  present Loading method use for loader show when location featching
  //#region
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: this.translate.instant('Please wait while we Save your Details...'),
      translucent: true,
     duration: 30000,
    });
    return await loading.present();
  }
  //#endregion


  // After Init call Function
  //#region 
  ionViewWillEnter() {
    this.OnClick_Safety_Address();

  }
//#endregion



//ngOnInit start
ngOnInit() 
 {

}


//ngOnInit End
//#endregion
  
  
  //#region  //IAddSafety
  addSafety()
  {
    if(this.UserID !== null)
      {
  this.NetWorkCheck();
    let AddSafety: IAddSafety = {

      //Safety Details
    Current_Status:this.Current_Status,
    From_Date: this.From_Date,
    To_Date: this.To_Date,
    
    //ISymptoms Details
    Cough: this.Cough,
    Cold: this.Cold,
    Fever: this.Fever,
    RunnyNose: this.RunnyNose,
    SoreThroat: this.SoreThroat,
    Diarrhea: this.Diarrhea,
    Pains: this.Pains,
    Breathing: this.Breathing,
    Fit: this.Fit,


//Current Address Details
UserID: this.UserID,
Current_lat: this.Current_lat,
Current_long: this.Current_long,
Current_Loc_Accuracy: this.Current_long

    };
    this.presentLoading();

    if (this.canSubmit) {
      this.canSubmit = false;
      this.safetyService.PostSafety(AddSafety).subscribe(
        res => {
                   this.loadingController.dismiss().catch(() => {});             

          this.showToast(this.translate.instant("Checkup Details Saved Successfully!!"));
          this.router.navigate(['/home']);
          this.canSubmit = true;
        },
        err => {
                   this.loadingController.dismiss().catch(() => {});             

                   this.showToast(this.translate.instant("Checkup Details failed to Saved. Please try again later..."));
          this.router.navigate(['/home']);
          this.canSubmit = true;
        }
      );
    }
    else {
               this.loadingController.dismiss().catch(() => {});             
               this.showToast(this.translate.instant("Please Wait while other requests are in process..."));
      this.router.navigate(['/home']);
    }
  }
  else // if user id not found
  {
    this.showToast(this.translate.instant("Please Register or Login again..."));
    this.isloggedIn = false;
          localStorage.setItem("isloggedIn", JSON.stringify(this.isloggedIn));
           AppComponent.isLoggedIn_2 = false;
           this.router.navigate(['/home']); 
  }
}
  //#endregion
  

 //Map current Location Function
  //#region
  OnClick_Safety_Address() {
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
      var latlng = new L.LatLng(resp.coords.latitude, resp.coords.longitude);
     // alert(latlng);
      this.Current_Loc_Accuracy = resp.coords.accuracy;
      this.Current_lat = latlng.lat;
      this.Current_long = latlng.lng;
     // map.flyTo(latlng, 16);
     //var staticMarker = L.marker(latlng, { draggable: false }).addTo(map)
        // .bindPopup("Your Currently Located Here" + "Drag Marker to Select another Location").openPopup();
    }).catch((error) => {
    //  console.log('Error getting location', error);
    });
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
  //#region //IAddSafety
    export interface IAddSafety extends ISymptoms, ICurrentAddress{ 
      Current_Status: string;
      From_Date: any;
      To_Date: any;
      } 
      export interface ISymptoms   {
        Cough: boolean; 
        Cold: boolean; 
        Fever: boolean; 
        RunnyNose: boolean; 
        SoreThroat: boolean; 
        Diarrhea: boolean; 
        Pains: boolean; 
        Breathing: boolean; 
        Fit: boolean; 
        }

          // Current Address Interface
export interface ICurrentAddress {
  UserID: string;
  Current_lat: any;
  Current_long: any;
  Current_Loc_Accuracy: any
}
        //#endregion

