import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ChartsModule } from 'ng2-charts';
import { LoginComponent } from './login/login.component';

import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';

import { NgxSpinnerModule } from "ngx-spinner";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ChartsModule,
    FormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    NgbModule,
    LoggerModule.forRoot({
      serverLoggingUrl: 'localhost',
      level: NgxLoggerLevel.TRACE,
      serverLogLevel: NgxLoggerLevel.ERROR,
      disableConsoleLogging: false
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
