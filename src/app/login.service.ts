import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  logged = 0

  constructor() { }

  login(user,pass) {
    console.log('loginservice')
    if (user == 'central' && pass == 'LagoEscondido') {
      this.logged = 1
    } else if (user == 'dpa' && pass == 'lago1234') {
      this.logged = 2
    } else {
      this.logged = 0
      window.alert('Usuario o contraseña no válidos')
    }
  }

  logout() {
    this.logged = 0;
  }

  getLogStatus () {
    return this.logged;
  }
}
