// Environmental Metrics Taxonomy & Scientific Thresholds

export const METRIC_DEFINITIONS = {
  // Soil Biogeochemistry
  soil_organic_carbon: {
    key: 'soil_organic_carbon',
    label: 'Soil Organic Carbon (SOC)',
    unit: '%',
    critical_low: 0.5,
    suboptimal: 1.2,
    optimal_min: 2.0,
    optimal_max: 5.0,
    description: 'Master indicator of soil structural stability, microbial energy supply, and water holding capacity.',
    category: 'soil'
  },
  soil_ph: {
    key: 'soil_ph',
    label: 'Soil Reaction (pH)',
    unit: 'pH units',
    critical_low: 5.0,
    optimal_min: 6.2,
    optimal_max: 7.2,
    critical_high: 8.5,
    description: 'Controls nutrient bioavailability, aluminum toxicity thresholds, and microbial nodulation.',
    category: 'soil'
  },
  bulk_density: {
    key: 'bulk_density',
    label: 'Soil Bulk Density',
    unit: 'g/cm³',
    optimal_max: 1.25,
    suboptimal: 1.45,
    critical_high: 1.60,
    description: 'Degree of soil compaction; values >1.45 g/cm³ restrict root elongation and water percolation.',
    category: 'soil'
  },
  soil_salinity_ece: {
    key: 'soil_salinity_ece',
    label: 'Electrical Conductivity (ECe)',
    unit: 'dS/m',
    optimal_max: 2.0,
    suboptimal: 4.0,
    critical_high: 8.0,
    description: 'Soluble salt concentration causing osmotic drought stress and clay dispersion.',
    category: 'soil'
  },
  cation_exchange_capacity: {
    key: 'cation_exchange_capacity',
    label: 'Cation Exchange Capacity (CEC)',
    unit: 'cmol(+)/kg',
    critical_low: 8.0,
    suboptimal: 15.0,
    optimal_min: 20.0,
    description: 'Soil ability to hold essential cations (Ca²⁺, Mg²⁺, K⁺) against leaching.',
    category: 'soil'
  },
  microbial_biomass_carbon: {
    key: 'microbial_biomass_carbon',
    label: 'Microbial Biomass Carbon (MBC)',
    unit: 'mg C/kg soil',
    critical_low: 100,
    suboptimal: 250,
    optimal_min: 400,
    description: 'Living belowground microbial engine driving organic matter mineralization and glomalin synthesis.',
    category: 'soil'
  },

  // Climate & Hydrology
  annual_rainfall: {
    key: 'annual_rainfall',
    label: 'Mean Annual Precipitation (MAP)',
    unit: 'mm/year',
    semi_arid_max: 550,
    subhumid_max: 1000,
    humid_min: 1000,
    description: 'Gross annual water input driving hydrological recharge and vegetation productivity.',
    category: 'climate'
  },
  aridity_index: {
    key: 'aridity_index',
    label: 'UNEP Aridity Index (P/PET)',
    unit: 'ratio',
    hyper_arid: 0.05,
    arid: 0.20,
    semi_arid: 0.50,
    dry_subhumid: 0.65,
    description: 'Precipitation to Potential Evapotranspiration ratio indicating atmospheric water deficit.',
    category: 'climate'
  },
  soil_water_holding_capacity: {
    key: 'soil_water_holding_capacity',
    label: 'Plant-Available Water Capacity (AWHC)',
    unit: 'mm water / 100cm soil',
    critical_low: 60,
    suboptimal: 120,
    optimal_min: 180,
    description: 'Volumetric soil moisture held between field capacity (-33 kPa) and permanent wilting point (-1500 kPa).',
    category: 'climate'
  },

  // Land Use & Disturbance
  tillage_intensity: {
    key: 'tillage_intensity',
    label: 'Tillage Disturbance Regime',
    levels: ['no-till', 'reduced-till', 'strip-till', 'conventional-inversion-tillage'],
    description: 'Physical shear disturbance disrupting fungal hyphal networks and accelerating SOC oxidation.',
    category: 'land_use'
  },
  crop_rotation_diversity: {
    key: 'crop_rotation_diversity',
    label: 'Crop Diversity Index',
    levels: ['monoculture', '2-crop-rotation', '3-crop-rotation', 'polyculture-intercropping', 'multi-strata-agroforestry'],
    description: 'Temporal and spatial crop heterogeneity supporting functional rhizosphere niches.',
    category: 'land_use'
  },
  chemical_input_intensity: {
    key: 'chemical_input_intensity',
    label: 'Agrochemical Pressure',
    levels: ['organic-regenerative', 'low-input-ipm', 'moderate-synthetic', 'high-intensity-synthetic'],
    description: 'Synthetic nitrogen, herbicide, and insecticide loading impacting soil biology and non-target fauna.',
    category: 'land_use'
  },
  habitat_fragmentation: {
    key: 'habitat_fragmentation',
    label: 'Landscape Fragmentation',
    levels: ['contiguous-natural', 'permeable-agroforestry-matrix', 'moderately-fragmented', 'highly-isolated-monoculture'],
    description: 'Spatial continuity of natural habitat patches, hedgerows, and field margins.',
    category: 'landscape'
  },

  // Biodiversity Indicators
  shannon_diversity_index: {
    key: 'shannon_diversity_index',
    label: "Shannon-Wiener Diversity Index (H')",
    unit: 'index',
    critical_low: 0.8,
    suboptimal: 1.5,
    optimal_min: 2.5,
    description: 'Composite metric of species richness and evenness across flora and fauna.',
    category: 'biodiversity'
  },
  pollinator_richness: {
    key: 'pollinator_richness',
    label: 'Wild Pollinator Density & Richness',
    unit: 'wild bees / 100 flowers / 10 min',
    critical_low: 2.0,
    suboptimal: 6.0,
    optimal_min: 12.0,
    description: 'Abundance of solitary wild bees (Apoidea) and syrphid hoverflies providing pollination services.',
    category: 'biodiversity'
  },
  earthworm_density: {
    key: 'earthworm_density',
    label: 'Earthworm Abundance (Lumbricidae)',
    unit: 'individuals / m²',
    critical_low: 20,
    suboptimal: 80,
    optimal_min: 200,
    description: 'Ecosystem engineers creating macro-biopores, cast aggregates, and accelerating nutrient mineralization.',
    category: 'biodiversity'
  },
  fungal_to_bacterial_ratio: {
    key: 'fungal_to_bacterial_ratio',
    label: 'Fungal-to-Bacterial Biomass Ratio (F:B)',
    unit: 'ratio',
    critical_low: 0.15,
    suboptimal: 0.40,
    optimal_min: 0.80,
    description: 'Indicator of mature, conservative soil nutrient cycling versus leaky bacterial systems.',
    category: 'biodiversity'
  }
};
