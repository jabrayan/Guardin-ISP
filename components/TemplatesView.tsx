import React, { useState, useRef } from 'react';
import { MOCK_TEMPLATES } from '../mockData';
import { Template } from '../types';
import { Upload, Plus, Search, FileCode, Check, AlertCircle, Download, X, Save, FileText, Trash2 } from 'lucide-react';

const TemplatesView: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);
  
  // Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    vendor: '',
    description: '',
    zabbixCompatibility: '7.0'
  });

  // --- Handlers for Import ---

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImportSubmit = () => {
    if (!selectedFile) return;

    // Simulate parsing logic
    const isYaml = selectedFile.name.toLowerCase().endsWith('.yaml') || selectedFile.name.toLowerCase().endsWith('.yml');
    const simulatedTemplate: Template = {
      id: `tpl-${Date.now()}`,
      name: selectedFile.name.replace(/\.(xml|yaml|yml|json)$/i, ''),
      vendor: 'Imported',
      zabbixCompatibility: '5.0 - 7.0',
      itemsCount: Math.floor(Math.random() * 150) + 10,
      triggersCount: Math.floor(Math.random() * 40) + 5,
      discoveryRules: Math.floor(Math.random() * 5) + 1,
      description: `Imported from ${selectedFile.name}`,
      importedAt: new Date().toISOString().split('T')[0],
      format: isYaml ? 'YAML' : 'XML'
    };

    setTemplates([simulatedTemplate, ...templates]);
    setIsImportModalOpen(false);
    setSelectedFile(null);
  };

  // --- Handlers for Create ---

  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTemplate(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const createdTemplate: Template = {
      id: `tpl-new-${Date.now()}`,
      name: newTemplate.name,
      vendor: newTemplate.vendor || 'Custom',
      zabbixCompatibility: newTemplate.zabbixCompatibility,
      itemsCount: 0,
      triggersCount: 0,
      discoveryRules: 0,
      description: newTemplate.description,
      importedAt: new Date().toISOString().split('T')[0],
      format: 'JSON' // Native format
    };

    setTemplates([createdTemplate, ...templates]);
    setIsCreateModalOpen(false);
    // Reset form
    setNewTemplate({
      name: '',
      vendor: '',
      description: '',
      zabbixCompatibility: '7.0'
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileCode className="h-6 w-6 text-primary-500" />
            Templates & Configuration
          </h2>
          <p className="text-slate-400 text-sm">Gerencie templates de monitoramento (Compatível Zabbix 5.0 - 7.0).</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Importar (XML/YAML)</span>
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-lg shadow-primary-600/20 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Criar Novo</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-4 bg-slate-900/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Buscar templates por nome ou vendor..." 
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500 hidden md:flex">
             <span className="flex items-center gap-1.5">
               <Check className="h-4 w-4 text-green-500" /> Zabbix 6.0 LTS
             </span>
             <span className="flex items-center gap-1.5">
               <Check className="h-4 w-4 text-green-500" /> Zabbix 7.0
             </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950 text-slate-200 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Template Name</th>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">Compatibility</th>
                <th className="px-6 py-4">Stats (Items/Trig)</th>
                <th className="px-6 py-4">Discovery</th>
                <th className="px-6 py-4 text-right">Format</th>
                <th className="px-6 py-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {templates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No templates found. Import or create one.
                  </td>
                </tr>
              ) : (
                templates.map((tpl) => (
                  <tr key={tpl.id} className="hover:bg-slate-800/50 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-medium hover:text-primary-400 transition-colors">{tpl.name}</span>
                        <span className="text-xs text-slate-500">{tpl.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 text-xs">
                        {tpl.vendor}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-xs font-mono">
                            v{tpl.zabbixCompatibility}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div title="Items">
                            <span className="text-white font-bold">{tpl.itemsCount}</span> <span className="text-xs">its</span>
                        </div>
                        <div className="w-px h-3 bg-slate-700"></div>
                        <div title="Triggers">
                            <span className="text-white font-bold">{tpl.triggersCount}</span> <span className="text-xs">trg</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300">{tpl.discoveryRules} LLD rules</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-xs text-slate-500 border border-slate-700 px-2 py-1 rounded bg-slate-900">
                        {tpl.format}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(tpl.id); }}
                        className="p-1 hover:bg-red-500/20 rounded text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
           <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-xl shadow-2xl flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                 <h3 className="text-xl font-bold text-white">Importar Template</h3>
                 <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="h-6 w-6" />
                 </button>
              </div>
              
              <div className="p-6">
                 <div 
                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors relative ${
                       dragActive ? 'border-primary-500 bg-primary-500/10' : 'border-slate-700 bg-slate-950/50 hover:border-primary-500/50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                 >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".xml,.yaml,.yml,.json"
                    />

                    {selectedFile ? (
                      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-200">
                        <div className="p-4 bg-green-500/20 rounded-full mb-4">
                           <FileText className="h-8 w-8 text-green-400" />
                        </div>
                        <h4 className="text-lg font-medium text-white mb-1">{selectedFile.name}</h4>
                        <p className="text-slate-400 text-xs mb-4">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                        <button 
                          onClick={() => setSelectedFile(null)}
                          className="text-xs text-red-400 hover:underline"
                        >
                          Remover arquivo
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="p-4 bg-slate-800 rounded-full mb-4">
                          <Upload className="h-8 w-8 text-primary-400" />
                        </div>
                        <h4 className="text-lg font-medium text-white mb-2">Arraste e solte o arquivo aqui</h4>
                        <p className="text-slate-400 text-sm mb-4">Suporte nativo para arquivos <span className="text-white font-mono">.xml</span> e <span className="text-white font-mono">.yaml</span></p>
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 text-sm"
                        >
                          Selecionar Arquivo
                        </button>
                      </>
                    )}
                 </div>

                 <div className="mt-6 space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                       <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
                       <div className="text-sm text-blue-200">
                          <p className="font-semibold mb-1">Compatibilidade Zabbix</p>
                          <p>O GuardianISP converterá automaticamente templates exportados das versões 5.0, 6.0 LTS e 7.0 para o formato interno.</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3 rounded-b-xl">
                 <button onClick={() => setIsImportModalOpen(false)} className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800">
                    Cancelar
                 </button>
                 <button 
                   onClick={handleImportSubmit}
                   disabled={!selectedFile}
                   className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${
                     selectedFile 
                       ? 'bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-600/20' 
                       : 'bg-slate-700 cursor-not-allowed opacity-50'
                   }`}
                 >
                    Importar Template
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
           <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl shadow-2xl flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                 <h3 className="text-xl font-bold text-white">Criar Novo Template</h3>
                 <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="h-6 w-6" />
                 </button>
              </div>
              
              <div className="p-6">
                 <form id="create-template-form" onSubmit={handleCreateSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Nome do Template</label>
                        <input 
                          type="text" 
                          name="name"
                          required
                          value={newTemplate.name}
                          onChange={handleCreateInputChange}
                          placeholder="e.g. Cisco ASR9k Custom"
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Vendor / Fabricante</label>
                        <input 
                          type="text" 
                          name="vendor"
                          value={newTemplate.vendor}
                          onChange={handleCreateInputChange}
                          placeholder="e.g. Cisco"
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Compatibilidade Alvo</label>
                      <select 
                        name="zabbixCompatibility"
                        value={newTemplate.zabbixCompatibility}
                        onChange={handleCreateInputChange}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                      >
                        <option value="7.0">Zabbix 7.0</option>
                        <option value="6.0">Zabbix 6.0 LTS</option>
                        <option value="5.0">Zabbix 5.0 LTS</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Descrição</label>
                      <textarea 
                        name="description"
                        rows={3}
                        value={newTemplate.description}
                        onChange={handleCreateInputChange}
                        placeholder="Descreva o propósito deste template..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none"
                      />
                    </div>
                 </form>
              </div>

              <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3 rounded-b-xl">
                 <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800">
                    Cancelar
                 </button>
                 <button 
                    type="submit"
                    form="create-template-form"
                    className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium shadow-lg shadow-primary-600/20"
                 >
                    <Save className="h-4 w-4" />
                    Salvar Template
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesView;
