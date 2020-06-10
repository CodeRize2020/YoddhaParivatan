import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoutineSafetyPage } from './routine-safety.page';

const routes: Routes = [
  {
    path: '',
    component: RoutineSafetyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutineSafetyPageRoutingModule {}
