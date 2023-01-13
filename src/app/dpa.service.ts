import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

var API_URL = "http://api.lago-escondido.com"

@Injectable({
  providedIn: 'root'
})
export class DpaService {

  constructor(private http: HttpClient) { }

  getEnergias() {
    console.log("dpaService");
    return this.http.get(API_URL + '/energiasgeneradas');
  }
}
