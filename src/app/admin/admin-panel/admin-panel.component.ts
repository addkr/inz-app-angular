import { Component, OnInit} from '@angular/core';
import { Admin, Specialities } from 'src/app/shared/admin';
import { NgForm } from '@angular/forms';
import { wsService } from '../../shared/wsservice';
import { SharedResources } from '../../shared/sharedResources';
import { MedicalPersonelModel } from 'src/app/shared/medical-personel-model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {

  shared = new SharedResources();
  admin: Admin = new Admin();
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  showLoad: boolean = false;
  mode: any;
  spec: Specialities = new Specialities();
  specList = [];
  specLoaded = false;
  medicalPersonelOptions = this.shared.medicalPersonel;
  medicalPersonel= new MedicalPersonelModel();
  showSpecialityOptions = true;
  private endpoint = this.shared.endpoint;
  constructor(private wsservice: wsService,private toastr: ToastrService) { 
    this.specialitiesList();
  }


  ngOnInit() {
    
  }

  resetAdminForm(form?: NgForm) {
    if (form != null)
      form.reset();
    this.admin = {
      username: '',
      email: '',
      phoneno: '',
      accesstype:'',
      datecreated: ''
    }
  }

  OnSubmitMedicalPersonel(newMedicalPersonelForm: NgForm){
    this.showLoad = true;
    var body : MedicalPersonelModel = {
      forename: this.medicalPersonel.forename,
      lastname: this.medicalPersonel.lastname,
      speciality: this.medicalPersonel.speciality,
      username: this.medicalPersonel.username,
      accesstype: this.medicalPersonel.accesstype,
      phoneno: this.medicalPersonel.phoneno,
      email: this.medicalPersonel.email
    }
    var url = "";
    switch(this.medicalPersonel.accesstype){
      case "doctor":
        url = this.endpoint+"doctors/Create";
        break;
      case "reception":
        url = this.endpoint+"receptions/Create";
        break;
      case "nurse":
        url = this.endpoint+"nurses/Create";
        break;      
    }
    console.log("urll: " + url);
    console.log(this.medicalPersonel)
     this.wsservice.postData(body,url).subscribe((success)=> {  
      console.log(success);
      this.showLoad = false;
      this.resetMedicalPersonelForm(newMedicalPersonelForm);
      this.toastr.success('Dodano konto');
    },(error)=>{
      console.log(error);
      this.toastr.error('Wystąpił błąd');
      this.showLoad = false;
      this.resetMedicalPersonelForm(newMedicalPersonelForm);
    }) 
  }

  checkUserName(username, accesstype){

  }

  resetMedicalPersonelForm(form?:NgForm){
    if(form != null)
      form.reset();
    this.medicalPersonel = {
      forename: '',
      lastname: '',
      speciality: '',
      username: '',
      accesstype: '',
      phoneno: '',
      email: ''
    }
  }

  onChange(value){
    if(value == "doctor"){
      this.showSpecialityOptions= true;      
    }else if(value == "nurse"){
      this.showSpecialityOptions= false;
      this.medicalPersonel.speciality = 'brak';
    }else{
      this.showSpecialityOptions= false;
      this.medicalPersonel.speciality = '';
    }
  }

  specialitiesList(){
    var json;
    var url = this.endpoint+"api/specialities";
    this.wsservice.getData(url).subscribe((success)=> {  
      json = JSON.parse(success["_body"]);    
      console.log(json);
      for(var i = 0 ; i < json.length ; i++){
        this.specList[i] =  json[i].name;
      }
      console.log( "lista" + this.specList)
      this.specLoaded = true;
    },(error)=>{
      console.log(error);
    })
  }

  OnSubmitSpec(specForm: NgForm){
    this.showLoad = true;
    var url = this.endpoint+"api/specialities";
    var body: Specialities = {
      name: this.spec.name
    }
    console.log(this.spec.name);
    this.wsservice.postData(body,url).subscribe((success) => {
      console.log(success);
      this.showLoad = false;
      this.toastr.success('Dodano specjalność');
    }, (error) => {
      this.toastr.error('Wystąpił błąd');
      this.showLoad = false;
      console.log(error);
    }); 
  }

  OnSubmitAdmin(newAdminForm: NgForm){
    this.showLoad = true;
    var url = this.endpoint+"admins/Create";
    console.log(newAdminForm.value);
    var body: Admin = {
      username: this.admin.username,
      email: this.admin.email,
      phoneno: this.admin.phoneno,
      accesstype:"admin",
      datecreated: new Date().toLocaleString().toString()
    }
    console.log(body);
    this.wsservice.postData(body,url).subscribe((success) => {
      console.log(success);
      this.showLoad = false;
      this.resetAdminForm(newAdminForm);
      this.toastr.success('Dodano konto');
    }, (error) => {
      this.showLoad = false;
      console.log(error);
      this.resetAdminForm(newAdminForm);
      this.toastr.error('Wystąpił błąd');
    }); 
  }



}


