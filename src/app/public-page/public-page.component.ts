import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-public-page',
  templateUrl: './public-page.component.html',
  styleUrls: ['./public-page.component.scss']
})
export class PublicPageComponent implements OnInit {

  authorized: boolean = false;
  constructor() {
    //this.checkAuthorization();
    if(localStorage.getItem("userToken") == null){
      console.log("not authorized: " + localStorage.getItem("userToken"))
      this.authorized = false;
    }else{
      this.authorized = true;
      console.log("authorized: " + localStorage.getItem("userToken"))
    }
   }

  checkAuthorization(){
    if(localStorage.getItem("userToken") == null){
      console.log("not authorized: " + localStorage.getItem("userToken"))
      this.authorized = false;
    }else{
      this.authorized = true;
      console.log("authorized: " + localStorage.getItem("userToken"))
    }
  }

  logout(){
    localStorage.removeItem("userToken");
    this.checkAuthorization();
  }
  ngOnInit() {
  }

}
