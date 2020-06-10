import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Observable';
import { IAddCitizen } from './citizen/citizen.page'
import { IFeedback } from '../feedback/feedback.page';
import { throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  toast: any;
  getShareUrl: string;
  encryptedData:string;
  secretKey:string="yoddha";

  constructor(private http: HttpClient,
    public toastController: ToastController,private translate: TranslateService) { }
  

    getDefaultLanguage(){
      let language = this.translate.getBrowserLang();
      this.translate.setDefaultLang(language);
      return language;
    }
  
    setLanguage(setLang) {
      this.translate.use(setLang);
    }
  
  //Golbal Declaration
  //#region 
  baseURL = "https://yoddha.coderize.in/";
  var_post_Citizen = "postCitizen";
  var_post_Feedback="postFeedback";
  var_get_getShareUrl="getShareURL";
  var_get_getUrl="getUpdateVersion";


  //#endregion

  

  //All Post Method Using Json
//#region 

  //Post Citizen details function
  PostAddCitizen(IAddCitizen: IAddCitizen): Observable<any> {
    return this.http
    .post(this.baseURL + this.var_post_Citizen, IAddCitizen).
    pipe(map((data: any) => {
          if(data)
          {
            return data;
          }
          else{
          catchError( error => {
            this.showToast( this.translate.instant('"Server Error. Please try after sometime.' ));
            return throwError( this.translate.instant('"Server Error. Please try after sometime.' ));
          })
          }
          }));    
  }



 
  //get method for district show district in dropdown
getShareLink() {
    return this.http.get(this.baseURL + this.var_get_getShareUrl                                                                           )
      .pipe(map(res =>res),
      catchError((err: HttpErrorResponse) => {
        this.showToast( this.translate.instant('"Server Error. Please try after sometime.' ));
        return throwError( this.translate.instant('"Server Error. Please try after sometime.' ));     
       }));
} 


  //get method for district show district in dropdown
  getVer() {
    return this.http.get(this.baseURL + this.var_get_getUrl                                                                           )
      .pipe(map(res =>res),
      catchError((err: HttpErrorResponse) => {
        this.showToast( this.translate.instant('"Server Error. Please try after sometime.' ));
        return throwError( this.translate.instant('"Server Error. Please try after sometime.' ));     
       }));
}


  //Post service method for Test to Server 
  //#region 
  PostFeedback(AddFeedback: IFeedback): Observable<any> {
    return this.http
      .post(this.baseURL + this.var_post_Feedback, AddFeedback).
    pipe(map((data: any) => {
          if(data)
          {
            return data;
          }
          else{
          catchError( error => {
            this.showToast( this.translate.instant('"Server Error. Please try after sometime.' ));
            return throwError( this.translate.instant('"Server Error. Please try after sometime.' ));          })
          }
          }));    
  }
//#endregion




     //Toster display function
  //#region 
  showToast(msg: string) {
    this.toast = this.toastController.create({
      message: msg,
      position: 'middle',
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
