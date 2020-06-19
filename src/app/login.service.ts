import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  logged = 0

  user

  constructor() { }

  login(user,pass) {
    console.log('loginservice')
    if (user == 'central' && pass == 'LagoEscondido') {
      this.logged = 1
      this.user = 'central'
    } else if (user == 'dpa' && pass == 'lago1234') {
      this.logged = 2
      this.user = 'dpa'
    } else {
      this.logged = 0
      this.user = null
      window.alert('Usuario o contraseña no válidos')
    }
  }

  logout() {
    this.logged = 0;
  }

  getUser () {
    return this.user;
  }
  
  getLogStatus () {
    return this.logged;
  }
}
