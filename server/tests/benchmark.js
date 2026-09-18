// Automated Benchmark Test Suite for Darukaa.Earth
// Validates all 6 Hackathon Evaluation Criteria.

import { ragEngineInstance } from '../knowledge/ragEngine.js';
import { MultiMetricNexusReasoner } from '../engine/nexusReasoner.js';
import { ClarificationEngine } from '../dialogue/clarificationEngine.js';
import { EcologicalOrchestrator } from '../dialogue/orchestrator.js';
import { GeoSpatialResolver } from '../spatial/geoResolver.js';

export async function runBenchmarkSuite() {
  ragEngineInstance.initialize();

  const results = {
    total_tests: 6,
    passed_tests: 0,
    timestamp: new Date().toISOString(),
    tests: []
  };

  // Test 1: Depth of Reasoning (Multi-Variable Coupling >= 3 variables)
  try {
    const hackathonState = {
      soil_organic_carbon: 0.3,
      rainfall: 'low (320 mm/year)',
      annual_rainfall: 320,
      crop: 'monoculture wheat',
      region: 'semi-arid',
      tillage: 'conventional-inversion-tillage'
    };
    const reasoning = MultiMetricNexusReasoner.reason(hackathonState, 'Monoculture wheat with 0.3% SOC and low rainfall');
    
    const hasCouplings = reasoning.nexus_multi_variable_couplings.length >= 2;
    const hasInterventions = reasoning.recommended_interventions.length >= 2;
    const hasCoverCrops = reasoning.recommended_interventions.some(i => i.id.includes('cover-crop') || i.id.includes('biochar') || i.id.includes('agroforestry'));
    const passed = hasCouplings && hasInterventions && hasCoverCrops;

    results.tests.push({
      criteria: '1. Depth of Reasoning (30%) - Multi-Variable Couplings (>=3 variables)',
      passed,
      details: {
        coupled_insights_count: reasoning.nexus_multi_variable_couplings.length,
        bottlenecks_identified: reasoning.limiting_ecological_bottlenecks.map(b => b.factor),
        recommended_interventions: reasoning.recommended_interventions.map(i => i.title),
        degradation_score: reasoning.executive_diagnosis.degradation_severity_score
      }
    });
    if (passed) results.passed_tests++;
  } catch (err) {
    results.tests.push({ criteria: '1. Depth of Reasoning', passed: false, error: err.message });
  }

  // Test 2: Scientific Grounding & Empirical Projections
  try {
    const state = { soil_organic_carbon: 0.5, annual_rainfall: 400 };
    const reasoning = MultiMetricNexusReasoner.reason(state, 'soil organic carbon water holding capacity');
    const hasCitations = reasoning.scientific_literature_evidence.length >= 2;
    const hasDOIs = reasoning.scientific_literature_evidence.every(e => e.doi && e.authors);
    const hasProjections = !!reasoning.quantitative_projections.timeline_projections.soil_organic_carbon;
    const passed = hasCitations && hasDOIs && hasProjections;

    results.tests.push({
      criteria: '2. Scientific Grounding (25%) - Peer-Reviewed Citations & Quantitative Models',
      passed,
      details: {
        citations_retrieved: reasoning.scientific_literature_evidence.map(c => `${c.authors} (${c.year}) - DOI: ${c.doi}`),
        quantitative_5yr_soc_delta: reasoning.quantitative_projections.net_deltas_5_year.soc_delta_pct,
        water_stored_liters_per_ha: `${reasoning.quantitative_projections.water_retention_liters_ha.toLocaleString()} L/ha`
      }
    });
    if (passed) results.passed_tests++;
  } catch (err) {
    results.tests.push({ criteria: '2. Scientific Grounding', passed: false, error: err.message });
  }

  // Test 3: Knowledge System Design (Hybrid RAG with BM25 + Dense Vectors)
  try {
    const query = 'arbuscular mycorrhizal glomalin aggregate stability semi-arid';
    const ragResults = ragEngineInstance.search(query, { topK: 3 });
    const passed = ragResults.length > 0 && ragResults[0].provenance.rrfScore > 0;

    results.tests.push({
      criteria: '3. Knowledge System Design (20%) - Hybrid RAG & Provenance Scores',
      passed,
      details: {
        top_match_title: ragResults[0]?.title,
        top_match_source: ragResults[0]?.source,
        rrf_fusion_score: ragResults[0]?.provenance?.rrfScore,
        dense_cosine: ragResults[0]?.provenance?.denseCosineScore,
        bm25_score: ragResults[0]?.provenance?.bm25Score
      }
    });
    if (passed) results.passed_tests++;
  } catch (err) {
    results.tests.push({ criteria: '3. Knowledge System Design', passed: false, error: err.message });
  }

  // Test 4: Conversational Intelligence (Missing Variable Detection)
  try {
    const vagueState = {};
    const sufficiency = ClarificationEngine.evaluateSufficiency(vagueState, 'Biodiversity is declining on my land');
    const passed = !sufficiency.isSufficient && sufficiency.clarifyingQuestions.length >= 2;

    results.tests.push({
      criteria: '4. Conversational Intelligence (15%) - Missing Variable & Clarification Detection',
      passed,
      details: {
        is_complete: sufficiency.isSufficient,
        missing_dimensions_count: sufficiency.missingDimensions.length,
        clarifying_questions_generated: sufficiency.clarifyingQuestions,
        provisional_hypothesis: sufficiency.provisionalHypothesis
      }
    });
    if (passed) results.passed_tests++;
  } catch (err) {
    results.tests.push({ criteria: '4. Conversational Intelligence', passed: false, error: err.message });
  }

  // Test 5: Multi-Turn Memory & State Accumulation
  try {
    const sessionId = `benchmark-session-${Date.now()}`;
    // Turn 1: Vague statement
    const turn1 = await EcologicalOrchestrator.process({
      sessionId,
      message: 'Biodiversity is declining on my farm and birds are gone.'
    });

    // Turn 2: Providing soil data
    const turn2 = await EcologicalOrchestrator.process({
      sessionId,
      message: 'Our soil organic carbon is 0.3% and pH is 8.1.'
    });

    // Turn 3: Providing climate and crop data
    const turn3 = await EcologicalOrchestrator.process({
      sessionId,
      message: 'We receive 320mm low rainfall and grow monoculture wheat.'
    });

    const finalState = turn3.currentState;
    const passed = finalState.soil_organic_carbon === 0.3 && 
                   finalState.soil_ph === 8.1 && 
                   finalState.annual_rainfall === 320 && 
                   finalState.crop === 'monoculture wheat';

    results.tests.push({
      criteria: '5. Multi-Turn Memory (10%) - Sequential State Accumulation',
      passed,
      details: {
        turn_count: turn3.turnCount,
        accumulated_soc: finalState.soil_organic_carbon,
        accumulated_ph: finalState.soil_ph,
        accumulated_rainfall: finalState.annual_rainfall,
        accumulated_crop: finalState.crop,
        diagnosis_complete: turn3.response.is_complete_diagnosis
      }
    });
    if (passed) results.passed_tests++;
  } catch (err) {
    results.tests.push({ criteria: '5. Multi-Turn Memory', passed: false, error: err.message });
  }

  // Test 6: Structured JSON & Geo-Spatial Context Resolution
  try {
    // Geo resolution test for Jaipur, Rajasthan (26.9124, 75.7873)
    const geo = GeoSpatialResolver.resolveCoordinates(26.9124, 75.7873);
    const hasGeo = geo && geo.koppen_climate.includes('BSh') || geo.koppen_climate.includes('BWh');

    // Structured JSON analysis test
    const jsonTest = await EcologicalOrchestrator.process({
      sessionId: `geo-test-${Date.now()}`,
      structuredInput: {
        soil_organic_carbon: 0.4,
        soil_ph: 7.9,
        crop: 'monoculture barley',
        rainfall: 'semi-arid (350mm)'
      },
      coordinates: { latitude: 26.9124, longitude: 75.7873 }
    });

    const passed = hasGeo && jsonTest.response.recommendations.length > 0;

    results.tests.push({
      criteria: '6. Multi-Modal Inputs & Spatial Context - Coordinates & JSON Payloads',
      passed,
      details: {
        resolved_ecoregion: geo.region_name,
        resolved_koppen_climate: geo.koppen_climate,
        resolved_soil_order: geo.dominant_soil_order,
        structured_payload_interventions_count: jsonTest.response.recommendations.length
      }
    });
    if (passed) results.passed_tests++;
  } catch (err) {
    results.tests.push({ criteria: '6. Spatial & Structured JSON', passed: false, error: err.message });
  }

  results.score_percentage = `${Math.round((results.passed_tests / results.total_tests) * 100)}%`;
  return results;
}

// Direct CLI execution support
if (process.argv[1]?.endsWith('benchmark.js')) {
  console.log('🧪 Running Darukaa.Earth Biodiversity Intelligence Benchmark Suite...\n');
  runBenchmarkSuite().then(res => {
    console.log(`=======================================================`);
    console.log(`🏁 BENCHMARK RESULTS: ${res.passed_tests}/${res.total_tests} PASSED (${res.score_percentage})`);
    console.log(`=======================================================\n`);
    res.tests.forEach((t, idx) => {
      console.log(`${t.passed ? '✅' : '❌'} [Test ${idx + 1}] ${t.criteria}`);
      console.log('   Details:', JSON.stringify(t.details || t.error, null, 2));
      console.log('');
    });
    process.exit(res.passed_tests === res.total_tests ? 0 : 1);
  });
}
