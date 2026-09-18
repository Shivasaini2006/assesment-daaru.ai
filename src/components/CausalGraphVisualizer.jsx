import React, { useState, useEffect } from 'react';
import { Layers, Info, RefreshCw, Zap, ArrowRight } from 'lucide-react';

const NODE_POSITIONS = {
  // Land Use & Disturbance (Left Column)
  tillage_intensity: { x: 80, y: 100, label: 'Tillage Disturbance', category: 'land_use', color: '#f43f5e' },
  crop_rotation_diversity: { x: 80, y: 220, label: 'Crop Diversification', category: 'land_use', color: '#10b981' },
  chemical_input_intensity: { x: 80, y: 340, label: 'Chemical Agrochemicals', category: 'land_use', color: '#f59e0b' },
  habitat_fragmentation: { x: 80, y: 460, label: 'Habitat Fragmentation', category: 'landscape', color: '#f43f5e' },

  // Soil Biogeochemistry (Center Column)
  soil_organic_carbon: { x: 340, y: 120, label: 'Soil Organic Carbon (SOC)', category: 'soil', color: '#10b981' },
  soil_ph: { x: 340, y: 240, label: 'Soil pH & Base Cations', category: 'soil', color: '#06b6d4' },
  bulk_density: { x: 340, y: 360, label: 'Bulk Density (Compaction)', category: 'soil', color: '#f43f5e' },
  cation_exchange_capacity: { x: 340, y: 470, label: 'Cation Exchange (CEC)', category: 'soil', color: '#8b5cf6' },

  // Climate & Hydrology (Mid-Right)
  annual_rainfall: { x: 580, y: 80, label: 'Precipitation / Rainfall', category: 'climate', color: '#06b6d4' },
  aridity_index: { x: 580, y: 190, label: 'Aridity Index (P/PET)', category: 'climate', color: '#f59e0b' },
  soil_water_holding_capacity: { x: 580, y: 310, label: 'Water Capacity (AWHC)', category: 'climate', color: '#38bdf8' },

  // Biodiversity & Trophic Levels (Right Column)
  microbial_biomass_carbon: { x: 820, y: 110, label: 'Microbial Biomass (MBC)', category: 'biodiversity', color: '#10b981' },
  fungal_to_bacterial_ratio: { x: 820, y: 220, label: 'Fungal:Bacterial (F:B)', category: 'biodiversity', color: '#10b981' },
  earthworm_density: { x: 820, y: 330, label: 'Earthworm Macrofauna', category: 'biodiversity', color: '#34d399' },
  pollinator_richness: { x: 820, y: 440, label: 'Wild Pollinators (Apoidea)', category: 'biodiversity', color: '#fbbf24' },
  shannon_diversity_index: { x: 820, y: 540, label: "Shannon Index (H')", category: 'biodiversity', color: '#a855f7' }
};

export default function CausalGraphVisualizer({ activeState }) {
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    fetch('/api/causal/graph')
      .then(res => res.json())
      .then(json => {
        if (json.success) setGraphData(json.data);
      })
      .catch(err => console.error('Failed to load graph:', err));
  }, []);

  return (
    <div className="glass-panel p-6 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-emerald">
              <Layers className="w-3.5 h-3.5" /> Interactive Ecological Causal Graph
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Multi-Metric Causal Dependency & Feedback Network</h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Visualizes mechanistic couplings between land management, soil physics, biogeochemical buffers, and trophic biodiversity. Click any node or link to inspect its scientific mechanism.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-900/80 border border-slate-800 px-3 py-2 rounded-xl text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-300">Positive Facilitation (+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-slate-300">Inhibition / Degradation (-)</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative bg-slate-950/80 border border-slate-800 rounded-xl overflow-x-auto p-4 flex justify-center">
        <svg viewBox="0 0 960 620" className="w-full max-w-[960px] min-w-[700px] h-auto select-none">
          <defs>
            <marker id="arrow-pos" markerWidth="8" markerHeight="8" refX="18" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#10b981" />
            </marker>
            <marker id="arrow-neg" markerWidth="8" markerHeight="8" refX="18" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#f43f5e" />
            </marker>
            <marker id="arrow-selected" markerWidth="8" markerHeight="8" refX="18" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#38bdf8" />
            </marker>
          </defs>

          {/* Render Causal Edges */}
          {graphData.edges.map((edge, idx) => {
            const source = NODE_POSITIONS[edge.from];
            const target = NODE_POSITIONS[edge.to];
            if (!source || !target) return null;

            const isSelected = selectedEdge === edge;
            const isNodeConnected = selectedNode && (selectedNode === edge.from || selectedNode === edge.to);
            const edgeColor = isSelected ? '#38bdf8' : edge.polarity > 0 ? '#10b981' : '#f43f5e';
            const strokeWidth = isSelected ? 3.5 : isNodeConnected ? 2.5 : 1.5;
            const opacity = (selectedNode && !isNodeConnected) ? 0.2 : isSelected ? 1 : 0.65;

            // Curved Bezier calculation
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const cx1 = source.x + dx * 0.5;
            const cy1 = source.y;
            const cx2 = source.x + dx * 0.5;
            const cy2 = target.y;

            return (
              <g key={idx} className="cursor-pointer transition-all" onClick={() => setSelectedEdge(edge)}>
                <path
                  d={`M ${source.x} ${source.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${target.x} ${target.y}`}
                  fill="none"
                  stroke={edgeColor}
                  strokeWidth={strokeWidth}
                  strokeOpacity={opacity}
                  strokeDasharray={edge.polarity < 0 ? '4 2' : 'none'}
                  markerEnd={isSelected ? 'url(#arrow-selected)' : edge.polarity > 0 ? 'url(#arrow-pos)' : 'url(#arrow-neg)'}
                />
              </g>
            );
          })}

          {/* Render Nodes */}
          {Object.entries(NODE_POSITIONS).map(([nodeId, pos]) => {
            const isSelected = selectedNode === nodeId;
            const isEdgeParticipant = selectedEdge && (selectedEdge.from === nodeId || selectedEdge.to === nodeId);
            const isStateActive = activeState && activeState[nodeId] !== undefined;

            return (
              <g
                key={nodeId}
                transform={`translate(${pos.x}, ${pos.y})`}
                className="cursor-pointer group"
                onClick={() => {
                  setSelectedNode(selectedNode === nodeId ? null : nodeId);
                  setSelectedEdge(null);
                }}
              >
                {/* Glow ring if active or selected */}
                {(isSelected || isStateActive) && (
                  <circle r="22" fill={pos.color} opacity="0.25" className="animate-pulse" />
                )}

                {/* Node circle */}
                <circle
                  r="14"
                  fill="#0f172a"
                  stroke={isSelected ? '#38bdf8' : isEdgeParticipant ? '#fbbf24' : pos.color}
                  strokeWidth={isSelected ? 3 : 2}
                  className="transition-transform group-hover:scale-110"
                />

                {/* Label text */}
                <text
                  x="0"
                  y="28"
                  textAnchor="middle"
                  fill={isSelected ? '#38bdf8' : '#e2e8f0'}
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="Inter, sans-serif"
                >
                  {pos.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Edge / Node Mechanism Detail Drawer */}
      {selectedEdge ? (
        <div className="bg-slate-900/90 border border-cyan-500/40 rounded-xl p-4 space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase">
              <Zap className="w-4 h-4" /> Mechanistic Coupling Details
            </div>
            <span className={`badge ${selectedEdge.polarity > 0 ? 'badge-emerald' : 'badge-rose'}`}>
              {selectedEdge.polarity > 0 ? '+ Positive Feedback' : '- Negative Disturbance'} (Weight: {selectedEdge.weight})
            </span>
          </div>
          <div className="text-sm font-semibold text-white flex items-center gap-2">
            <span>{NODE_POSITIONS[selectedEdge.from]?.label}</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <span>{NODE_POSITIONS[selectedEdge.to]?.label}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            {selectedEdge.mechanism}
          </p>
        </div>
      ) : selectedNode ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2 animate-fade-in">
          <div className="text-xs font-bold text-slate-400 uppercase">Selected Variable Node</div>
          <div className="text-sm font-bold text-white">{NODE_POSITIONS[selectedNode]?.label}</div>
          <div className="text-xs text-slate-300">
            Category: <span className="font-semibold text-emerald-400 uppercase">{NODE_POSITIONS[selectedNode]?.category}</span>
          </div>
          <p className="text-xs text-slate-400">
            Click on adjacent links to inspect exact biophysical interaction pathways.
          </p>
        </div>
      ) : (
        <div className="text-center py-2 text-xs text-slate-500 italic">
          Click on any node or connection arrow above to view peer-reviewed mechanistic equations.
        </div>
      )}
    </div>
  );
}
