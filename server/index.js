// Darukaa.Earth Biodiversity Intelligence API Server
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { ragEngineInstance } from './knowledge/ragEngine.js';
import { EcologicalOrchestrator } from './dialogue/orchestrator.js';
import { sessionStoreInstance } from './dialogue/memoryManager.js';
import { GeoSpatialResolver } from './spatial/geoResolver.js';
import { PRESET_SCENARIOS } from './spatial/presets.js';
import { causalGraphInstance } from './engine/causalGraph.js';
import { runBenchmarkSuite } from './tests/benchmark.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize RAG knowledge index on boot
ragEngineInstance.initialize();

// 1. Conversational Chat Endpoint (Stateful, Multi-Turn)
app.post('/api/chat', async (req, res) => {
  try {
    const { sessionId, message, structuredInput, coordinates } = req.body;
    const result = await EcologicalOrchestrator.process({
      sessionId: sessionId || 'default-session',
      message: message || '',
      structuredInput,
      coordinates
    });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Structured Analysis Endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { payload, sessionId } = req.body;
    const result = await EcologicalOrchestrator.process({
      sessionId: sessionId || `direct-analysis-${Date.now()}`,
      message: 'Analyze ecological parameters and generate evidence-backed restoration protocol.',
      structuredInput: payload
    });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error in /api/analyze:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Geo-Spatial Coordinate Resolution
app.post('/api/georesolve', (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const resolved = GeoSpatialResolver.resolveCoordinates(latitude, longitude);
    res.json({ success: true, data: resolved });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Preset Scenarios
app.get('/api/presets', (req, res) => {
  res.json({ success: true, data: PRESET_SCENARIOS });
});

// 5. Knowledge Base Search & Corpus
app.get('/api/knowledge/search', (req, res) => {
  try {
    const query = req.query.q || '';
    const topK = parseInt(req.query.topK || '5', 10);
    const results = ragEngineInstance.search(query, { topK });
    res.json({ success: true, query, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/knowledge/corpus', (req, res) => {
  res.json({ success: true, data: ragEngineInstance.getCorpus() });
});

// 6. Causal Graph Structure
app.get('/api/causal/graph', (req, res) => {
  res.json({ success: true, data: causalGraphInstance.getGraphStructure() });
});

// 7. Reset Session
app.post('/api/reset', (req, res) => {
  const { sessionId } = req.body;
  const session = sessionStoreInstance.resetSession(sessionId || 'default-session');
  res.json({ success: true, message: 'Session reset successfully', state: session.getState() });
});

// 8. Automated Benchmark Runner
app.get('/api/benchmark', async (req, res) => {
  try {
    const benchmarkResults = await runBenchmarkSuite();
    res.json({ success: true, data: benchmarkResults });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve frontend in production
const clientDistPath = path.join(__dirname, '../dist');
app.use(express.static(clientDistPath));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🌿 Darukaa.Earth AI Biodiversity Intelligence Engine`);
  console.log(`🚀 Server operational on http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
