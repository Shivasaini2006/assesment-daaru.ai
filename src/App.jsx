import React, { useState } from 'react';
import { 
  Leaf, MessageSquare, Layers, FileJson, Sliders, 
  Database, Award, Compass, Sparkles, Activity, ShieldCheck 
} from 'lucide-react';
import ChatInterface from './components/ChatInterface.jsx';
import CausalGraphVisualizer from './components/CausalGraphVisualizer.jsx';
import JsonStudio from './components/JsonStudio.jsx';
import ParameterSliders from './components/ParameterSliders.jsx';
import KnowledgeExplorer from './components/KnowledgeExplorer.jsx';
import GeoContextSelector from './components/GeoContextSelector.jsx';
import BenchmarkRunner from './components/BenchmarkRunner.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [activeState, setActiveState] = useState({});
  const [selectedScenarioId, setSelectedScenarioId] = useState(null);

  const handleSelectScenario = (scenarioId) => {
    setSelectedScenarioId(scenarioId);
    setActiveTab('json');
  };

  const handleApplyGeoContext = (resolvedData) => {
    setActiveState(prev => ({
      ...prev,
      coordinates: resolvedData.spatial_coordinates,
      ecoregion: resolvedData.wwf_biome,
      region: resolvedData.region_name,
      annual_rainfall: resolvedData.mean_annual_precipitation_mm,
      soil_ph: resolvedData.baseline_ph,
      soil_organic_carbon: resolvedData.baseline_soc_pct
    }));
    setActiveTab('chat');
  };

  const navTabs = [
    { id: 'chat', label: 'AI Scientist Chat & Memory', icon: MessageSquare, color: 'emerald' },
    { id: 'causal', label: 'Causal Dependency Graph', icon: Layers, color: 'emerald' },
    { id: 'json', label: 'Structured JSON Studio', icon: FileJson, color: 'cyan' },
    { id: 'sliders', label: 'Parameter Simulator', icon: Sliders, color: 'amber' },
    { id: 'geo', label: 'Spatial Biome Resolver', icon: Compass, color: 'purple' },
    { id: 'knowledge', label: 'Scientific Knowledge (RAG)', icon: Database, color: 'teal' },
    { id: 'benchmark', label: 'Evaluation Benchmark', icon: Award, color: 'rose' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#050b14] text-slate-100 font-sans">
      {/* 1. Header Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 flex items-center justify-center shadow-lg shadow-emerald-950/60 ring-2 ring-emerald-400/30">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-extrabold tracking-tight text-white font-display">
                  Darukaa<span className="text-emerald-400">.Earth</span>
                </h1>
                <span className="badge badge-emerald text-[10px] tracking-wider font-bold">
                  AI Environmental Scientist
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-Metric Biodiversity Intelligence & Causal Ecological Reasoning System
              </p>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="hidden md:flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Evidence-Grounding: <strong className="text-emerald-300">FAO • IPCC • IPBES</strong></span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 shadow-sm">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Nexus Engine: <strong className="text-cyan-300">3+ Variables Coupled</strong></span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-2 overflow-x-auto scrollbar-none border-t border-slate-800/60 py-2 text-xs">
          {navTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all whitespace-nowrap border ${
                  isActive
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/70 shadow-md shadow-emerald-950/50'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800/80 hover:text-white hover:bg-slate-800 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* 2. Main Content View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'chat' && (
          <ChatInterface
            onStateUpdate={setActiveState}
            activeState={activeState}
            onSelectScenario={handleSelectScenario}
          />
        )}

        {activeTab === 'causal' && (
          <CausalGraphVisualizer activeState={activeState} />
        )}

        {activeTab === 'json' && (
          <JsonStudio initialScenarioId={selectedScenarioId} />
        )}

        {activeTab === 'sliders' && (
          <ParameterSliders />
        )}

        {activeTab === 'geo' && (
          <GeoContextSelector onApplyGeoContext={handleApplyGeoContext} />
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeExplorer />
        )}

        {activeTab === 'benchmark' && (
          <BenchmarkRunner />
        )}
      </main>

      {/* 3. Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-4 text-center text-xs text-slate-500">
        <p>Darukaa.Earth AI Biodiversity Intelligence System • Grounded in FAO, IPCC, IPBES & RothC Mathematical Pedotransfer Models</p>
      </footer>
    </div>
  );
}
