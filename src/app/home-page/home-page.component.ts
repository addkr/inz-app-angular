import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  
  constructor(private userService: UserService) { }

  ngOnInit() {
   
  }

 

  logout(){
    localStorage.removeItem('userToken');

  }

}
