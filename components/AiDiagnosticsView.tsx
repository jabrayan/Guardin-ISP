import React from 'react';
import { MOCK_AI_DIAGNOSTICS, MOCK_HOSTS } from '../mockData';
import { BrainCircuit, Activity, AlertTriangle, CheckCircle, MessageSquare } from 'lucide-react';

const AiDiagnosticsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             <BrainCircuit className="h-6 w-6 text-purple-500" />
             AI Diagnostics & CoPilot
          </h2>
          <p className="text-slate-400 text-sm">Hardware Health Prediction • Root Cause Analysis • Capacity Planning</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-lg shadow-purple-600/20 transition-colors">
            <MessageSquare className="h-4 w-4" />
            <span>Ask CoPilot</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CoPilot Chat (Visual Mockup) */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[600px] shadow-lg">
           <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                 <BrainCircuit className="h-5 w-5 text-white" />
              </div>
              <div>
                 <h3 className="font-semibold text-white">Guardian Assistant</h3>
                 <p className="text-xs text-green-400 flex items-center gap-1">
                   <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online
                 </p>
              </div>
           </div>
           
           <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-950/30">
              <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0"></div>
                 <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none text-sm text-slate-200">
                    Why is router <b>br-edge-rtr-01</b> showing high latency?
                 </div>
              </div>

              <div className="flex gap-3 flex-row-reverse">
                 <div className="w-8 h-8 rounded-full bg-purple-600 flex-shrink-0 flex items-center justify-center">
                    <BrainCircuit className="h-4 w-4 text-white" />
                 </div>
                 <div className="bg-purple-900/20 border border-purple-500/20 p-3 rounded-2xl rounded-tr-none text-sm text-slate-200">
                    <p className="mb-2">Analysis of <b>br-edge-rtr-01</b> indicates:</p>
                    <ul className="list-disc pl-4 space-y-1 text-slate-300">
                       <li>Optical signal on interface <b>xe-0/0/0</b> has degraded by 3dB in the last 48h.</li>
                       <li>CRC errors are correlating with traffic spikes.</li>
                       <li><b>Recommendation:</b> Clean fiber connectors or replace SFP+ module.</li>
                    </ul>
                 </div>
              </div>
           </div>

           <div className="p-4 border-t border-slate-800 bg-slate-900">
              <input 
                 type="text" 
                 placeholder="Ask about your network status..." 
                 className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
              />
           </div>
        </div>

        {/* Diagnostics Cards */}
        <div className="lg:col-span-2 space-y-4">
           {MOCK_AI_DIAGNOSTICS.map((diag, idx) => {
              const host = MOCK_HOSTS.find(h => h.id === diag.hostId);
              const healthColor = diag.healthScore > 90 ? 'text-green-400' : diag.healthScore > 70 ? 'text-yellow-400' : 'text-red-400';
              const borderClass = diag.healthScore > 90 ? 'border-green-500/20' : diag.healthScore > 70 ? 'border-yellow-500/20' : 'border-red-500/20';

              return (
                 <div key={idx} className={`bg-slate-900 border ${borderClass} rounded-xl p-6 shadow-lg`}>
                    <div className="flex justify-between items-start mb-4">
                       <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold bg-slate-800 ${healthColor} border border-slate-700`}>
                             {diag.healthScore}
                          </div>
                          <div>
                             <h3 className="text-lg font-bold text-white">{host?.name || 'Unknown Device'}</h3>
                             <p className="text-sm text-slate-400">{host?.template} • {host?.ip}</p>
                          </div>
                       </div>
                       <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          diag.trafficPrediction === 'Stable' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                       }`}>
                          Traffic: {diag.trafficPrediction}
                       </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                       <div>
                          <p className="text-xs uppercase text-slate-500 font-bold mb-2">Anomalies Detected</p>
                          <ul className="space-y-1">
                             {diag.anomaliesDetected.map((anom, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                   <AlertTriangle className="h-3 w-3 text-yellow-500" />
                                   {anom}
                                </li>
                             ))}
                          </ul>
                       </div>
                       <div>
                          <p className="text-xs uppercase text-slate-500 font-bold mb-2">AI Recommendation</p>
                          <div className="flex items-start gap-2 text-sm text-blue-300">
                             <CheckCircle className="h-4 w-4 mt-0.5 text-blue-500" />
                             {diag.recommendation}
                          </div>
                       </div>
                    </div>

                    {diag.predictedFailureDate && (
                       <div className="mt-4 p-3 bg-red-900/10 border border-red-500/20 rounded text-red-300 text-sm flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          <b>Prediction:</b> Hardware failure probability > 80% by {diag.predictedFailureDate}. Plan maintenance.
                       </div>
                    )}
                 </div>
              );
           })}
        </div>
      </div>
    </div>
  );
};

export default AiDiagnosticsView;