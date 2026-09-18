// Causal Ecological Dependency Graph & Feedback Loops

export const CAUSAL_EDGES = [
  // Tillage impacts
  { from: 'tillage_intensity', to: 'soil_organic_carbon', polarity: -1, weight: 0.85, mechanism: 'Physical disruption exposes protected micro-aggregates to rapid microbial oxidation.' },
  { from: 'tillage_intensity', to: 'fungal_to_bacterial_ratio', polarity: -1, weight: 0.90, mechanism: 'Mechanical shearing severs mycorrhizal hyphal networks (Glomeromycota).' },
  { from: 'tillage_intensity', to: 'earthworm_density', polarity: -1, weight: 0.80, mechanism: 'Direct physical trauma and destruction of vertical permanent burrows.' },
  { from: 'tillage_intensity', to: 'bulk_density', polarity: 1, weight: 0.65, mechanism: 'Subsurface compaction layer (plow pan) forms at working depth.' },

  // Soil Organic Carbon feedbacks
  { from: 'soil_organic_carbon', to: 'soil_water_holding_capacity', polarity: 1, weight: 0.95, mechanism: 'Humified organic matter acts as a colloidal sponge, increasing micro-pore water retention (Lal 2004).' },
  { from: 'soil_organic_carbon', to: 'microbial_biomass_carbon', polarity: 1, weight: 0.90, mechanism: 'Provides primary heterotrophic energy and carbon substrate for rhizosphere food webs.' },
  { from: 'soil_organic_carbon', to: 'bulk_density', polarity: -1, weight: 0.75, mechanism: 'Low-density organic matter dilutes mineral matrix and promotes granular aggregation.' },
  { from: 'soil_organic_carbon', to: 'cation_exchange_capacity', polarity: 1, weight: 0.85, mechanism: 'Carboxylic and phenolic functional groups provide high pH-dependent cation exchange sites.' },

  // Climate & Hydrology interactions
  { from: 'annual_rainfall', to: 'soil_water_holding_capacity', polarity: 1, weight: 0.70, mechanism: 'Gross water recharge governs seasonal soil moisture storage.' },
  { from: 'aridity_index', to: 'microbial_biomass_carbon', polarity: 1, weight: 0.75, mechanism: 'High atmospheric vapor pressure deficit dehydrates topsoil microbes.' },
  { from: 'soil_water_holding_capacity', to: 'shannon_diversity_index', polarity: 1, weight: 0.80, mechanism: 'Sustained plant hydration supports extended flowering phenology and flora richness.' },

  // Crop Diversity & Landscape
  { from: 'crop_rotation_diversity', to: 'shannon_diversity_index', polarity: 1, weight: 0.85, mechanism: 'Multi-species root exudate diversity drives niche differentiation in soil and canopy organisms.' },
  { from: 'crop_rotation_diversity', to: 'pollinator_richness', polarity: 1, weight: 0.80, mechanism: 'Provides temporal continuity of pollen and nectar resources across seasons.' },
  { from: 'crop_rotation_diversity', to: 'fungal_to_bacterial_ratio', polarity: 1, weight: 0.75, mechanism: 'Perennial and woody hosts supply resistant lignin substrates fueling saprophytic fungi.' },
  { from: 'habitat_fragmentation', to: 'pollinator_richness', polarity: -1, weight: 0.85, mechanism: 'Physical distance exceeds maximum foraging radius of small wild solitary bees (<250m).' },

  // Chemical & pH feedbacks
  { from: 'chemical_input_intensity', to: 'soil_ph', polarity: -1, weight: 0.70, mechanism: 'Nitrification of synthetic ammonium fertilizers releases 2 protons (H+) per mole.' },
  { from: 'chemical_input_intensity', to: 'microbial_biomass_carbon', polarity: -1, weight: 0.75, mechanism: 'Osmotic shock from soluble salts and direct pesticide biocidal suppression.' },
  { from: 'soil_ph', to: 'microbial_biomass_carbon', polarity: 1, weight: 0.80, mechanism: 'Extreme pH (<5.2 or >8.5) denatures microbial enzymes and induces Al³⁺ toxicity.' },

  // Earthworms & Microbes to Soil Quality
  { from: 'earthworm_density', to: 'soil_water_holding_capacity', polarity: 1, weight: 0.70, mechanism: 'Earthworm macropores accelerate gravitational infiltration rate 3-fold.' },
  { from: 'fungal_to_bacterial_ratio', to: 'soil_organic_carbon', polarity: 1, weight: 0.80, mechanism: 'Fungal melanin and chitin produce recalcitrant humic aggregates with multi-decadal stability.' }
];

export class EcologicalCausalGraph {
  constructor() {
    this.edges = CAUSAL_EDGES;
    this.nodes = new Set();
    this.adjacency = new Map();

    this.edges.forEach(edge => {
      this.nodes.add(edge.from);
      this.nodes.add(edge.to);
      if (!this.adjacency.has(edge.from)) {
        this.adjacency.set(edge.from, []);
      }
      this.adjacency.get(edge.from).push(edge);
    });
  }

  getDownstreamImpacts(sourceNodes) {
    const impacts = [];
    const visited = new Set();

    const traverse = (node, currentPath, accumulatedPolarity, accumulatedWeight) => {
      const outgoing = this.adjacency.get(node) || [];
      for (const edge of outgoing) {
        const nextPolarity = accumulatedPolarity * edge.polarity;
        const nextWeight = accumulatedWeight * edge.weight;
        const pathKey = `${node}->${edge.to}`;

        impacts.push({
          from: edge.from,
          to: edge.to,
          path: [...currentPath, edge.to],
          netDirection: nextPolarity > 0 ? 'INCREASE' : 'DECREASE',
          strength: parseFloat(nextWeight.toFixed(3)),
          mechanism: edge.mechanism
        });

        if (!currentPath.includes(edge.to) && currentPath.length < 3) {
          traverse(edge.to, [...currentPath, edge.to], nextPolarity, nextWeight);
        }
      }
    };

    sourceNodes.forEach(node => {
      traverse(node, [node], 1, 1.0);
    });

    return impacts;
  }

  getGraphStructure() {
    return {
      nodes: Array.from(this.nodes),
      edges: this.edges
    };
  }
}

export const causalGraphInstance = new EcologicalCausalGraph();
