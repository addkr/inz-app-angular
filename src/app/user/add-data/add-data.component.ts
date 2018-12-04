import { Component, OnInit } from '@angular/core';
import { UserPersonalData } from 'src/app/shared/user.model';
import { NgForm } from '@angular/forms';
import { SharedResources } from 'src/app/shared/sharedResources';
import { UserService } from '../../shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { wsService } from '../../shared/wsservice';
import { Router } from '@angular/router';
import { MedicalPersonelModel } from 'src/app/shared/medical-personel-model';

@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.scss']
})
export class AddDataComponent implements OnInit {
  userData: UserPersonalData;
  
  shared = new SharedResources();
  translateDatePicker = this.shared.translateDatePicker;
  educationOption = this.shared.educationOption;
  citizenshipoptions = this.shared.citizenshipoptions;
  sexoptions = this.shared.sexoptions;
  doctors: any;
  private endpoint = this.shared.endpoint;
  medicalPersonelModel = new MedicalPersonelModel();
  nurses: any;
  showLoad = false;
  reception = false;
  constructor(private router: Router, private userService: UserService, private toastr: ToastrService, private wsservice: wsService) {
    this.getDoctors();
    this.getNurses();
   }

  ngAfterViewInit(){
  }
  logout(){
    if(confirm("Czy chcesz się wylogować?")){
      localStorage.removeItem("userToken");
      this.router.navigate(["/publicpage"]);
    }
  }
  

  ngOnInit() {
    this.resetForm();
    if(localStorage.getItem("AccessType")=="reception"){
      console.log("AccessType: reception")
      this.reception = true;
    }
  }

  onChange(value){
    if(value == "Inna"){
      this.userData.pesel = "00000000000";
    }else{
      this.userData.pesel = "";
    }
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.reset();
    this.userData = {
    forename:'',
    secondname:'',
    lastname:'',
    familyname:'',
    sex:'',
    citizenship:'',
    education:'',
    pesel:'',
    dateofbirth:'',
    email:'',
    phoneno:'',
    street:'',
    housenumber:'',
    local:'',
    city:'',
    country:'',
    datecreated:'',
    username: '',
    accesstype: '',
    doctorusername:'',
    nurseusername:''
    }
  }


  OnSubmit(form: NgForm) {
    var username, email;
    if(this.reception == true){
      username = this.userData.username;
      email = "brak";
    }else{
      username = localStorage.getItem("UserName");
      email = localStorage.getItem("Email");
    }
    this.showLoad = true;
    const body: UserPersonalData = {
      forename: this.userData.forename,
      secondname: this.userData.secondname,
      lastname: this.userData.lastname,
      familyname: this.userData.familyname,
      sex: this.userData.sex,
      citizenship: this.userData.citizenship,
      education: this.userData.education,
      pesel: this.userData.pesel,
      dateofbirth: this.userData.dateofbirth,
      email: email,
      phoneno: this.userData.phoneno,
      street: this.userData.street,
      housenumber: this.userData.housenumber,
      local: this.userData.local,
      city: this.userData.city,
      country: this.userData.country,
      datecreated: new Date().toLocaleString().toString(),
      username : username,
      accesstype: "patient",
      doctorusername: this.userData.doctorusername,
      nurseusername: this.userData.nurseusername
    }
    this.wsservice.postData(body, "http://localhost:52084/patients/Create").subscribe((data) => {
        console.log(data);
        this.showLoad = false;
        this.toastr.success('Dodano dane');
        this.router.navigate(['/home']);
    }, (error) => {
        console.log(error);
        this.toastr.success('Wystąpił błąd');
        this.showLoad = false;
    });
    
  }

   getDoctors(){
    this.wsservice.getData(this.endpoint+"api/doctors").subscribe((success)=>{
      this.doctors = JSON.parse(success["_body"]);    
      console.log(this.doctors)
    },(error)=>{
      console.log(error)
    })
  }

  getNurses(){
    this.wsservice.getData(this.endpoint+"api/nurses").subscribe((success)=>{
      this.nurses = JSON.parse(success["_body"]);    
      console.log(this.doctors)
    },(error)=>{
      console.log(error)
    })
  }

 
  
}
