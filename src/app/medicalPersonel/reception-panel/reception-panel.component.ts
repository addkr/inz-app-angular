import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { wsService } from 'src/app/shared/wsservice';
import { ToastrService } from 'ngx-toastr';
import { SharedResources } from 'src/app/shared/sharedResources';
import { Specialities } from 'src/app/shared/admin';
import { AppointmentModel, AppointmentInfo } from 'src/app/shared/appointment-model';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reception-panel',
  templateUrl: './reception-panel.component.html',
  styleUrls: ['./reception-panel.component.scss']
})
export class ReceptionPanelComponent implements OnInit {

  shared = new SharedResources();
  private endpoint = this.shared.endpoint;
  specList = [];
  lastappointmentsnurse = [];
  doctors = [];
  nurses = [];
  freeTerms: any;
  specialities = new Specialities();
  showLoad = false;
  dataLoaded = false;
  freeTermsLoaded = false;
  doctorsLoaded = false;
  doctorsBySpeciality = [];
  appointmentModel = new AppointmentModel();
  id: any;
  appointmentInfo: any;
  patientsLoaded = false;
  pesel: any;
  patientForeName: any;
  patientLastName: any;
  username: any;
  appointmentsList = [];
  lastappointments = [];
  lastAppLoaded = false;

  constructor(private userService: UserService, private router: Router, private wsservice: wsService, private toastr: ToastrService) {
    this.getSpecialities();
   }

  ngOnInit() {
  }

  logout(){
    if(confirm("Czy chcesz się wylogować?")){
      localStorage.removeItem("userToken");
      this.router.navigate(["/publicpage"]);
    }
  }

  check(pesel){
    this.getPatients(pesel);
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

  getAppointments(username){
    this.appointmentsList = [];
    var body = {
      username: username,
      accesstype: "patient"
    }
    this.wsservice.postData(body,this.endpoint+"api/GetAppointmentsList").subscribe((success)=>{ 
      this.appointmentsList = JSON.parse(success["_body"]);
      this.getDoctors();
      this.getNurses();
    },(error)=>{
    });
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
            this.lastappointments = [];
            this.getAppointments(this.username);          
            this.getDoctors();
            this.getNurses();
          },(error)=>{
          })
      }
      }else if(status == "Odwołana"){
        confirm("Wizyta jest już odwołana");
      }
  }   
 
  confirm(id, usdate, date,status){
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
            this.lastappointments = [];
            this.getAppointments(this.username);          
            this.getDoctors();
            this.getNurses();
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
          this.appointmentInfo.usdate = this.appointmentsList[j]["date"];
          this.appointmentInfo.date = new Date(this.appointmentsList[j]["date"]).toLocaleString();
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
    for (var j = 0 ; j < this.appointmentsList.length ; j++){
      for(var i = 0 ; i < this.nurses.length ; i++){     
        if(this.nurses[i].username == this.appointmentsList[j].doctorusername){
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

  getPatientAppointments(pesel){
    this.lastappointments = [];
    var body = {
      accesstype: "reception",
      pesel:pesel,
      username:null
    }
    this.wsservice.postData(body,this.endpoint+"api/GetPatients").subscribe((success)=>{
      var json = JSON.parse(success["_body"]);
      this.patientForeName = json[0].forename;
      this.patientLastName = json[0].lastname;
      this.username = json[0].username;
      this.getAppointments(json[0].username);
    },(error) => {
    });
  }

  getPatients(pesel){
    var body = {
      accesstype: "reception",
      pesel:pesel,
      username:null
    }
    this.wsservice.postData(body,this.endpoint+"api/GetPatients").subscribe((success)=>{
      var json = JSON.parse(success["_body"]);
      this.patientForeName = json[0].forename;
      this.patientLastName = json[0].lastname;
      this.username = json[0].username;
    },(error) => {
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

  getFreeTerms(doctorusername){
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
    var body = {
      speciality: speciality
    }
    this.wsservice.postData(body,this.endpoint+"api/GetDoctorsBySpeciality").subscribe((success)=>{
      this.doctorsBySpeciality = JSON.parse(success["_body"]);  
      if(this.doctorsBySpeciality.length != 0) {
        this.doctorsLoaded = true; 
      }      
    },(error)=>{
    })
  }

  OnSubmit(newAppointment:NgForm){
    this.showLoad = true;
    var body = {
      datecreated: new Date().toLocaleString().toString(),
      date: this.appointmentModel.date,
      patientusername: this.username,
      medicusername: this.appointmentModel.medicusername,
      description: 'brak',
      confirmed: 'nie'
    }
     this.wsservice.postData(body,this.endpoint+"appointments/Create").subscribe((success)=>{
      this.showLoad = false;
      this.deleteFreeTerm();
      this.toastr.success('Utworzono wizytę');
      this.resetForm(newAppointment);
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


}
