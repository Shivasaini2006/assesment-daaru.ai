import React, { useState } from 'react';
import { Compass, MapPin, Globe, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

const PRESET_LOCATIONS = [
  { name: 'Thar Transition (Jaipur, India)', lat: 26.9124, lon: 75.7873, tag: 'Semi-Arid BSh' },
  { name: 'Indo-Gangetic Basin (Punjab, India)', lat: 30.9010, lon: 75.8573, tag: 'Alluvial Subhumid' },
  { name: 'Mediterranean Grove (Andalusia, Spain)', lat: 37.7796, lon: -3.7849, tag: 'Csa Dry Summer' },
  { name: 'North American Great Plains (Kansas, USA)', lat: 38.5266, lon: -96.7265, tag: 'Prairie BSk' },
  { name: 'Sahelian Savanna (Niamey, Niger)', lat: 13.5116, lon: 2.1254, tag: 'Sahel BSh' },
  { name: 'Amazon Fringe (Mato Grosso, Brazil)', lat: -12.5564, lon: -55.7224, tag: 'Tropical Aw' }
];

export default function GeoContextSelector({ onApplyGeoContext }) {
  const [lat, setLat] = useState('26.9124');
  const [lon, setLon] = useState('75.7873');
  const [resolved, setResolved] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResolve = async (customLat = null, customLon = null) => {
    const latitude = parseFloat(customLat !== null ? customLat : lat);
    const longitude = parseFloat(customLon !== null ? customLon : lon);

    if (isNaN(latitude) || isNaN(longitude)) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/georesolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude, longitude })
      });
      const json = await res.json();
      if (json.success) {
        setResolved(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (loc) => {
    setLat(String(loc.lat));
    setLon(String(loc.lon));
    handleResolve(loc.lat, loc.lon);
  };

  return (
    <div className="glass-panel p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-cyan">
              <Globe className="w-3.5 h-3.5" /> Spatial Context Resolver
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Geo-Spatial Biome & Climate Coordinate Calibration</h2>
          <p className="text-xs text-slate-400">
            Resolves latitude/longitude coordinates into Köppen-Geiger climate classifications, WWF ecoregions, baseline precipitation, and soil taxonomy.
          </p>
        </div>
      </div>

      {/* Coordinate Input & Quick Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="text-xs font-bold text-slate-300 uppercase">Input Coordinates</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Latitude (°N/S)</label>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Longitude (°E/W)</label>
              <input
                type="number"
                step="any"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <button
            onClick={() => handleResolve()}
            disabled={isLoading}
            className="btn-primary w-full justify-center py-2.5 text-xs"
          >
            <Compass className="w-4 h-4" />
            <span>{isLoading ? 'Calibrating...' : 'Resolve Spatial Context'}</span>
          </button>

          {/* Quick Presets */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="text-[11px] font-semibold text-slate-400">Sample Global Locations:</div>
            <div className="space-y-1.5">
              {PRESET_LOCATIONS.map((loc, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectPreset(loc)}
                  className="w-full text-left px-3 py-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 text-xs text-slate-300 flex items-center justify-between transition-colors"
                >
                  <span className="font-medium">{loc.name}</span>
                  <span className="badge badge-emerald text-[9px]">{loc.tag}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resolved Spatial Data Card */}
        <div className="lg:col-span-2 space-y-4">
          {resolved ? (
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="badge badge-emerald text-[10px]">Resolved Ecoregion</span>
                  <h3 className="text-base font-bold text-white mt-1">{resolved.region_name}</h3>
                </div>
                {onApplyGeoContext && (
                  <button
                    onClick={() => onApplyGeoContext(resolved)}
                    className="btn-primary text-xs py-2 px-3.5"
                  >
                    <span>Apply to Active Chat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
                  <div className="text-[11px] text-slate-400">Köppen Climate</div>
                  <div className="font-bold text-cyan-400 mt-0.5">{resolved.koppen_climate}</div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
                  <div className="text-[11px] text-slate-400">Mean Precipitation</div>
                  <div className="font-bold text-blue-400 mt-0.5">{resolved.mean_annual_precipitation_mm} mm/yr</div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
                  <div className="text-[11px] text-slate-400">Mean Temperature</div>
                  <div className="font-bold text-amber-400 mt-0.5">{resolved.mean_temperature_c} °C</div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
                  <div className="text-[11px] text-slate-400">Dominant Soil Order</div>
                  <div className="font-bold text-slate-200 mt-0.5">{resolved.dominant_soil_order}</div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
                  <div className="text-[11px] text-slate-400">Baseline Topsoil SOC</div>
                  <div className="font-bold text-emerald-400 mt-0.5">{resolved.baseline_soc_pct}%</div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
                  <div className="text-[11px] text-slate-400">Baseline Soil pH</div>
                  <div className="font-bold text-purple-400 mt-0.5">{resolved.baseline_ph}</div>
                </div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg text-xs">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Biodiversity Vulnerability Status:</div>
                <p className="text-slate-300 mt-0.5">{resolved.biodiversity_vulnerability}</p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-xl p-12 text-center text-slate-500 space-y-2">
              <Compass className="w-8 h-8 mx-auto text-slate-600" />
              <div className="text-sm font-semibold text-slate-400">No Spatial Coordinates Calibrated Yet</div>
              <p className="text-xs">Click "Resolve Spatial Context" or pick a location preset to calibrate baseline biomes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
