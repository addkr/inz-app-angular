import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserName } from 'src/app/shared/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: UserName;
  userClaims: any;
  isLoginError : boolean = false;
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  OnSubmit(userName,password){
    this.userService.userAuthentication(userName,password).subscribe((data : any)=>{
     localStorage.setItem('userToken',data.access_token);
     this.getUserData();   
   },
   (err : HttpErrorResponse)=>{
     this.isLoginError = true;
   });
 }

 getUserData(){
  
  this.userService.getUserClaims().subscribe((data: any) => {
     this.username.userName = data["UserName"];
  });
  this.CheckUserData(this.username.userName);
 }

 

     
  CheckUserData(username){
    this.userService.CheckUserData(username).subscribe((data: any) => {
      console.log(data);
      //this.router.navigate(['/home']);
    }, (error) => {
      console.log(error);
      if(error=="Dane mają wartość Null. Ta metoda lub właściwość nie może być wywołana na wartościach zerowych."){
        console.log("Użytkownik nie istnieje lub wprowadzone dane są niepoprawne");
        //this.router.navigate(['/addData']);
      }
    });
  } 
}
