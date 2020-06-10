import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-update-page',
  templateUrl: './update-page.page.html',
  styleUrls: ['./update-page.page.scss'],
})
export class UpdatePagePage implements OnInit {
  tabBarElement: any;
  constructor() { 
    this.tabBarElement = document.querySelector('#myTabBar')
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
   // console.log('ionViewDidLoad AlldetailPage');
}

  ngOnInit() {
  }



}
