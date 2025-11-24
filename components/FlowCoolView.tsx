import React from 'react';
import { MOCK_FLOWS } from '../mockData';
import { ArrowRight, Filter, Download, Play, Waves } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const FlowCoolView: React.FC = () => {
  // Aggregate data for visualization
  const flowByProto = [
    { name: 'TCP', value: 65 },
    { name: 'UDP', value: 25 },
    { name: 'ICMP', value: 5 },
    { name: 'ESP', value: 5 },
  ];

  const flowByASN = [
    { name: 'Google', value: 400 },
    { name: 'Facebook', value: 300 },
    { name: 'Netflix', value: 250 },
    { name: 'Amazon', value: 150 },
    { name: 'Cloudflare', value: 100 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             <Waves className="h-6 w-6 text-indigo-500" />
             FlowCool Analytics
          </h2>
          <p className="text-slate-400 text-sm">NetFlow v5/v9 & IPFIX Ingestion • ElasticSearch Backend</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Smart Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg shadow-indigo-600/20 transition-colors">
            <Play className="h-4 w-4" />
            <span>Live Capture</span>
          </button>
        </div>
      </div>

      {/* Top Talkers Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top ASN (Inbound Traffic)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={flowByASN} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip 
                   contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff'}}
                   cursor={{fill: '#1e293b'}}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]}>
                  {flowByASN.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#818cf8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Protocol Distribution</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={flowByProto}>
                <XAxis dataKey="name" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                   contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff'}}
                   cursor={{fill: '#1e293b'}}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Flow Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
           <h3 className="font-semibold text-white">Live Flow Stream (Last 5 minutes)</h3>
           <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
             <Download className="h-3 w-3" /> Export CSV
           </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950 text-slate-200 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4"></th>
                <th className="px-6 py-4">Destination</th>
                <th className="px-6 py-4">Proto / Port</th>
                <th className="px-6 py-4">ASN / Interface</th>
                <th className="px-6 py-4 text-right">Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {MOCK_FLOWS.map((flow) => (
                <tr key={flow.id} className="hover:bg-slate-800/50 transition-colors font-mono text-xs">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FlowCoolView;