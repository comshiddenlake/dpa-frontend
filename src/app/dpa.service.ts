import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

var API_URL = "http://localhost:3000"

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
