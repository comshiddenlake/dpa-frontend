import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

var API_URL = "http://192.168.2.6:3000"

@Injectable({
  providedIn: 'root'
})
export class DpaService {

  constructor(private http: HttpClient) { }

  getEnergias() {
    console.log("dpaService");
    return this.http.get(API_URL + '/energias');
  }
}
