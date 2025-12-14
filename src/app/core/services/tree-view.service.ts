import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TreeData } from '../models/tree-data';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TreeViewService {
  private http = inject(HttpClient);
  private triggerView = new BehaviorSubject<string>('');
  public triggerView$ = this.triggerView.asObservable();

  constructor() { }

  setTrigger(value: string) {
    this.triggerView.next(value);
  }

  getTreeData(): Observable<TreeData[]> {
    return this.http.get<TreeData[]>(`${environment.apiUrl}/tree-data`);
  }
}
