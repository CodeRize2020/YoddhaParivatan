import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdatePagePage } from './update-page.page';

const routes: Routes = [
  {
    path: '',
    component: UpdatePagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdatePagePageRoutingModule {}
