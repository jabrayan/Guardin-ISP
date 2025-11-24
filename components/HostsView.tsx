import React, { useState } from 'react';
import { MOCK_HOSTS } from '../mockData';
import { Host, SnmpVersion } from '../types';
import { Search, Filter, Plus, MoreHorizontal, Terminal, X, Save } from 'lucide-react';

const HostsView: React.FC = () => {
  const [hosts, setHosts] = useState<Host[]>(MOCK_HOSTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHost, setNewHost] = useState({
    name: '',
    ip: '',
    group: 'Web Servers',
    template: 'Linux Generic',
    snmpVersion: 'v2c' as SnmpVersion,
    snmpCommunity: 'public'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewHost(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveHost = (e: React.FormEvent) => {
    e.preventDefault();
    const createdHost: Host = {
      id: `h-${Date.now()}`,
      name: newHost.name,
      ip: newHost.ip,
      group: newHost.group,
      status: 'PENDING',
      latency: 0,
      tags: [newHost.template.split(' ')[0].toLowerCase(), 'new'],
      os: newHost.template.includes('Windows') ? 'Windows' : 'Linux',
      cpuUsage: 0,
      memoryUsage: 0,
      template: newHost.template,
      snmpVersion: newHost.snmpVersion,
      snmpCommunity: newHost.snmpCommunity
    };

    setHosts([...hosts, createdHost]);
    setIsModalOpen(false);
    // Reset form
    setNewHost({
      name: '',
      ip: '',
      group: 'Web Servers',
      template: 'Linux Generic',
      snmpVersion: 'v2c',
      snmpCommunity: 'public'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Hosts & Inventory</h2>
          <p className="text-slate-400 text-sm">Gerencie seus ativos e configure monitoramento.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-lg shadow-primary-600/20 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar Host</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by name, IP or tag..." 
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950/50 text-slate-200 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Name / IP</th>
                <th className="px-6 py-4">Group</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tags</th>
                <th className="px-6 py-4">Load (CPU/Mem)</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {hosts.map((host) => (
                <tr key={host.id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-white font-medium">{host.name}</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                         {host.ip} 
                         {host.latency > 0 && <span className="text-slate-600">• {host.latency}ms</span>}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {host.group}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      host.status === 'UP' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : host.status === 'DOWN'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : host.status === 'PENDING'
                        ? 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        host.status === 'UP' ? 'bg-green-400' : host.status === 'DOWN' ? 'bg-red-400' : host.status === 'PENDING' ? 'bg-slate-400' : 'bg-orange-400'
                      }`}></span>
                      {host.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {host.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 w-24">
                      <div className="flex justify-between text-xs">
                        <span>CPU</span>
                        <span className={host.cpuUsage > 80 ? 'text-red-400' : 'text-slate-300'}>{host.cpuUsage}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${host.cpuUsage > 80 ? 'bg-red-500' : 'bg-blue-500'}`} 
                          style={{ width: `${host.cpuUsage}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between text-xs mt-1">
                        <span>MEM</span>
                        <span className={host.memoryUsage > 90 ? 'text-red-400' : 'text-slate-300'}>{host.memoryUsage}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${host.memoryUsage > 90 ? 'bg-red-500' : 'bg-purple-500'}`} 
                          style={{ width: `${host.memoryUsage}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white" title="SSH Terminal">
                        <Terminal className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Add Host */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white">Adicionar Novo Host</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="add-host-form" onSubmit={handleSaveHost} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nome e IP */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Hostname</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={newHost.name}
                      onChange={handleInputChange}
                      placeholder="e.g. web-server-01"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">IP Address</label>
                    <input 
                      type="text" 
                      name="ip"
                      required
                      value={newHost.ip}
                      onChange={handleInputChange}
                      placeholder="e.g. 192.168.1.10"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    />
                  </div>

                  {/* Grupo e Template */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Grupo</label>
                    <select 
                      name="group"
                      value={newHost.group}
                      onChange={handleInputChange}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 appearance-none"
                    >
                      <option>Web Servers</option>
                      <option>Databases</option>
                      <option>Infrastructure</option>
                      <option>Cache</option>
                      <option>Load Balancers</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Template</label>
                    <select 
                      name="template"
                      value={newHost.template}
                      onChange={handleInputChange}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 appearance-none"
                    >
                      <option>Linux Generic</option>
                      <option>Windows Server</option>
                      <option>Cisco Network Device</option>
                      <option>Docker Node</option>
                      <option>Kubernetes Worker</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-6">
                  <h4 className="text-sm font-semibold text-primary-400 mb-4 uppercase tracking-wider">Configuração SNMP</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Versão SNMP</label>
                      <select 
                        name="snmpVersion"
                        value={newHost.snmpVersion}
                        onChange={handleInputChange}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                      >
                        <option value="v1">v1</option>
                        <option value="v2c">v2c</option>
                        <option value="v3">v3</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Comunidade SNMP</label>
                      <input 
                        type="text" 
                        name="snmpCommunity"
                        value={newHost.snmpCommunity}
                        onChange={handleInputChange}
                        placeholder="public"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                      />
                      <p className="text-xs text-slate-500">Para v3, use este campo como Context Name (simplificado).</p>
                    </div>
                  </div>
                </div>

              </form>
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3 rounded-b-xl">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                form="add-host-form"
                className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-primary-600/20"
              >
                <Save className="h-4 w-4" />
                Salvar Host
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostsView;