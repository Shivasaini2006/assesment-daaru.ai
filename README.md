# 🌿 Darukaa.Earth — AI Biodiversity & Environmental Intelligence System

> **Darukaa.Earth Hackathon Submission**: An AI-powered conversational environmental intelligence platform that acts as an **AI Environmental Scientist**, combining deep scientific grounding, multi-variable causal reasoning, hybrid RAG knowledge retrieval, and stateful multi-turn memory.

---

## 🌟 Key Capabilities & Hackathon Criteria

1. **Structured Knowledge Base (Hybrid RAG)**
   - Curated repository of peer-reviewed studies (FAO, IPCC AR6 WG2, IPBES, Lal, RothC, Bardgett).
   - Combines **Dense Semantic Vector Embeddings** + **Sparse Okapi BM25 Lexical Search** via **Reciprocal Rank Fusion (RRF)** with exact provenance scores and DOIs.
   - Formal ontology covering Soil Biogeochemistry, Climate/Hydrology, Land Use/Disturbance, and Biodiversity Indicators.

2. **Multi-Metric Causal Reasoning ($\ge 3$ Coupled Variables)**
   - Evaluates simultaneous multi-variable couplings (e.g., Soil Organic Carbon $\times$ Semi-Arid Aridity $\times$ Monoculture Wheat $\times$ Tillage).
   - Applies **Liebig's Law of the Minimum** to isolate the limiting ecological bottlenecks.

3. **Evidence-Backed Actionable Protocols**
   - Prescribes concrete agro-ecological interventions (multi-species cover crops, mycorrhizal inoculants, pyrolyzed biochar, alley agroforestry, native floral corridors).
   - Generates **5-Year Quantitative Projections** ($\Delta \text{SOC}$, $\Delta \text{AWHC}$, $\Delta \text{Shannon } H'$, bulk density) based on RothC and empirical pedotransfer functions.

4. **Conversational Intelligence & Memory**
   - Stateful multi-turn memory tracking 18+ parameters across turns.
   - Detects sparse inputs (e.g. *"Biodiversity is declining on my land"*), formulates provisional hypotheses, and asks targeted scientific clarifying questions with 1-click suggestion chips.

5. **Multi-Modal Inputs & Spatial Context**
   - Natural language queries, structured JSON payloads with schema validation, and Latitude/Longitude coordinate resolution to Köppen climate zones & WWF ecoregions.

6. **Scientist Workbench UI & API**
   - Full dark-mode glassmorphic interface: Interactive Multi-Turn Chat, Live SVG Causal Dependency Graph, Structured JSON Studio, Parameter Simulator, Spatial Biome Resolver, Scientific Knowledge Explorer, and Automated Benchmark Suite.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Client
```bash
npm run build:client
```

### 3. Start the Platform
```bash
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser.

### 4. Run the Automated Benchmark Suite
```bash
node server/tests/benchmark.js
```
Expected output:
```
=======================================================
🏁 BENCHMARK RESULTS: 6/6 PASSED (100%)
=======================================================
✅ [Test 1] 1. Depth of Reasoning (30%) - Multi-Variable Couplings (>=3 variables)
✅ [Test 2] 2. Scientific Grounding (25%) - Peer-Reviewed Citations & Quantitative Models
✅ [Test 3] 3. Knowledge System Design (20%) - Hybrid RAG & Provenance Scores
✅ [Test 4] 4. Conversational Intelligence (15%) - Missing Variable & Clarification Detection
✅ [Test 5] 5. Multi-Turn Memory (10%) - Sequential State Accumulation
✅ [Test 6] 6. Multi-Modal Inputs & Spatial Context - Coordinates & JSON Payloads
```

---

## 📁 Repository Structure

```
├── client/ / src/              # React + Vite Scientific Workbench
│   ├── components/
│   │   ├── ChatInterface.jsx         # Conversational assistant & clarifying prompts
│   │   ├── CausalGraphVisualizer.jsx # Interactive SVG causal dependency network
│   │   ├── JsonStudio.jsx            # Structured JSON telemetry playground
│   │   ├── ParameterSliders.jsx      # Real-time multi-variable knob simulator
│   │   ├── ScientificDossier.jsx     # Diagnosis, Nexus, Projections & Citations
│   │   ├── KnowledgeExplorer.jsx     # RAG corpus browser with DOIs
│   │   ├── GeoContextSelector.jsx    # Lat/Lon spatial context resolver
│   │   └── BenchmarkRunner.jsx       # In-app evaluation suite runner
│   ├── App.jsx                       # Main shell & tabbed navigation
│   └── index.css                     # Modern dark-mode glassmorphism design system
├── server/
│   ├── knowledge/
│   │   ├── corpus.json               # Curated peer-reviewed scientific studies
│   │   ├── embeddings.js             # Dense semantic vector representations
│   │   ├── bm25.js                   # Sparse Okapi BM25 lexical engine
│   │   └── ragEngine.js              # Hybrid RRF search & provenance tracker
│   ├── engine/
│   │   ├── ecoMetrics.js             # Metric taxonomy & scientific thresholds
│   │   ├── causalGraph.js            # Directed causal dependency & feedback graph
│   │   ├── nexusReasoner.js          # Multi-metric >=3 variable reasoning engine
│   │   ├── interventionCatalog.js    # Evidence-backed agro-ecological protocols
│   │   └── quantitativeModel.js      # RothC carbon kinetics & hydrological models
│   ├── dialogue/
│   │   ├── memoryManager.js          # Multi-turn session state & entity extractor
│   │   ├── clarificationEngine.js    # Missing variable detector & inquiry formulator
│   │   └── orchestrator.js           # Central conversational coordinator
│   ├── spatial/
│   │   ├── geoResolver.js            # Global coordinate & biome lookup
│   │   └── presets.js                # 6 benchmark real-world ecosystem scenarios
│   ├── tests/
│   │   └── benchmark.js              # 6-criteria automated test suite
│   └── index.js                      # Express REST API server
└── package.json
```

---

## 📜 License
MIT License • Built for the Darukaa.Earth AI Hackathon.
