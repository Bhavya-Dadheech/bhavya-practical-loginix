import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Servers } from '../models/server.model';
import { environment } from '../../../environments/environment';
import { ServerMetrics } from '../models/server-metrics.model';

@Injectable({
  providedIn: 'root'
})
export class ServersService {
  private http = inject(HttpClient);

  private isValid = (v: any) => v !== null && v !== undefined && v !== '';

  getServers(options: any = {}): Observable<Servers[]> {
    let params = new HttpParams();
    if (this.isValid(options.status)) params = params.set('status', options.status);
    if (this.isValid(options.cpu)) params = params.set('cpu', options.cpu);

    return this.http.get<Servers[]>(`${environment.apiUrl}/servers`, { params });
  }

  getServerById(serverId: number): Observable<ServerMetrics> {
    return this.http.get<ServerMetrics>(`${environment.apiUrl}/servers/${serverId}`);
  }

  getDetailedMetrics(serverId: number): Observable<ServerMetrics> {
    let params = new HttpParams();
    if (this.isValid(serverId)) params = params.set('serverId', serverId);
    return this.http.get<ServerMetrics>(`${environment.apiUrl}/servers-metrics`, { params });
  }
}
