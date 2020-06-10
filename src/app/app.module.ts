import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IonicStorageModule } from '@ionic/storage';
//import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase, HttpErrorResponse } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Network } from '@ionic-native/network/ngx';
import { AppUpdate } from '@ionic-native/app-update/ngx';


import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RegistrationService } from './Registration/registration.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';


export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/', '.json');
}




@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
	IonicStorageModule.forRoot(),
  HttpClientModule,TranslateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: LanguageLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    RegistrationService,
    StatusBar, AppUpdate,
    SplashScreen, SocialSharing, AndroidPermissions, Network,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
	 LocationAccuracy, NativeGeocoder, Geolocation
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
