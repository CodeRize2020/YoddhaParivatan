import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController, AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import * as $ from 'jquery'
import { HomePage } from 'src/app/home/home.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage';
import * as L from "leaflet";
import { MigrationService } from './migration.service';
import { Network } from '@ionic-native/network/ngx';
import { RegistrationService } from '../Registration/registration.service';
import { TranslateService } from '@ngx-translate/core';
import { Guid } from 'guid-typescript';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-relocation',
  templateUrl: './migration.page.html',
  styleUrls: ['./migration.page.scss'],
})
export class MigrationPage implements OnInit {

   //#region 
    //Global Declaration Common Variables
   toast: any;
   canSubmit = true;
   isSymptomsVisible: boolean = true;
   isIcurrentAddressVisible:boolean =true;
   isIQAddZoneVisible:boolean=true;
   isRelocationVisible:boolean=true;
  //#endregion
  
   // Location
   isRelocationFormAddressLocationInfoVisible: boolean = true;
   isRelocationToAddressLocationInfoVisible: boolean = true;
   isCurrentAddressLocationInfoVisible: boolean = false;
   isRelocationMigration
AddressLocationInfoVisible: boolean = true;
  
   static staticMarker;
  isloggedIn: boolean;
  isRegister: boolean;
   isReadonly() { return true; }
  //#endregion
  
  
   //#region 
  //Global Declaration Variables for Relocation Module
  
  checked:boolean=true;
  //Global for addRelocation
  Travel_Mode:string;
  Rel_Start_Date:any;
  Rel_End_Date:any;
  Relocation_Reason:string;
  Relocation_Status:string;
  Total_Member:number;
  mrn_number:string;
  //Global for Relocation Address
    From_lat : any;
    From_long : any;
    From_Address: string;
    To_lat : any;
    To_long : any;
    To_Address: string;
    To_Pincode:number;
    From_Pincode:number;
  // Current Address Interface
  
  UserID: string;
  Current_lat: any;
  Current_long: any;
  Current_Loc_Accuracy: any
  
  
  //#endregion

  static frominitialMapLoad: boolean = false;
  static toinitialMapLoad: boolean = false;

  
  //#region 
  //contructor method start
    constructor(
      private platform: Platform,
      public toastController: ToastController,
      public Migrationservice :MigrationService,
      public loadingController:LoadingController,
      public router: Router,
      public alertController: AlertController, 
      private geolocation: Geolocation,
      private network: Network,
      private translate: TranslateService 

      ) {
        this.platform.backButton.subscribeWithPriority(6666666,()=>{
          if(window.confirm(this.translate.instant("Do you really want to Exit the App")))
          {
            navigator["app"].exitApp();
          }
      });
      }

      minDate: string = new Date().toISOString();


      CompareDate() {
        let dateString = (document.getElementById('Rel_Start_Date') as HTMLTextAreaElement).value;
        var today = new Date();
        var myDate = new Date(dateString);
       console.log("Data",dateString)
        if (today > myDate) { 
            // $('#Visit_Date').after('<p>You can Select a date in the future!.</p>');
            this.showToast(this.translate.instant("Your Selected Past Date Please select Future Date"));
        }
      }
      

      ionViewDidEnter()
      {
        this.UserID = JSON.parse(localStorage.getItem('UserID'));
      }
   // End Constructor   
  //#endregion
  // relocation pincode
  isMarkSafeVisible:boolean =true;

  ShowHideDiv() {
    $("input[name='Relocation_Status']").click(function () {
      if ($("#chkNo").is(":checked")) {
        $("#dvPassport").hide();
        $("#dvPassportNot").show(); 
      } else if ($("#chkYes").is(":checked")) {
        $("#dvPassport").show();
        $("#dvPassportNot").hide();
      }
  });
  }


  btn_MigrationTabClick()
  {
 
      this.router.navigate(['/relocation']);
  }
  
  btn_statusTabClick()
  {

      this.router.navigate(['/status']);
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
       duration:30000,
    });
    return await loading.present();
  }
  //#endregion
  
  
    // After Init call Function
    //#region 
    ionViewWillEnter() {
      // this.mapLoad();
      if(MigrationPage.frominitialMapLoad == false)
      {
        this.OnClick_Relocation_From_Address();
      }
      if(MigrationPage.toinitialMapLoad == false)
      {
        this.OnClick_Relocation_To_Address();
      }
  

      $('div.Relocation_From_Map_Div').hide();
      $('#Relocation_From_Address').focus(function () {
        $('div.Relocation_From_Map_Div').show();
      });
  
      $('div.Relocation_To_Map_Div').hide();
      $('#Relocation_To_Address').focus(function () {
        $('div.Relocation_To_Map_Div').show();
      });
  
      $('div.Relocation_Migration_Map_Div').hide();
      $('#Relocation_Migration_Address').focus(function () {
        $('div.Relocation_Migration_Map_Div').show();
      });
    }
  //#endregion
  
  
  
  
   // Map Diva close button function
    //#region 
    closedMapDiv_From() {
      $('div.Relocation_From_Map_Div').hide();
      
      // $('div.from_address').hide();
  
    }
  
    closedMapDiv_To() {
      $('div.Relocation_To_Map_Div').hide();
    }
  
    closedMapDiv_RelocationMigration() {
      $('div.Relocation_Migration_Map_Div').hide();
    }
    //#endregion
  
   //ngOnInit
  //#region 
  ngOnInit() 
  {
    //this.CompareDate();
  }

  //#endregion
  
  
    //#region  addRelocation Method
    addRelocation(form)
    {
      if(this.UserID !== null)
      {
      this.NetWorkCheck();
      this.mrn_number = "MRN-"+Guid.create().toString().slice(0, 6);
      let AddRelocation: IQAddRelocation = {
        ///addRelocation Details
  mrn_number:this.mrn_number,
  Travel_Mode:this.Travel_Mode,
  Rel_Start_Date:this.Rel_Start_Date,
  Rel_End_Date:this.Rel_End_Date,
  Relocation_Reason:this.Relocation_Reason,
  Relocation_Status:this.Relocation_Status,
  Total_Member:this.Total_Member,
  //Relocation Address Details
    From_lat : this.From_lat,
    From_long : this.From_long,
    To_lat : this.To_lat,
    To_long : this.To_long,
    From_Address: this.From_Address,
    To_Address: this.To_Address,
    From_Pincode:this.From_Pincode,
    To_Pincode:this.To_Pincode,
  
  // Current Address Interface
  UserID: this.UserID,
  Current_lat: this.Current_lat,
  Current_long: this.Current_long,
  Current_Loc_Accuracy: this.Current_Loc_Accuracy,
  


      };
      this.presentLoading();
      if (this.canSubmit) {
        this.canSubmit = false;
        this.Migrationservice.PostRelocation(AddRelocation).subscribe(
          res => {
            this.loadingController.dismiss().catch(() => {});             
            this.showToast(this.translate.instant("Migration Details Saved Successfully!!"));
             this.router.navigate(["/home"]);
             this.canSubmit = true;                    
          },
          err => {
            this.loadingController.dismiss().catch(() => {});     
            this.showToast(this.translate.instant("Migration Details failed to Saved. Please try again later..."));
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
   // #endregion
    
  
  //Map current Location Function
    //#region
    OnClick_Relocation_From_Address() {
      var map = new L.map('Frommap').setView([18.5314, 73.8446], 8, { minZoom: 1, maxZoom: 20 });
      map.center = [18.5314, 73.8446];
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
      }).addTo(map);
      MigrationPage.frominitialMapLoad = true;
      this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
        var latlng = new L.LatLng(resp.coords.latitude, resp.coords.longitude);
        this.Current_Loc_Accuracy = resp.coords.accuracy;
        this.Current_lat = latlng.lat;
        this.Current_long = latlng.lng;
        this.From_lat = latlng.lat;
        this.From_long = latlng.lng;
        map.flyTo(latlng, 16);
        MigrationPage.staticMarker = L.marker(latlng, { draggable: true }).addTo(map)
          // .bindPopup("Your Currently Located Here" + "Drag Marker to Select another Location").openPopup();
          MigrationPage.staticMarker.on('dragend', function (event) {
         // console.log("In Drage")
         MigrationPage.staticMarker = event.target;
          var position = MigrationPage.staticMarker.getLatLng();
          MigrationPage.staticMarker.setLatLng([position.lat, position.lng], { draggable: 'true' });
          map.panTo([position.lat, position.lng]);
          (document.getElementById('From_lat') as HTMLTextAreaElement).value = MigrationPage.staticMarker.getLatLng().lat;
          (document.getElementById('From_long') as HTMLTextAreaElement).value = MigrationPage.staticMarker.getLatLng().lng;
         // console.log("In function Lat Long", RelocationPage.staticMarker.getLatLng().lat, RelocationPage.staticMarker.getLatLng().lng);
        });
  
      }).catch((error) => {
       // console.log('Error getting location', error);
      });
    }
    //#endregion
  
  
  
   //Map current Location Function
    //#region
    OnClick_Relocation_To_Address() {
      var map = new L.map('Tomap').setView([18.5314, 73.8446], 8, { minZoom: 1, maxZoom: 20 });
      map.center = [18.5314, 73.8446];
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
      }).addTo(map);
      MigrationPage.toinitialMapLoad = true;
      this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
        var latlng = new L.LatLng(resp.coords.latitude, resp.coords.longitude);
        this.To_lat = latlng.lat;
        this.To_long = latlng.lng;
        map.flyTo(latlng, 16);
        MigrationPage.staticMarker = L.marker(latlng, { draggable: true }).addTo(map)
          // .bindPopup("Your Currently Located Here" + "Drag Marker to Select another Location").openPopup();
          MigrationPage.staticMarker.on('dragend', function (event) {
        //  console.log("In Drage")
        MigrationPage.staticMarker = event.target;
          var position = MigrationPage.staticMarker.getLatLng();
          MigrationPage.staticMarker.setLatLng([position.lat, position.lng], { draggable: 'true' });
          map.panTo([position.lat, position.lng]);
          (document.getElementById('To_lat') as HTMLTextAreaElement).value = MigrationPage.staticMarker.getLatLng().lat;
          (document.getElementById('To_long') as HTMLTextAreaElement).value = MigrationPage.staticMarker.getLatLng().lng;
       //   console.log("In function Lat Long", RelocationPage.staticMarker.getLatLng().lat, RelocationPage.staticMarker.getLatLng().lng);
        });
  
      }).catch((error) => {
       // console.log('Error getting location', error);
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
   
  //#region //IQAddRelocation interface
  export interface IQAddRelocation extends IRelocationAddress{
    Travel_Mode: string;
    Rel_Start_Date:any;
    Rel_End_Date:any;
    Relocation_Reason:string;
    Relocation_Status:string;
    Total_Member:number;
    mrn_number:string;
    } 
     
  
    export interface IRelocationAddress extends ICurrentAddress{
      From_lat : any;
      From_long : any;
      To_lat : any;
      To_long : any;
      From_Address: string;
      To_Address: string;
      To_Pincode:number;
      From_Pincode:number;
      } 
  
      // Current Address Interface
  export interface ICurrentAddress {
    UserID: string;
    Current_lat: any;
    Current_long: any;
    Current_Loc_Accuracy: any
  }
  

    
  //#endregion
  
  
  
