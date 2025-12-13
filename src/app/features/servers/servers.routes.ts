import { DetailedMetricsComponent } from "./detailed-metrics/detailed-metrics.component";
import { ServersComponent } from "./servers.component";

export const SERVERS_ROUTES = [
  {
    path: '',
    component: ServersComponent
  },
  {
    path: ':id',
    component: DetailedMetricsComponent
  }
]