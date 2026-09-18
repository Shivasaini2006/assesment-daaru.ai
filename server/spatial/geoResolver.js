// Geo-Spatial Context & Biome Resolution Engine
// Resolves Latitude / Longitude or Regional Names to Köppen-Geiger climate zones, WWF ecoregions, baseline soil orders, and hydrological regimes.

const GLOBAL_ECOREGIONS = [
  {
    name: 'Thar Desert & Semi-Arid Northwestern Plains (Rajasthan, India)',
    bounds: { minLat: 24.0, maxLat: 30.0, minLon: 70.0, maxLon: 77.0 },
    koppen: 'BWh / BSh (Hot Arid / Semi-Arid Steppe)',
    biome: 'Deserts & Xeric Shrublands / Tropical Dry Forest',
    mean_annual_rainfall_mm: 310,
    mean_temperature_c: 27.5,
    dominant_soil_order: 'Aridisols / Entisols (Sandy Arenosols with low organic carbon)',
    baseline_soc_pct: 0.25,
    baseline_ph: 8.2,
    biodiversity_vulnerability: 'HIGH (Prone to desertification, loss of native Acacia nilotica, Prosopis cineraria)'
  },
  {
    name: 'Indo-Gangetic Alluvial Agricultural Basin (Punjab / Haryana / UP)',
    bounds: { minLat: 25.0, maxLat: 32.0, minLon: 74.0, maxLon: 88.0 },
    koppen: 'Cwa / BSh (Monsoon-influenced Humid Subtropical / Semi-Arid)',
    biome: 'Terai-Duar Savannas & Indo-Gangetic Alluvium',
    mean_annual_rainfall_mm: 680,
    mean_temperature_c: 24.8,
    dominant_soil_order: 'Inceptisols / Entisols (Alluvial silt-loam with severe sodicity/salinity patches)',
    baseline_soc_pct: 0.45,
    baseline_ph: 7.9,
    biodiversity_vulnerability: 'CRITICAL (Intensive rice-wheat rotation, groundwater depletion, pesticide saturation)'
  },
  {
    name: 'Mediterranean Basin Olive & Vineyard Matrix (Andalusia, Spain)',
    bounds: { minLat: 36.0, maxLat: 44.0, minLon: -9.0, maxLon: 3.0 },
    koppen: 'Csa (Hot-summer Mediterranean)',
    biome: 'Mediterranean Forests, Woodlands & Scrub',
    mean_annual_rainfall_mm: 480,
    mean_temperature_c: 18.2,
    dominant_soil_order: 'Alfisol / Calcisols (Calcareous stony clay-loam, severe erosion risk)',
    baseline_soc_pct: 0.65,
    baseline_ph: 7.6,
    biodiversity_vulnerability: 'HIGH (Bare inter-row tillage, wild bee and bird decline)'
  },
  {
    name: 'North American Great Plains (Kansas / Nebraska, USA)',
    bounds: { minLat: 36.0, maxLat: 43.0, minLon: -102.0, maxLon: -95.0 },
    koppen: 'BSk / Dfa (Cold Semi-Arid / Humid Continental)',
    biome: 'Temperate Grasslands, Savannas & Shrublands',
    mean_annual_rainfall_mm: 520,
    mean_temperature_c: 12.5,
    dominant_soil_order: 'Mollisols (Deep prairie soils, degraded under continuous cereal monocrop)',
    baseline_soc_pct: 1.10,
    baseline_ph: 6.8,
    biodiversity_vulnerability: 'MODERATE_TO_HIGH (Loss of native prairie pollinators, high herbicide load)'
  },
  {
    name: 'Sub-Saharan Sahelian Transition Zone (Burkina Faso / Niger / Mali)',
    bounds: { minLat: 11.0, maxLat: 18.0, minLon: -5.0, maxLon: 15.0 },
    koppen: 'BSh (Semi-Arid Hot Sahelian Steppe)',
    biome: 'Sahelian Acacia Savanna',
    mean_annual_rainfall_mm: 390,
    mean_temperature_c: 29.2,
    dominant_soil_order: 'Arenosols / Lixisols (Highly weathered, low CEC, extreme crusting)',
    baseline_soc_pct: 0.20,
    baseline_ph: 6.2,
    biodiversity_vulnerability: 'CRITICAL (Wind erosion, loss of Faidherbia parklands, severe drought)'
  },
  {
    name: 'Brazilian Cerrado / Amazon Agricultural Fringe (Mato Grosso, Brazil)',
    bounds: { minLat: -16.0, maxLat: -8.0, minLon: -60.0, maxLon: -50.0 },
    koppen: 'Aw (Tropical Savanna with wet/dry season)',
    biome: 'Cerrado Savanna / Amazon Transition',
    mean_annual_rainfall_mm: 1450,
    mean_temperature_c: 26.0,
    dominant_soil_order: 'Oxisols / Ferralsols (Highly weathered acidic red clay, high Al toxicity)',
    baseline_soc_pct: 1.40,
    baseline_ph: 4.8,
    biodiversity_vulnerability: 'EXTREME (Deforestation edge effects, severe landscape fragmentation)'
  }
];

export class GeoSpatialResolver {
  /**
   * Resolves latitude and longitude coordinates into environmental baseline context.
   * @param {number} lat - Latitude in degrees
   * @param {number} lon - Longitude in degrees
   * @returns {Object} - Spatial environmental baseline
   */
  static resolveCoordinates(lat, lon) {
    if (typeof lat !== 'number' || typeof lon !== 'number') {
      return null;
    }

    const matchedRegion = GLOBAL_ECOREGIONS.find(region => 
      lat >= region.bounds.minLat && lat <= region.bounds.maxLat &&
      lon >= region.bounds.minLon && lon <= region.bounds.maxLon
    );

    if (matchedRegion) {
      return {
        matched: true,
        region_name: matchedRegion.name,
        koppen_climate: matchedRegion.koppen,
        wwf_biome: matchedRegion.biome,
        mean_annual_precipitation_mm: matchedRegion.mean_annual_rainfall_mm,
        mean_temperature_c: matchedRegion.mean_temperature_c,
        dominant_soil_order: matchedRegion.dominant_soil_order,
        baseline_soc_pct: matchedRegion.baseline_soc_pct,
        baseline_ph: matchedRegion.baseline_ph,
        biodiversity_vulnerability: matchedRegion.biodiversity_vulnerability,
        spatial_coordinates: { latitude: lat, longitude: lon }
      };
    }

    // Heuristic fallback for arbitrary global coordinates
    const isTropical = Math.abs(lat) < 23.5;
    const isAridBand = (Math.abs(lat) >= 15 && Math.abs(lat) <= 35);
    
    return {
      matched: false,
      region_name: `Global Coordinate Point (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
      koppen_climate: isAridBand ? 'BSh / BWh (Subtropical Arid/Semi-Arid)' : isTropical ? 'Aw / Af (Tropical)' : 'Cfb / Dfb (Temperate)',
      wwf_biome: isAridBand ? 'Xeric Shrubland / Dry Grassland' : isTropical ? 'Tropical Seasonal Agro-Ecosystem' : 'Temperate Agricultural Mosaic',
      mean_annual_precipitation_mm: isAridBand ? 420 : 850,
      mean_temperature_c: isTropical ? 26.5 : 16.0,
      dominant_soil_order: 'Inceptisols / Alfisols',
      baseline_soc_pct: 0.85,
      baseline_ph: 6.5,
      biodiversity_vulnerability: 'MODERATE',
      spatial_coordinates: { latitude: lat, longitude: lon }
    };
  }

  static getPresetRegions() {
    return GLOBAL_ECOREGIONS;
  }
}
