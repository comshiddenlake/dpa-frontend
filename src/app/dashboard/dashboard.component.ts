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
  mega = true
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

  headers = ["fecha", "francis", "banki", "pelton", "p1", "p2", "p3", "p4", "p5", "p6"]

  public barChartData: ChartDataSets[] = [{
    data: [], label: "Francis"
  }, {
    data: [], label: "Banki"
  }, {
    data: [], label: "Pelton"
  }
  ];

  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public dailyData(data) {
    this.spinner.show();

    this.energias = data;

    this.mega = true;

    this.cleanData(false);
    this.energi = []

    this.barChartLabels = [];
    for (let i = 0; i < data.length; i++) {
      this.barChartLabels.push(data[i]["fecha"].substring(0, 10));
      this.energi.push({ "fecha": data[i]["fecha"].substring(0, 10), "francis": data[i]["francis"], "banki": data[i]["banki"], "pelton": data[i]["pelton"], "p1": data[i]["p1"], "p2": data[i]["p2"], "p3": data[i]["p3"], "p4": data[i]["p4"], "p5": data[i]["p5"], "p6": data[i]["p6"] })
      this.barChartData[0]['data'].push(data[i]["francis"])
      this.barChartData[1]['data'].push(data[i]["banki"])
      this.barChartData[2]['data'].push(data[i]["pelton"])
    }

    this.initializeData();

    this.spinner.hide();
  }

  public monthlyData(data) {
    this.spinner.show();

    this.mega = true;

    this.energi = []

    this.cleanData(true);

    this.filterFromDate(data[0]["fecha"].substring(0, 7), data);

    this.initializeData();

    this.spinner.hide();
  }

  filterFromDate(fecha, data) {
    let bankito = 0, francito = 0, peltoncito = 0, acum = 0, p1 = 0, p2 = 0, p3 = 0, p4 = 0, p5 = 0, p6 = 0;

    for (let i = 0; i < data.length; i++) {
      if (data[i]["fecha"].includes(fecha)) {
        bankito += data[i]["banki"]
        francito += data[i]["francis"]
        peltoncito += data[i]["pelton"]
        p1 += data[i]["P1"]
        p2 += data[i]["P2"]
        p3 += data[i]["P3"]
        p4 += data[i]["P4"]
        p5 += data[i]["P5"]
        p6 += data[i]["P6"]
      } else {
        this.energi.push({ "fecha": data[i]["fecha"].substring(0, fecha.length), "francis": data[i]["francis"], "banki": data[i]["banki"], "pelton": data[i]["pelton"], "p1": data[i]["p1"], "p2": data[i]["p2"], "p3": data[i]["p3"], "p4": data[i]["p4"], "p5": data[i]["p5"], "p6": data[i]["p6"] })
        fecha = data[i]["fecha"].substring(0, fecha.length);

        this.barChartData[0]['data'].push(francito);
        this.barChartData[1]['data'].push(bankito);
        this.barChartData[2]['data'].push(peltoncito);

        this.barChartLabels.push(fecha);

        bankito = data[i]["banki"], francito = data[i]["francis"], peltoncito = data[i]["pelton"], acum = 1
      }
    }
  }

  public rangeData(data) {
    this.spinner.show();

    this.mega = true;

    this.energi = []

    this.cleanData(true);

    let fechita = data[0]["fecha"].substring(0, 7);
    let toDateFormated = new Date(this.toDate.year + "-" + this.toDate.month + "-" + this.toDate.day)
    let fromDateFormated = new Date(this.fromDate.year + "-" + this.fromDate.month + "-" + this.fromDate.day)

    for (let i = 0; i < data.length; i++) {
      if (fromDateFormated <= new Date(data[i]["fecha"]) && toDateFormated >= new Date(data[i]["fecha"])) {
        this.barChartLabels.push(data[i]["fecha"].substring(0, 10));
        this.energi.push({ "fecha": data[i]["fecha"].substring(0, 10), "francis": data[i]["francis"], "banki": data[i]["banki"], "pelton": data[i]["pelton"], "p1": data[i]["p1"], "p2": data[i]["p2"], "p3": data[i]["p3"], "p4": data[i]["p4"], "p5": data[i]["p5"], "p6": data[i]["p6"] })
        this.barChartData[0]['data'].push(data[i]["francis"])
        this.barChartData[1]['data'].push(data[i]["banki"])
        this.barChartData[2]['data'].push(data[i]["pelton"])

      }
    }
    this.barChartLabels.push(fechita);

    this.initializeData();

    this.spinner.hide();
  }

  public annualData(data) {
    this.spinner.show();

    this.mega = true;

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

  switchMegaToKilo() {
    this.spinner.show();
    let header = ["francis", "banki", "pelton", "p1", "p2", "p3", "p4", "p5", "p6"];
    this.cleanData(false);

    for (let i = 0; i < this.energi.length; i++) {
      for (let u = 0; u < header.length; u++) {
        (this.mega) ? (this.energi[i][header[u]] = (this.energi[i][header[u]] / 1000)) : (this.energi[i][header[u]] = (this.energi[i][header[u]] * 1000))
      }
      this.barChartData[0]['data'].push(this.energi[i]["francis"]);
      this.barChartData[1]['data'].push(this.energi[i]["banki"]);
      this.barChartData[2]['data'].push(this.energi[i]["pelton"]);
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

  initializeData() {
    this.spinner.show();

    this.mega = true;

    let header = ["francis", "banki", "pelton", "p1", "p2", "p3", "p4", "p5", "p6"];

    this.cleanData(false);

    for (let i = 0; i < this.energi.length; i++) {
      for (let u = 0; u < header.length; u++) {
      }
      this.barChartData[0]['data'].push(this.energi[i]["francis"]);
      this.barChartData[1]['data'].push(this.energi[i]["banki"]);
      this.barChartData[2]['data'].push(this.energi[i]["pelton"]);
    }
    (this.mega) ? this.mega = false : this.mega = true

    this.spinner.hide();
  }

  cleanData(bool) {
    (bool) ? (this.barChartLabels = []) : this.barChartLabels;
    this.barChartData[0].data = [];
    this.barChartData[1].data = [];
    this.barChartData[2].data = [];
  }
}
