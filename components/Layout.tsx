import React from 'react';
import { 
  LayoutDashboard, 
  Server, 
  Activity, 
  Network, 
  Settings, 
  Bell, 
  Menu,
  ShieldCheck,
  Code,
  Waves,
  BrainCircuit,
  ShieldAlert,
  FileText,
  Copy
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onChangeView: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const navItems = [
    { id: 'dashboard', label: 'ISP Dashboard', icon: LayoutDashboard },
    { id: 'flowcool', label: 'FlowCool (NetFlow)', icon: Waves, highlight: true },
    { id: 'ai-core', label: 'AI Diagnostics', icon: BrainCircuit, highlight: true },
    { id: 'ddos', label: 'DDoS Guard', icon: ShieldAlert, highlight: true },
    { id: 'hosts', label: 'Hosts & Inventário', icon: Server },
    { id: 'templates', label: 'Templates (Zabbix)', icon: Copy },
    { id: 'topology', label: 'Mapas & Topologia', icon: Network },
    { id: 'triggers', label: 'Triggers & Eventos', icon: Activity },
    { id: 'reports', label: 'Relatórios PDF', icon: FileText },
    { id: 'api', label: 'API & OpenAPI', icon: Code },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col z-20 shadow-2xl`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-900">
          {sidebarOpen && (
            <div className="flex items-center gap-2 font-bold text-lg text-primary-500 tracking-tight whitespace-nowrap">
              <ShieldCheck className="h-6 w-6" />
              <span>GUARDIAN<span className="text-white">ISP</span></span>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                  active 
                    ? 'bg-gradient-to-r from-primary-600/20 to-primary-900/10 text-primary-400 border border-primary-600/20 shadow-lg shadow-primary-900/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 transition-colors ${active ? 'text-primary-500' : item.highlight ? 'text-indigo-400 group-hover:text-indigo-300' : ''}`} />
                {sidebarOpen && <span className="font-medium truncate">{item.label}</span>}
                {sidebarOpen && item.highlight && !active && (
                   <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center font-bold text-xs shadow-lg">
              NOC
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white">NOC Operator</p>
                <p className="text-xs text-slate-500 truncate">noc@guardian.isp</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-5" 
             style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>

        {/* Header */}
        <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 z-10 sticky top-0">
          <h2 className="text-lg font-semibold text-slate-100 capitalize flex items-center gap-2">
            {navItems.find(i => i.id === currentView)?.icon && React.createElement(navItems.find(i => i.id === currentView)!.icon, { className: "h-5 w-5 text-primary-500" })}
            {navItems.find(i => i.id === currentView)?.label}
          </h2>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-500">
               <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> ELASTIC: CONNECTED</span>
               <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> AI ENGINE: ACTIVE</span>
            </div>
            <div className="h-6 w-px bg-slate-800 hidden md:block"></div>
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors hover:bg-slate-800 rounded-full">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              </span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto p-6 z-10 custom-scrollbar">
          <div className="max-w-[1920px] mx-auto">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;