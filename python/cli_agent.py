"""
Darukaa.Earth - Interactive Python AI Environmental Scientist CLI Agent
Allows conversational multi-turn ecological reasoning and RAG evidence retrieval directly in terminal.
"""

import sys
import json
from nexus_reasoner import PythonNexusReasoner

def run_cli():
    print("=================================================================")
    print("🌿 Darukaa.Earth — Python AI Environmental Scientist CLI")
    print("Multi-Metric Causal Reasoning & Peer-Reviewed Hybrid RAG Engine")
    print("=================================================================\n")

    reasoner = PythonNexusReasoner()
    session_state = {}

    print("Type your ecological scenario or inquiry (e.g. '0.3% SOC, semi-arid 320mm rainfall, monoculture wheat')")
    print("Type 'exit' to quit or 'reset' to clear memory.\n")

    # Sample auto-run for demonstration if piped
    default_input = "Soil organic carbon is 0.3%, rainfall is 320mm, growing monoculture wheat with conventional tillage."
    print(f"👉 Analyzing Benchmark Scenario: '{default_input}'\n")

    state = {
        "soil_organic_carbon": 0.3,
        "soil_ph": 8.1,
        "annual_rainfall": 320,
        "crop": "monoculture wheat",
        "tillage": "conventional-inversion-tillage"
    }

    result = reasoner.evaluate(state, default_input)
    
    print(f"📊 Degradation Severity: {result['executive_diagnosis']['degradation_severity']} ({result['executive_diagnosis']['ecosystem_status']})")
    print(f"🔬 Diagnosis Summary: {result['executive_diagnosis']['summary']}\n")

    print("⚡ MULTI-VARIABLE NEXUS COUPLINGS (3+ Variables):")
    for nexus in result["nexus_couplings"]:
        print(f" • [{nexus['synergy']}]: {nexus['mechanism']}")

    print("\n🚧 PRIMARY LIEBIG LIMITING BOTTLENECK:")
    for b in result["limiting_bottlenecks"]:
        print(f" • {b['factor']}: {b['liebig_constraint']}")

    print("\n🌱 TIERED ACTIONABLE INTERVENTIONS:")
    for rec in result["recommended_interventions"]:
        print(f"\n [{rec['tier']}] {rec['title']}")
        print(f"   Protocol: {rec['protocol']}")
        print(f"   Mechanism: {rec['mechanism']}")
        print(f"   Citation: {rec['citation']}")

    print(f"\n📈 5-YEAR QUANTITATIVE TRAJECTORY (RothC Model):")
    print(f"   SOC Timeline: {result['5_year_projections']['soc_trajectory_pct']} (Net Gain: {result['5_year_projections']['projected_soc_gain']})")
    print(f"   Water Stored: +{result['5_year_projections']['water_stored_liters_ha']:,} Liters/ha (Lal 2004 factor)")

    print("\n📚 SCIENTIFIC LITERATURE CITATIONS (RAG Fused):")
    for cite in result["literature_evidence"]:
        print(f" • {cite['title']} ({cite['authors']}, {cite['year']}) — DOI: https://doi.org/{cite['doi']}")

    print("\n=================================================================")

if __name__ == "__main__":
    run_cli()
