import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AccessType } from 'src/app/shared/user.model';
import { ErrorModel } from '../../shared/error-model';
import { SharedResources } from 'src/app/shared/sharedResources';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  showLoad: boolean = false;
  userClaims: any;
  isLoginError : boolean = false;
  error: ErrorModel = new ErrorModel();
  message: any;
  shared = new SharedResources();
  loginOptions = this.shared.loginOptions;
  accessType = new AccessType();
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  OnSubmit(userForm: NgForm){
    this.showLoad = true;
    console.log(userForm.value)
     this.userService.userAuthentication(userForm.value.UserName,userForm.value.Password).subscribe((data : any)=>{
     localStorage.setItem('userToken',data.access_token);
     this.getUserData(userForm.value.accesstype);   
     this.showLoad = false;
   },
   (err : HttpErrorResponse)=>{
     this.isLoginError = true;
     this.showLoad = false;
     console.log(err);
     this.message = this.error.error(err.error.error);
   }); 
 }

 getUserData(accesstype){  
      this.userService.getUserClaims().subscribe((data: any) => {
        localStorage.setItem('UserName',data.UserName);
        localStorage.setItem('Email',data.Email);
        this.CheckUserData(accesstype,data["UserName"]);
      });      
 }
     
  CheckUserData(accesstype,username){
    this.userService.CheckUserData(accesstype,username).subscribe((data: any) => {
      var json = JSON.parse(data);
      this.navigate(json.accesstype);
     
    }, (error) => {
      console.log(error);
      if(error=="Dane mają wartość Null. Ta metoda lub właściwość nie może być wywołana na wartościach zerowych."){
        console.log("Użytkownik nie istnieje lub wprowadzone dane są niepoprawne");
        //this.router.navigate(['/addData']);
      }
    });
  } 

  navigate(access){
    if(access==""){
      console.log("Brak danych użytkownika");
      this.router.navigate(['/addData']);
    }else if (access == "doctor"){
      this.router.navigate(['/doctorpanel']);
    }else if (access == "patient"){
      this.router.navigate(['/home']);
    }else if (access == "nurse"){
      this.router.navigate(['/nursepanel']);
    }else if (access == "reception"){
      this.router.navigate(['/receptionpanel']);
    }else if (access == "admin"){
      this.router.navigate(['/adminpanel']);
    }
  }
}
