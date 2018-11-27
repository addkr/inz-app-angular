import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { wsService } from '../shared/wsservice';
import { NgForm } from '@angular/forms';
import { SharedResources} from '../shared/sharedResources';
import { Router } from '@angular/router';
import { AppointmentModel, AppointmentInfo } from '../shared/appointment-model';
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
  appointmentModel = new AppointmentModel();
  lastappointments = [];
  private endpoint = this.shared.endpoint;
  medicalPersonelData = [];
  appointmentsList = [];
  AppointmentInfo = new AppointmentInfo();
  constructor(private userService: UserService, private wsservice: wsService, private router: Router) { 
    this.getAppointments();
  }

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

  getAppointments(){
    this.wsservice.getData(this.endpoint+"api/appointments").subscribe((success)=>{
      //this.lastappointments = JSON.parse(success["_body"]);
      this.appointmentsList = JSON.parse(success["_body"]);
      
      this.CheckUserData();
      console.log(success)
    },(error)=>{
      console.log(error)
    });
  }

  CheckUserData(){
    
    for(var i=0; i<this.appointmentsList.length;i++){
      this.userService.CheckUserData("doctor",this.appointmentsList[i].medicusername).subscribe((data: any) => {
        this.medicalPersonelData[i] = JSON.parse(data);
        this.AppointmentInfo.date = this.appointmentsList[i-1]["date"];
        this.AppointmentInfo.doctorforename = this.medicalPersonelData[i].forename;
        this.AppointmentInfo.doctorlastname = this.medicalPersonelData[i].lastname;
        this.lastappointments[i-1] = this.AppointmentInfo;
        console.log(this.medicalPersonelData[i])
        console.log(this.appointmentsList[i-1] + "i"+i)
        console.log(this.AppointmentInfo)
        console.log(this.lastappointments)
      }, (error) => {
        console.log(error);
        if(error=="Dane mają wartość Null. Ta metoda lub właściwość nie może być wywołana na wartościach zerowych."){
          console.log("Użytkownik nie istnieje lub wprowadzone dane są niepoprawne");
          //this.router.navigate(['/addData']);
        }
      });
      
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
