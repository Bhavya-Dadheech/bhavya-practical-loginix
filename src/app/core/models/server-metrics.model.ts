export class Metrics {
  hour!: number
  cpu!: number
}

export class ServerMetrics {
  serverId!: number
  metrics!: Metrics[]
} 
