import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FlowData } from '../types';
import { ArrowRight, Filter, Download, Play, Pause, Waves, Wifi, WifiOff, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Generators for simulation (used when WebSocket fails or for demo)
const SAMPLE_ASNS = ['AS15169 (Google)', 'AS32934 (Facebook)', 'AS16509 (Amazon)', 'AS13335 (Cloudflare)', 'AS20940 (Akamai)', 'AS1299 (Telia)'];
const SAMPLE_IPS = ['200.1.1.', '45.22.10.', '192.168.100.', '10.0.5.', '172.16.20.'];
const SAMPLE_PORTS = [443, 80, 53, 22, 5432, 8080, 3389];
const SAMPLE_PROTOS = ['TCP', 'UDP', 'ICMP', 'ESP'] as const;

const generateRandomFlow = (): FlowData => {
  const protocol = SAMPLE_PROTOS[Math.floor(Math.random() * SAMPLE_PROTOS.length)];
  return {
    id: `flow-${Date.now()}-${Math.random()}`,
    srcIp: `${SAMPLE_IPS[Math.floor(Math.random() * SAMPLE_IPS.length)]}${Math.floor(Math.random() * 255)}`,
    dstIp: `${SAMPLE_IPS[Math.floor(Math.random() * SAMPLE_IPS.length)]}${Math.floor(Math.random() * 255)}`,
    srcPort: Math.floor(Math.random() * 60000) + 1024,
    dstPort: SAMPLE_PORTS[Math.floor(Math.random() * SAMPLE_PORTS.length)],
    protocol: protocol,
    bytes: Math.floor(Math.random() * 50000000) + 1000,
    packets: Math.floor(Math.random() * 10000) + 10,
    asn: SAMPLE_ASNS[Math.floor(Math.random() * SAMPLE_ASNS.length)],
    interface: `xe-0/0/${Math.floor(Math.random() * 4)}`,
    timestamp: new Date().toLocaleTimeString()
  };
};

const FlowCoolView: React.FC = () => {
  const [isLive, setIsLive] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'emulated'>('disconnected');
  const [recentFlows, setRecentFlows] = useState<FlowData[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<number | null>(null);

  // --- WebSocket & Simulation Logic ---

  const startCapture = () => {
    setIsLive(true);
    
    // 1. Try to connect to real WebSocket
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/v1/ws/netflow`;
      
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        setConnectionStatus('connected');
        console.log('WS Connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          addFlow(data);
        } catch (e) {
          console.error('Failed to parse flow data', e);
        }
      };

      ws.onerror = () => {
        // Fallback to simulation if backend isn't real
        setConnectionStatus('emulated');
        startSimulation();
      };

      ws.onclose = () => {
        if (connectionStatus === 'connected') {
           setConnectionStatus('disconnected');
           setIsLive(false);
        }
      };

      wsRef.current = ws;
    } catch (e) {
      setConnectionStatus('emulated');
      startSimulation();
    }
  };

  const startSimulation = () => {
    // Clear any existing intervals first
    if (intervalRef.current) window.clearInterval(intervalRef.current);

    // Simulate incoming traffic (bursty)
    intervalRef.current = window.setInterval(() => {
        const burstSize = Math.floor(Math.random() * 3) + 1;
        for(let i=0; i<burstSize; i++) {
            addFlow(generateRandomFlow());
        }
    }, 800);
  };

  const stopCapture = () => {
    setIsLive(false);
    setConnectionStatus('disconnected');
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const addFlow = (flow: FlowData) => {
    setRecentFlows(prev => {
      const updated = [flow, ...prev];
      return updated.slice(0, 50); // Keep last 50 items buffer
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCapture();
  }, []);


  // --- Dynamic Statistics Calculation ---

  const stats = useMemo(() => {
    const protoCount: Record<string, number> = {};
    const asnCount: Record<string, number> = {};

    recentFlows.forEach(flow => {
      // Proto Stats
      protoCount[flow.protocol] = (protoCount[flow.protocol] || 0) + 1;
      // ASN Stats
      asnCount[flow.asn] = (asnCount[flow.asn] || 0) + (flow.bytes / 1024 / 1024); // MB
    });

    const flowByProto = Object.keys(protoCount).map(k => ({ name: k, value: protoCount[k] }));
    const flowByASN = Object.keys(asnCount)
        .map(k => ({ name: k.split(' ')[0], value: Math.round(asnCount[k]) }))
        .sort((a,b) => b.value - a.value)
        .slice(0, 5);

    return { flowByProto, flowByASN };
  }, [recentFlows]);


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             <Waves className="h-6 w-6 text-indigo-500" />
             FlowCool Analytics
          </h2>
          <p className="text-slate-400 text-sm flex items-center gap-2">
            NetFlow v5/v9 & IPFIX Ingestion
            {connectionStatus === 'connected' && <span className="text-green-400 flex items-center gap-1 text-xs"><Wifi className="h-3 w-3" /> Live Socket</span>}
            {connectionStatus === 'emulated' && <span className="text-amber-400 flex items-center gap-1 text-xs"><Activity className="h-3 w-3" /> Simulating Feed</span>}
            {connectionStatus === 'disconnected' && <span className="text-slate-600 flex items-center gap-1 text-xs"><WifiOff className="h-3 w-3" /> Offline</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Smart Filter</span>
          </button>
          
          {!isLive ? (
            <button 
                onClick={startCapture}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg shadow-indigo-600/20 transition-colors"
            >
                <Play className="h-4 w-4" />
                <span>Start Live Capture</span>
            </button>
          ) : (
            <button 
                onClick={stopCapture}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg transition-colors"
            >
                <Pause className="h-4 w-4" />
                <span>Stop Capture</span>
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex justify-between">
            <span>Top ASN (Volume MB)</span>
            <span className="text-xs font-mono text-slate-500">Window: Last 50 flows</span>
          </h3>
          <div className="h-64">
            {recentFlows.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.flowByASN} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={80} tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
                    <Tooltip 
                    contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff'}}
                    cursor={{fill: '#1e293b'}}
                    />
                    <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]}>
                    {stats.flowByASN.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#818cf8'} />
                    ))}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-sm">Waiting for flow data...</div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Protocol Distribution (Count)</h3>
          <div className="h-64">
             {recentFlows.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.flowByProto}>
                        <XAxis dataKey="name" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip 
                        contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff'}}
                        cursor={{fill: '#1e293b'}}
                        />
                        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
             ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-sm">Waiting for flow data...</div>
             )}
          </div>
        </div>
      </div>

      {/* Live Flow Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
           <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></div>
                <h3 className="font-semibold text-white">Live Flow Stream</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">Buffer: {recentFlows.length}</span>
           </div>
           <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
             <Download className="h-3 w-3" /> Export CSV
           </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950 text-slate-200 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4"></th>
                <th className="px-6 py-4">Destination</th>
                <th className="px-6 py-4">Proto / Port</th>
                <th className="px-6 py-4">ASN / Interface</th>
                <th className="px-6 py-4 text-right">Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {recentFlows.length === 0 ? (
                 <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                        {isLive ? 'Listening for flows...' : 'Click "Start Live Capture" to begin analysis'}
                    </td>
                 </tr>
              ) : (
                recentFlows.map((flow) => (
                    <tr key={flow.id} className="hover:bg-slate-800/50 transition-colors font-mono text-xs animate-in fade-in slide-in-from-top-1 duration-200">
                    <td className="px-6 py-4 text-slate-500">{flow.timestamp}</td>
                    <td className="px-6 py-4 text-blue-400">{flow.srcIp}</td>
                    <td className="px-6 py-4 text-slate-600"><ArrowRight className="h-4 w-4" /></td>
                    <td className="px-6 py-4 text-orange-400">{flow.dstIp}</td>
                    <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-slate-800 rounded text-slate-300 mr-2">{flow.protocol}</span>
                        <span className="text-slate-500">{flow.dstPort}</span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex flex-col">
                        <span className="text-slate-300">{flow.asn}</span>
                        <span className="text-slate-500">{flow.interface}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex flex-col items-end">
                        <span className="text-white font-bold">{(flow.bytes / 1024 / 1024).toFixed(2)} MB</span>
                        <span className="text-slate-500">{flow.packets} pkts</span>
                        </div>
                    </td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FlowCoolView;