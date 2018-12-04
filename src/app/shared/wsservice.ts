import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, AccessType } from './user.model';
import { SharedResources } from './sharedResources';

@Injectable({
  providedIn: 'root',
})
/* 
* Klasa "serwis" do wywoływania web service 
*/

export class wsService {

  shared = new SharedResources();
  endpoint = this.shared.endpoint;

  constructor(private http: Http, private httpClient: HttpClient) { }

  registerUser(user : User){
    const body: User = {
      UserName: user.UserName,
      Password: user.Password,
      Email: user.Email
    }
    let opt: RequestOptions
       let myHeaders: Headers = new Headers
       myHeaders.set('No-Auth', 'True');
       opt = new RequestOptions({
        withCredentials: false,
        headers: myHeaders
       })  
    return this.http.post(this.endpoint + 'api/User/Register', body, opt);
  }

  userAuthentication(userName, password) {
    var data = "username=" + userName + "&password=" + password + "&grant_type=password";
    let opt: RequestOptions
       let myHeaders: Headers = new Headers
       myHeaders.set('No-Auth', 'True');
       myHeaders.append('Content-Type','application/x-www-urlencoded');
       opt = new RequestOptions({
        withCredentials: false,
        headers: myHeaders
       })  
    return this.http.post(this.endpoint + 'token', data, opt);
  }

  CheckUserData(accesstype,username) {
    const body: AccessType = {
      username: username,
      accesstype: accesstype
    }; 
    let opt: RequestOptions
       let myHeaders: Headers = new Headers
       myHeaders.append('Content-Type','application/json');
       opt = new RequestOptions({
        withCredentials: true,
        headers: myHeaders
       })  
    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.endpoint + 'api/CheckUserData', body, opt);
  }
  

  getUserClaims(){
   return  this.httpClient.get(this.endpoint+'api/GetUserClaims');
  }
  
  /* 
  * Metoda tworząca post request do web service
  */
  postData(body, url) {
    console.log("body: "+ body+" url: "+url);
    let opt: RequestOptions
       let myHeaders: Headers = new Headers
       myHeaders.set('Content-type', 'application/json');
       myHeaders.append('Access-Control-Allow-Headers', 'Content-type, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers');
       myHeaders.append('Access-Control-Allow-Methods', '*');
       myHeaders.append('Access-Control-Allow-Origin', '*');
       myHeaders.append("Authorization", "Bearer " + localStorage.getItem('userToken'));
       opt = new RequestOptions({
         withCredentials: true,
         headers: myHeaders
        })   
    return this.http.post(url,body, opt);
  }    

  getData(url){
    let opt: RequestOptions
       let myHeaders: Headers = new Headers
       myHeaders.set('Content-type', 'application/json');
       myHeaders.append('Access-Control-Allow-Headers', 'Content-type, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers');
       myHeaders.append('Access-Control-Allow-Methods', '*');
       myHeaders.append('Access-Control-Allow-Origin', '*');
       myHeaders.append("Authorization", "Bearer " + localStorage.getItem('userToken'));
       opt = new RequestOptions({
         withCredentials: false,
         headers: myHeaders
        })   
    return this.http.get(url,opt);
  }
  

} 
