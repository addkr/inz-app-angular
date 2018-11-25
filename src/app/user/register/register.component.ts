import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { User, UserName } from 'src/app/shared/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  
  user: User;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$';
  username: UserName;
  constructor(private userService: UserService, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {
    this.resetForm();
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.reset();
    this.user = {
      UserName: '',
      Password: '',
      Email: ''
    }
  }


  CheckUserData(){

    this.userService.CheckUserData().subscribe((data: any) => {
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

  OnSubmit(form: NgForm) {
    this.userService.registerUser(form.value)
      .subscribe((data: any) => {
        if (data.Succeeded == true) {
          this.resetForm(form);
          this.toastr.success('Zarejestrowano nowego użytkownika');
          this.router.navigate(['/login']);
        }
        else
          this.toastr.error(data.Errors[0]);
      });
  }
}
