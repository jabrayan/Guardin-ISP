import { Host, Severity, Trigger, MetricPoint, GraphData, FlowData, AiDiagnostic, DdosIncident, GeneratedReport, Template } from './types';

export const MOCK_HOSTS: Host[] = [
  { id: 'h1', name: 'br-core-rtr-01', ip: '200.1.1.1', group: 'Core', status: 'UP', latency: 1, tags: ['juniper', 'mx960'], os: 'Junos', cpuUsage: 45, memoryUsage: 30, template: 'Juniper Core', snmpVersion: 'v3' },
  { id: 'h2', name: 'br-edge-rtr-01', ip: '200.1.1.2', group: 'Edge', status: 'UP', latency: 2, tags: ['cisco', 'asr9k'], os: 'IOS-XR', cpuUsage: 62, memoryUsage: 40, template: 'Cisco Edge', snmpVersion: 'v3' },
  { id: 'h3', name: 'bras-concentrator-01', ip: '100.64.0.1', group: 'Access', status: 'UP', latency: 4, tags: ['huawei', 'ne40'], os: 'VRP', cpuUsage: 78, memoryUsage: 60, template: 'Huawei BRAS', snmpVersion: 'v2c' },
  { id: 'h4', name: 'cdn-cache-node-01', ip: '10.0.2.11', group: 'CDN', status: 'DOWN', latency: 0, tags: ['nginx', 'linux'], os: 'Linux', cpuUsage: 0, memoryUsage: 0, template: 'Linux CDN' },
  { id: 'h5', name: 'dns-resolver-01', ip: '1.1.1.1', group: 'Infrastructure', status: 'UP', latency: 5, tags: ['bind', 'linux'], os: 'Linux', cpuUsage: 25, memoryUsage: 30, template: 'Linux Generic' },
  { id: 'h6', name: 'olt-gpon-zone-a', ip: '172.16.0.10', group: 'GPON', status: 'UP', latency: 8, tags: ['fiberhome'], os: 'FiberHome', cpuUsage: 10, memoryUsage: 55, template: 'OLT Generic' },
  { id: 'h7', name: 'sw-aggr-l3', ip: '10.0.5.5', group: 'Aggregation', status: 'UNREACHABLE', latency: 0, tags: ['mikrotik'], os: 'RouterOS', cpuUsage: 0, memoryUsage: 0, template: 'Mikrotik Switch' },
];

export const MOCK_TRIGGERS: Trigger[] = [
  { id: 't1', hostId: 'h4', description: 'BGP Session Down with Peer AS1234', severity: Severity.DISASTER, lastChange: '2023-10-27T10:30:00Z', acknowledged: false },
  { id: 't2', hostId: 'h1', description: 'Interface xe-0/0/0 utilization > 85%', severity: Severity.HIGH, lastChange: '2023-10-27T08:15:00Z', acknowledged: true },
  { id: 't3', hostId: 'h3', description: 'PPPoE User Drop Rate High', severity: Severity.AVERAGE, lastChange: '2023-10-27T11:45:00Z', acknowledged: false },
  { id: 't4', hostId: 'h7', description: 'Optical Signal Degradation (High Attenuation)', severity: Severity.WARNING, lastChange: '2023-10-27T09:00:00Z', acknowledged: false },
];

export const generateMetrics = (points: number = 20): MetricPoint[] => {
  const data: MetricPoint[] = [];
  const now = new Date();
  for (let i = points; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 60000);
    data.push({
      time: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      value: Math.floor(Math.random() * 40) + 30, 
    });
  }
  return data;
};

export const TOPOLOGY_DATA: GraphData = {
  nodes: MOCK_HOSTS.map(h => ({ id: h.name, group: h.group === 'Core' ? 1 : 2, status: h.status })),
  links: [
    { source: 'br-core-rtr-01', target: 'br-edge-rtr-01', value: 10 },
    { source: 'br-edge-rtr-01', target: 'bras-concentrator-01', value: 5 },
    { source: 'bras-concentrator-01', target: 'olt-gpon-zone-a', value: 2 },
    { source: 'br-core-rtr-01', target: 'dns-resolver-01', value: 1 },
    { source: 'br-edge-rtr-01', target: 'cdn-cache-node-01', value: 1 },
    { source: 'olt-gpon-zone-a', target: 'sw-aggr-l3', value: 1 },
  ]
};

// --- MOCK DATA FOR NEW MODULES ---

export const MOCK_FLOWS: FlowData[] = [
  { id: 'f1', srcIp: '45.12.33.1', dstIp: '200.1.1.5', srcPort: 443, dstPort: 54322, protocol: 'TCP', bytes: 15000000, packets: 12000, asn: 'AS15169 (Google)', interface: 'xe-0/0/0', timestamp: 'Now' },
  { id: 'f2', srcIp: '157.240.22.35', dstIp: '200.1.1.8', srcPort: 443, dstPort: 12344, protocol: 'UDP', bytes: 8500000, packets: 8000, asn: 'AS32934 (Facebook)', interface: 'xe-0/0/1', timestamp: 'Now' },
  { id: 'f3', srcIp: '23.22.11.1', dstIp: '200.1.1.20', srcPort: 80, dstPort: 44123, protocol: 'TCP', bytes: 5200000, packets: 4000, asn: 'AS16509 (Amazon)', interface: 'xe-0/1/0', timestamp: 'Now' },
  { id: 'f4', srcIp: '1.1.1.1', dstIp: '200.1.1.2', srcPort: 53, dstPort: 53, protocol: 'UDP', bytes: 200000, packets: 1500, asn: 'AS13335 (Cloudflare)', interface: 'xe-0/0/0', timestamp: 'Now' },
  { id: 'f5', srcIp: '200.1.1.100', dstIp: '8.8.8.8', srcPort: 12345, dstPort: 53, protocol: 'UDP', bytes: 150000, packets: 1200, asn: 'AS15169 (Google)', interface: 'xe-0/0/1', timestamp: 'Now' },
];

export const MOCK_AI_DIAGNOSTICS: AiDiagnostic[] = [
  { 
    hostId: 'h1', 
    healthScore: 92, 
    recommendation: 'Optimize TCAM usage manually or enable auto-compaction.', 
    anomaliesDetected: ['TCAM usage slight increase'], 
    trafficPrediction: 'Stable' 
  },
  { 
    hostId: 'h2', 
    healthScore: 78, 
    predictedFailureDate: '2024-03-15', 
    recommendation: 'Replace Optical Transceiver on Port 3. Light levels dropping -2dB/week.', 
    anomaliesDetected: ['Optical Signal Degradation', 'Micro-bursts on Uplink'], 
    trafficPrediction: 'Increasing' 
  },
  { 
    hostId: 'h3', 
    healthScore: 45, 
    recommendation: 'Immediate Firmware Update required. Memory leak detected pattern matching CVE-2023-XXXX.', 
    anomaliesDetected: ['High CPU interrupt usage', 'Memory Leak', 'Session Flapping'], 
    trafficPrediction: 'Saturation Risk' 
  }
];

export const MOCK_DDOS_INCIDENTS: DdosIncident[] = [
  { id: 'inc-001', targetIp: '200.1.1.150', type: 'Volumetric', peakMbps: 45000, status: 'Mitigated', mitigationMethod: 'FlowSpec', startTime: '2023-10-27T08:00:00Z', duration: 1200 },
  { id: 'inc-002', targetIp: '200.1.1.152', type: 'SynFlood', peakMbps: 2500, status: 'Active', mitigationMethod: 'Blackhole', startTime: 'Now', duration: 300 },
  { id: 'inc-003', targetIp: '200.1.1.200', type: 'Amplification', peakMbps: 12000, status: 'Ended', mitigationMethod: 'Scrubbing', startTime: '2023-10-26T14:30:00Z', duration: 450 },
];

export const MOCK_REPORTS: GeneratedReport[] = [
  { id: 'rep-101', title: 'Monthly Core Network Health', type: 'AI Health', generatedAt: '2023-10-01', size: '2.4 MB', status: 'Ready' },
  { id: 'rep-102', title: 'Incident #492 Post-Mortem', type: 'Incident Post-Mortem', generatedAt: '2023-10-15', size: '1.1 MB', status: 'Ready' },
  { id: 'rep-103', title: 'Traffic Capacity Planning Q4', type: 'Traffic Analysis', generatedAt: '2023-10-27', size: 'Pending', status: 'Generating' },
];

export const MOCK_TEMPLATES: Template[] = [
  { id: 'tpl-01', name: 'Cisco IOS-XR SNMPv3', vendor: 'Cisco', zabbixCompatibility: '5.0 - 7.0', itemsCount: 145, triggersCount: 32, discoveryRules: 5, description: 'Standard monitoring for ASR9k/CRS routers via SNMPv3', importedAt: '2023-09-10', format: 'XML' },
  { id: 'tpl-02', name: 'Juniper Junos Core', vendor: 'Juniper', zabbixCompatibility: '6.0 - 7.0', itemsCount: 210, triggersCount: 45, discoveryRules: 8, description: 'Full stack monitoring for MX series including chassis alarms', importedAt: '2023-09-12', format: 'XML' },
  { id: 'tpl-03', name: 'Huawei VRP NE40/NE8000', vendor: 'Huawei', zabbixCompatibility: '5.4 - 7.0', itemsCount: 180, triggersCount: 28, discoveryRules: 6, description: 'BRAS and Core router monitoring template', importedAt: '2023-10-05', format: 'YAML' },
  { id: 'tpl-04', name: 'Linux Server Generic', vendor: 'Linux', zabbixCompatibility: '5.0+', itemsCount: 65, triggersCount: 12, discoveryRules: 2, description: 'Basic OS metrics (CPU, Mem, Disk, Net)', importedAt: '2023-01-20', format: 'XML' },
  { id: 'tpl-05', name: 'Mikrotik RouterOS SNMP', vendor: 'Mikrotik', zabbixCompatibility: '6.4 - 7.0', itemsCount: 88, triggersCount: 15, discoveryRules: 3, description: 'Optimized for CCR/CRS devices', importedAt: '2023-05-15', format: 'XML' },
];