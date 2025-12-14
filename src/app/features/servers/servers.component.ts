import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { SharedModules } from '../../shared/modules/shared-modules';
import { ServersService } from '../../core/services/servers.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Servers } from '../../core/models/server.model';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-servers',
  standalone: true,
  imports: [SharedModules],
  templateUrl: './servers.component.html',
  styleUrl: './servers.component.scss'
})
export class ServersComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private destroy$ = inject(DestroyRef);
  private serversService = inject(ServersService);
  private messageService = inject(NzMessageService);

  isLoading = signal(false);
  serverList: Servers[] = [];
  filterForm!: FormGroup;
  options: { status: string, cpu: number | null } = { status: '', cpu: null };

  constructor() {
    this.filterForm = this.fb.group({
      status: [''],
      cpu: [0]
    })
  }

  ngOnInit(): void {
    this.fetchServers();

    // this.filterForm.get('status')?.valueChanges.subscribe(value => {
    //   this.options.status = value;
    //   this.fetchServers();
    // });
    // this.filterForm.get('cpu')?.valueChanges
    //   .pipe(debounceTime(500), distinctUntilChanged())
    //   .subscribe((value) => {
    //     this.options.cpu = value;
    //     this.fetchServers();
    //   });

    this.filterForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        this.options = value;
        this.fetchServers();
      })
  }

  fetchServers() {
    this.isLoading.set(true);
    this.serversService.getServers(this.options)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroy$)
      )
      .subscribe({
        next: (res: any) => {
          this.serverList = res;
        },
        error: err => {
          console.error(err);
          this.messageService.error(err);
        }
      })
  }

  viewDetailedMetrics(data: Servers) {
    this.router.navigate([`servers/${data.id}`])
  }

  resetForm() {
    this.filterForm.reset();
  }
}
