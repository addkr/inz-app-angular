import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';

@Injectable({
  providedIn: 'root',
})
/* 
* Klasa "serwis" do wywoływania web service 
*/
export class wsService {

  constructor(private http: Http) { }
  
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
       opt = new RequestOptions({
         withCredentials: false,
         headers: myHeaders
        })   
    var response = this.http.post(url,body, opt).subscribe((success)=> {
        console.log("error: "+success);
    },
    (error) => {
      console.log("error: "+error);
       
    })    
    return response;
}    
  

} 
