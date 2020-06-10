import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  // {
  //   path: 'folder/:id',
  //   loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  // },
  {
    path: "home",
    loadChildren: "./home/home.module#HomePageModule"
  },
  {
    path: 'relocation',
    loadChildren: () => import('./Migration/migration.module').then( m => m.MigrationPageModule)
  },
  {
    path: 'citizen',
    loadChildren: () => import('./Registration/citizen/citizen.module').then( m => m.CitizenPageModule)
  },
  {
    path: 'policy',
    loadChildren: () => import('./policy/policy.module').then( m => m.PolicyPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },

  {
    path: 'routine-safety',
    loadChildren: () => import('./Safety/routine-safety/routine-safety.module').then( m => m.RoutineSafetyPageModule)
  },
  {
    path: 'feedback',
    loadChildren: () => import('./feedback/feedback.module').then( m => m.FeedbackPageModule)
  },
  {
    path: 'status',
    loadChildren: () => import('./status/status.module').then( m => m.StatusPageModule)
  },
  {
    path: 'update-page',
    loadChildren: () => import('./update-page/update-page.module').then( m => m.UpdatePagePageModule)
  },
  // {
  //   path: 'socia-share',
  //   loadChildren: () => import('./socia-share/socia-share.module').then( m => m.SociaSharePageModule)
  // },
  // {
  //   path: 'requirement',
  //   loadChildren: () => import('./requirement/requirement.module').then( m => m.RequirementPageModule)
  // },
  // {
  //   path: 'shop-detail',
  //   loadChildren: () => import('./shop-detail/shop-detail.module').then( m => m.ShopDetailPageModule)
  // }
  /*{
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  }*/
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
