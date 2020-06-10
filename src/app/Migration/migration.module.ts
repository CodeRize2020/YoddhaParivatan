import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MigrationPageRoutingModule } from './migration-routing.module';

import { MigrationPage } from './migration.page';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    MigrationPageRoutingModule
  ],
  declarations: [MigrationPage]
})
export class MigrationPageModule {}
