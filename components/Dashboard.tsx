import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { ShieldAlert, Server, Activity, ArrowUp, ArrowDown, Network, Wifi, Globe, Zap } from 'lucide-react';
import { MOCK_HOSTS, MOCK_TRIGGERS, generateMetrics, MOCK_DDOS_INCIDENTS } from '../mockData';
import { Severity } from '../types';

const Dashboard: React.FC = () => {
  const metricsData = React.useMemo(() => generateMetrics(20), []);
  const hostsUp = MOCK_HOSTS.filter(h => h.status === 'UP').length;
  const hostsDown = MOCK_HOSTS.filter(h => h.status === 'DOWN').length;
  const activeDDoS = MOCK_DDOS_INCIDENTS.filter(i => i.status === 'Active').length;

  const severityColor = (sev: Severity) => {
    switch (sev) {
      case Severity.DISASTER: return 'text-red-400 bg-red-400/10 border-red-400/20';
      case Severity.HIGH: return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case Severity.AVERAGE: return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case Severity.WARNING: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* ISP KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Network Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Globe className="h-24 w-24 text-blue-500" />
          </div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Backbone Capacity</p>
              <h3 className="text-2xl font-bold text-white mt-1">142.5 Gbps</h3>
            </div>
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 border border-blue-500/30">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm relative z-10">
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-blue-500 h-full w-[65%]"></div>
            </div>
            <span className="text-blue-400 font-mono">65%</span>
          </div>
        </div>

        {/* DDoS Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          {activeDDoS > 0 && <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>}
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">DDoS Protection</p>
              <h3 className={`text-2xl font-bold mt-1 ${activeDDoS > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {activeDDoS > 0 ? `${activeDDoS} ATTACK ACTIVE` : 'SECURE'}
              </h3>
            </div>
            <div className={`p-2 rounded-lg border ${activeDDoS > 0 ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-500 relative z-10">
             Last 24h: <span className="text-slate-300">12 Incidents Mitigated</span>
          </div>
        </div>

        {/* Host Health */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Network Nodes</p>
              <h3 className="text-2xl font-bold text-white mt-1">{MOCK_HOSTS.length}</h3>
            </div>
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 border border-indigo-500/30">
              <Server className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 text-sm">
            <span className="text-green-500 flex items-center gap-1 font-medium bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
              <ArrowUp className="h-3 w-3" /> {hostsUp}
            </span>
            <span className="text-red-500 flex items-center gap-1 font-medium bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              <ArrowDown className="h-3 w-3" /> {hostsDown}
            </span>
          </div>
        </div>

        {/* AI Prediction */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg group">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">AI Insight</p>
              <h3 className="text-2xl font-bold text-purple-400 mt-1">2 Risks</h3>
            </div>
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 border border-purple-500/30">
              <Zap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 text-sm text-purple-300 flex items-center gap-2">
             <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
             Predictive Hardware Failures
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Traffic Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Network className="h-5 w-5 text-primary-500" />
              Aggregate Traffic (Core Uplinks)
            </h3>
            <div className="flex gap-2 text-xs">
                <button className="px-3 py-1 bg-slate-800 text-white rounded hover:bg-slate-700">1h</button>
                <button className="px-3 py-1 bg-slate-800 text-slate-400 rounded hover:bg-slate-700">12h</button>
                <button className="px-3 py-1 bg-slate-800 text-slate-400 rounded hover:bg-slate-700">24h</button>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metricsData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#475569" 
                  tick={{fill: '#64748b', fontSize: 12}}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#475569" 
                  tick={{fill: '#64748b', fontSize: 12}}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff'}}
                  itemStyle={{color: '#fff'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Problems Widget */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col shadow-lg">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Wifi className="h-5 w-5 text-red-500" />
                NOC Alerts
             </h3>
             <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{MOCK_TRIGGERS.length}</span>
          </div>
          
          <div className="flex-1 overflow-auto -mx-2 px-2 space-y-3 custom-scrollbar">
            {MOCK_TRIGGERS.map(trigger => {
              const host = MOCK_HOSTS.find(h => h.id === trigger.hostId);
              return (
                <div key={trigger.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-700 transition-all group">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border font-bold ${severityColor(trigger.severity)}`}>
                      {trigger.severity}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(trigger.lastChange).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 font-medium line-clamp-2 mt-1 group-hover:text-primary-400 transition-colors">
                    {trigger.description}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                    <Server className="h-3 w-3" />
                    <span className="text-slate-400">{host?.name || 'Unknown'}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;