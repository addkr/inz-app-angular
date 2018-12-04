import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/shared/user.model';
import { Router } from '@angular/router';
import { SharedResources } from 'src/app/shared/sharedResources';
import { wsService } from 'src/app/shared/wsservice';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  shared = new SharedResources();
  user: User;
  emailPattern = this.shared.emailPattern;
  passwordPattern = this.shared.passwordPattern;
  showLoad: boolean = false;
  constructor(private userService: UserService, private toastr: ToastrService, private router: Router, private wsservice: wsService) { }

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

  OnSubmit(form: NgForm) {
    this.showLoad = true;
    this.userService.registerUser(form.value)
      .subscribe((data: any) => {
        if (data.Succeeded == true) {
          this.resetForm(form);
          this.toastr.success('Zarejestrowano nowego użytkownika');
          this.router.navigate(['/login']);
          this.showLoad = false;
        }
        else
          this.toastr.error(data.Errors[0]);
          this.showLoad = false;
      });
  }
}
