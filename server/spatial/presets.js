// Curated Real-World Benchmark Ecosystem Scenarios

export const PRESET_SCENARIOS = [
  {
    id: 'hackathon-example-semi-arid-wheat',
    name: '1. Semi-Arid Monoculture Wheat (Hackathon Benchmark)',
    description: 'Direct use case from hackathon challenge: low organic carbon, semi-arid rainfall, conventional tillage, cereal monoculture.',
    location: 'Jaipur Periphery / Thar Transition, Rajasthan, India',
    coordinates: { latitude: 26.9124, longitude: 75.7873 },
    data: {
      soil_organic_carbon: 0.3,
      soil_ph: 8.1,
      annual_rainfall: 320,
      rainfall: 'low (320 mm/year)',
      crop: 'monoculture wheat',
      crop_rotation_diversity: 'monoculture',
      tillage: 'conventional-inversion-tillage',
      tillage_intensity: 'conventional-inversion-tillage',
      chemical_input_intensity: 'moderate-synthetic',
      region: 'semi-arid',
      shannon_diversity_index: 0.85,
      pollinator_richness: 2.1
    },
    sample_queries: [
      "Biodiversity is declining on my land. Soil organic carbon is 0.3%, rainfall is low, and we grow monoculture wheat in a semi-arid zone.",
      "How do we restore soil biology and water retention on our semi-arid wheat field?",
      "Can we integrate agroforestry or cover crops with 320mm rainfall?"
    ]
  },
  {
    id: 'amazon-fringe-acidic-pasture',
    name: '2. Degraded Tropical Savanna Pasture (Acidic / Aluminum Toxicity)',
    description: 'High rainfall tropical fringe with severe soil acidification, aluminum toxicity, and fragmented forest canopy.',
    location: 'Mato Grosso Agricultural Fringe, Brazil',
    coordinates: { latitude: -12.5564, longitude: -55.7224 },
    data: {
      soil_organic_carbon: 0.9,
      soil_ph: 4.8,
      annual_rainfall: 1450,
      rainfall: 'high tropical seasonal (1450 mm/year)',
      crop: 'degraded brachiaria pasture',
      crop_rotation_diversity: 'monoculture',
      tillage: 'no-till (overgrazed)',
      tillage_intensity: 'no-till',
      chemical_input_intensity: 'low-input-ipm',
      region: 'tropical savanna / Cerrado',
      habitat_fragmentation: 'highly-isolated-monoculture',
      shannon_diversity_index: 0.95
    },
    sample_queries: [
      "Our pasture soil has pH 4.8 and grass growth is stalling despite 1400mm rainfall. How can we fix aluminum toxicity and bring back biodiversity?",
      "Suggest a silvopastoral system for acidic tropical soils."
    ]
  },
  {
    id: 'mediterranean-bare-olive-grove',
    name: '3. Degraded Mediterranean Bare-Tilled Olive Grove',
    description: 'Steep calcareous slope with continuous inter-row inversion tillage, severe erosion, and loss of predatory arthropods.',
    location: 'Jaén / Andalusia, Spain',
    coordinates: { latitude: 37.7796, longitude: -3.7849 },
    data: {
      soil_organic_carbon: 0.6,
      soil_ph: 7.8,
      annual_rainfall: 460,
      rainfall: 'mediterranean dry summer (460 mm/year)',
      crop: 'monoculture olive orchard',
      crop_rotation_diversity: 'monoculture',
      tillage: 'conventional-inversion-tillage',
      tillage_intensity: 'conventional-inversion-tillage',
      chemical_input_intensity: 'moderate-synthetic',
      region: 'mediterranean',
      shannon_diversity_index: 1.1,
      pollinator_richness: 3.5
    },
    sample_queries: [
      "Our olive orchard soil is bare and eroding after summer storms. Organic carbon is 0.6% and pollinators are missing.",
      "What cover crop blend works in dry Mediterranean olive groves without competing for water?"
    ]
  },
  {
    id: 'indo-gangetic-saline-sodic',
    name: '4. Indo-Gangetic Saline & Sodic Rice-Wheat Alluvium',
    description: 'High electrical conductivity, structural clay dispersion, and continuous pesticide saturation.',
    location: 'Ludhiana / Karnal Basin, India',
    coordinates: { latitude: 29.6857, longitude: 76.9905 },
    data: {
      soil_organic_carbon: 0.38,
      soil_ph: 8.7,
      soil_salinity_ece: 5.4,
      annual_rainfall: 650,
      rainfall: 'monsoon-driven (650 mm/year)',
      crop: 'intensive rice-wheat cereal rotation',
      crop_rotation_diversity: '2-crop-rotation',
      tillage: 'conventional-inversion-tillage',
      tillage_intensity: 'conventional-inversion-tillage',
      chemical_input_intensity: 'high-intensity-synthetic',
      region: 'alluvial subhumid',
      shannon_diversity_index: 0.75
    },
    sample_queries: [
      "Our soil pH is 8.7 with electrical conductivity 5.4 dS/m in a rice-wheat system. Earthworms have disappeared completely.",
      "How do we biologically remediate sodic soil and restore subterranean food webs?"
    ]
  },
  {
    id: 'midwest-corn-soy-monoculture',
    name: '5. High-Input Prairie Corn-Soybean Industrial Matrix',
    description: 'Heavily mechanized cereal-legume rotation with zero semi-natural field margins and severe monarch butterfly / wild bee loss.',
    location: 'Des Moines / Iowa Prairie Basin, USA',
    coordinates: { latitude: 41.5868, longitude: -93.6250 },
    data: {
      soil_organic_carbon: 1.35,
      soil_ph: 6.4,
      annual_rainfall: 880,
      rainfall: 'temperate continental (880 mm/year)',
      crop: 'corn-soybean 2-year rotation',
      crop_rotation_diversity: '2-crop-rotation',
      tillage: 'reduced-till',
      tillage_intensity: 'reduced-till',
      chemical_input_intensity: 'high-intensity-synthetic',
      habitat_fragmentation: 'highly-isolated-monoculture',
      shannon_diversity_index: 1.25,
      pollinator_richness: 4.2
    },
    sample_queries: [
      "We grow corn-soybean on 500 acres. We want to establish native prairie pollinator strips and reduce chemical N leaching.",
      "What is the quantitative impact of 10% prairie buffer strips on beneficial insects and soil water holding capacity?"
    ]
  },
  {
    id: 'western-ghats-shade-depleted-coffee',
    name: '6. Sun-Exposed Subtropical Coffee Plantation',
    description: 'Subtropical montane agro-ecosystem experiencing berry borer pest outbreaks due to shade tree deforestation and avian predator loss.',
    location: 'Chikkamagaluru / Western Ghats, India',
    coordinates: { latitude: 13.3153, longitude: 75.7754 },
    data: {
      soil_organic_carbon: 1.15,
      soil_ph: 5.3,
      annual_rainfall: 1850,
      rainfall: 'high monsoon (1850 mm/year)',
      crop: 'sun-exposed monoculture robusta coffee',
      crop_rotation_diversity: 'monoculture',
      tillage: 'no-till',
      tillage_intensity: 'no-till',
      chemical_input_intensity: 'moderate-synthetic',
      region: 'tropical montane',
      shannon_diversity_index: 1.35
    },
    sample_queries: [
      "Our coffee plants suffer from severe berry borer attacks since shade trees were cut down. How can multi-strata native canopy restore natural pest predators?",
      "What native canopy trees provide hydraulic lift and bird habitat in Western Ghats coffee?"
    ]
  }
];
