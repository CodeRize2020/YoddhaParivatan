import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoutineSafetyPageRoutingModule } from './routine-safety-routing.module';

import { RoutineSafetyPage } from './routine-safety.page';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    RoutineSafetyPageRoutingModule
  ],
  declarations: [RoutineSafetyPage]
})
export class RoutineSafetyPageModule {}
