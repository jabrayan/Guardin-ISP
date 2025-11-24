export enum Severity {
  DISASTER = 'Disaster',
  HIGH = 'High',
  AVERAGE = 'Average',
  WARNING = 'Warning',
  INFO = 'Info',
}

export type SnmpVersion = 'v1' | 'v2c' | 'v3';

export interface Host {
  id: string;
  name: string;
  ip: string;
  group: string;
  status: 'UP' | 'DOWN' | 'UNREACHABLE' | 'PENDING';
  latency: number; // ms
  tags: string[];
  os: string;
  cpuUsage: number;
  memoryUsage: number;
  // Configuration fields
  template?: string;
  snmpVersion?: SnmpVersion;
  snmpCommunity?: string;
}

export interface Trigger {
  id: string;
  hostId: string;
  description: string;
  severity: Severity;
  lastChange: string; // ISO date
  acknowledged: boolean;
}

export interface MetricPoint {
  time: string;
  value: number;
}

export interface Link {
  source: string;
  target: string;
  value: number;
}

export interface TopologyNode {
  id: string;
  group: number;
  status: 'UP' | 'DOWN' | 'UNREACHABLE' | 'PENDING';
}

export interface GraphData {
  nodes: TopologyNode[];
  links: Link[];
}

// --- NEW TYPES FOR GUARDIAN ISP ---

export interface FlowData {
  id: string;
  srcIp: string;
  dstIp: string;
  srcPort: number;
  dstPort: number;
  protocol: 'TCP' | 'UDP' | 'ICMP';
  bytes: number;
  packets: number;
  asn: string; // Autonomous System
  interface: string;
  timestamp: string;
}

export interface AiDiagnostic {
  hostId: string;
  healthScore: number; // 0-100
  predictedFailureDate?: string;
  anomaliesDetected: string[];
  recommendation: string;
  trafficPrediction: 'Stable' | 'Increasing' | 'Saturation Risk';
}

export interface DdosIncident {
  id: string;
  targetIp: string;
  type: 'Volumetric' | 'SynFlood' | 'Amplification' | 'AppLayer';
  peakMbps: number;
  status: 'Active' | 'Mitigated' | 'Ended';
  mitigationMethod: 'FlowSpec' | 'Blackhole' | 'Scrubbing' | 'None';
  startTime: string;
  duration: number; // seconds
}

export interface GeneratedReport {
  id: string;
  title: string;
  type: 'AI Health' | 'Traffic Analysis' | 'Incident Post-Mortem';
  generatedAt: string;
  size: string;
  status: 'Ready' | 'Generating';
}

export interface Template {
  id: string;
  name: string;
  vendor: string;
  zabbixCompatibility: string; // e.g., "5.0 - 7.0"
  itemsCount: number;
  triggersCount: number;
  discoveryRules: number;
  description: string;
  importedAt: string;
  format: 'XML' | 'YAML' | 'JSON';
}