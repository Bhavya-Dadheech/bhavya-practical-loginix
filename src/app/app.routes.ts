import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'servers',
        loadChildren: () => import('./features/servers/servers.routes').then(m => m.SERVERS_ROUTES)
      },
      {
        path: 'tree-view',
        loadChildren: () => import('./features/parent-sibling-wrapper/tree-view.routes').then(m => m.TREE_VIEW_ROUTES)
      }
    ]
  }
];
