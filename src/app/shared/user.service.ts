import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User, UserPersonalData, AccessType } from './user.model';
import { Observable, of, Subject } from 'rxjs';
import { SharedResources } from './sharedResources';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  shared = new SharedResources();
  endpoint = this.shared.endpoint;

  constructor(private http: HttpClient) { }

  registerUser(user : User){
    const body: User = {
      UserName: user.UserName,
      Password: user.Password,
      Email: user.Email
    }
    var reqHeader = new HttpHeaders({'No-Auth':'True'});
    return this.http.post(this.endpoint + 'api/User/Register', body,{headers : reqHeader});
  }

  userAuthentication(userName, password) {
    var data = "username=" + userName + "&password=" + password + "&grant_type=password";
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded','No-Auth':'True' });
    return this.http.post(this.endpoint + 'token', data, { headers: reqHeader });
  }

  getUserClaims(){
   return  this.http.get(this.endpoint+'/api/GetUserClaims');
  }

   CheckUserData(accesstype,username) {
    const body: AccessType = {
      username: username,
      accesstype: accesstype
    }; 
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.endpoint + 'api/CheckUserData', body, { headers: reqHeader });
  }


}
