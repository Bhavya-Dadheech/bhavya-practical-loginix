import { Component, DestroyRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Metrics, ServerMetrics } from '../../../core/models/server-metrics.model';
import { ServersService } from '../../../core/services/servers.service';
import { finalize, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Servers } from '../../../core/models/server.model';
import { SharedModules } from '../../../shared/modules/shared-modules';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts"

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-detailed-metrics',
  standalone: true,
  imports: [SharedModules],
  templateUrl: './detailed-metrics.component.html',
  styleUrl: './detailed-metrics.component.scss'
})
export class DetailedMetricsComponent implements OnInit {
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private serversService = inject(ServersService);
  private messageService = inject(NzMessageService);

  serverId!: number;
  serverDetails: Servers = new Servers();
  detailedMetric: ServerMetrics = new ServerMetrics();
  isLoading = signal(false);

  @ViewChild("chart") chart!: ChartComponent;
  chartOptions: ChartOptions = {
    series: [
      {
        name: "CPU",
        data: []
      }
    ],
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "straight"
    },
    title: {
      text: "CPU Usage",
      align: "left"
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5
      }
    },
    xaxis: {
      categories: []
    }
  };
  // public chartOptions!: ChartOptions;
  hourLabels!: number[];
  cpuValues!: number[];
  averageCPU!: string;
  highestCpuSpike: Metrics = new Metrics();
  lowestCpuDip: Metrics = new Metrics();

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.serverId = id;
      this.fetchPageData();
    } else {
      this.messageService.error('Invalid Server Id');
      this.router.navigate(['servers']);
    }
  }

  fetchPageData() {
    this.isLoading.set(true);
    this.serversService.getServerById(this.serverId)
      .pipe(
        switchMap((res: any) => {
          this.serverDetails = res;
          return this.serversService.getDetailedMetrics(this.serverId);
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroy$)
      )
      .subscribe({
        next: (res: any) => {
          const response = res;
          if (response && Array.isArray(response) && response.length > 0) {
            this.detailedMetric = response[0];

            if (this.detailedMetric && this.detailedMetric.serverId === Number(this.serverId)) {
              this.cpuValues = this.detailedMetric.metrics.map(m => m.cpu);
              this.hourLabels = this.detailedMetric.metrics.map(m => m.hour);
              this.constructChart();
              this.calculateStatistics(this.detailedMetric.metrics);
            }
          }
        },
        error: err => {
          console.error(err);
          this.messageService.error(err);
        }
      })
  }

  constructChart() {
    this.chartOptions = {
      series: [
        {
          name: "CPU",
          data: this.cpuValues
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "CPU Usage",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      },
      xaxis: {
        categories: this.hourLabels
      }
    };
  }

  calculateStatistics(metrics: Metrics[]) {
    const totalCpu = metrics.reduce((sum, item) => sum + item.cpu, 0);
    this.averageCPU = (totalCpu / metrics.length).toFixed(2);

    this.highestCpuSpike = metrics.reduce((prev, current) =>
      (prev.cpu > current.cpu) ? prev : current
    );

    this.lowestCpuDip = metrics.reduce((prev, current) =>
      (prev.cpu < current.cpu) ? prev : current
    );
  }

  goBack() {
    this.router.navigate(['servers']);
  }
}
