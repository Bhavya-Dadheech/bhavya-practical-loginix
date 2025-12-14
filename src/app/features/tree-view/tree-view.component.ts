import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { TreeViewService } from '../../core/services/tree-view.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SharedModules } from '../../shared/modules/shared-modules';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { finalize, map } from 'rxjs';

interface TreeNode {
  name: string;
  errorCount?: number;
  disabled?: boolean;
  children?: TreeNode[];
}

interface FlatNode {
  expandable: boolean;
  name: string;
  errorCount?: number;
  level: number;
  disabled: boolean;
}

@Component({
  selector: 'app-tree-view',
  standalone: true,
  imports: [SharedModules],
  templateUrl: './tree-view.component.html',
  styleUrl: './tree-view.component.scss'
})
export class TreeViewComponent implements OnInit {
  private destroy$ = inject(DestroyRef);
  private treeViewService = inject(TreeViewService);
  private messageService = inject(NzMessageService);

  treeViewTrigger!: string;
  treeViewData!: any;
  isLoading = signal(false)

  private transformer = (node: TreeNode, level: number): FlatNode => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.name === node.name
        ? existingNode
        : {
          expandable: !!node.children && node.children.length > 0,
          name: node.name,
          errorCount: node.errorCount,
          level,
          disabled: !!node.disabled
        };
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };
  flatNodeMap = new Map<FlatNode, TreeNode>();
  nestedNodeMap = new Map<TreeNode, FlatNode>();
  checklistSelection = new SelectionModel<FlatNode>(true);

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new NzTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);

  ngOnInit(): void {
    this.treeViewService.triggerView$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.treeViewTrigger = res;
          if (this.treeViewTrigger === 'run') {
            this.isLoading.set(true);
            this.fetchTreeData();
          }
        },
        error: err => {
          console.error(err);
          this.messageService.error(err);
        }
      })
  }

  fetchTreeData() {
    this.treeViewService.getTreeData()
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroy$)
      )
      .subscribe({
        next: (res: any) => {
          this.treeViewData = res;
          if (this.treeViewData && Array.isArray(this.treeViewData) && this.treeViewData.length > 0) {
            // this.tranformToTreeData();
            const treeData = this.transformToTreeData();
            this.dataSource.setData(treeData);
          }
        },
        error: err => {
          console.error(err);
          this.messageService.error(err);
        }
      })
  }

  tranformToTreeData() {
    let mappedData: any = []
    this.treeViewData.map((data: any) => {
      const check = mappedData.some((d: any) => d.company === data.company);
      if (!check) {
        const obj: any = {}
        obj.company = data.company;
        obj.children = [];
        obj.children.push(data);
        mappedData.push(obj);
      } else {
        const toFind = mappedData.find((d: any) => d.company === data.company);
        const findIndex = mappedData.indexOf(toFind);
        mappedData[findIndex].children.push(data);
      }
    });
    console.log(mappedData);
  }

  transformToTreeData() {
    const treeData: any[] = [];

    // Use forEach instead of map since we aren't returning a new array directly
    this.treeViewData.forEach((row: any) => {

      // --- LEVEL 1: COMPANY ---
      // Try to find an existing node for this Company
      let companyNode = treeData.find(n => n.name === row.company);

      // If it doesn't exist, create it and push to tree
      if (!companyNode) {
        companyNode = { name: row.company, children: [] };
        treeData.push(companyNode);
      }

      // --- LEVEL 2: SERVER GROUP ---
      // Look for the group INSIDE the company we just found/created
      let groupNode = companyNode.children.find((n: any) => n.name === row.server_group);

      if (!groupNode) {
        groupNode = { name: row.server_group, children: [] };
        companyNode.children.push(groupNode);
      }

      // --- LEVEL 3: SERVER NAME ---
      // Look for server INSIDE the group
      let serverNode = groupNode.children.find((n: any) => n.name === row.server_name);

      if (!serverNode) {
        serverNode = {
          name: row.server_name,
          // Bonus: I kept your error count here since it belongs to the server
          errorCount: row.server_errors_count,
          children: []
        };
        groupNode.children.push(serverNode);
      }

      // --- LEVEL 4: INSTANCE ---
      // Look for instance INSIDE the server
      let instanceNode = serverNode.children.find((n: any) => n.name === row.instance_name);

      if (!instanceNode) {
        instanceNode = { name: row.instance_name, children: [] };
        serverNode.children.push(instanceNode);
      }

      // --- LEVEL 5: DATABASE (Leaf Node) ---
      // Databases are the final item, so we just push them.
      // (Optional: You can add a check here too if you have duplicate DB names)
      instanceNode.children.push({ name: row.database_name });

    });

    console.log(treeData);
    return treeData;
  }

  hasChild = (_: number, node: FlatNode): boolean => node.expandable;

  descendantsAllSelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.length > 0 && descendants.every(child => this.checklistSelection.isSelected(child));
  }

  descendantsPartiallySelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  leafItemSelectionToggle(node: FlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  itemSelectionToggle(node: FlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  checkAllParentsSelection(node: FlatNode): void {
    let parent: FlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: FlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 && descendants.every(child => this.checklistSelection.isSelected(child));
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  getParentNode(node: FlatNode): FlatNode | null {
    const currentLevel = node.level;

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (currentNode.level < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
}
