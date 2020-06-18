import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService: LoginService, private router: Router, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.hide();
  }

  user
  password

  public loginUp() {
    this.loginService.login(this.user,this.password);
    if (this.loginService.getLogStatus() == 0) {
      this.cleanCredentials();
      this.spinner.show();
    } else {
      this.router.navigate(['dashboard']);
    }
  }

  public cleanCredentials () {
    this.user = ''
    this.password = ''
  }

}
