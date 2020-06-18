import { Component, OnInit } from '@angular/core';

import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { DpaService } from '../dpa.service';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private http: DpaService, private login: LoginService, private router: Router, private spinner: NgxSpinnerService) {
    this.spinner.show();
  }

  energias

  energi = []

  async ngOnInit() {
    if (this.login.getLogStatus() == 0)
      this.router.navigate([''])

    await this.http.getEnergias().subscribe((data) => this.setDataSet(data))
  }

  config = [];

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  headers = ["fecha", "francis", "banki", "pelton", "p1", "p2", "p3", "p4", "p5", "p6"]

  public barChartData: ChartDataSets[] = [{
    data: [], label: "Francis"
  }, {
    data: [], label: "Banki"
  }, {
    data: [], label: "Pelton"
  }
  ];

  setDataSet(data) {
    let banki = [], francis = [], pelton = [], fechareverse = [], fecha = []
    this.barChartLabels = [];
    for (let i = 0; i < data.length; i++) {
      fecha.push(data[i]["fecha"].substring(0, 10));
      francis.push(data[i]["francis"]);
      banki.push(data[i]["banki"]);
      pelton.push(data[i]["pelton"]);
    }
    this.barChartData[0]['data'] = francis.reverse();
    this.barChartData[1]['data'] = banki.reverse();
    this.barChartData[2]['data'] = pelton.reverse();
    fechareverse = fecha.reverse()
    for (let i = 0; i < 30; i++) {
      this.barChartLabels.push(fechareverse[i]);
    }

    this.energias = data.reverse();

    this.spinner.hide();
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public randomize(): void {
    this.barChartData[0].data = [];
    this.setDataSet(this.energias);
  }

  public dailyData(data) {
    this.spinner.show();
    this.barChartData[0].data = [];

    let banki = [], francis = [], pelton = [], fechareverse = [], fecha = []
    this.barChartLabels = [];
    for (let i = 0; i < data.length; i++) {
      fecha.push(data[i]["fecha"].substring(0, 10));
      francis.push(data[i]["francis"]);
      banki.push(data[i]["banki"]);
      pelton.push(data[i]["pelton"]);
    }
    this.barChartData[0]['data'] = francis.reverse();
    this.barChartData[1]['data'] = banki.reverse();
    this.barChartData[2]['data'] = pelton.reverse();
    fechareverse = fecha.reverse()
    for (let i = 0; i < 30; i++) {
      this.barChartLabels.push(fechareverse[i]);
    }

    this.energi = data.reverse();

    this.spinner.hide();
  }

  public monthlyData(data) {
    this.spinner.show();

    this.energi = []

    this.barChartData[0].data = [];
    let banki = [], francis = [], pelton = [], fecha = []
    this.barChartLabels = [];

    let fechita = data[0]["fecha"].substring(0, 7), bankito = 0, francito = 0, peltoncito = 0, acum = 0;

    for (let i = 0; i < data.length; i++) {
      if (data[i]["fecha"].includes(fechita)) {
        bankito += data[i]["banki"]
        francito += data[i]["francis"]
        peltoncito += data[i]["pelton"]
        acum++
      } else {
        fecha.push(fechita);
        francis.push(francito / acum);
        banki.push(bankito / acum);
        pelton.push(peltoncito / acum);
        fechita = data[i]["fecha"].substring(0, 7)
        this.energi.push({ "fecha": fechita, "francis": francito, "banki": bankito, "pelton": peltoncito })
        bankito = 0, francito = 0, peltoncito = 0, acum = 0
      }
    }
    this.barChartData[0]['data'] = francis;
    this.barChartData[1]['data'] = banki;
    this.barChartData[2]['data'] = pelton;
    for (let i = 0; i < fecha.length; i++) {
      this.barChartLabels.push(fecha[i]);
    }

    this.energi = this.energi.reverse();

    this.spinner.hide();
  }

  public annualData() {
    this.spinner.show();

    this.spinner.hide();
  }

  downloadFile() {
    let data = [];
    for (let i = 0; i < this.energi.length; i++) {
      data.push(this.energi[i]);
    }
    const replacer = (key, value) => value === null ? '' : value;
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    var a = document.createElement('a');
    var blob = new Blob([csvArray], { type: 'text/csv' }),
      url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = data[0]["fecha"] + "-" + data[data.length - 1]["fecha"] + "myFile.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

}
