import { HttpInterceptor, HttpRequest, HttpHandler, HttpUserEvent, HttpEvent } from "@angular/common/http";
import { Observable } from 'rxjs';
import { UserService } from "../shared/user.service";
import { tap }  from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.headers.get('No-Auth') == "True")
            return next.handle(req.clone());

        if (localStorage.getItem('userToken') != null) {
            const clonedreq = req.clone({
                headers: req.headers.set("Authorization", "Bearer " + localStorage.getItem('userToken'))
            });
            return next.handle(clonedreq).pipe(
                tap((success)=> {
                    console.log(success);
                }, (error) => {
                    console.log(error);
                    if (error.status === 401)
                    console.log(error);
                    this.router.navigateByUrl('/login');
                })
            );
               
        }
        else {
            this.router.navigateByUrl('/login');
        }
    }
}