// Stateful Multi-Turn Conversational Memory & Variable Tracker

export class EcoSessionMemory {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.turns = [];
    this.accumulatedState = {
      // Soil attributes
      soil_organic_carbon: undefined,
      soil_ph: undefined,
      bulk_density: undefined,
      soil_salinity_ece: undefined,
      soil_texture: undefined,
      
      // Climate & Hydrology
      annual_rainfall: undefined,
      rainfall: undefined,
      aridity_index: undefined,
      region: undefined,
      
      // Land Use & Disturbance
      crop: undefined,
      crop_rotation_diversity: undefined,
      tillage: undefined,
      tillage_intensity: undefined,
      chemical_input_intensity: undefined,
      habitat_fragmentation: undefined,
      
      // Biodiversity
      shannon_diversity_index: undefined,
      pollinator_richness: undefined,
      earthworm_density: undefined,
      
      // Spatial
      coordinates: undefined,
      ecoregion: undefined
    };
    this.lastDiagnosis = null;
    this.createdAt = new Date().toISOString();
  }

  /**
   * Extracts environmental variables from natural language text using flexible regexes and domain entity rules.
   */
  extractVariablesFromText(text) {
    if (!text || typeof text !== 'string') return {};
    const extracted = {};
    const lower = text.toLowerCase();

    // 1. Soil Organic Carbon (SOC)
    // Matches: "0.3% soc", "soc: 0.3%", "soil organic carbon is 0.3%", "carbon is 0.3%", "organic carbon of 0.4%"
    const socMatch = lower.match(/(?:soc|soil organic carbon|organic carbon|carbon)[\s:=isofaroundapprox]+([0-9]+(?:\.[0-9]+)?)\s*%?/i) ||
                     lower.match(/([0-9]+(?:\.[0-9]+)?)\s*%\s*(?:soc|soil organic carbon|organic carbon|carbon)/i);
    if (socMatch) {
      extracted.soil_organic_carbon = parseFloat(socMatch[1]);
    }

    // 2. Soil pH
    // Matches: "pH 6.5", "pH: 4.8", "pH is 8.1", "soil pH of 5.5", "ph=8.1"
    const phMatch = lower.match(/(?:soil\s*)?ph[\s:=isofaroundapprox]+([0-9]+(?:\.[0-9]+)?)/i);
    if (phMatch) {
      extracted.soil_ph = parseFloat(phMatch[1]);
    }

    // 3. Rainfall / Precipitation
    // Matches: "320mm rainfall", "320 mm low rainfall", "receive 320mm", "rainfall is 400mm", "rainfall: low"
    const rainfallNumMatch = lower.match(/(?:rainfall|precipitation|receive|rain)[\s:=isofaroundapprox]+([0-9]+)\s*(?:mm)?/i) ||
                            lower.match(/([0-9]+)\s*mm\s*(?:rainfall|precipitation|annual|low|rain)?/i);
    if (rainfallNumMatch) {
      extracted.annual_rainfall = parseInt(rainfallNumMatch[1], 10);
      extracted.rainfall = `${rainfallNumMatch[1]} mm/year`;
    } else if (lower.includes('low rainfall') || lower.includes('semi-arid') || lower.includes('arid')) {
      extracted.rainfall = 'low (<400 mm/year)';
      extracted.region = 'semi-arid';
    } else if (lower.includes('high rainfall') || lower.includes('tropical')) {
      extracted.rainfall = 'high (>1200 mm/year)';
    }

    // 4. Crop & Land Use
    if (lower.includes('monoculture wheat') || (lower.includes('wheat') && lower.includes('monoculture'))) {
      extracted.crop = 'monoculture wheat';
      extracted.crop_rotation_diversity = 'monoculture';
    } else if (lower.includes('monoculture olive') || lower.includes('olive orchard')) {
      extracted.crop = 'monoculture olive orchard';
      extracted.crop_rotation_diversity = 'monoculture';
    } else if (lower.includes('rice-wheat') || lower.includes('paddy wheat')) {
      extracted.crop = 'intensive rice-wheat cereal rotation';
      extracted.crop_rotation_diversity = '2-crop-rotation';
    } else if (lower.includes('corn-soy') || lower.includes('maize-soybean')) {
      extracted.crop = 'corn-soybean rotation';
      extracted.crop_rotation_diversity = '2-crop-rotation';
    } else if (lower.includes('pasture') || lower.includes('grazing')) {
      extracted.crop = 'pasture / grazing land';
    } else if (lower.includes('coffee')) {
      extracted.crop = 'coffee plantation';
    } else if (lower.includes('wheat')) {
      extracted.crop = 'monoculture wheat';
      extracted.crop_rotation_diversity = 'monoculture';
    }

    // 5. Tillage
    if (lower.includes('conventional tillage') || lower.includes('inversion plowing') || lower.includes('plow') || lower.includes('tilled')) {
      extracted.tillage = 'conventional-inversion-tillage';
      extracted.tillage_intensity = 'conventional-inversion-tillage';
    } else if (lower.includes('no-till') || lower.includes('zero till')) {
      extracted.tillage = 'no-till';
      extracted.tillage_intensity = 'no-till';
    }

    // 6. Region
    if (lower.includes('semi-arid') || lower.includes('semi arid')) {
      extracted.region = 'semi-arid';
    } else if (lower.includes('mediterranean')) {
      extracted.region = 'mediterranean';
    } else if (lower.includes('tropical')) {
      extracted.region = 'tropical';
    }

    // 7. Salinity / ECe
    const ecMatch = lower.match(/(?:ec|ece|electrical conductivity)[\s:=isofaroundapprox]+([0-9]+(?:\.[0-9]+)?)\s*(?:ds\/m)?/i);
    if (ecMatch) {
      extracted.soil_salinity_ece = parseFloat(ecMatch[1]);
    }

    return extracted;
  }

  /**
   * Updates state with new structured or extracted data.
   */
  updateState(incomingData) {
    if (!incomingData || typeof incomingData !== 'object') return;

    for (const [key, value] of Object.entries(incomingData)) {
      if (value !== undefined && value !== null && value !== '') {
        this.accumulatedState[key] = value;
      }
    }
  }

  addTurn(userMessage, systemResponse, structuredInput = null) {
    const extracted = this.extractVariablesFromText(userMessage);
    this.updateState(extracted);
    if (structuredInput) {
      this.updateState(structuredInput);
    }

    this.turns.push({
      turnIndex: this.turns.length + 1,
      timestamp: new Date().toISOString(),
      userMessage,
      extractedVariables: extracted,
      accumulatedStateSnapshot: { ...this.accumulatedState },
      systemResponse
    });
  }

  getState() {
    return { ...this.accumulatedState };
  }

  getKnownVariableCount() {
    return Object.values(this.accumulatedState).filter(v => v !== undefined && v !== null && v !== '').length;
  }
}

// In-Memory Session Store
class SessionStore {
  constructor() {
    this.sessions = new Map();
  }

  getSession(sessionId = 'default-session') {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, new EcoSessionMemory(sessionId));
    }
    return this.sessions.get(sessionId);
  }

  resetSession(sessionId = 'default-session') {
    this.sessions.set(sessionId, new EcoSessionMemory(sessionId));
    return this.sessions.get(sessionId);
  }
}

export const sessionStoreInstance = new SessionStore();
