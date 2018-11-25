import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AngularApp';

  constructor(private router: Router){
    this.router.navigate(['home']);
  }

  selected(input){
    switch(input){
     case 'register':
       this.router.navigate(['register']);
       break;
     case 'login':
       this.router.navigate(['loginService']);
       break;
    }
}
}
