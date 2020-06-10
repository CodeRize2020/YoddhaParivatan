import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.page.html',
  styleUrls: ['./policy.page.scss'],
})
export class PolicyPage implements OnInit {
  tabBarElement: any;

  constructor(public router: Router) { 
    this.tabBarElement = document.querySelector('#myTabBar')
  }

  ngOnInit() {
  }


  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
   // console.log('ionViewDidLoad AlldetailPage');
}
  exist()
  {
    this.router.navigate(['/logout']);
  }

  iagree()
  {
    this.router.navigate(['/home']);
  }

}
