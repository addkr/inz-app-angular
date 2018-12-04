import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { UserService } from './shared/user.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AddDataComponent } from './user/add-data/add-data.component';
import { HttpModule } from '@angular/http';
import { MaterializeModule } from 'angular2-materialize';
import { PublicPageComponent } from './public-page/public-page.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { DoctorPanelComponent } from './medicalPersonel/doctor-panel/doctor-panel.component';
import { NursePanelComponent } from './medicalPersonel/nurse-panel/nurse-panel.component';
import { ReceptionPanelComponent } from './medicalPersonel/reception-panel/reception-panel.component';
import { PatientPanelComponent } from './patient-panel/patient-panel.component';

const appRoutes: Routes = 
[{path: 'register', component: RegisterComponent},
{path: 'login', component: LoginComponent},
{ path : '', redirectTo:'/publicpage', pathMatch : 'full'},
{path: 'addData', component: AddDataComponent},
{path: 'publicpage', component: PublicPageComponent},
{path: 'adminpanel',component: AdminPanelComponent, canActivate:[AuthGuard]},
{path: 'doctorpanel',component: DoctorPanelComponent, canActivate:[AuthGuard]},
{path: 'nursepanel',component: NursePanelComponent, canActivate:[AuthGuard]},
{path: 'receptionpanel',component: ReceptionPanelComponent, canActivate:[AuthGuard]},
{path: 'patientpanel',component: PatientPanelComponent, canActivate:[AuthGuard]}]

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    AddDataComponent,
    PublicPageComponent,
    AdminPanelComponent,
    DoctorPanelComponent,
    NursePanelComponent,
    ReceptionPanelComponent,
    PatientPanelComponent
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
