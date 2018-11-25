import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { UserComponent } from './user/user.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { UserService } from './shared/user.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth.interceptor';
import { EventSchedulerComponent } from './event-scheduler/event-scheduler.component';
import { AddDataComponent } from './user/add-data/add-data.component';
import { HttpModule } from '@angular/http';
import { MaterializeModule } from 'angular2-materialize';

const appRoutes: Routes = [{path: 'register', component: RegisterComponent},
{path: 'login', component: LoginComponent},
{path: 'home', component: HomePageComponent, canActivate:[AuthGuard]},
{ path : '', redirectTo:'/home', pathMatch : 'full'},
{path:'scheduler', component: EventSchedulerComponent},
{path: 'addData', component: AddDataComponent}]

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    UserComponent,
    LoginComponent,
    HomePageComponent,
    EventSchedulerComponent,
    AddDataComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: true}
    ),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    HttpModule,
    MaterializeModule
  ],
  providers: [UserService, ,AuthGuard,
    ,
    {
      provide : HTTP_INTERCEPTORS,
      useClass : AuthInterceptor,
      multi : true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
