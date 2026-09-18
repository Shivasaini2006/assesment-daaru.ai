// Comprehensive Agro-Ecological Intervention Protocols

export const INTERVENTIONS = [
  {
    id: 'multi-species-cover-crop-mycorrhizal',
    title: 'Multi-Species Cover Crop Polyculture with Arbuscular Mycorrhizal (AMF) Inoculation',
    category: 'Soil Regeneration & Biological Nitrogen Fixation',
    suitability: {
      min_soc: 0.1,
      max_soc: 2.0,
      tillage_triggers: ['conventional-inversion-tillage', 'reduced-till'],
      cropping_triggers: ['monoculture', '2-crop-rotation']
    },
    protocol: {
      cocktail_composition: [
        { species: 'Vicia villosa (Hairy Vetch)', function: 'Rhizobium-mediated N-fixation (80-120 kg N/ha), low C:N ratio biomass' },
        { species: 'Secale cereale (Cereal Rye)', function: 'High fibrous root density, allelopathic weed suppression, stable humic precursor' },
        { species: 'Raphanus sativus var. longipinnatus (Daikon Radish)', function: 'Biological subsoil drilling, taproots break plow pans down to 1.5m' },
        { species: 'Trifolium incarnatum (Crimson Clover)', function: 'Early spring nectar source for wild bees, superficial root mat' }
      ],
      inoculant: 'Rhizophagus irregularis + Glomus mosseae (5,000 spores/m² at seeding)',
      termination_method: 'Roller-crimping at 50% bloom to create continuous 8-10 cm protective mulch armor without herbicide.',
      seeding_rate: '35-45 kg/ha diverse seed blend'
    },
    scientific_mechanism: 'Living root exudation stimulates microbial biomass carbon (MBC). Termination via roller-crimper lays an organic armor that shields soil from solar radiation (reducing topsoil temps by 4-6°C), slows evaporation, and supplies balanced C:N biomass that builds the stable humic (HUM) pool without inducing nitrogen starvation.',
    impacted_metrics: [
      { metric: 'soil_organic_carbon', delta: '+0.25 to +0.45% in 24 months', confidence: 0.92 },
      { metric: 'soil_water_holding_capacity', delta: '+18-26%', confidence: 0.90 },
      { metric: 'earthworm_density', delta: '+150-240%', confidence: 0.88 },
      { metric: 'bulk_density', delta: '-0.12 to -0.18 g/cm³', confidence: 0.85 }
    ],
    time_horizon: 'Short to Medium Term (12-36 months)',
    primary_citation: 'FAO Soils Bulletin 44 (2021) & Lal (Science 2004)'
  },
  {
    id: 'biochar-pyrolysis-co-composting',
    title: 'Co-Composted Quenched Biochar Amendment (Pyrolyzed Hardwood/Residue)',
    category: 'Permanent Carbon Sequestration & Soil Physics',
    suitability: {
      max_soc: 1.5,
      aridity_triggers: ['semi-arid', 'arid'],
      texture_triggers: ['sandy', 'loam', 'degraded clay']
    },
    protocol: {
      biochar_specs: 'Pyrolyzed at 550°C, particle size 0.5 - 2.0 mm, specific surface area >300 m²/g.',
      charging_process: 'Co-composted 1:4 with active dairy/green waste compost for 21 days to saturate internal porous matrix with humic acids and beneficial inoculants.',
      application_rate: '8-12 metric tons/ha incorporated into the top 10-15 cm during transition.',
      longevity: 'Recalcitrant aromatic ring structure provides >300-year carbon permanence.'
    },
    scientific_mechanism: 'Creates immediate internal micropores (1-10 µm) that hold capillary water against gravity under high vapor pressure deficits. Surfaces oxidize over 2-3 months, acquiring carboxyl functional groups that boost Cation Exchange Capacity (CEC) and provide physical habitat refuges shielding mycorrhizae and protozoa from dehydration.',
    impacted_metrics: [
      { metric: 'soil_water_holding_capacity', delta: '+20-32%', confidence: 0.94 },
      { metric: 'cation_exchange_capacity', delta: '+4.0 to +7.5 cmol(+)/kg', confidence: 0.91 },
      { metric: 'soil_organic_carbon', delta: '+0.40 to +0.70% permanent carbon', confidence: 0.96 },
      { metric: 'microbial_biomass_carbon', delta: '+35-50%', confidence: 0.87 }
    ],
    time_horizon: 'Immediate to Medium Term (Immediate water boost, permanent carbon storage)',
    primary_citation: 'Lehmann & Joseph (Biochar for Environmental Management, 2015)'
  },
  {
    id: 'stratified-alley-agroforestry',
    title: 'Stratified Alley Cropping & Multi-Strata Agroforestry Windbreaks',
    category: 'Landscape Ecology & Microclimatic Buffering',
    suitability: {
      rainfall_triggers: ['low', 'semi-arid', 'subhumid'],
      landscape_triggers: ['monoculture', 'fragmented', 'wind-erosion-prone']
    },
    protocol: {
      canopy_strata: [
        { tier: 'Upper Canopy (Deep Nitrogen Fixing Trees)', species: 'Faidherbia albida (reverse phenology) or Albizia lebbeck, spaced at 10m x 10m' },
        { tier: 'Intermediate Shrub Layer (Floral Corridors)', species: 'Cajanus cajan (Pigeonpea), Caragana arborescens, or native Crataegus' },
        { tier: 'Ground Herbaceous Strip', species: 'Perennial pollinator mix (Echinacea, Foeniculum vulgare, Medicago)' }
      ],
      alley_width: '18-24 meters between tree rows, oriented perpendicular to prevailing erosive winds.',
      root_management: 'Tree roots perform hydraulic lift at night, drawing subsoil moisture to the active rooting zone.'
    },
    scientific_mechanism: 'Multi-tiered canopy architecture dampens turbulent wind velocity by 60-80%, reducing evapotranspiration rates by 22-30% in adjacent crop alleys. Deep tree roots intercept leaching nitrates and cycle calcium/potassium to surface litter. Reconnects fragmented landscape patches, enabling gene flow for native insectivores and wild Apoidea.',
    impacted_metrics: [
      { metric: 'shannon_diversity_index', delta: "+0.8 to +1.4 units (H' jumps from 1.1 to 2.3+)", confidence: 0.93 },
      { metric: 'pollinator_richness', delta: '+70-110%', confidence: 0.91 },
      { metric: 'microclimate_cooling', delta: '2.5 to 4.2°C temperature buffer during heat peaks', confidence: 0.89 },
      { metric: 'crop_yield_resilience', delta: '+20-35% during drought years', confidence: 0.86 }
    ],
    time_horizon: 'Medium to Long Term (24-60 months)',
    primary_citation: 'IPCC AR6 WG2 Chapter 5 (2022) & Tscharntke et al. (Biol Cons 2012)'
  },
  {
    id: 'perennial-floral-corridors-hedgerows',
    title: 'Native Perennial Floral Buffer Strips & Stepping-Stone Hedgerow Matrix',
    category: 'Pollinator Restoration & Biological Pest Control',
    suitability: {
      biodiversity_triggers: ['pollinator_loss', 'low_species_richness', 'high_pesticide_pressure']
    },
    protocol: {
      strip_design: '3-5 meter wide uncultivated field margins along boundaries and waterways (representing 8-12% total land area).',
      species_guild: 'Successional flowering continuum featuring at least 12 native flowering forbs and shrubs providing pollen and nectar across all 4 seasons.',
      nesting_substrates: 'Bare soil sand patches (for ground-nesting bees) + hollow pithy stems (Sambucus, Rubus) + undisturbed tussock grasses (for bumblebee queens).'
    },
    scientific_mechanism: 'Breaks the spatial foraging barrier for wild solitary bees whose foraging radius is restricted to <250m. Boosts natural predator guilds (Carabidae beetles, parasitoid wasps, Syrphidae hoverflies) which suppress aphid and lepidopteran pest populations, lowering or eliminating the economic threshold for chemical insecticide applications.',
    impacted_metrics: [
      { metric: 'pollinator_richness', delta: '+85-140% wild bee density', confidence: 0.95 },
      { metric: 'biological_pest_suppression', delta: '+45-65% reduction in crop pest damage', confidence: 0.88 },
      { metric: 'shannon_diversity_index', delta: '+0.6 to +1.1 units', confidence: 0.90 }
    ],
    time_horizon: 'Short to Medium Term (6-18 months)',
    primary_citation: 'IPBES Global Assessment (2019) & Garibaldi et al. (Science 2016)'
  },
  {
    id: 'halophytic-biodrainage-salinity-remediation',
    title: 'Halophytic Phyto-Extraction & Calcium Replacement Remediation',
    category: 'Soil Salinity & Sodic Soil Restoration',
    suitability: {
      salinity_triggers: ['high_salinity', 'sodicity', 'ec_gt_4']
    },
    protocol: {
      bio_drainage_plants: 'Deep-rooted salt-accumulating halophytes (Sesbania bispinosa, Atriplex canescens, Melilotus siculus).',
      chemical_amendment: 'Agricultural Phosphogypsum (CaSO4·2H2O) applied at 3-5 t/ha calculated based on Exchangeable Sodium Percentage (ESP).',
      leaching_schedule: 'Surface ponding after subsoil ripping to exchange Na⁺ with Ca²⁺ and flush sodium below rhizosphere.'
    },
    scientific_mechanism: 'Ca²⁺ ions displace adsorbed Na⁺ from exchange sites on dispersed clay colloids, initiating soil flocculation. Restores soil hydraulic conductivity and structural macro-porosity. Halophytes actively pump groundwater, lowering saline water tables by 0.8-1.4m and preventing capillary salt crusting.',
    impacted_metrics: [
      { metric: 'soil_salinity_ece', delta: '-40 to -60% in upper 40 cm', confidence: 0.91 },
      { metric: 'bulk_density', delta: '-0.15 g/cm³', confidence: 0.87 },
      { metric: 'microbial_biomass_carbon', delta: '+60-95%', confidence: 0.84 }
    ],
    time_horizon: 'Medium Term (18-36 months)',
    primary_citation: 'Roux-Fouillet & Mantilla (Agric Ecosyst Environ 2017)'
  },
  {
    id: 'ph-buffering-calcification-rebalancing',
    title: 'Biological pH Buffering & Base Cation Saturation Rebalancing',
    category: 'Soil Chemistry Rebalancing',
    suitability: {
      ph_triggers: ['acidic_lt_5_5', 'alkaline_gt_8_2']
    },
    protocol: {
      acidic_protocol: 'Ultra-fine Dolomitic Limestone (CaCO3 + MgCO3) blended with humic acid extracts at 2.5 t/ha to neutralize Al³⁺ toxicity without over-liming.',
      alkaline_protocol: 'Elemental sulfur or iron sulfate incorporated with acidic compost to mobilize insoluble phosphorus and micronutrients.',
      rhizobium_boost: 'Seed inoculation with adapted acid-tolerant or alkaline-tolerant Rhizobia strains.'
    },
    scientific_mechanism: 'Neutralizing soil pH to 6.2-6.8 precipitates toxic ionic aluminum (Al³⁺ $\\to$ Al(OH)3), removing the physiological block on legume root elongation and nitrogenase enzyme synthesis. Unlocks fixed orthophosphates ($H_2PO_4^-$), dramatically stimulating root mycorrhizal symbiosis.',
    impacted_metrics: [
      { metric: 'soil_ph', delta: 'Normalized to optimal 6.4 - 6.8 range', confidence: 0.94 },
      { metric: 'microbial_biomass_carbon', delta: '+40-70%', confidence: 0.90 },
      { metric: 'shannon_diversity_index', delta: '+0.5 to +0.9 units', confidence: 0.85 }
    ],
    time_horizon: 'Short Term (3-12 months)',
    primary_citation: 'FAO Soils Bulletin 82 (2018)'
  }
];
