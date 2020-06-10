import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Observable';
import { ToastController } from '@ionic/angular';

import { IAddSafety } from './routine-safety/routine-safety.page';
import { throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class SafetyService {

 //#region //Golbal Declaration URL For Server
 baseURL = "https://yoddha.coderize.in/";
 var_post_Test ="postTest";
 var_post_Visit ="postVisit";
 var_post_Safety ="postSafety";
  toast: Promise<void>;

//#endregion


//#region // Constructor Start
 constructor(private http: HttpClient, public toastController: ToastController,
  private translate: TranslateService 
  ) { }
//#endregion







//Post service method for Visit to Server 
  //#region 

  PostSafety(AddSafety: IAddSafety): Observable<any> {
    return this.http
      .post(this.baseURL + this.var_post_Safety, AddSafety).
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
