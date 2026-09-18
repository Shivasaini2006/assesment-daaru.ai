import React, { useState } from 'react';
import { 
  AlertTriangle, ShieldCheck, Activity, Layers, Droplets, 
  Sparkles, BookOpen, Clock, ChevronRight, FileText, ExternalLink, 
  TrendingUp, Compass, Cpu, CheckCircle2 
} from 'lucide-react';

export default function ScientificDossier({ data, spatialContext }) {
  const [activeTab, setActiveTab] = useState('interventions');

  if (!data) return null;

  const {
    executive_summary,
    degradation_severity_score,
    ecosystem_state,
    multi_variable_nexus = [],
    limiting_bottlenecks = [],
    recommendations = [],
    projections = {},
    citations = []
  } = data;

  const degradationVal = parseInt(degradation_severity_score || '40', 10);

  return (
    <div className="glass-panel p-6 space-y-6 animate-fade-in">
      {/* 1. Executive Summary & Diagnostic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="badge badge-emerald">
              <Cpu className="w-3.5 h-3.5" /> AI Environmental Scientist Diagnosis
            </span>
            {spatialContext && (
              <span className="badge badge-cyan">
                <Compass className="w-3.5 h-3.5" /> {spatialContext.region_name || 'Spatial Grounded'}
              </span>
            )}
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Ecological Assessment & Intervention Dossier
          </h2>
          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            {executive_summary}
          </p>
        </div>

        {/* Severity Gauge */}
        <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 min-w-[220px]">
          <div className="relative flex items-center justify-center w-14 h-14">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={degradationVal > 60 ? "text-rose-500" : degradationVal > 35 ? "text-amber-500" : "text-emerald-500"}
                strokeDasharray={`${degradationVal}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-bold text-sm text-white">{degradation_severity_score}</span>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Degradation Risk</div>
            <div className="text-xs font-bold text-slate-200 mt-0.5">{ecosystem_state}</div>
          </div>
        </div>
      </div>

      {/* 2. Multi-Metric Nexus Couplings (>= 3 Variables) */}
      {multi_variable_nexus.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-400 uppercase tracking-wider">
            <Layers className="w-4 h-4" /> Multi-Variable Nexus Interactions (3+ Variables Coupled)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {multi_variable_nexus.map((nexus, idx) => (
              <div key={idx} className="bg-slate-900/70 border border-amber-500/20 rounded-xl p-4 space-y-2 hover:border-amber-500/40 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-amber-300">{nexus.synergy_type}</span>
                  <span className="badge badge-amber text-[10px]">{nexus.severity}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {nexus.variables.map((v, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                      {v}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {nexus.analysis}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Liebig Ecological Bottlenecks */}
      {limiting_bottlenecks.length > 0 && (
        <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" /> Primary Liebig Limiting Bottlenecks
          </div>
          <div className="space-y-1.5">
            {limiting_bottlenecks.map((b, i) => (
              <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>{b.factor}:</strong> {b.liebig_constraint}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('interventions')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'interventions'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> Actionable Interventions ({recommendations.length})
        </button>

        <button
          onClick={() => setActiveTab('projections')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'projections'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" /> 5-Year Quantitative Projections
        </button>

        <button
          onClick={() => setActiveTab('citations')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'citations'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> Scientific Evidence & RAG Grounding ({citations.length})
        </button>
      </div>

      {/* 5. Sub-Tab Content: Interventions */}
      {activeTab === 'interventions' && (
        <div className="space-y-4">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/30 rounded-xl p-5 space-y-3.5 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 tracking-wider uppercase block">{rec.tier}</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{rec.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-emerald flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3" /> {rec.time_horizon}
                  </span>
                </div>
              </div>

              {/* Protocol Specs */}
              {rec.actionable_protocol && (
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Specific Ecological Protocol:</div>
                  {rec.actionable_protocol.cocktail_composition && (
                    <div className="space-y-1">
                      {rec.actionable_protocol.cocktail_composition.map((c, i) => (
                        <div key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong className="text-emerald-300">{c.species}:</strong> {c.function}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {rec.actionable_protocol.biochar_specs && (
                    <div className="text-xs text-slate-300 space-y-1">
                      <p><strong>Specifications:</strong> {rec.actionable_protocol.biochar_specs}</p>
                      <p><strong>Charging Process:</strong> {rec.actionable_protocol.charging_process}</p>
                      <p><strong>Application Rate:</strong> {rec.actionable_protocol.application_rate}</p>
                    </div>
                  )}
                  {rec.actionable_protocol.canopy_strata && (
                    <div className="space-y-1">
                      {rec.actionable_protocol.canopy_strata.map((s, i) => (
                        <div key={i} className="text-xs text-slate-300">
                          <strong className="text-cyan-300">{s.tier}:</strong> {s.species}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Scientific Mechanism */}
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase">Scientific Mechanism (Why it Works):</div>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  {rec.scientific_reasoning}
                </p>
              </div>

              {/* Impacted Metrics & Citations */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-slate-400">Impacted Metrics:</span>
                  {rec.impacted_metrics.map((m, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 text-[11px] font-mono">
                      {m.metric}: {m.delta}
                    </span>
                  ))}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  Ref: <span className="text-slate-200">{rec.primary_citation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. Sub-Tab Content: 5-Year Quantitative Projections */}
      {activeTab === 'projections' && projections.timeline_projections && (
        <div className="space-y-4">
          {/* Key Net Gains */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-center">
              <div className="text-[11px] font-bold text-slate-400 uppercase">5-Yr SOC Gain</div>
              <div className="text-lg font-bold text-emerald-400 mt-1">{projections.net_deltas_5_year?.soc_delta_pct}</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-center">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Water Capacity (AWHC)</div>
              <div className="text-lg font-bold text-cyan-400 mt-1">{projections.net_deltas_5_year?.awhc_gain_pct}</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-center">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Shannon Diversity (H')</div>
              <div className="text-lg font-bold text-purple-400 mt-1">{projections.net_deltas_5_year?.shannon_diversity_gain}</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-center">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Water Stored / Ha</div>
              <div className="text-lg font-bold text-blue-400 mt-1">+{projections.water_retention_liters_ha?.toLocaleString()} L/ha</div>
            </div>
          </div>

          {/* Trajectory Table */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 overflow-x-auto">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Mathematical Multi-Year Restoration Trajectory (RothC & Empirical pedotransfer models)
            </div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2 font-semibold">Ecological Metric</th>
                  <th className="pb-2 font-semibold">Year 0 (Baseline)</th>
                  <th className="pb-2 font-semibold">Year 1</th>
                  <th className="pb-2 font-semibold">Year 2</th>
                  <th className="pb-2 font-semibold">Year 3</th>
                  <th className="pb-2 font-semibold text-emerald-400">Year 5 (Maturity)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                <tr>
                  <td className="py-2.5 font-sans font-medium text-slate-200">Soil Organic Carbon (%)</td>
                  {projections.timeline_projections.soil_organic_carbon.map((p, i) => (
                    <td key={i} className="py-2.5 text-slate-300">{p.value}%</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-medium text-slate-200">Available Water Capacity (mm/m)</td>
                  {projections.timeline_projections.water_holding_capacity.map((p, i) => (
                    <td key={i} className="py-2.5 text-slate-300">{p.value} mm</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-medium text-slate-200">Shannon Diversity Index (H')</td>
                  {projections.timeline_projections.shannon_diversity_index.map((p, i) => (
                    <td key={i} className="py-2.5 text-slate-300">{p.value}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-medium text-slate-200">Bulk Density (g/cm³)</td>
                  {projections.timeline_projections.bulk_density.map((p, i) => (
                    <td key={i} className="py-2.5 text-slate-300">{p.value} g/cm³</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. Sub-Tab Content: Scientific Citations */}
      {activeTab === 'citations' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-400 mb-2">
            Retrieved from indexed peer-reviewed scientific repositories with Reciprocal Rank Fusion (RRF) provenance scores.
          </div>
          {citations.map((cite, idx) => (
            <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-slate-100">{cite.title}</h4>
                <span className="badge badge-cyan text-[10px]">RRF: {cite.provenance_score?.rrfScore}</span>
              </div>
              <div className="text-xs text-slate-400">
                <strong>{cite.authors}</strong> ({cite.year}) • <em>{cite.source}</em>
              </div>
              <div className="bg-slate-950/60 border-l-2 border-emerald-500 rounded p-2.5 text-xs text-slate-300 italic">
                "{cite.key_excerpt}"
              </div>
              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 font-mono">
                <span>DOI: {cite.doi}</span>
                <span className="text-emerald-400">Domain: {cite.domain}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
