import { Component, OnInit} from '@angular/core';
import { Admin, Specialities } from 'src/app/shared/admin';
import { NgForm } from '@angular/forms';
import { wsService } from '../../shared/wsservice';
import { SharedResources } from '../../shared/sharedResources';
import { MedicalPersonelModel } from 'src/app/shared/medical-personel-model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {

  shared = new SharedResources();
  admin: Admin = new Admin();
  emailPattern = this.shared.emailPattern;
  showLoad: boolean = false;
  spec: Specialities = new Specialities();
  specList = [];
  specLoaded = false;
  medicalPersonelOptions = this.shared.medicalPersonel;
  medicalPersonel= new MedicalPersonelModel();
  showSpecialityOptions = true;
  private endpoint = this.shared.endpoint;

  constructor(private wsservice: wsService,private toastr: ToastrService, private router: Router) { 
    this.specialitiesList();
  }


  ngOnInit() {
    
  }

  logout(){
    if(confirm("Czy chcesz się wylogować?")){
      localStorage.removeItem("userToken");
      this.router.navigate(["/publicpage"]);
    }
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
     this.wsservice.postData(body,this.endpoint+this.medicalPersonel.accesstype+"s/Create").subscribe((success)=> {  
      this.showLoad = false;
      this.resetMedicalPersonelForm(newMedicalPersonelForm);
      this.toastr.success('Dodano konto');
    },(error)=>{
      this.toastr.error('Wystąpił błąd');
      this.showLoad = false;
      this.resetMedicalPersonelForm(newMedicalPersonelForm);
    }) 
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
    if(value == "doctor" || value == "nurse"){
      this.showSpecialityOptions= true;      
    }else{
      this.showSpecialityOptions= false;
      this.medicalPersonel.speciality = '';
    }
  }

  specialitiesList(){
    this.wsservice.getData(this.endpoint+"api/specialities").subscribe((success)=> {  
      var json = JSON.parse(success["_body"]); 
      for(var i = 0 ; i < json.length ; i++){
        this.specList[i] =  json[i].name;
      }
      this.specLoaded = true;
    },(error)=>{
    })
  }

  OnSubmitSpec(specForm: NgForm){
    this.showLoad = true;
    var body = {
      name: this.spec.name
    }
    this.wsservice.postData(body,this.endpoint+"specialities/Create").subscribe((success) => {
      this.showLoad = false;
      this.toastr.success('Dodano specjalność');
    }, (error) => {
      this.toastr.error('Wystąpił błąd');
      this.showLoad = false;
    }); 
  }

  OnSubmitAdmin(newAdminForm: NgForm){
    this.showLoad = true;
    var body: Admin = {
      username: this.admin.username,
      email: this.admin.email,
      phoneno: this.admin.phoneno,
      accesstype:"admin",
      datecreated: new Date().toLocaleString().toString()
    }
    this.wsservice.postData(body,this.endpoint+"admins/Create").subscribe((success) => {
      this.showLoad = false;
      this.resetAdminForm(newAdminForm);
      this.toastr.success('Dodano konto');
    }, (error) => {
      this.showLoad = false;
      this.resetAdminForm(newAdminForm);
      this.toastr.error('Wystąpił błąd');
    }); 
  }



}


