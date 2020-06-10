import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { IQAddRelocation } from './migration.page';
import { throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class MigrationService {
  //Golbal Declaration
  //#region 
  baseUrl = "https://yoddha.coderize.in/";
  var_post_Symptoms = "postSymptoms";
  var_post_Zone = "postZone";
  var_post_Relocation = "postRelocation";

  var_getBrief="getBriefStatusByUserID/";
  var_getMRN="getDetailStatusByMRN/"
  toast: any;
  //#endregion

  // Constructor Start
  //#region 
  constructor(private http: HttpClient, public toastController: ToastController,
    private translate: TranslateService 
  ) { }




  //Post service method for symptoms to Server 
  //#region 

  PostRelocation(QAddRelocation: IQAddRelocation): Observable<any> {
    return this.http
      .post(this.baseUrl + this.var_post_Relocation, QAddRelocation).
      pipe(
        map((data: any) => {
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

  //#endregion

  getUserBriefDetails(user_id) {
    return this.http.get(this.baseUrl + this.var_getBrief + user_id                                                                      )
      .pipe(map(res =>res),
      catchError((err: HttpErrorResponse) => {
        return Observable.throw(err.message || "server error");
      }));
  }
 
  // getUserDetails(mrn_number) {
  //   return this.http.get(this.baseUrl + this.var_getMRN + mrn_number                                                                     )
  //     .pipe(map(res =>res),
  //     catchError((err: HttpErrorResponse) => {
  //       return Observable.throw(err.message || "server error");
  //     }));
  // }


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
