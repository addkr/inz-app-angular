import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { UserPersonalData, User } from 'src/app/shared/user.model';
import { NgForm } from '@angular/forms';
import { SharedResources } from 'src/app/shared/sharedResources';
import { UserService } from '../../shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { wsService } from '../../shared/wsservice';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.scss']
})
export class AddDataComponent implements OnInit {
  userData: UserPersonalData;
  
  shared = new SharedResources();
  translateToPolish = this.shared.translateToPolish;
  educationOption = this.shared.educationOption;
  citizenshipoptions = this.shared.citizenshipoptions;
  sexoptions = this.shared.sexoptions;

  constructor(private router: Router, private userService: UserService, private toastr: ToastrService, private wsservice: wsService) { }

  ngAfterViewInit(){
  }

  ngOnInit() {
    this.resetForm();
    
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
    accesstype: ''
    }
  }


  OnSubmit(form: NgForm) {
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
      email: localStorage.getItem("Email"),
      phoneno: this.userData.phoneno,
      street: this.userData.street,
      housenumber: this.userData.housenumber,
      local: this.userData.local,
      city: this.userData.city,
      country: this.userData.country,
      datecreated: new Date().toLocaleString().toString(),
      username : localStorage.getItem("UserName"),
      accesstype: "patient"
    }
    this.wsservice.postData(body, "http://localhost:52084/patients/Create").subscribe((data) => {
        console.log(data);
        this.router.navigate(['/home']);
    }, (error) => {
        console.log(error);
    });
    
  }

  getUserData(){
  
    this.userService.getUserClaims().subscribe((data: any) => {
       localStorage.setItem('UserName',data.UserName);
       localStorage.setItem('Email',data.Email);
       //this.CheckUserData(data["UserName"]);
    });
    
   }

  /* CheckUserData(username){
    this.userService.CheckUserData(username).subscribe((data: any) => {
      console.log(data);
      if(data==""){
        console.log("Brak danych użytkownika");
        this.router.navigate(['/addData']);
      }else{
        this.router.navigate(['/home']);
      }
      //this.router.navigate(['/home']);
    }, (error) => {
      console.log(error);
      if(error=="Dane mają wartość Null. Ta metoda lub właściwość nie może być wywołana na wartościach zerowych."){
        console.log("Użytkownik nie istnieje lub wprowadzone dane są niepoprawne");
        //this.router.navigate(['/addData']);
      }
    });
  }  */
  
}
