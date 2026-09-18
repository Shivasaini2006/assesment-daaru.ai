import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, User, HelpCircle, Sparkles, RefreshCw, 
  Layers, MapPin, Database, ChevronRight, AlertCircle, ArrowUpRight,
  Terminal, ShieldCheck, Cpu
} from 'lucide-react';
import ScientificDossier from './ScientificDossier.jsx';
import { renderFormattedText } from '../utils/markdown.jsx';

export default function ChatInterface({ onStateUpdate, activeState, onSelectScenario }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Welcome to **Darukaa.Earth AI Environmental Scientist**. I specialize in multi-variable ecological intelligence, soil biogeochemistry, and evidence-grounded biodiversity restoration. Tell me about your ecosystem, land conditions, or specific environmental challenge.",
      clarification: {
        provisional_hypothesis: "To formulate an accurate, evidence-backed restoration protocol with 5-year quantitative projections, please specify your current soil, rainfall, and land management parameters.",
        questions: [
          "What is your approximate **Soil Organic Carbon (SOC %)** or topsoil condition?",
          "What is your **annual rainfall pattern / climate zone**?",
          "What is your **cropping system and tillage practice**?"
        ],
        suggested_chips: [
          { label: '🌿 Load Hackathon Semi-Arid Wheat (0.3% SOC)', presetId: 'hackathon-example-semi-arid-wheat' },
          { label: '🌳 Load Acidic Tropical Pasture (pH 4.8)', presetId: 'amazon-fringe-acidic-pasture' },
          { label: '🫒 Load Mediterranean Olive Grove', presetId: 'mediterranean-bare-olive-grove' }
        ]
      }
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(`session-${Date.now()}`);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend = null, structuredPayload = null) => {
    const text = textToSend !== null ? textToSend : inputValue.trim();
    if (!text && !structuredPayload) return;

    if (text) {
      setMessages(prev => [...prev, { role: 'user', content: text }]);
      setInputValue('');
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: text,
          structuredInput: structuredPayload
        })
      });

      const json = await response.json();
      if (json.success) {
        const { response: resData, currentState, spatialContext } = json.data;
        if (onStateUpdate) onStateUpdate(currentState);

        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: resData.executive_summary,
            structuredData: resData,
            spatialContext,
            clarification: resData.clarification_prompt
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: `Error analyzing ecosystem parameters: ${json.error}` }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `Network communication error: ${err.message}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipClick = (chip) => {
    if (chip.presetId && onSelectScenario) {
      onSelectScenario(chip.presetId);
    } else if (chip.payload) {
      handleSendMessage(`Providing parameters: ${JSON.stringify(chip.payload)}`, chip.payload);
    } else if (chip.label) {
      handleSendMessage(chip.label);
    }
  };

  const handleResetSession = async () => {
    await fetch('/api/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });
    setMessages([
      {
        role: 'assistant',
        content: "Session memory reset. I am ready to evaluate a new ecosystem.",
        clarification: {
          questions: [
            "Can you specify your **soil organic carbon %**, **annual rainfall**, and **land use type**?"
          ],
          suggested_chips: [
            { label: '🌿 Load Hackathon Semi-Arid Wheat (0.3% SOC)', presetId: 'hackathon-example-semi-arid-wheat' },
            { label: '🌳 Load Acidic Tropical Pasture (pH 4.8)', presetId: 'amazon-fringe-acidic-pasture' }
          ]
        }
      }
    ]);
    if (onStateUpdate) onStateUpdate({});
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[640px] glass-panel overflow-hidden border border-slate-800 shadow-2xl">
      {/* Top Session & State Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/80 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-200">Active Multi-Turn Session:</span>
          <span className="font-mono text-emerald-400/90 text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {sessionId.slice(0, 18)}
          </span>
        </div>

        {/* Accumulated State Pills */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto max-w-xl">
          {activeState && Object.entries(activeState).filter(([_, v]) => v !== undefined && v !== null && v !== '').map(([k, v]) => (
            <span key={k} className="px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-700/60 text-[11px] text-emerald-300 font-mono shadow-sm">
              <strong className="text-slate-400">{k}:</strong> {typeof v === 'number' ? v : String(v).slice(0, 16)}
            </span>
          ))}
        </div>

        <button
          onClick={handleResetSession}
          className="btn-secondary text-[11px] py-1.5 px-3 flex items-center gap-1.5 hover:bg-rose-950/40 hover:border-rose-500/50 hover:text-rose-300 transition-colors"
          title="Reset Conversational Memory"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Memory</span>
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-950/40">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3.5 max-w-4xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                msg.role === 'user'
                  ? 'bg-cyan-600 text-white shadow-cyan-900/50'
                  : 'bg-emerald-600 text-white shadow-emerald-900/50 ring-2 ring-emerald-400/20'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4.5 h-4.5" /> : <Bot className="w-4.5 h-4.5" />}
            </div>

            {/* Message Body */}
            <div className="space-y-4 flex-1">
              <div
                className={`p-4 sm:p-5 rounded-2xl text-sm leading-relaxed shadow-lg ${
                  msg.role === 'user'
                    ? 'bg-cyan-950/70 border border-cyan-700/50 text-cyan-100 rounded-tr-none ml-8'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none mr-8'
                }`}
              >
                <div>{renderFormattedText(msg.content)}</div>

                {/* Clarification Prompt Box */}
                {msg.clarification && (
                  <div className="mt-4 bg-slate-950/90 border border-amber-500/30 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                      <HelpCircle className="w-4 h-4" /> Scientific Clarifying Questions (Sparse State Detected)
                    </div>
                    {msg.clarification.provisional_hypothesis && (
                      <p className="text-xs text-slate-300 italic bg-amber-950/20 border border-amber-500/10 p-2.5 rounded-lg">
                        {msg.clarification.provisional_hypothesis}
                      </p>
                    )}
                    <ul className="space-y-2 text-xs text-slate-200">
                      {msg.clarification.questions.map((q, qIdx) => (
                        <li key={qIdx} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                          <span>{renderFormattedText(q)}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Quick Suggestion Chips */}
                    {msg.clarification.suggested_chips && msg.clarification.suggested_chips.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80">
                        <div className="text-[11px] font-semibold text-slate-400 mb-2">Quick 1-Click Evaluation Presets:</div>
                        <div className="flex flex-wrap gap-2">
                          {msg.clarification.suggested_chips.map((chip, cIdx) => (
                            <button
                              key={cIdx}
                              onClick={() => handleChipClick(chip)}
                              className="text-xs px-3.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-600/50 hover:border-emerald-400 flex items-center gap-1.5 transition-all shadow-sm"
                            >
                              <span>{chip.label}</span>
                              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Structured Scientific Dossier (if response has full reasoning) */}
              {msg.structuredData && (
                <ScientificDossier data={msg.structuredData} spatialContext={msg.spatialContext} />
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 mr-auto text-slate-300 text-xs py-3 px-4 bg-slate-900/80 border border-emerald-500/30 rounded-xl max-w-md animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-600/50 flex items-center justify-center">
              <Bot className="w-4 h-4 text-emerald-400 animate-spin" />
            </div>
            <div>
              <div className="font-semibold text-white">Coupling Multi-Metric Ecological Variables...</div>
              <div className="text-[11px] text-slate-400">Querying FAO, IPCC & RothC RAG knowledge index</div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/95">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-3 max-w-4xl mx-auto"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type an environmental inquiry (e.g., Soil organic carbon is 0.3%, rainfall is low, crop is monoculture wheat)..."
              className="w-full bg-slate-950 border border-slate-700/80 focus:border-emerald-400 rounded-xl pl-4 pr-10 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-sans"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="btn-primary py-3.5 px-6 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline font-semibold">Analyze</span>
          </button>
        </form>
      </div>
    </div>
  );
}
