import { Component, inject } from '@angular/core';
import { SharedModules } from '../../../shared/modules/shared-modules';
import { TreeViewService } from '../../../core/services/tree-view.service';

@Component({
  selector: 'app-child',
  standalone: true,
  imports: [SharedModules],
  templateUrl: './child.component.html',
  styleUrl: './child.component.scss'
})
export class ChildComponent {
  private treeViewService = inject(TreeViewService);

  triggerTreeView() {
    this.treeViewService.setTrigger('run');
  }
}
