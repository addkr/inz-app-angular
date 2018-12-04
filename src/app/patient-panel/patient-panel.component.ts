import { Component, OnInit, ViewChild } from '@angular/core';
import { AppointmentInfo, AppointmentModel, FreeTerm } from '../shared/appointment-model';
import { UserService } from '../shared/user.service';
import { wsService } from '../shared/wsservice';
import { SharedResources } from '../shared/sharedResources';
import { Specialities } from '../shared/admin';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {Popup} from 'ng2-opd-popup';

@Component({
  selector: 'app-patient-panel',
  templateUrl: './patient-panel.component.html',
  styleUrls: ['./patient-panel.component.scss']
})


export class PatientPanelComponent implements OnInit {

  shared = new SharedResources();
  lastappointments = [];
  lastappointmentsnurse = [];
  private endpoint = this.shared.endpoint;
  //medicalPersonelData: any;
  appointmentsList = [];
  appointmentInfo: any;
  doctors = [];
  nurses = [];
  specList = [];
  freeTerms: any;
  specialities = new Specialities();
  appointmentModel = new AppointmentModel();
  showLoad = false;
  freeTermsLoaded = false;
  doctorsLoaded = false;
  freeTerm = new FreeTerm();
  id: any;
  dataLoaded = false;

  constructor(private userService: UserService,  private wsservice: wsService, private toastr: ToastrService, private router: Router) { 
    this.getAppointments();
    this.getSpecialities();
    this.getDoctors();
    this.getNurses();
  }

  ngOnInit() {
    this.resetForm();
  }

  logout(){
    if(confirm("Czy chcesz się wylogować?")){
      localStorage.removeItem("userToken");
      this.router.navigate(["/publicpage"]);
    }    
  }

  cancel(id,usdate,date,status){    
      if(new Date(usdate).getTime() > Date.now() && status == "brak"){
          if(confirm("Czy chcesz odwołać wizytę z dnia "+date + "?")) {
            var body = {
              edit : false,
              date : "",
              confirmed : "NIE",
              description: "Odwołana",
              id : id
            }
            this.wsservice.postData(body,this.endpoint+"api/UpdateAppointment").subscribe((success)=>{
              this.getAppointments();
              this.lastappointments = [];
              this.getDoctors();
              this.getNurses();
            },(error)=>{
            })
        }
        }else if(status == "Odwołana"){
          confirm("Wizyta jest już odwołana");
        }
    }   
  
  confirm(id, usdate,date,status){
    if(status == "Potwierdzona"){
      confirm("Wizyta już została potwierdzona");
    }
    else if(status == "Odwołana"){
      confirm("Wizyta została odwołana");
    }
    else{
      if(new Date(usdate).getTime() <= Date.now()){
        if(confirm("Czy chcesz potwierdzić wizytę z dnia "+date + "?")) {
          var body = {
            edit : false,
            date : "",
            confirmed : "TAK",
            description: "Potwierdzona",
            id : id
          }
          this.wsservice.postData(body,this.endpoint+"api/UpdateAppointment").subscribe((success)=>{
            this.getAppointments();
            this.lastappointments = [];
            this.getDoctors();
          },(error)=>{
          })
        }
      }else{
        confirm("Data wizyty jeszcze nie minęła");
      }    
    }
  }  
 
  createAppointmentsList(){
    this.lastappointments = [];
    for (var j = 0 ; j < this.appointmentsList.length ; j++){
      for(var i = 0 ; i < this.doctors.length ; i++){     
        if(this.doctors[i].username == this.appointmentsList[j].doctorusername){
          console.log(i);
          this.appointmentInfo = new AppointmentInfo();
          this.appointmentInfo.description = this.appointmentsList[j]["description"];
          this.appointmentInfo.date = new Date(this.appointmentsList[j]["date"]).toLocaleString();
          this.appointmentInfo.usdate = this.appointmentsList[j]["date"];
          this.appointmentInfo.doctorforename = this.doctors[i].forename;
          this.appointmentInfo.doctorlastname = this.doctors[i].lastname;
          this.appointmentInfo.id = this.appointmentsList[j]["id"];
          this.appointmentInfo.speciality = this.doctors[i].speciality;
          this.lastappointments.push(this.appointmentInfo);
        }
      }
    }
    
  }

  createAppointmentsListNurse(){
    this.lastappointmentsnurse = [];
    for (var j = 0 ; j < this.appointmentsList.length ; j++){
      for(var i = 0 ; i < this.nurses.length ; i++){     
        if(this.nurses[i].username == this.appointmentsList[j].doctorusername){
          console.log(i);
          this.appointmentInfo = new AppointmentInfo();
          this.appointmentInfo.description = this.appointmentsList[j]["description"];
          this.appointmentInfo.date = new Date(this.appointmentsList[j]["date"]).toLocaleString();
          this.appointmentInfo.usdate = this.appointmentsList[j]["date"];
          this.appointmentInfo.doctorforename = this.nurses[i].forename;
          this.appointmentInfo.doctorlastname = this.nurses[i].lastname;
          this.appointmentInfo.id = this.appointmentsList[j]["id"];
          this.appointmentInfo.speciality = this.nurses[i].speciality;
          this.lastappointmentsnurse.push(this.appointmentInfo);
        }
      }
    }
  }

  getAppointments(){
    this.appointmentsList = [];
    var body = {
      username: localStorage.getItem("UserName"),
      accesstype: "patient"
    }
    this.wsservice.postData(body,this.endpoint+"api/GetAppointmentsList").subscribe((success)=>{ 
      this.appointmentsList = JSON.parse(success["_body"]);
    },(error)=>{
    });
    
  }

  onDateChange(value){
    this.id = value;
    for(var i = 0 ; i < this.freeTerms.length;i++){
      if(this.freeTerms[i].id == value){
        this.appointmentModel.date = this.freeTerms[i].date;
      }
    }
  }

  onSpecialityChange(value){
    this.getDoctorsBySpeciality(value);
  }

  onDoctorsChange(value){
    this.getFreeTerms(value);
  }

  getSpecialities(){
    this.wsservice.getData(this.endpoint+"api/specialities").subscribe((success)=> {  
      var json = JSON.parse(success["_body"]);  
      for(var i = 0 ; i < json.length ; i++){
        this.specList[i] =  json[i].name;
      }
      this.dataLoaded = true;
    },(error)=>{
    })
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.reset();
    this.appointmentModel = {
      datecreated: '',
      date: '',
      patientusername: '',
      medicusername: '',
      description: ''
    }
  }

  OnSubmit(newAppointment:NgForm){
    this.showLoad = true;
    var body = {
      datecreated: new Date().toLocaleString().toString(),
      date: this.appointmentModel.date,
      patientusername: localStorage.getItem("UserName"),
      medicusername: this.appointmentModel.medicusername,
      description: 'brak',
      confirmed: 'nie'
    }
     this.wsservice.postData(body,this.endpoint+"appointments/Create").subscribe((success)=>{
      this.showLoad = false;
      this.deleteFreeTerm();
      this.toastr.success('Utworzono wizytę');
      this.resetForm(newAppointment);
      this.getAppointments();
      this.getDoctors();
      this.getNurses();
    },(error)=>{
      this.toastr.error(error.Errors[0]);
      this.showLoad = false;
      this.resetForm(newAppointment);
    }) 
  }

  deleteFreeTerm(){
    var body = {
      id: this.id
    }
    this.wsservice.postData(body,this.endpoint+"api/DeleteFreeTerm").subscribe((success)=>{
      this.showLoad = false;
    },(error)=>{
      this.showLoad = false;
    })
  }
  
  getDoctors(){
    this.wsservice.getData(this.endpoint+"api/doctors").subscribe((success)=>{
      this.doctors = JSON.parse(success["_body"]);
      this.createAppointmentsList();
    },(error)=>{
    })
  }

  getNurses(){
    this.wsservice.getData(this.endpoint+"api/nurses").subscribe((success)=>{
      this.nurses = JSON.parse(success["_body"]);    
      this.createAppointmentsListNurse();
    },(error)=>{
    })
  }

  getFreeTerms(doctorusername){
    this.freeTermsLoaded = false; 
    var body = {
      username: doctorusername,
      accesstype: "doctor"
    }
    this.wsservice.postData(body,this.endpoint+"api/GetFreeTerms").subscribe((success)=>{
      this.freeTerms = JSON.parse(success["_body"]);
      if(this.freeTerms.length != 0) {
        this.freeTermsLoaded = true; 
      }
    },(error)=>{
    })
  }

  getDoctorsBySpeciality(speciality){
    this.doctorsLoaded = false; 
    var body = {
      speciality: speciality
    }
    this.wsservice.postData(body,this.endpoint+"api/GetDoctorsBySpeciality").subscribe((success)=>{
      this.doctors = JSON.parse(success["_body"]);  
      if(this.doctors.length != 0) {
        this.doctorsLoaded = true; 
      }    
    },(error)=>{
    })
  }
}
