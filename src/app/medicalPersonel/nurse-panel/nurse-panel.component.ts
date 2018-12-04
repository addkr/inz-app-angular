import { Component, OnInit } from '@angular/core';
import { wsService } from 'src/app/shared/wsservice';
import { SharedResources } from 'src/app/shared/sharedResources';
import { UserPersonalData } from 'src/app/shared/user.model';
import { DateTimeModel } from 'src/app/shared/appointment-model';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nurse-panel',
  templateUrl: './nurse-panel.component.html',
  styleUrls: ['./nurse-panel.component.scss']
})
export class NursePanelComponent implements OnInit {

  userPersonalData: UserPersonalData;
  patients = [];
  showLoad = false;
  lastAppointments = [];  
  freeTerms: any;
  shared = new SharedResources();
  translateDatePicker = this.shared.translateDatePicker;
  translateTimePicker = this.shared.translateTimePicker;
  private endpoint = this.shared.endpoint;
  dateTimeModel = new DateTimeModel();
  add = false;

  constructor(private wsservice: wsService, private router: Router) {
    this.getPatients();
    this.getFreeTerms();
    this.getAppointments()
   }

  ngOnInit() {
  }
  cancel(id,usdate,date,status){    
    if(new Date(usdate).getTime() > Date.now() && status == "brak"){
        console.log(status)
        if(confirm("Czy chcesz odwołać wizytę z dnia "+date + "?")) {
          var body = {
            edit : false,
            date : "",
            confirmed : "NIE",
            description: "Odwołana",
            id : id
          }
          this.wsservice.postData(body,this.endpoint+"api/UpdateAppointment").subscribe((success)=>{
            console.log(success)
          this.getAppointments();
          this.lastAppointments = [];
          this.getAppointments();
          },(error)=>{
            console.log(error)
          })
      }
      }else if(status == "Odwołana"){
        confirm("Wizyta jest już odwołana");
      }
  }   
  

  deleteFreeTerm(date, id){
    if(confirm("Czy chcesz usunąć termin " + date +" ?")){
      var body = {
        id:id
      }
      this.wsservice.postData(body,this.endpoint+"api/DeleteFreeTerm").subscribe((success) => {
        console.log(success)
        this.getFreeTerms();
      },(error)=> {
        console.log(error)
      })
    }
  }

  
  logout(){
    if(confirm("Czy chcesz się wylogować?")){
      localStorage.removeItem("userToken");
      this.router.navigate(["/publicpage"]);
    }
  }

  getAppointments(){
    var body = {
      username: localStorage.getItem("UserName"),
      accesstype: "doctor"
    }
    this.wsservice.postData(body,this.endpoint+"api/GetAppointmentsList").subscribe((success)=>{
      this.lastAppointments = JSON.parse(success["_body"]);
      this.createAppointmentsList();
    }, (error)=>{
      console.log(error)
    })
  }

  getPatients(){
    var body = {
      username: localStorage.getItem("UserName"),
      accesstype:"nurse"
    }
    this.wsservice.postData(body,this.endpoint+"api/GetPatients").subscribe((success)=>{
      var tab = JSON.parse(success["_body"]);
      for(var i=0; i < tab.length; i++){
        this.userPersonalData = new UserPersonalData();
        this.userPersonalData.forename = tab[i].forename;
        this.userPersonalData.lastname = tab[i].lastname;
        this.userPersonalData.username = tab[i].username;
        this.patients[i] = this.userPersonalData;
        console.log(this.patients[i].forename)
      }
    },(error)=>{
      console.log(error)
    })
  }

  createAppointmentsList(){
    for(var i = 0 ; i < this.lastAppointments.length ; i++){
      for(var j = 0 ; j < this.patients.length ; j++){
        if(this.lastAppointments[i].patientusername == this.patients[j].username){
          this.lastAppointments[i].patientforename = this.patients[j].forename;
          this.lastAppointments[i].patientlastname = this.patients[j].lastname;
          this.lastAppointments[i].usdate = this.lastAppointments[i].date;
          this.lastAppointments[i].date = new Date(this.lastAppointments[i]["date"]).toLocaleString();
        }
      }
    }
  }

  getFreeTerms(){
    var body = {
      username: localStorage.getItem("UserName"),
      accesstype: "nurse"
    }
    this.wsservice.postData(body,this.endpoint+"api/GetFreeTerms").subscribe((success)=>{
      console.log(success)
      this.freeTerms = JSON.parse(success["_body"]);
      console.log(this.freeTerms)
    },(error)=>{
      console.log(error)
    })
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.reset();
    this.dateTimeModel = {
      date: '',
      time: ''
    }
  }

  OnSubmitFreeTerm(form: NgForm){
    this.showLoad = true;
    var body = {
      doctorusername: localStorage.getItem("UserName"),
      date: this.dateTimeModel.date + ", " + this.dateTimeModel.time,
      doctorspeciality: "Pielęgniarka"
    }
    this.wsservice.postData(body,this.endpoint+"freeterms/Create").subscribe((success)=>{
      this.showLoad = false;
      this.resetForm(form);
      this.getFreeTerms();
      console.log(success)
    },(error)=>{
      console.log(error)
      this.showLoad = false;
      this.resetForm(form);
    })
  }

}
