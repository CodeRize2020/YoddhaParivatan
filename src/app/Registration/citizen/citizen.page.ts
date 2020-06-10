import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController, NavController, AlertController, Platform } from '@ionic/angular';
import { RegistrationService } from '../registration.service';
import { Router } from '@angular/router';
import * as L from "leaflet";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Guid } from 'guid-typescript';
import { Storage } from '@ionic/storage';
import * as $ from 'jquery'
import { AppComponent } from 'src/app/app.component';
import { Network } from '@ionic-native/network/ngx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-citizen',
  templateUrl: './citizen.page.html',
  styleUrls: ['./citizen.page.scss'],
})
export class CitizenPage implements OnInit {
// local Storage Arrya
items: IAddLocalCitizen[] = [];
Iaddlocal: IAddLocalCitizen = <IAddLocalCitizen>{};
static homeinitialMapLoad: boolean = false;



//Global Declaration
//#region 
toast: any;
canSubmit = true;
public onlineOffline: boolean = navigator.onLine;


//Persona InfoisAddButtonVisible
isPersonalInfoVisible: boolean = true;

//Personal Medical Info
isPersonalMedicalInfoVisible: boolean = true;

//Diabetes Info
isDiabetesVisible: boolean = true;

// Location
isHomeAddressLocationInfoVisible: boolean = true;
isCurrentAddressLocationInfoVisible: boolean = false;
static staticMarker;
  data: any;
  LocalUserID: any;
isReadonly() { return true; }
isloggedIn: boolean = false;


isAddButtonVisible: boolean = false;
isRegister: boolean;
isAddedMemer: boolean = false;
AddMemerCount: number = 0;


covert_string_guid: string;
Unique_guid: string;
guid: any;


// Global Variable for AddCitizen
Profession: string;
User_Type: string;
Member_Type: string;
ParentID: string;

// Global Variable for PersonalInfo
Name: string = "";
MobileNo: number =null;
Password: string = "";
Email: string ;
Gender: string;
Photo: string;

// Global Variable for PersonalMedicalInfo
Age: number;
BloodGroup: string;
Weight: number;
Smoking: boolean;
Drinking: boolean;


// Global Variable for Diabetes
Diabetes: boolean;
Blood_Pressure: boolean;
Asthama: boolean;
Hypertension: boolean;
Lung_Disease: boolean;
Heart_Disease: boolean;

No_Disease:boolean;
Other_Disease:string;


// Global Variabel for Current Address 
UserID: string;
Current_lat: any;
Current_long: any;
Current_Loc_Accuracy: any;


// Global Variable for Location
Home_Address: string;
Home_Add_lat: string = "";
Home_Add_long: string = "";

//#endregion


//Constructor
//#region 
constructor(
  public toastController: ToastController,
  public registrationService: RegistrationService,
  private geolocation: Geolocation,
  public loadingController: LoadingController,
  public router: Router,
  public alertController: AlertController,
  private network: Network,
  private translate: TranslateService ,
  private platform: Platform,

) {
  this.platform.backButton.subscribeWithPriority(6666666,()=>{
    if(window.confirm(this.translate.instant("Do you really want to Exit the App")))
    {
      navigator["app"].exitApp();
    }
});
  // this.isRegister = JSON.parse(localStorage.getItem('isRegister'));
  // this.LocalUserID = JSON.parse(localStorage.getItem('UserID'));

  //console.log("Dashboard Checking"+this.isRegister);

 //#endregion

}

ionViewDidEnter()
{
  this.isRegister = JSON.parse(localStorage.getItem('isRegister'));
  this.LocalUserID = JSON.parse(localStorage.getItem('UserID'));
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
    duration : 30000,
  });
  
  return await loading.present();
}
//#endregion


// After Init call Function
//#region 
ionViewWillEnter() {
  if(CitizenPage.homeinitialMapLoad == false)
  {
    this.OnClick_Home_Address();

  }
  $('div.Home_Map_Div').hide();
  $('#Home_Address').focus(function () {
    $('div.Home_Map_Div').show();
  });
}
//#endregion

ngOnInit() {
  this.presentAlert();
}


// Map Diva close button function
//#region 
closedMapDiv() {
  $('div.Home_Map_Div').hide();
}
//#endregion

//Map current Location Function
//#region
OnClick_Home_Address() {
  var map = new L.map('citizenmap').setView([18.5314, 73.8446], 8, { minZoom: 1, maxZoom: 20 });
  map.center = [18.5314, 73.8446];
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
  }).addTo(map);
  CitizenPage.homeinitialMapLoad = true;
  this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
    var latlng = new L.LatLng(resp.coords.latitude, resp.coords.longitude);
    this.Current_Loc_Accuracy = resp.coords.accuracy;
    this.Current_lat = latlng.lat;
    this.Current_long = latlng.lng;
    this.Home_Add_lat = latlng.lat;
    this.Home_Add_long = latlng.lng;
    map.flyTo(latlng, 16);
    CitizenPage.staticMarker = L.marker(latlng, { draggable: true }).addTo(map)
      // .bindPopup("Your Currently Located Here" + "Drag Marker to Select another Location").openPopup();
    CitizenPage.staticMarker.on('dragend', function (event) {
    //  console.log("In Drage")
      CitizenPage.staticMarker = event.target;
      var position = CitizenPage.staticMarker.getLatLng();
      CitizenPage.staticMarker.setLatLng([position.lat, position.lng], { draggable: 'true' });
      map.panTo([position.lat, position.lng]);
      (document.getElementById('Home_Add_lat') as HTMLTextAreaElement).value = CitizenPage.staticMarker.getLatLng().lat;
      (document.getElementById('Home_Add_long') as HTMLTextAreaElement).value = CitizenPage.staticMarker.getLatLng().lng;
     // console.log("In function Lat Long", CitizenPage.staticMarker.getLatLng().lat, CitizenPage.staticMarker.getLatLng().lng);

    });

  }).catch((error) => {
    //console.log('Error getting location', error);
  });
}
//#endregion



// Post Method for to submit Add Citizen Details Form.
//#region 
addCitizen() {
  this.NetWorkCheck();
  if (this.LocalUserID == null) {
    if (this.isRegister == false) {
    //this will be true and no one register on the device
    this.UserID = "CZ"+Guid.create().toString();
    this.User_Type = "Citizen_Parent",
      this.ParentID = this.UserID
  }
  if (this.isRegister == true) {
    this.showToast(this.translate.instant("You are already Registered"));
    this.router.navigate(['/home']);
  }
  let AddCitizen: IAddCitizen = {
    // AddCitizen Details
    Profession: this.Profession,
    User_Type: this.User_Type,
    ParentID: this.ParentID,
    Member_Type: this.Member_Type,

    // PersonalInfo Details
    Name: this.Name,
    MobileNo: this.MobileNo,
    // Password: this.registrationService.encrypt(this.Password),
    Password : this.Password,
    Email: this.Email,
    Gender: this.Gender,

    // PersonalMedicalInfo Details
    Age: this.Age,
    BloodGroup: this.BloodGroup,
    Weight: this.Weight,
    Smoking: this.Smoking,
    Drinking: this.Drinking,

    // Diabetes Details
    Diabetes: this.Diabetes,
    Blood_Pressure: this.Blood_Pressure,
    Asthama: this.Asthama,
    Hypertension: this.Hypertension,
    Lung_Disease: this.Lung_Disease,
    Heart_Disease: this.Heart_Disease,
    No_Disease:this.No_Disease,
    Other_Disease:this.Other_Disease,
    // Home Address Details
    Home_Address: this.Home_Address,
    Home_Add_lat: this.Home_Add_lat,
    Home_Add_long: this.Home_Add_long,

    // Current Address Details
    Current_lat: this.Current_lat,
    Current_long: this.Current_long,
    Current_Loc_Accuracy: this.Current_Loc_Accuracy,
    UserID: this.UserID
  };
  this.presentLoading();
  if (this.canSubmit) {
    this.canSubmit = false;
    this.registrationService.PostAddCitizen(AddCitizen).subscribe(
      res => {
        if(this.isRegister == false)
        {
                   this.loadingController.dismiss().catch(() => {});             

          this.data = res;
          this.isRegister= true;
          this.isloggedIn= true;
           // If user not register local fields are update usin update method
           localStorage.setItem("isloggedIn", JSON.stringify(this.isloggedIn));
           localStorage.setItem("Name", JSON.stringify(this.Name));
           localStorage.setItem("UserID", JSON.stringify(this.UserID));
           localStorage.setItem("MobileNo", JSON.stringify(this.MobileNo));
           localStorage.setItem("Password", JSON.stringify(this.Password));
           localStorage.setItem("isRegister", JSON.stringify(this.isRegister));
           localStorage.setItem("Email", JSON.stringify(this.Email));

          AppComponent.isLoggedIn_2 = true;
         // console.log("Respose", AddCitizen);
         this.showToast(this.translate.instant("You have successfully registered"));
          this.canSubmit = true;
          this.router.navigate(['/home']);
        }
        else if(this.isRegister == true)
        {
          this.loadingController.dismiss().catch(() => {});             
          this.showToast(this.translate.instant("You are already Registered"));
          this.router.navigate(['/home']);
        }
      },
      err => {
                 this.loadingController.dismiss().catch(() => {});             
                 this.showToast(this.translate.instant("Registration failed. Please try again later..."));
        this.router.navigate(['/home']);
        AppComponent.isLoggedIn_2 = false;
        this.canSubmit = true;
      }
    );
  }
  else
  {
    this.loadingController.dismiss().catch(() => {});             
     this.showToast(this.translate.instant("Please Wait while other requests are in process..."));
    this.router.navigate(['/home']);
  }
}
else
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
//#endregion




async presentAlert() {
  const alert = await this.alertController.create({
    header: this.translate.instant('Please Note'),
    message: this.translate.instant('I hereby declare that information provided will be accurate.'),
    buttons: [
      {
        text: this.translate.instant('Okay'),
        handler: () => {
        }
      }
    ],
    backdropDismiss: false,

  });
  await alert.present();
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
  //#endregionendregion

}
//Interface
//#region
//IAddCitizen Main Interface
export interface IAddCitizen extends IPersonalnfo, IPersonalMedicallnfo, IDisease, IHomeAddress, ICurrentAddress {
  Profession: string;
  User_Type: string;
  Member_Type: string;
  ParentID: string;
}

//PersonalInfo Sub Interface
export interface IPersonalnfo {
  Name: string;
  MobileNo: number;
  Password: string;
  Email: string;
  Gender: string;
  // Photo: string;
}

//PersonalMedicalInfo Sub Interface
export interface IPersonalMedicallnfo {
  Age: number;
  BloodGroup: string;
  Weight: number;
  Smoking: boolean;
  Drinking: boolean;
}

//Disease Sub Interface
export interface IDisease {
  Diabetes: boolean;
  Blood_Pressure: boolean;
  Asthama: boolean;
  Hypertension: boolean;
  Lung_Disease: boolean;
  Heart_Disease: boolean;
  No_Disease:boolean;
  Other_Disease:string;
}

// Current Address Interface
export interface ICurrentAddress {
  UserID: string;
  Current_lat: any;
  Current_long: any;
  Current_Loc_Accuracy: any
}

//Disease Sub Interface
export interface IHomeAddress {
  Home_Address: string;
  Home_Add_lat: any;
  Home_Add_long: any;
}
//#endregion


//Local Interface
//#region 
export interface IAddLocalCitizen {
  UserID: string;
  Name: string;
  MobileNo: number;
  Email: string;
  User_Type: string;
  Password: string;
  isRegister : boolean;
  isLoggedIn : boolean;
}

export interface IUpdateLocalCitizen {
  UserID: string;
  Name: string;
  MobileNo: number;
  Email: string;
  User_Type: string;
  Password: string;
  isRegister : boolean;
  isLoggedIn : boolean;
}

//#endregion