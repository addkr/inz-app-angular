import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { wsService } from '../shared/wsservice';
import { NgForm } from '@angular/forms';
import { SharedResources} from '../shared/sharedResources';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  shared = new SharedResources();
  data: any;
  lastappointmentsShow = false;
  menuShow = true;
  addappointmentShow = false;
  translateToPolish = this.shared.translateToPolish
  constructor(private userService: UserService, private wsservice: wsService, private router: Router) { }

  ngOnInit() {
   
  }

  goTo(value){
    switch(value){
      case "lastappointmentsShow":
        this.lastappointmentsShow = !this.lastappointmentsShow;
        this.menuShow = !this.menuShow;
        break;
      case "addappointmentShow":
       /*  this.addappointmentShow = !this.addappointmentShow;
        this.menuShow = !this.menuShow; */
        this.router.navigate['/appointment'];
        break;
      case "addappointmentShow":
        this.addappointmentShow = !this.addappointmentShow;
        this.menuShow = !this.menuShow;
        break;
    }
    
  }
  

  OnSubmit(form: NgForm){
   var body = {
     "name": form.value
   };
  this.wsservice.postData(body, "http://localhost:52084/specialities/Create").subscribe((data) => {
    console.log(data);
}, (error) => {
    console.log(error);
});
 }

}
