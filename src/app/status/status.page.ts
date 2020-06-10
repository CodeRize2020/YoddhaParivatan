import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MigrationService } from '../Migration/migration.service';
import { LoadingController, ToastController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Time } from '@angular/common';

@Component({
  selector: 'app-status',
  templateUrl: './status.page.html',
  styleUrls: ['./status.page.scss'],
})
export class StatusPage implements OnInit {
  isUserInfoVisible:boolean = false;
  isLableVisible:boolean = false;
  isCheckInfoVisible:boolean = false;

  UserID: any;
  toast: any;
  next: Date;
  endTime: string;
 
  
  constructor(public router: Router, 
    public tblservice:MigrationService,
    public loadingController:LoadingController,   
    private translate: TranslateService,
    public toastController: ToastController, 
    private platform: Platform,
    ) { this.platform.backButton.subscribeWithPriority(6666666,()=>{
      if(window.confirm(this.translate.instant("Do you really want to Exit the App")))
      {
        navigator["app"].exitApp();
      }
  });}

    shouldDisable=false; //DISBALE BUTTON


  ionViewDidEnter()
  {
    this.UserID = JSON.parse(localStorage.getItem('UserID'));

  }


   //  present Loading method use for loader show when location featching
  //#region
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: this.translate.instant('Please wait while we check your Details...'),
      translucent: true,
       duration: 30000,
    });
    return await loading.present();
  }
  //#endregion


// Tab Button Click
  //#region 
  btn_MigrationTabClick()
  {
      this.router.navigate(['/relocation']);
  }
  
  btn_statusTabClick()
  {
      this.router.navigate(['/status']);
  }



  ngOnInit() {
   
  }

 // After 2 hrs check status fuction 
AddMinutesToDate(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}
 DateFormat(date){
 var days = date.getDate();
 var year = date.getFullYear();
 var month = (date.getMonth()+1);
 var hours = date.getHours();
 var minutes = date.getMinutes();
 minutes = minutes < 10 ? '0' + minutes : minutes;
 var strTime = days + '/' + month + '/' + year + '/ '+hours + ':' + minutes;
 return strTime;
}

  
    

    
    checkStatus()
  {
    this.getDetails(this.UserID);
    var now = new Date();
    console.log(this.DateFormat(now));
    this.next = this.AddMinutesToDate(now,120);
   // document.getElementById("datebtn1").innerHTML = "Check Status after ="+next ;
   this.endTime=this.DateFormat(this.next)
    console.log(this.DateFormat(this.next));
    this.isLableVisible =  true;
    this.shouldDisable=true;

    setTimeout(x => {
      this.shouldDisable=false;
      this.isLableVisible=false;
     }, 7200000)//2 hrs
    // }, 60000)//2 hrs
  }

  userRes:any;
  // public static userResDetails:any;
  userResDetails:any;

  getDetails(userid){
    this.isCheckInfoVisible= true;
    this.presentLoading();
    this.tblservice.getUserBriefDetails(userid).subscribe(res => {
      if(res !== "NA")
      {
        this.loadingController.dismiss().catch(() => {});             
        this.userRes=res;
      }
    else
    {
      this.loadingController.dismiss().catch(() => {});             
      this.showToast(this.translate.instant("Status Not Found..."))
    }
        //console.log("Data on show details"+this.userRes)
    });
    
  }


  
  showDetails(mrn_number,index)
  {
   this.isUserInfoVisible= true;
   this.userResDetails=this.userRes[index];
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


}
