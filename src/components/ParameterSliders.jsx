import React, { useState } from 'react';
import { Sliders, RefreshCw, Zap, TrendingUp } from 'lucide-react';
import ScientificDossier from './ScientificDossier.jsx';

export default function ParameterSliders() {
  const [params, setParams] = useState({
    soil_organic_carbon: 0.3,
    soil_ph: 8.1,
    annual_rainfall: 320,
    tillage_intensity: 'conventional-inversion-tillage',
    crop_rotation_diversity: 'monoculture',
    chemical_input_intensity: 'moderate-synthetic'
  });

  const [dossier, setDossier] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulate = async (customParams = null) => {
    const payload = customParams || params;
    setIsLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload })
      });
      const json = await res.json();
      if (json.success) {
        setDossier(json.data.response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key, val) => {
    const updated = { ...params, [key]: val };
    setParams(updated);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-panel p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-emerald">
                <Sliders className="w-3.5 h-3.5" /> Interactive Ecological Simulator
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Multi-Variable Parameter Tuning & State Simulation</h2>
            <p className="text-xs text-slate-400">
              Adjust environmental knobs to observe real-time non-linear threshold shifts, Liebig bottlenecks, and quantitative restoration trajectories.
            </p>
          </div>

          <button
            onClick={() => handleSimulate()}
            disabled={isLoading}
            className="btn-primary"
          >
            <Zap className="w-4 h-4" />
            <span>{isLoading ? 'Simulating...' : 'Simulate Ecosystem'}</span>
          </button>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Soil Organic Carbon */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300">Soil Organic Carbon (SOC)</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">{params.soil_organic_carbon}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="5.0"
              step="0.05"
              value={params.soil_organic_carbon}
              onChange={(e) => handleChange('soil_organic_carbon', parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.1% (Severe)</span>
              <span>1.5% (Threshold)</span>
              <span>5.0% (Optimal)</span>
            </div>
          </div>

          {/* 2. Soil pH */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300">Soil pH Reaction</span>
              <span className="font-mono font-bold text-cyan-400 text-sm">{params.soil_ph}</span>
            </div>
            <input
              type="range"
              min="4.0"
              max="9.5"
              step="0.1"
              value={params.soil_ph}
              onChange={(e) => handleChange('soil_ph', parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>4.0 (Al Toxicity)</span>
              <span>6.5 (Optimal)</span>
              <span>9.5 (Sodic)</span>
            </div>
          </div>

          {/* 3. Rainfall */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300">Annual Rainfall (MAP)</span>
              <span className="font-mono font-bold text-blue-400 text-sm">{params.annual_rainfall} mm</span>
            </div>
            <input
              type="range"
              min="150"
              max="2000"
              step="25"
              value={params.annual_rainfall}
              onChange={(e) => handleChange('annual_rainfall', parseInt(e.target.value, 10))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>150mm (Arid)</span>
              <span>550mm (Semi-Arid)</span>
              <span>2000mm (Humid)</span>
            </div>
          </div>

          {/* 4. Tillage Intensity */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
            <label className="text-xs font-bold text-slate-300 block">Tillage Disturbance Regime</label>
            <select
              value={params.tillage_intensity}
              onChange={(e) => handleChange('tillage_intensity', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="conventional-inversion-tillage">Conventional Inversion Tillage (High Disturbance)</option>
              <option value="reduced-till">Reduced / Minimum Tillage</option>
              <option value="strip-till">Strip Tillage</option>
              <option value="no-till">Continuous Zero-Till / Living Armor</option>
            </select>
          </div>

          {/* 5. Crop Diversity */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
            <label className="text-xs font-bold text-slate-300 block">Crop & Spatial Diversification</label>
            <select
              value={params.crop_rotation_diversity}
              onChange={(e) => handleChange('crop_rotation_diversity', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="monoculture">Single Cereal Monoculture</option>
              <option value="2-crop-rotation">2-Crop Annual Rotation</option>
              <option value="polyculture-intercropping">Polyculture & Intercropping</option>
              <option value="multi-strata-agroforestry">Multi-Strata Agroforestry Matrix</option>
            </select>
          </div>

          {/* 6. Chemical Pressure */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
            <label className="text-xs font-bold text-slate-300 block">Agrochemical Intensity</label>
            <select
              value={params.chemical_input_intensity}
              onChange={(e) => handleChange('chemical_input_intensity', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="high-intensity-synthetic">High Synthetic N/P + Preventive Insecticides</option>
              <option value="moderate-synthetic">Moderate Synthetic Fertilizer (Standard)</option>
              <option value="low-input-ipm">Low-Input Integrated Pest Management (IPM)</option>
              <option value="organic-regenerative">Biological / Organic Regenerative Inputs</option>
            </select>
          </div>
        </div>
      </div>

      {/* Simulation Dossier Output */}
      {dossier && (
        <ScientificDossier data={dossier} />
      )}
    </div>
  );
}
