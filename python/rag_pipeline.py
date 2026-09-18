"""
Darukaa.Earth - Python Hybrid RAG Retrieval Engine
Fuses Dense Semantic Concept Vectors with Sparse Okapi BM25 Lexical Search via Reciprocal Rank Fusion.
"""

import json
import math
import os
import re
from typing import List, Dict, Any, Tuple

CORPUS_PATH = os.path.join(os.path.dirname(__file__), "..", "server", "knowledge", "corpus.json")

# Canonical 25-dimensional ecological concept ontology vectors
ECOLOGICAL_CONCEPTS = [
    # Soil Biogeochemistry
    ['soil organic carbon', 'soc', 'humus', 'carbon sequestration', 'rothc', 'c:n ratio'],
    ['soil ph', 'acidity', 'alkalinity', 'aluminum toxicity', 'liming', 'cec'],
    ['soil microbiome', 'microbial biomass', 'fungal-to-bacterial', 'mycorrhizae', 'glomalin'],
    ['bulk density', 'compaction', 'aggregation', 'macropores', 'hydraulic conductivity'],
    ['soil salinity', 'electrical conductivity', 'ece', 'sodicity', 'halophytes', 'gypsum'],
    # Climate & Hydrology
    ['aridity', 'precipitation', 'rainfall', 'drought', 'evapotranspiration', 'awhc'],
    ['microclimate', 'canopy cooling', 'thermal buffering', 'relative humidity'],
    ['water infiltration', 'percolation', 'runoff', 'soil moisture deficit'],
    ['extreme weather', 'heat stress', 'flash flood', 'monsoon variability'],
    ['evaporation loss', 'soil armour', 'living mulch', 'surface crusting'],
    # Land Use & Disturbance
    ['conventional tillage', 'inversion plowing', 'soil disturbance', 'no-till'],
    ['monoculture', 'crop simplification', 'cereal wheat monocrop', 'fallow'],
    ['synthetic fertilizers', 'chemical nitrogen', 'nitrification', 'pesticide drift'],
    ['habitat fragmentation', 'land clearing', 'deforestation', 'edge effect'],
    ['overgrazing', 'pasture degradation', 'livestock compaction', 'silvopasture'],
    # Biodiversity
    ['species richness', 'shannon wiener index', 'h prime', 'functional diversity'],
    ['pollinators', 'apoidea', 'wild bees', 'syrphidae', 'floral buffer strips'],
    ['soil macrofauna', 'earthworms', 'lumbricidae', 'collembola', 'biopores'],
    ['natural enemies', 'biological pest control', 'parasitoids', 'avian insectivores'],
    ['ecological corridors', 'hedgerows', 'stepping stones', 'paddock trees'],
    # Agro-Ecology & Restoration
    ['multi-species cover crops', 'legume green manure', 'vicia villosa', 'rhizobium'],
    ['biochar amendment', 'pyrolysis', 'porous matrix', 'co-composting'],
    ['agroforestry systems', 'alley cropping', 'faidherbia albida', 'strata layering'],
    ['contour swales', 'keyline design', 'biological drilling', 'daikon radish'],
    ['holistic planned grazing', 'manure cycling', 'sward diversification']
]

class BM25Retriever:
    def __init__(self, k1: float = 1.5, b: float = 0.75):
        self.k1 = k1
        self.b = b
        self.docs = []
        self.doc_lengths = []
        self.avg_doc_len = 0.0
        self.inverted_index = {}
        self.idf = {}

    def fit(self, docs: List[Dict[str, Any]]):
        self.docs = docs
        total_len = 0
        self.doc_lengths = []
        self.inverted_index = {}

        for idx, doc in enumerate(docs):
            text = f"{doc['title']} {doc['domain']} {doc['summary']} {doc['key_excerpts']} {' '.join(doc.get('tags', []))}"
            tokens = re.findall(r'\b\w+\b', text.lower())
            tokens = [t for t in tokens if len(t) > 2]
            self.doc_lengths.append(len(tokens))
            total_len += len(tokens)

            tf = {}
            for t in tokens:
                tf[t] = tf.get(t, 0) + 1

            for term, count in tf.items():
                if term not in self.inverted_index:
                    self.inverted_index[term] = {}
                self.inverted_index[term][idx] = count

        n_docs = len(docs)
        self.avg_doc_len = total_len / (n_docs or 1)

        for term, postings in self.inverted_index.items():
            n = len(postings)
            self.idf[term] = math.log(1 + (n_docs - n + 0.5) / (n + 0.5))

    def search(self, query: str, top_k: int = 5) -> List[Tuple[int, float]]:
        tokens = re.findall(r'\b\w+\b', query.lower())
        tokens = [t for t in tokens if len(t) > 2]
        scores = [0.0] * len(self.docs)

        for t in tokens:
            if t not in self.inverted_index:
                continue
            idf_val = self.idf.get(t, 0.0)
            for doc_idx, count in self.inverted_index[t].items():
                doc_len = self.doc_lengths[doc_idx]
                numerator = count * (self.k1 + 1)
                denominator = count + self.k1 * (1 - self.b + self.b * (doc_len / self.avg_doc_len))
                scores[doc_idx] += idf_val * (numerator / denominator)

        ranked = [(idx, score) for idx, score in enumerate(scores) if score > 0]
        ranked.sort(key=lambda x: x[1], reverse=True)
        return ranked[:top_k]

class SemanticConceptEmbedder:
    def __init__(self):
        self.doc_vectors = []
        self.docs = []

    def _embed(self, text: str) -> List[float]:
        text_lower = text.lower()
        vec = []
        for concepts in ECOLOGICAL_CONCEPTS:
            val = 0.0
            for c in concepts:
                if c in text_lower:
                    val += 2.5 if ' ' in c else 1.0
            vec.append(val)
        norm = math.sqrt(sum(v*v for v in vec))
        if norm == 0:
            return [0.001] * len(ECOLOGICAL_CONCEPTS)
        return [v / norm for v in vec]

    def fit(self, docs: List[Dict[str, Any]]):
        self.docs = docs
        self.doc_vectors = []
        for d in docs:
            full_text = f"{d['title']} {d['domain']} {d['summary']} {d['key_excerpts']} {' '.join(d.get('tags', []))}"
            self.doc_vectors.append(self._embed(full_text))

    def search(self, query: str, top_k: int = 5) -> List[Tuple[int, float]]:
        q_vec = self._embed(query)
        scores = []
        for idx, d_vec in enumerate(self.doc_vectors):
            dot = sum(q * d for q, d in zip(q_vec, d_vec))
            scores.append((idx, dot))
        scores.sort(key=lambda x: x[1], reverse=True)
        return [s for s in scores if s[1] > 0.05][:top_k]

class PythonEnvironmentalRAG:
    def __init__(self, corpus_path: str = CORPUS_PATH):
        with open(corpus_path, "r", encoding="utf-8") as f:
            self.corpus = json.load(f)
        self.bm25 = BM25Retriever()
        self.bm25.fit(self.corpus)
        self.embedder = SemanticConceptEmbedder()
        self.embedder.fit(self.corpus)

    def hybrid_search(self, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
        bm25_res = self.bm25.search(query, top_k=top_k * 2)
        dense_res = self.embedder.search(query, top_k=top_k * 2)

        rrf_k = 60
        fused = {}

        for rank, (idx, score) in enumerate(bm25_res):
            fused[idx] = fused.get(idx, 0.0) + (1.0 / (rrf_k + rank + 1))

        for rank, (idx, score) in enumerate(dense_res):
            fused[idx] = fused.get(idx, 0.0) + (1.0 / (rrf_k + rank + 1))

        ranked = sorted(fused.items(), key=lambda x: x[1], reverse=True)[:top_k]

        results = []
        for doc_idx, rrf_score in ranked:
            doc = self.corpus[doc_idx].copy()
            doc["provenance"] = {"rrf_score": round(rrf_score, 4)}
            results.append(doc)
        return results

if __name__ == "__main__":
    rag = PythonEnvironmentalRAG()
    results = rag.hybrid_search("soil organic carbon semi arid wheat cover crops", top_k=3)
    print(f"✅ Python RAG retrieved {len(results)} peer-reviewed documents:")
    for r in results:
        print(f" - [{r['doi']}] {r['title']} ({r['authors']}, {r['year']}) (RRF: {r['provenance']['rrf_score']})")
