// Missing Environmental Variable Detector & Scientific Clarification Engine

export class ClarificationEngine {
  /**
   * Evaluates whether current environmental state has sufficient variables for deep diagnosis.
   * @param {Object} state - Accumulated environmental state
   * @param {string} userQuery - The latest user query
   * @returns {Object} - Sufficiency status, missing variables list, provisional hypothesis, and clarifying questions
   */
  static evaluateSufficiency(state, userQuery = '') {
    const missingDimensions = [];
    const clarifyingQuestions = [];
    const suggestedChips = [];

    // Check Dimension 1: Soil Health (SOC, pH, texture)
    const hasSoilData = state.soil_organic_carbon !== undefined || state.soil_ph !== undefined || state.soil_salinity_ece !== undefined;
    if (!hasSoilData) {
      missingDimensions.push({
        dimension: 'Soil Biogeochemistry',
        variables: ['soil_organic_carbon', 'soil_ph'],
        scientific_rationale: 'Soil Organic Carbon (SOC %) is the master variable governing moisture retention capacity (Lal 2004) and microbial biomass carbon (FAO 2020).'
      });
      clarifyingQuestions.push('What is your approximate **Soil Organic Carbon (SOC %)** or topsoil organic matter level (e.g., <0.5%, 1.0%, >2.0%)?');
      suggestedChips.push({ label: 'SOC: 0.3% (Degraded)', payload: { soil_organic_carbon: 0.3 } });
      suggestedChips.push({ label: 'SOC: 1.2% (Moderate)', payload: { soil_organic_carbon: 1.2 } });
    }

    // Check Dimension 2: Climate & Hydrology (Rainfall, aridity, region)
    const hasClimateData = state.annual_rainfall !== undefined || state.rainfall !== undefined || state.region !== undefined;
    if (!hasClimateData) {
      missingDimensions.push({
        dimension: 'Climate & Hydrology',
        variables: ['annual_rainfall', 'aridity_index'],
        scientific_rationale: 'Annual precipitation and vapor pressure deficit dictate hydraulic recharge rates and feasible agroforestry species.'
      });
      clarifyingQuestions.push('What is your **rainfall pattern or regional climate** (e.g., semi-arid <400mm, subhumid 700mm, tropical >1200mm)?');
      suggestedChips.push({ label: 'Low Rainfall (Semi-Arid, 320mm)', payload: { annual_rainfall: 320, rainfall: 'low (320 mm/year)', region: 'semi-arid' } });
      suggestedChips.push({ label: 'Moderate Rainfall (750mm)', payload: { annual_rainfall: 750, rainfall: 'subhumid (750 mm/year)' } });
    }

    // Check Dimension 3: Land Use, Cropping & Tillage
    const hasLandUseData = state.crop !== undefined || state.crop_rotation_diversity !== undefined || state.tillage !== undefined;
    if (!hasLandUseData) {
      missingDimensions.push({
        dimension: 'Land Use & Disturbance Regime',
        variables: ['crop', 'tillage_intensity'],
        scientific_rationale: 'Inversion tillage severs arbuscular mycorrhizal networks, while monoculture cropping creates pollinator nectar deserts.'
      });
      clarifyingQuestions.push('What is your **current cropping and tillage regime** (e.g., monoculture wheat with conventional plowing, orchard, or multi-crop rotation)?');
      suggestedChips.push({ label: 'Monoculture Wheat (Conventional Tillage)', payload: { crop: 'monoculture wheat', tillage: 'conventional-inversion-tillage' } });
      suggestedChips.push({ label: 'No-Till Pasture', payload: { crop: 'pasture', tillage: 'no-till' } });
    }

    // If 2 or more major dimensions are missing, ask clarifying questions while providing a provisional scientific hypothesis
    const isSufficient = missingDimensions.length <= 1;

    let provisionalHypothesis = null;
    if (!isSufficient) {
      provisionalHypothesis = "Based on preliminary ecological indicators, biodiversity decline is typically driven by a multi-variable bottleneck—such as soil organic matter collapse compounded by hydrological deficit or intensive mechanical disturbance. To generate an accurate, non-obvious restoration protocol with quantitative bounds, we need to calibrate the underlying state.";
    }

    return {
      isSufficient,
      missingDimensions,
      clarifyingQuestions,
      suggestedChips,
      provisionalHypothesis,
      dimensionsCoveredCount: 3 - missingDimensions.length
    };
  }
}
