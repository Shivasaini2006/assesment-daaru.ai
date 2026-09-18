// BM25 Sparse Lexical Search Engine for Environmental Science Corpus
// Implements Okapi BM25 algorithm with domain-specific tokenization and stop-word filtering.

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from',
  'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself',
  'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most',
  'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our',
  'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than',
  'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this',
  'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when',
  'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself'
]);

function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s\-\.\%]/g, ' ')
    .split(/[\s,;:!?()\[\]"']+/)
    .filter(t => t.length > 1 && !STOP_WORDS.has(t));
}

export class BM25Index {
  constructor(k1 = 1.5, b = 0.75) {
    this.k1 = k1;
    this.b = b;
    this.documents = [];
    this.docLengths = [];
    this.avgDocLength = 0;
    this.invertedIndex = new Map(); // term -> Map(docIndex -> termFrequency)
    this.idf = new Map(); // term -> idf value
    this.totalDocs = 0;
  }

  buildIndex(docs) {
    this.documents = docs;
    this.totalDocs = docs.length;
    this.docLengths = [];
    this.invertedIndex.clear();
    this.idf.clear();

    let totalLength = 0;

    docs.forEach((doc, docIdx) => {
      const fullText = [
        doc.title,
        doc.domain,
        doc.summary,
        doc.key_excerpts,
        (doc.tags || []).join(' '),
        Object.values(doc.empirical_metrics || {}).join(' ')
      ].join(' ');

      const tokens = tokenize(fullText);
      this.docLengths.push(tokens.length);
      totalLength += tokens.length;

      const termCounts = new Map();
      for (const token of tokens) {
        termCounts.set(token, (termCounts.get(token) || 0) + 1);
      }

      for (const [term, count] of termCounts.entries()) {
        if (!this.invertedIndex.has(term)) {
          this.invertedIndex.set(term, new Map());
        }
        this.invertedIndex.get(term).set(docIdx, count);
      }
    });

    this.avgDocLength = totalLength / (this.totalDocs || 1);

    // Compute Robertson-Spärck Jones IDF
    for (const [term, postingList] of this.invertedIndex.entries()) {
      const n = postingList.size;
      const idfValue = Math.log(1 + (this.totalDocs - n + 0.5) / (n + 0.5));
      this.idf.set(term, Math.max(0.1, idfValue));
    }
  }

  search(query, topK = 5) {
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return [];

    const scores = new Array(this.totalDocs).fill(0);

    for (const token of queryTokens) {
      if (!this.invertedIndex.has(token)) continue;
      const termIdf = this.idf.get(token) || 0;
      const postings = this.invertedIndex.get(token);

      for (const [docIdx, tf] of postings.entries()) {
        const docLen = this.docLengths[docIdx];
        const numerator = tf * (this.k1 + 1);
        const denominator = tf + this.k1 * (1 - this.b + this.b * (docLen / this.avgDocLength));
        scores[docIdx] += termIdf * (numerator / denominator);
      }
    }

    const ranked = scores
      .map((score, docIdx) => ({
        doc: this.documents[docIdx],
        score,
        matchType: 'BM25_LEXICAL'
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return ranked;
  }
}
