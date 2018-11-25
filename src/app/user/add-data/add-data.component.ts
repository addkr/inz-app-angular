import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { UserPersonalData, User } from 'src/app/shared/user.model';
import { NgForm } from '@angular/forms';
import { SharedResources } from 'src/app/shared/sharedResources';
import { UserService } from '../../shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { wsService } from '../../shared/wsservice';

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

  constructor(private userService: UserService, private toastr: ToastrService, private wsservice: wsService) { }

  ngAfterViewInit(){
  }

  ngOnInit() {
    this.resetForm();
    
  }

/*   CheckUserData(){
    this.userService.CheckUserData().subscribe((data: any) => {
      console.log(data);

    }, (error) => {
      console.log(error);
    });
  } */

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
    userName: ''
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
      email: "email",
      phoneno: this.userData.phoneno,
      street: this.userData.street,
      housenumber: this.userData.housenumber,
      local: this.userData.local,
      city: this.userData.city,
      country: this.userData.country,
      datecreated: new Date().toLocaleString().toString(),
      userName : ''
    }
    this.wsservice.postData(body, "http://localhost:52084/patients/Create");
  }
  
}
