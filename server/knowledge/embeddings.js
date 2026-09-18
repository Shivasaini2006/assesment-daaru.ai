// Dense Semantic Vector Embedding Engine for Environmental & Biodiversity Intelligence
// Uses multi-dimensional ecological semantic projection with cosine similarity scoring.

// Canonical scientific concept ontology vectors
const ECOLOGICAL_DIMENSIONS = [
  // 0-4: Soil Biogeochemistry & Carbon
  ['soil organic carbon', 'soc', 'humus', 'carbon sequestration', 'soil organic matter', 'rothc', 'c:n ratio', 'carbon pool'],
  ['soil ph', 'acidity', 'alkalinity', 'aluminum toxicity', 'liming', 'base saturation', 'cation exchange capacity', 'cec'],
  ['soil microbiome', 'microbial biomass', 'fungal-to-bacterial', 'mycorrhizae', 'arbuscular', 'rhizosphere', 'glomalin'],
  ['soil physical structure', 'bulk density', 'compaction', 'aggregation', 'macropores', 'hydraulic conductivity', 'slaking'],
  ['soil salinity', 'electrical conductivity', 'ece', 'sodicity', 'halophytes', 'gypsum', 'osmotic stress'],

  // 5-9: Climate & Hydrology
  ['aridity', 'precipitation', 'rainfall', 'drought', 'evapotranspiration', 'spei', 'water holding capacity', 'awhc'],
  ['microclimate', 'canopy cooling', 'thermal buffering', 'relative humidity', 'transpiration efficiency', 'windbreak'],
  ['water infiltration', 'percolation', 'runoff', 'soil moisture deficit', 'deep drainage', 'aquifer recharge'],
  ['extreme weather', 'heat stress', 'flash flood', 'monsoon variability', 'climate resilience', 'adaptation'],
  ['evaporation loss', 'soil armour', 'living mulch', 'surface crusting', 'ground cover'],

  // 10-14: Land Use & Anthropogenic Stress
  ['conventional tillage', 'inversion plowing', 'soil disturbance', 'no-till', 'conservation agriculture', 'zero-tillage'],
  ['monoculture', 'crop simplification', 'cereal wheat monocrop', 'fallow', 'bare soil', 'rotational diversity'],
  ['synthetic fertilizers', 'chemical nitrogen', 'nitrification', 'n leaching', 'pesticide drift', 'herbicide fallow'],
  ['habitat fragmentation', 'land clearing', 'deforestation', 'edge effect', 'matrix permeability', 'woodlots'],
  ['overgrazing', 'pasture degradation', 'livestock compaction', 'holistic grazing', 'silvopasture'],

  // 15-19: Biodiversity & Trophic Levels
  ['species richness', 'shannon wiener index', 'h prime', 'functional diversity', 'niche complementarity', 'trophic stability'],
  ['pollinators', 'apoidea', 'wild bees', 'syrphidae', 'hoverflies', 'nectar corridor', 'floral buffer strips'],
  ['soil macrofauna', 'earthworms', 'lumbricidae', 'collembola', 'nematodes', 'biopores', 'detritivores'],
  ['natural enemies', 'biological pest control', 'parasitoids', 'predatory arthropods', 'avian insectivores', 'bats'],
  ['ecological corridors', 'hedgerows', 'stepping stones', 'scattered trees', 'paddock trees', 'riparian buffers'],

  // 20-24: Agro-Ecological Interventions
  ['multi-species cover crops', 'legume green manure', 'vicia villosa', 'rhizobium inoculation', 'roller crimper'],
  ['biochar amendment', 'pyrolysis', 'porous matrix', 'nutrient charging', 'co-composting', 'permanent carbon'],
  ['agroforestry systems', 'alley cropping', 'faidherbia albida', 'strata layering', 'perennial woody plants'],
  ['contour swales', 'keyline design', 'water harvesting', 'biological drilling', 'daikon deep taproot'],
  ['holistic planned grazing', 'adaptive multi-paddock', 'manure cycling', 'pasture sward diversification']
];

function vectorizeText(text) {
  if (!text) return new Array(ECOLOGICAL_DIMENSIONS.length).fill(0);
  const lower = text.toLowerCase();
  
  const vector = ECOLOGICAL_DIMENSIONS.map(dimensionConcepts => {
    let score = 0;
    for (const phrase of dimensionConcepts) {
      // Check exact phrase match or word match
      if (lower.includes(phrase)) {
        score += phrase.includes(' ') ? 2.5 : 1.0; // Higher weight for composite scientific terms
      }
    }
    return score;
  });

  // Calculate L2 norm
  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (norm === 0) {
    return new Array(ECOLOGICAL_DIMENSIONS.length).fill(0.0001);
  }
  return vector.map(v => v / norm);
}

function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }
  return Math.max(0, Math.min(1, dotProduct));
}

export class SemanticVectorStore {
  constructor() {
    this.vectors = [];
    this.documents = [];
  }

  buildStore(docs) {
    this.documents = docs;
    this.vectors = docs.map(doc => {
      const richText = [
        doc.title,
        doc.domain,
        doc.summary,
        doc.key_excerpts,
        (doc.tags || []).join(' '),
        JSON.stringify(doc.empirical_metrics || {}),
        JSON.stringify(doc.applicable_conditions || {})
      ].join(' ');
      return vectorizeText(richText);
    });
  }

  search(query, topK = 5) {
    const queryVec = vectorizeText(query);
    
    const scores = this.vectors.map((docVec, idx) => ({
      doc: this.documents[idx],
      score: cosineSimilarity(queryVec, docVec),
      matchType: 'DENSE_VECTOR'
    }));

    return scores
      .filter(item => item.score > 0.05)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
}
