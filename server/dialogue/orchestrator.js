// Conversational Intelligence & Ecological Orchestrator
// Coordinates Memory, Geo-Resolution, Missing Parameter Evaluation, RAG Retrieval, and Nexus Reasoning.

import { sessionStoreInstance } from './memoryManager.js';
import { ClarificationEngine } from './clarificationEngine.js';
import { MultiMetricNexusReasoner } from '../engine/nexusReasoner.js';
import { GeoSpatialResolver } from '../spatial/geoResolver.js';

export class EcologicalOrchestrator {
  /**
   * Processes incoming user conversation or structured query.
   * @param {Object} payload - { sessionId, message, structuredInput, coordinates }
   * @returns {Object} - Complete scientific response dossier
   */
  static async process(payload) {
    const { sessionId = 'default-session', message = '', structuredInput = null, coordinates = null } = payload;
    const session = sessionStoreInstance.getSession(sessionId);

    // 1. Resolve Geo-Coordinates if provided
    let spatialContext = null;
    if (coordinates && typeof coordinates.latitude === 'number' && typeof coordinates.longitude === 'number') {
      spatialContext = GeoSpatialResolver.resolveCoordinates(coordinates.latitude, coordinates.longitude);
      if (spatialContext) {
        session.updateState({
          coordinates: spatialContext.spatial_coordinates,
          ecoregion: spatialContext.wwf_biome,
          region: spatialContext.region_name,
          annual_rainfall: session.getState().annual_rainfall || spatialContext.mean_annual_precipitation_mm,
          soil_ph: session.getState().soil_ph || spatialContext.baseline_ph,
          soil_organic_carbon: session.getState().soil_organic_carbon !== undefined ? session.getState().soil_organic_carbon : spatialContext.baseline_soc_pct
        });
      }
    }

    // 2. Extract & Update State from natural language and structured input
    const extractedVariables = session.extractVariablesFromText(message);
    session.updateState(extractedVariables);
    if (structuredInput && typeof structuredInput === 'object') {
      session.updateState(structuredInput);
    }

    const currentState = session.getState();

    // 3. Check Metric Sufficiency & Missing Variables
    const sufficiency = ClarificationEngine.evaluateSufficiency(currentState, message);

    // 4. Run Multi-Metric Causal Nexus Reasoning
    const reasoningDossier = MultiMetricNexusReasoner.reason(currentState, message);

    // 5. Synthesize Scientist-Grade Narrative Response
    const structuredResponse = this.formatScientificResponse({
      currentState,
      sufficiency,
      reasoningDossier,
      spatialContext,
      userQuery: message
    });

    // 6. Record turn in multi-turn memory
    session.addTurn(message, structuredResponse, structuredInput);

    return {
      sessionId,
      turnCount: session.turns.length,
      currentState,
      spatialContext,
      sufficiency,
      reasoningDossier,
      response: structuredResponse
    };
  }

  static formatScientificResponse({ currentState, sufficiency, reasoningDossier, spatialContext, userQuery }) {
    const isSufficient = sufficiency.isSufficient;
    const { executive_diagnosis, nexus_multi_variable_couplings, limiting_ecological_bottlenecks, recommended_interventions, quantitative_projections, scientific_literature_evidence } = reasoningDossier;

    return {
      is_complete_diagnosis: isSufficient,
      executive_summary: executive_diagnosis.summary,
      degradation_severity_score: executive_diagnosis.degradation_severity_score,
      ecosystem_state: executive_diagnosis.ecosystem_state,
      
      // Multi-Variable Reasoning
      multi_variable_nexus: nexus_multi_variable_couplings,
      limiting_bottlenecks: limiting_ecological_bottlenecks,
      
      // Tiered Recommendations
      recommendations: recommended_interventions.map((intervention, index) => ({
        tier: index === 0 ? 'Tier 1: Immediate Rhizosphere & Moisture Foundation' : index === 1 ? 'Tier 2: Permanent Carbon & Habitat Structuring' : 'Tier 3: Landscape Heterogeneity & Pollinator Matrix',
        title: intervention.title,
        category: intervention.category,
        actionable_protocol: intervention.protocol,
        scientific_reasoning: intervention.scientific_mechanism,
        impacted_metrics: intervention.impacted_metrics,
        time_horizon: intervention.time_horizon,
        primary_citation: intervention.primary_citation
      })),

      // Quantitative Projections
      projections: quantitative_projections,

      // Scientific Literature Citations (RAG Grounding)
      citations: scientific_literature_evidence.map(paper => ({
        id: paper.id,
        title: paper.title,
        authors: paper.authors,
        year: paper.year,
        source: paper.source,
        doi: paper.doi,
        domain: paper.domain,
        key_excerpt: paper.key_excerpts,
        provenance_score: paper.provenance
      })),

      // Clarifying Questions (if sparse input)
      clarification_prompt: !isSufficient ? {
        provisional_hypothesis: sufficiency.provisionalHypothesis,
        questions: sufficiency.clarifyingQuestions,
        suggested_chips: sufficiency.suggestedChips
      } : null
    };
  }
}
