import React from 'react';
import { MOCK_DDOS_INCIDENTS } from '../mockData';
import { ShieldAlert, Zap, Ban, ShieldCheck, Activity } from 'lucide-react';

const DDoSView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             <ShieldAlert className="h-6 w-6 text-red-500" />
             DDoS Protection Engine
          </h2>
          <p className="text-slate-400 text-sm">Automated Mitigation via BGP FlowSpec & Blackholing</p>
        </div>
        <div className="flex gap-3">
             <div className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg flex flex-col items-center">
                 <span className="text-xs text-slate-500 uppercase">Scrubbing Center</span>
                 <span className="text-green-400 text-sm font-bold flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> READY
                 </span>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Status Cards */}
         <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg border-l-4 border-l-green-500">
            <h3 className="text-slate-400 text-sm uppercase font-bold">Mitigation Status</h3>
            <p className="text-2xl font-bold text-white mt-1">Auto-Pilot</p>
            <p className="text-xs text-slate-500 mt-2">Entropy-based detection enabled</p>
         </div>
         <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg border-l-4 border-l-red-500">
            <h3 className="text-slate-400 text-sm uppercase font-bold">Active Attacks</h3>
            <p className="text-2xl font-bold text-red-400 mt-1">{MOCK_DDOS_INCIDENTS.filter(i => i.status === 'Active').length}</p>
            <p className="text-xs text-slate-500 mt-2">Current Peak: 2.5 Gbps</p>
         </div>
         <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg border-l-4 border-l-blue-500">
            <h3 className="text-slate-400 text-sm uppercase font-bold">BGP Rules</h3>
            <p className="text-2xl font-bold text-blue-400 mt-1">4 Active</p>
            <p className="text-xs text-slate-500 mt-2">3 FlowSpec, 1 RTBH</p>
         </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
         <div className="p-4 border-b border-slate-800 bg-slate-900/50">
            <h3 className="font-semibold text-white">Incident Log</h3>
         </div>
         <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950 text-slate-200 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Target IP</th>
                <th className="px-6 py-4">Attack Type</th>
                <th className="px-6 py-4">Peak Traffic</th>
                <th className="px-6 py-4">Mitigation</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {MOCK_DDOS_INCIDENTS.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-800/50 transition-colors">
                   <td className="px-6 py-4">
                      {inc.status === 'Active' ? (
                         <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold animate-pulse">
                            <Activity className="h-3 w-3" /> ACTIVE
                         </span>
                      ) : (
                         <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-700 text-slate-300 text-xs font-bold">
                            ENDED
                         </span>
                      )}
                   </td>
                   <td className="px-6 py-4 font-mono text-white">{inc.targetIp}</td>
                   <td className="px-6 py-4 text-slate-300">{inc.type}</td>
                   <td className="px-6 py-4 text-white font-bold">{inc.peakMbps > 1000 ? `${(inc.peakMbps/1000).toFixed(1)} Gbps` : `${inc.peakMbps} Mbps`}</td>
                   <td className="px-6 py-4">
                      <span className="text-xs font-mono text-indigo-300 bg-indigo-900/30 px-2 py-1 rounded border border-indigo-500/30">
                         {inc.mitigationMethod}
                      </span>
                   </td>
                   <td className="px-6 py-4 text-slate-500">{inc.duration}s</td>
                   <td className="px-6 py-4 text-right">
                      {inc.status === 'Active' && (
                         <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded shadow flex items-center gap-1 ml-auto">
                            <Ban className="h-3 w-3" /> Block
                         </button>
                      )}
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

export default DDoSView;