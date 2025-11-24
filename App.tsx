import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import HostsView from './components/HostsView';
import TopologyMap from './components/TopologyMap';
import ApiDocs from './components/ApiDocs';
import FlowCoolView from './components/FlowCoolView';
import AiDiagnosticsView from './components/AiDiagnosticsView';
import DDoSView from './components/DDoSView';
import ReportsView from './components/ReportsView';
import TemplatesView from './components/TemplatesView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'flowcool':
        return <FlowCoolView />;
      case 'ai-core':
        return <AiDiagnosticsView />;
      case 'ddos':
        return <DDoSView />;
      case 'hosts':
        return <HostsView />;
      case 'templates':
        return <TemplatesView />;
      case 'topology':
        return <TopologyMap />;
      case 'reports':
        return <ReportsView />;
      case 'api':
        return <ApiDocs />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <h3 className="text-xl font-semibold mb-2 text-slate-300">Module Under Construction</h3>
            <p>The module <span className="text-primary-500 font-mono">{currentView}</span> is part of the roadmap.</p>
          </div>
        );
    }
  };

  return (
    <Layout currentView={currentView} onChangeView={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

export default App;