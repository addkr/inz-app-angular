import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Aplikacja dla przychodni lekarskiej';
  constructor(){
    //localStorage.removeItem("userToken");
  }
 
}
