"""
Darukaa.Earth - Python Multi-Metric Ecological Reasoning Engine
Evaluates >= 3 environmental variables simultaneously and computes 5-year restoration trajectories.
"""

from typing import Dict, Any, List
import math
from rag_pipeline import PythonEnvironmentalRAG

class PythonNexusReasoner:
    def __init__(self):
        self.rag = PythonEnvironmentalRAG()

    def evaluate(self, state: Dict[str, Any], query: str = "") -> Dict[str, Any]:
        soc = state.get("soil_organic_carbon")
        ph = state.get("soil_ph")
        rainfall_val = state.get("annual_rainfall", 350)
        crop = str(state.get("crop", "monoculture wheat")).lower()
        tillage = str(state.get("tillage", "conventional-inversion-tillage")).lower()

        nexus_insights = []
        bottlenecks = []
        interventions = []
        degradation_score = 30

        # Multi-variable coupling: SOC + Climate + Monoculture Crop
        if (soc is not None and soc < 1.0) or rainfall_val < 600 or "monoculture" in crop:
            if (soc is not None and soc <= 0.5) and rainfall_val < 500:
                nexus_insights.append({
                    "variables": [f"SOC ({soc}%)", f"Rainfall ({rainfall_val} mm)", f"Crop ({crop})"],
                    "synergy": "Severe Structural & Hydrological Vulnerability Loop",
                    "mechanism": (
                        "Sub-0.5% SOC destroys aggregate stability (slaking). Bare soil reaches >45°C "
                        "under solar irradiance, converting 50-65% of precipitation into evaporative runoff "
                        "and suffocating arbuscular mycorrhizal networks."
                    )
                })
                bottlenecks.append({
                    "factor": "Hydrological & Soil Carbon Colloidal Deficit",
                    "liebig_constraint": "Water holding capacity is paralyzed by absence of humic substances."
                })
                degradation_score += 40

        # Soil pH dysbiosis
        if ph is not None and (ph < 5.5 or ph > 8.2):
            nexus_insights.append({
                "variables": [f"Soil pH ({ph})", "Rhizosphere Microflora", "Nutrient Bioavailability"],
                "synergy": "Biogeochemical Ion Blockade",
                "mechanism": "Solubilizes toxic Al3+ (<5.5) or fixes orthophosphates (>8.2), arresting Rhizobium nodulation."
            })
            bottlenecks.append({
                "factor": "Ion Toxicity / Bioavailability Arrest",
                "liebig_constraint": "Root meristem elongation is chemically inhibited."
            })
            degradation_score += 25

        # Interventions synthesis
        interventions.append({
            "tier": "Tier 1: Immediate Rhizosphere & Moisture Foundation",
            "title": "Multi-Species Cover Crop Polyculture + AMF Inoculation",
            "protocol": "Vicia villosa (Hairy Vetch) + Secale cereale + Raphanus sativus (Daikon biological drilling) with Rhizophagus irregularis inoculant.",
            "mechanism": "Terminated with roller-crimper to create persistent mulch shield (-5°C topsoil cooling, +20-30% AWHC).",
            "citation": "FAO Soils Bulletin 44 (2021) & Lal (Science 2004)"
        })

        if soc is not None and soc < 1.0:
            interventions.append({
                "tier": "Tier 2: Permanent Carbon & Porous Sponge Matrix",
                "title": "Quenched Pyrolyzed Biochar Amendment (550°C)",
                "protocol": "8-10 t/ha biochar co-composted 1:4 with organic manure to saturate internal micro-porosity.",
                "mechanism": "Creates recalcitrant aromatic carbon sponge holding capillary water against vapor pressure deficit.",
                "citation": "Lehmann & Joseph (2015)"
            })

        interventions.append({
            "tier": "Tier 3: Landscape Heterogeneity & Pollinator Matrix",
            "title": "Stratified Alley Agroforestry & Floral Corridors",
            "protocol": "Reverse-phenology Faidherbia albida (10m x 10m) + native perennial floral buffer strips.",
            "mechanism": "Hydraulic lift provides subsoil water transfer; buffers ambient wind speed by 60-80%.",
            "citation": "IPCC AR6 WG2 Chapter 5 (2022) & IPBES (2019)"
        })

        # 5-Year Mathematical Pedotransfer Trajectory
        base_soc = soc if soc is not None else 0.5
        soc_trajectory = [round(base_soc + 0.3 * yr * (0.88 ** (yr * 0.2)), 2) for yr in [0, 1, 2, 3, 5]]

        # Hybrid RAG retrieval
        rag_query = f"{query} soil organic carbon rainfall {crop} biodiversity restoration"
        citations = self.rag.hybrid_search(rag_query, top_k=3)

        return {
            "executive_diagnosis": {
                "degradation_severity": f"{min(100, degradation_score)}%",
                "ecosystem_status": "Critically Compromised" if degradation_score > 60 else "Degraded Agro-Ecosystem",
                "summary": f"Multi-variable bottleneck diagnosed at the intersection of soil carbon ({base_soc}%), climate aridity ({rainfall_val}mm), and management disturbance."
            },
            "nexus_couplings": nexus_insights,
            "limiting_bottlenecks": bottlenecks,
            "recommended_interventions": interventions,
            "5_year_projections": {
                "soc_trajectory_pct": soc_trajectory,
                "projected_soc_gain": f"+{round(soc_trajectory[-1] - base_soc, 2)}%",
                "water_stored_liters_ha": round((soc_trajectory[-1] - base_soc) * 175000)
            },
            "literature_evidence": [
                {"title": c["title"], "authors": c["authors"], "year": c["year"], "doi": c["doi"], "rrf": c["provenance"]["rrf_score"]}
                for c in citations
            ]
        }

if __name__ == "__main__":
    reasoner = PythonNexusReasoner()
    test_state = {
        "soil_organic_carbon": 0.3,
        "soil_ph": 8.1,
        "annual_rainfall": 320,
        "crop": "monoculture wheat",
        "tillage": "conventional-inversion-tillage"
    }
    result = reasoner.evaluate(test_state, "monoculture wheat low rainfall")
    print("🌿 Python Multi-Metric Nexus Reasoning Result:")
    print(f"Severity: {result['executive_diagnosis']['degradation_severity']}")
    print(f"Projected 5-Yr SOC: {result['5_year_projections']['soc_trajectory_pct']} (Gain: {result['5_year_projections']['projected_soc_gain']})")
    print(f"Water Stored: +{result['5_year_projections']['water_stored_liters_ha']:,} L/ha")
    print("\nInterventions:")
    for i in result["recommended_interventions"]:
        print(f" - [{i['tier']}] {i['title']} (Ref: {i['citation']})")
