import { Component } from '@angular/core';
import { SharedModules } from '../../shared/modules/shared-modules';
import { ParentComponent } from '../parent/parent.component';
import { TreeViewComponent } from '../tree-view/tree-view.component';

@Component({
  selector: 'app-parent-sibling-wrapper',
  standalone: true,
  imports: [SharedModules, ParentComponent, TreeViewComponent],
  templateUrl: './parent-sibling-wrapper.component.html',
  styleUrl: './parent-sibling-wrapper.component.scss'
})
export class ParentSiblingWrapperComponent {

}
