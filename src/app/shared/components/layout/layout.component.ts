import { Component, signal } from '@angular/core';
import { SharedModules } from '../../modules/shared-modules';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SharedModules, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  isCollapsed = signal(false);
}
