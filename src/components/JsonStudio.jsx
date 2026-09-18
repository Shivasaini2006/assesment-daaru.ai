import React, { useState, useEffect } from 'react';
import { Code, Play, CheckCircle, AlertCircle, Copy, FileJson, Sparkles } from 'lucide-react';
import ScientificDossier from './ScientificDossier.jsx';

export default function JsonStudio({ initialScenarioId = null }) {
  const [presets, setPresets] = useState([]);
  const [selectedPresetId, setSelectedPresetId] = useState('hackathon-example-semi-arid-wheat');
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    fetch('/api/presets')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setPresets(json.data);
          const defaultPreset = json.data.find(p => p.id === (initialScenarioId || 'hackathon-example-semi-arid-wheat')) || json.data[0];
          if (defaultPreset) {
            setSelectedPresetId(defaultPreset.id);
            setJsonText(JSON.stringify(defaultPreset.data, null, 2));
          }
        }
      });
  }, [initialScenarioId]);

  const handleSelectPreset = (presetId) => {
    setSelectedPresetId(presetId);
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      setJsonText(JSON.stringify(preset.data, null, 2));
      setJsonError(null);
    }
  };

  const handleJsonChange = (e) => {
    const text = e.target.value;
    setJsonText(text);
    try {
      JSON.parse(text);
      setJsonError(null);
    } catch (err) {
      setJsonError(err.message);
    }
  };

  const handleRunAnalysis = async () => {
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (err) {
      setJsonError('Invalid JSON structure. Please fix syntax errors before running.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: parsed })
      });
      const data = await res.json();
      if (data.success) {
        setAnalysisResult(data.data.response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Studio Header & Preset Selector */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-cyan">
                <FileJson className="w-3.5 h-3.5" /> Structured JSON Studio
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Direct Environmental Payload Diagnostic Studio</h2>
            <p className="text-xs text-slate-400">
              Input programmatic ecological telemetry (soil chemistry, climate indices, management regimes) for deterministic multi-variable nexus diagnosis.
            </p>
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={isLoading || !!jsonError}
            className="btn-primary"
          >
            <Play className="w-4 h-4" />
            <span>{isLoading ? 'Executing Model...' : 'Run Nexus Diagnosis'}</span>
          </button>
        </div>

        {/* Benchmark Preset Buttons */}
        <div>
          <div className="text-xs font-semibold text-slate-400 mb-2">Load Benchmark Ecosystem Preset:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {presets.map(preset => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                className={`text-left p-3 rounded-xl border text-xs transition-all ${
                  selectedPresetId === preset.id
                    ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-100 shadow-md shadow-emerald-950/50'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-bold">{preset.name}</div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{preset.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* JSON Editor Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>JSON Telemetry Payload (Editable):</span>
            {jsonError ? (
              <span className="text-rose-400 flex items-center gap-1 font-mono text-[11px]">
                <AlertCircle className="w-3.5 h-3.5" /> Syntax Error: {jsonError}
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                <CheckCircle className="w-3.5 h-3.5" /> Valid JSON Schema
              </span>
            )}
          </div>
          <textarea
            value={jsonText}
            onChange={handleJsonChange}
            rows={12}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-300 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed resize-y"
          />
        </div>
      </div>

      {/* Analysis Result Output */}
      {analysisResult && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" /> Nexus Diagnostic Output
          </div>
          <ScientificDossier data={analysisResult} />
        </div>
      )}
    </div>
  );
}
