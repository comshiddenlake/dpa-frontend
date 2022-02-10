import { Component, OnInit } from '@angular/core';

import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { DpaService } from '../dpa.service';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private http: DpaService,
    private login: LoginService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private logger: NGXLogger) {
    this.spinner.show();
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  mega = false
  energias
  energi = []
  config = [];

  async ngOnInit() {
    if (this.login.getLogStatus() == 0)
      this.router.navigate([''])
    this.http.getEnergias().subscribe((data) => this.dailyData(data));
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

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

  headers = ["fecha", "francisA", "francisB", "banki", "chipre1", "chipre2", "chipre3", "chipre4", "chipre5", "chipre6", "chipre7"]

  public barChartData: ChartDataSets[] = [{
    data: [], label: "FrancisA"
  }, {
    data: [], label: "FrancisB"
  },
  {
    data: [], label: "Banki"
  },
  {
    data: [], label: "Chipre1"
  },
  {
    data: [], label: "Chipre2"
  },
  {
    data: [], label: "Chipre3"
  },
  {
    data: [], label: "Chipre4"
  },
  {
    data: [], label: "Chipre5"
  },
  {
    data: [], label: "Chipre6"
  },
  {
    data: [], label: "Chipre7"
  }
  ];

  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public dailyData(data) {
    console.log(JSON.stringify(data))
    this.spinner.show();

    this.energias = data;

    //this.mega = true;

    this.cleanData(false);
    this.energi = []

    this.barChartLabels = [];
    for (let i = 0; i < data.length; i++) {
      this.barChartLabels.push(data[i]["fecha"].substring(0, 10));
      this.energi.push({ "fecha": data[i]["fecha"].substring(0, 10), "francisA": data[i]["francisA"] / 1000000, "francisB": data[i]["francisB"] / 1000000, "banki": data[i]["banki"] / 1000000, "chipre1": data[i]["chipre1"] / 1000000, "chipre2": data[i]["chipre2"] / 1000000, "chipre3": data[i]["chipre3"] / 1000000, "chipre4": data[i]["chipre4"] / 1000000, "chipre5": data[i]["chipre5"] / 1000000, "chipre6": data[i]["chipre6"] / 1000000, "chipre7": data[i]["chipre7"] / 1000000 })
      this.barChartData[0]['data'].push(this.energi[i]["francisA"])
      this.barChartData[1]['data'].push(this.energi[i]["francisB"])
      this.barChartData[2]['data'].push(this.energi[i]["banki"])
      this.barChartData[3]['data'].push(this.energi[i]["chipre1"])
      this.barChartData[4]['data'].push(this.energi[i]["chipre2"])
      this.barChartData[5]['data'].push(this.energi[i]["chipre3"])
      this.barChartData[6]['data'].push(this.energi[i]["chipre4"])
      this.barChartData[7]['data'].push(this.energi[i]["chipre5"])
      this.barChartData[8]['data'].push(this.energi[i]["chipre6"])
      this.barChartData[9]['data'].push(this.energi[i]["chipre7"])
    }

    this.initializeData();

    this.spinner.hide();
  }

  public monthlyData(data) {
    //this.spinner.show();

    //this.mega = true;

    this.energi = []

    this.cleanData(true);

    this.filterFromDate(data[0]["fecha"].substring(0, 7), data);

    this.initializeData();

    //this.spinner.hide();
  }

  filterFromDate(fecha, data) {
    let bankito = 0, francitoA = 0, francitoB = 0, acum = 0, chipre1 = 0, chipre2 = 0, chipre3 = 0, chipre4 = 0, chipre5 = 0, chipre6 = 0, chipre7 = 0;
    /*
    ESTE DATA TRAE LA INFO DEL BACK
    */
   console.log("Fecha: "+ fecha)
    for (let i = 0; i < data.length; i++) {
      console.log("data[i][fecha].includes(fecha) " + data[i]["fecha"].includes(fecha))
      if (data[i]["fecha"].includes(fecha)) {
        francitoA += data[i]["francisA"]
        francitoB += data[i]["francisB"]
        bankito += data[i]["banki"]
        chipre1 += data[i]["chipre1"]
        chipre2 += data[i]["chipre2"]
        chipre3 += data[i]["chipre3"]
        chipre4 += data[i]["chipre4"]
        chipre5 += data[i]["chipre5"]
        chipre6 += data[i]["chipre6"]
        chipre7 += data[i]["chipre7"]
      } else {
        this.energi.push({
          "fecha": data[i]["fecha"].substring(0, fecha.length),
          "francisA": data[i]["francisA"], "francisB": data[i]["francisB"],
          "banki": data[i]["banki"], "chipre1": data[i]["chipre1"],
          "chipre2": data[i]["chipre2"], "chipre3": data[i]["chipre3"],
          "chipre4": data[i]["chipre4"], "chipre5": data[i]["chipre5"],
          "chipre6": data[i]["chipre6"], "chipre7": data[i]["chipre7"]
        })
        fecha = data[i]["fecha"].substring(0, fecha.length);

        this.barChartData[0]['data'].push(francitoA / 1000000);
        this.barChartData[1]['data'].push(francitoB / 1000000);
        this.barChartData[2]['data'].push(bankito / 1000000);
        this.barChartData[3]['data'].push(chipre1 / 1000000);
        this.barChartData[4]['data'].push(chipre2 / 1000000);
        this.barChartData[5]['data'].push(chipre3 / 1000000);
        this.barChartData[6]['data'].push(chipre4 / 1000000);
        this.barChartData[7]['data'].push(chipre5 / 1000000);
        this.barChartData[8]['data'].push(chipre6 / 1000000);
        this.barChartData[9]['data'].push(chipre7 / 1000000);
        
        this.barChartLabels.push(fecha);

        bankito = data[i]["banki"], francitoA = data[i]["francisA"], francitoB = data[i]["francisB"], chipre1 = data[i]["chipre1"], chipre2 = data[i]["chipre2"], chipre3 = data[i]["chipre3"], chipre4 = data[i]["chipre4"], chipre5 = data[i]["chipre5"], chipre6 = data[i]["chipre6"], chipre7 = data[i]["chipre7"], acum = 1
      }
    }
  }

  public rangeData(data) {
    //this.spinner.show();

    //this.mega = true;

    this.energi = []

    this.cleanData(true);

    let fechita = data[0]["fecha"].substring(0, 7);
    let toDateFormated = new Date(this.toDate.year + "-" + this.toDate.month + "-" + this.toDate.day)
    let fromDateFormated = new Date(this.fromDate.year + "-" + this.fromDate.month + "-" + this.fromDate.day)
    for (let i = 0; i < data.length; i++) {
      if (fromDateFormated <= new Date(data[i]["fecha"]) && toDateFormated >= new Date(data[i]["fecha"])) {
        this.barChartLabels.push(data[i]["fecha"].substring(0, 10));
        this.energi.push({
          "fecha": data[i]["fecha"].substring(0, 10), "francisA": data[i]["francisA"] / 1000000,
          "francisB": data[i]["francisB"] / 1000000, "banki": data[i]["banki"] / 1000000, "chipre1": data[i]["chipre1"] / 1000000,
          "chipre2": data[i]["chipre2"] / 1000000, "chipre3": data[i]["chipre3"] / 1000000, "chipre4": data[i]["chipre4"] / 1000000,
          "chipre5": data[i]["chipre5"] / 1000000, "chipre6": data[i]["chipre6"] / 1000000, "chipre7": data[i]["chipre7"] / 1000000
        })
        this.barChartData[0]['data'].push(data[i]["francisA"] / 1000000)
        this.barChartData[1]['data'].push(data[i]["francisB"] / 1000000)
        this.barChartData[2]['data'].push(data[i]["banki"] / 1000000)
        this.barChartData[3]['data'].push(data[i]["chipre1"] / 1000000)
        this.barChartData[4]['data'].push(data[i]["chipre2"] / 1000000)
        this.barChartData[5]['data'].push(data[i]["chipre3"] / 1000000)
        this.barChartData[6]['data'].push(data[i]["chipre4"] / 1000000)
        this.barChartData[7]['data'].push(data[i]["chipre5"] / 1000000)
        this.barChartData[8]['data'].push(data[i]["chipre6"] / 1000000)
        this.barChartData[9]['data'].push(data[i]["chipre7"] / 1000000)
      }
    }
    this.barChartLabels.push(fechita);

    this.initializeData();

    //this.spinner.hide();
  }

  public annualData(data) {
    this.spinner.show();

    //this.mega = true;

    this.energi = []

    this.cleanData(true);

    this.filterFromDate(data[0]["fecha"].substring(0, 4), data);
    this.initializeData();
    this.spinner.hide();
  }

  downloadFile() {
    let data = [];
    data = this.energi
    const replacer = (key, value) => value === null ? '' : value;
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    var a = document.createElement('a');
    var blob = new Blob([csvArray], { type: 'text/csv' }),
      url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = data[0]["fecha"].substring(0, 10) + "-" + data[data.length - 1]["fecha"].substring(0, 10) + ".csv";

    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  /*switchMegaToKilo() {
    this.spinner.show();
    let header = ["francisA", "francisB", "banki", "chipre1", "chipre2", "chipre3", "chipre4", "chipre5", "chipre6", "chipre7"];
    this.cleanData(false);
    console.log("hits.mega" + this.mega)
    for (let i = 0; i < this.energi.length; i++) {
      for (let u = 0; u < header.length; u++) {
        (this.mega) ? (this.energi[i][header[u]] = (this.energi[i][header[u]] * 1000)) : (this.energi[i][header[u]] = (this.energi[i][header[u]] / 1000000))
      }
      this.barChartData[0]['data'].push(this.energi[i]["francisA"]/1000000)
      this.barChartData[1]['data'].push(this.energi[i]["francisB"]/1000000)
      this.barChartData[2]['data'].push(this.energi[i]["banki"]/1000000)
      this.barChartData[3]['data'].push(this.energi[i]["chipre1"]/1000000)
      this.barChartData[4]['data'].push(this.energi[i]["chipre2"]/1000000)
      this.barChartData[5]['data'].push(this.energi[i]["chipre3"]/1000000)
      this.barChartData[6]['data'].push(this.energi[i]["chipre4"]/1000000)
      this.barChartData[7]['data'].push(this.energi[i]["chipre5"]/1000000)
      this.barChartData[8]['data'].push(this.energi[i]["chipre6"]/1000000)
      this.barChartData[9]['data'].push(this.energi[i]["chipre7"]/1000000)
    }
    (this.mega) ? this.mega = false : this.mega = true

    this.spinner.hide();

    var buttonParentNode = document.getElementById('customSwitch1');
    var button_click = function (e) {
      // this function handle all button click event
      var btn = e.target; // DOM element which was click. It must be any tag inside buttonParentNode
      if (btn.tagName == 'INPUT') { // if DOM element is a input tag. 
        if (btn.innerHTML == 'X') {
          btn.innerHTML = 'O';
        } else {
          btn.innerHTML = 'X';
        }
      }
    };

    buttonParentNode.addEventListener('click', button_click, false);

  }
*/
  initializeData() {
    //this.spinner.show();

    //this.mega = true;

    let header = ["francisA", "francisB", "banki", "chipre1", "chipre2", "chipre3", "chipre4", "chipre5", "chipre6", "chipre7"];

    this.cleanData(false);

    for (let i = 0; i < this.energi.length; i++) {
      for (let u = 0; u < header.length; u++) {
      }
      this.barChartData[0]['data'].push(this.energi[i]["francisA"])
      this.barChartData[1]['data'].push(this.energi[i]["francisB"])
      this.barChartData[2]['data'].push(this.energi[i]["banki"])
      this.barChartData[3]['data'].push(this.energi[i]["chipre1"])
      this.barChartData[4]['data'].push(this.energi[i]["chipre2"])
      this.barChartData[5]['data'].push(this.energi[i]["chipre3"])
      this.barChartData[6]['data'].push(this.energi[i]["chipre4"])
      this.barChartData[7]['data'].push(this.energi[i]["chipre5"])
      this.barChartData[8]['data'].push(this.energi[i]["chipre6"])
      this.barChartData[9]['data'].push(this.energi[i]["chipre7"])
    }
    //(this.mega) ? this.mega = false : this.mega = true

    this.spinner.hide();
  }

  cleanData(bool) {
    (bool) ? (this.barChartLabels = []) : this.barChartLabels;
    this.barChartData[0].data = [];
    this.barChartData[1].data = [];
    this.barChartData[2].data = [];
    this.barChartData[3].data = [];
    this.barChartData[4].data = [];
    this.barChartData[5].data = [];
    this.barChartData[6].data = [];
    this.barChartData[7].data = [];
    this.barChartData[8].data = [];
    this.barChartData[9].data = [];
  }
}
