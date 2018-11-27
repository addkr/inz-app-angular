import { Component, OnInit } from '@angular/core';
import { SharedResources } from 'src/app/shared/sharedResources';
import { Router } from '@angular/router';
import { wsService } from '../../shared/wsservice';
import { AppointmentModel, DateTimeModel } from 'src/app/shared/appointment-model';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
  styleUrls: ['./create-appointment.component.scss']
})
export class CreateAppointmentComponent implements OnInit {

  shared = new SharedResources();
  translateToPolish = this.shared.translateToPolish;
  translateTimePicker = this.shared.translateTimePicker;
  router: Router;
  doctors = [];
  private endpoint = this.shared.endpoint;
  appointmentModel = new AppointmentModel();
  dateTimeModel = new DateTimeModel();
  showLoad = false;
  constructor(private wsservice: wsService) {
    this.getDoctors();
   }

  ngOnInit() {
    this.resetForm();
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
    this.dateTimeModel = {
      date: '',
      time: ''
    }
  }

  OnSubmit(newAppointment:NgForm){
    this.showLoad = true;
    var body: AppointmentModel = {
      datecreated: new Date().toLocaleString().toString(),
      date: this.dateTimeModel.date + ", " + this.dateTimeModel.time,
      patientusername: "admintest",
      medicusername: this.appointmentModel.medicusername,
      description: 'brak'
    }
    console.log(body)
    this.wsservice.postData(body,this.endpoint+"appointments/Create").subscribe((success)=>{
      this.showLoad = false;
      console.log(success)
    },(error)=>{
      console.log(error)
      this.showLoad = false;
    })
  }

  getDoctors(){
    this.wsservice.getData(this.endpoint+"api/doctors").subscribe((success)=>{
      this.doctors = JSON.parse(success["_body"]);    
      console.log(this.doctors)
    },(error)=>{
      console.log(error)
    })
  }

}
