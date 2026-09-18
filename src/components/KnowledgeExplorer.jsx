import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, ExternalLink, Sparkles, Database } from 'lucide-react';

export default function KnowledgeExplorer() {
  const [corpus, setCorpus] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch('/api/knowledge/corpus')
      .then(res => res.json())
      .then(json => {
        if (json.success) setCorpus(json.data);
      });
  }, []);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/knowledge/search?q=${encodeURIComponent(searchQuery)}&topK=10`);
      const json = await res.json();
      if (json.success) {
        setSearchResults(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const displayedList = searchResults || corpus;
  const filteredList = selectedDomain === 'ALL' 
    ? displayedList 
    : displayedList.filter(d => (d.domain || '').toLowerCase().includes(selectedDomain.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-panel p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-cyan">
                <Database className="w-3.5 h-3.5" /> Scientific Knowledge Layer
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Peer-Reviewed Environmental Science Knowledge Corpus</h2>
            <p className="text-xs text-slate-400">
              Retrievable RAG index spanning FAO technical reports, IPCC AR6 assessments, IPBES studies, and seminal journals (Nature, Science).
            </p>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Indexed Studies: <span className="font-bold text-emerald-400">{corpus.length}</span>
          </div>
        </div>

        {/* Search Bar & Domain Filters */}
        <div className="space-y-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search semantic corpus (e.g. arbuscular mycorrhizae glomalin, biochar water holding capacity, RothC humification)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button type="submit" className="btn-primary py-2.5 px-4 text-xs">
              <span>{isLoading ? 'Searching...' : 'Hybrid RAG Search'}</span>
            </button>
          </form>

          {/* Domain Chips */}
          <div className="flex flex-wrap gap-2 pt-1 text-xs">
            {['ALL', 'Soil', 'Climate', 'Biodiversity', 'Agro-Ecology', 'Carbon'].map(domain => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedDomain === domain
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 font-bold'
                    : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Studies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.map((doc, idx) => (
          <div key={idx} className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/30 rounded-xl p-5 space-y-3 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="badge badge-emerald text-[10px]">{doc.domain}</span>
                {doc.provenance && (
                  <span className="badge badge-cyan text-[10px]">
                    RRF Score: {doc.provenance.rrfScore}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white leading-snug">{doc.title}</h3>
              <div className="text-xs text-slate-400 font-medium">
                {doc.authors} ({doc.year}) • <span className="text-slate-300 italic">{doc.source}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {doc.summary}
              </p>
              {doc.key_excerpts && (
                <div className="bg-slate-950/70 border-l-2 border-emerald-500 rounded p-2.5 text-[11px] text-slate-300 italic mt-2">
                  "{doc.key_excerpts}"
                </div>
              )}
            </div>

            {/* Footer Metadata */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>DOI: {doc.doi}</span>
              <a
                href={`https://doi.org/${doc.doi}`}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-sans font-medium"
              >
                <span>View DOI</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
