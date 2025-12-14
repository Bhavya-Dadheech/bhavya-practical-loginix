import { Component } from '@angular/core';
import { ChildComponent } from './child/child.component';
import { SharedModules } from '../../shared/modules/shared-modules';

@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [SharedModules, ChildComponent],
  templateUrl: './parent.component.html',
  styleUrl: './parent.component.scss'
})
export class ParentComponent {

}
