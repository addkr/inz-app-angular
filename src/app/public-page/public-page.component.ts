import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-public-page',
  templateUrl: './public-page.component.html',
  styleUrls: ['./public-page.component.scss']
})
export class PublicPageComponent implements OnInit {

  authorized: boolean;
  constructor() {
    this.checkAuthorization();
   }

  checkAuthorization(){
    if(localStorage.getItem("userToken") == null){
      this.authorized = false;
    }else{
      this.authorized = true;
    }
  }

  logout(){
    localStorage.removeItem("userToken");
    this.checkAuthorization();
  }
  ngOnInit() {
  }

}
