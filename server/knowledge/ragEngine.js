// Hybrid RAG Retrieval Engine for Darukaa.Earth
// Combines BM25 Lexical + Dense Vector Embeddings + Ontological Filters via Reciprocal Rank Fusion (RRF).

import { BM25Index } from './bm25.js';
import { SemanticVectorStore } from './embeddings.js';
import corpusData from './corpus.json' with { type: 'json' };

export class EnvironmentalRAGEngine {
  constructor() {
    this.corpus = corpusData;
    this.bm25 = new BM25Index();
    this.vectorStore = new SemanticVectorStore();
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;
    this.bm25.buildIndex(this.corpus);
    this.vectorStore.buildStore(this.corpus);
    this.initialized = true;
    console.log(`[RAG Engine] Successfully indexed ${this.corpus.length} peer-reviewed environmental science documents.`);
  }

  /**
   * Hybrid search combining BM25 and Dense Vectors using Reciprocal Rank Fusion (RRF)
   * @param {string} query - Free text query or composite metric query
   * @param {Object} options - Filtering and weighting options
   * @returns {Array} - Ranked list of evidence documents with provenance scores
   */
  search(query, options = {}) {
    if (!this.initialized) this.initialize();

    const topK = options.topK || 4;
    const filterDomain = options.domain;
    const filterTags = options.tags || [];

    // 1. Sparse Lexical Search (BM25)
    const bm25Results = this.bm25.search(query, topK * 2);

    // 2. Dense Semantic Vector Search
    const vectorResults = this.vectorStore.search(query, topK * 2);

    // 3. Reciprocal Rank Fusion (RRF) with k = 60
    const rrfK = 60;
    const fusedScores = new Map();

    bm25Results.forEach((res, rank) => {
      const docId = res.doc.id;
      const rrfScore = 1.0 / (rrfK + rank + 1);
      fusedScores.set(docId, {
        doc: res.doc,
        rrfScore: (fusedScores.get(docId)?.rrfScore || 0) + rrfScore,
        bm25Score: res.score,
        denseScore: 0,
        bm25Rank: rank + 1,
        denseRank: null
      });
    });

    vectorResults.forEach((res, rank) => {
      const docId = res.doc.id;
      const rrfScore = 1.0 / (rrfK + rank + 1);
      const existing = fusedScores.get(docId);
      if (existing) {
        existing.rrfScore += rrfScore;
        existing.denseScore = res.score;
        existing.denseRank = rank + 1;
      } else {
        fusedScores.set(docId, {
          doc: res.doc,
          rrfScore,
          bm25Score: 0,
          denseScore: res.score,
          bm25Rank: null,
          denseRank: rank + 1
        });
      }
    });

    // 4. Ontological & Domain Filtering / Boosting
    let ranked = Array.from(fusedScores.values());

    if (filterDomain) {
      ranked = ranked.filter(item => 
        item.doc.domain.toLowerCase().includes(filterDomain.toLowerCase())
      );
    }

    if (filterTags.length > 0) {
      ranked.forEach(item => {
        const docTags = (item.doc.tags || []).map(t => t.toLowerCase());
        const matchCount = filterTags.filter(t => docTags.includes(t.toLowerCase())).length;
        if (matchCount > 0) {
          item.rrfScore *= (1 + 0.25 * matchCount); // Boost documents matching explicit target metrics
        }
      });
    }

    // 5. Final Sort & Provenance Extraction
    ranked.sort((a, b) => b.rrfScore - a.rrfScore);

    return ranked.slice(0, topK).map(item => ({
      id: item.doc.id,
      title: item.doc.title,
      authors: item.doc.authors,
      year: item.doc.year,
      source: item.doc.source,
      doi: item.doc.doi,
      domain: item.doc.domain,
      summary: item.doc.summary,
      empirical_metrics: item.doc.empirical_metrics,
      key_excerpts: item.doc.key_excerpts,
      provenance: {
        rrfScore: parseFloat(item.rrfScore.toFixed(4)),
        bm25Score: parseFloat(item.bm25Score.toFixed(3)),
        denseCosineScore: parseFloat(item.denseScore.toFixed(3)),
        bm25Rank: item.bm25Rank,
        denseRank: item.denseRank
      }
    }));
  }

  getCorpus() {
    if (!this.initialized) this.initialize();
    return this.corpus;
  }
}

export const ragEngineInstance = new EnvironmentalRAGEngine();
