import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CitizenPageRoutingModule } from './citizen-routing.module';

import { CitizenPage } from './citizen.page';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    CitizenPageRoutingModule
  ],
  declarations: [CitizenPage]
})
export class CitizenPageModule {}
