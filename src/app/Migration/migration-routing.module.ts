import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MigrationPage } from './migration.page';

const routes: Routes = [
  {
    path: '',
    component: MigrationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MigrationPageRoutingModule {}
