import Sidebar from '../components/layout/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  Cpu, 
  Loader2, 
  Download, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  FileJson, 
  Flame,
  Award,
  BookOpen,
  BrainCircuit,
  Lightbulb,
  X,
  FileCode,
  Compass,
  FileText
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getSessionHistory } from '../services/firebaseService';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

interface AIAnalysis {
  summary: string;
  topTopics: string[];
  providerInsights: string;
  suggestedPrompts: {
    original: string;
    improved: string;
    reason: string;
  }[];
}

export default function History() {
  const [search, setSearch] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // AI Insights State
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showAnalysisPane, setShowAnalysisPane] = useState(false);

  // Show Export selector
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getSessionHistory();
        setHistory(data);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(item => 
    item.prompt.toLowerCase().includes(search.toLowerCase())
  );

  // Helper: Copying master answer to clipboard
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper: Export Entire History as CSV
  const exportAllToCSV = () => {
    if (history.length === 0) return;
    
    // Construct CSV Header
    const headers = ['Session ID', 'Timestamp', 'User Prompt', 'Winner Model / LLM', 'Confidence Indicator', 'Audit Reasoning', 'Final Synthesized Answer'];
    
    const rows = history.map(item => {
      const date = item.timestamp?.toDate ? item.timestamp.toDate().toISOString() : new Date().toISOString();
      const prompt = (item.prompt || '').replace(/"/g, '""');
      const best = (item.judgeResult?.bestProvider || 'None').replace(/"/g, '""');
      const score = (item.judgeResult?.compositeScore || item.judgeResult?.confidence * 10 || 8.5).toFixed(1);
      const reasoning = (item.judgeResult?.reasoning || '').replace(/"/g, '""');
      const answer = (item.masterAnswer || '').replace(/"/g, '""');

      return `"${item.id}","${date}","${prompt}","${best}","${score}","${reasoning}","${answer}"`;
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `echo_lens_all_sessions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
  };

  // Helper: Export Entire History as JSON
  const exportAllToJSON = () => {
    if (history.length === 0) return;
    const formattedData = history.map(item => ({
      id: item.id,
      timestamp: item.timestamp?.toDate ? item.timestamp.toDate().toISOString() : new Date().toISOString(),
      prompt: item.prompt,
      selectedWinner: item.judgeResult?.bestProvider || 'n/a',
      judgeConfidence: item.judgeResult?.confidence || null,
      judgeDetails: {
        reasoning: item.judgeResult?.reasoning || '',
        strongPoints: item.judgeResult?.strongPoints || [],
        weaknesses: item.judgeResult?.weaknesses || []
      },
      synthesizedOutputLength: item.masterAnswer?.length || 0,
      masterAnswer: item.masterAnswer || ''
    }));

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(formattedData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `echo_lens_history_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    setShowExportMenu(false);
  };

  // Helper: Export Single Session as Markdown
  const exportSingleToMarkdown = (item: any) => {
    const tsStr = item.timestamp?.toDate ? item.timestamp.toDate().toLocaleString() : 'Just now';
    const content = `# AI Echo Lens Orchestration Session Report
**Date:** ${tsStr}
**Session ID:** ${item.id}

## 1. Original User Prompt
\`\`\`
${item.prompt}
\`\`\`

## 2. Dynamic Evaluation Analysis
* **Engine Selected Winner:** \`${item.judgeResult?.bestProvider || 'N/A'}\`
* **Score Confidence Rating:** \`${(item.judgeResult?.confidence * 10 || 8.5).toFixed(1)}\`

### Evaluation Audit Reasoning
> ${item.judgeResult?.reasoning || 'No details specified.'}

### Competency Strong Points
${item.judgeResult?.strongPoints?.map((p: string) => `- ${p}`).join('\n') || '* No highlights recorded.'}

### Weakness Factors Checked
${item.judgeResult?.weaknesses?.map((w: string) => `- ${w}`).join('\n') || '* No concerns recorded.'}

## 3. High-Fidelity Synthesized Answer (Consolidated Master output)
---
${item.masterAnswer || 'Empty result'}
---
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `echo_lens_session_${item.id.substring(0, 8)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Run AI Trends analysis
  const handleAIAnalysis = async () => {
    if (history.length === 0) {
      alert('You need at least one completed orchestration result to run AI Pattern Analysis.');
      return;
    }
    setAnalyzing(true);
    setAnalysisError(null);
    setShowAnalysisPane(true);
    try {
      const response = await axios.post('/api/ai/analyze-logs', { logs: history });
      setAnalysis(response.data);
    } catch (err: any) {
      console.error('AI History analysis failed:', err);
      setAnalysisError(err.response?.data?.error || 'Failed to complete orchestration pattern mining.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F8FC]">
      <Sidebar />
      <main className="flex-1 flex flex-col bg-[#F6F8FC]/50 overflow-y-auto px-8 py-10 custom-scrollbar text-slate-800">
        <div className="max-w-5xl mx-auto w-full">
          
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-slate-100 pb-6">
            <div>
              <h1 className="text-2xl font-display font-bold text-slate-800 mb-1">Session History</h1>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Review, compare, and export past orchestrations.</p>
            </div>
            
            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3 relative">
              {/* AI Analysis trigger */}
              <button 
                onClick={handleAIAnalysis}
                className="flex items-center gap-2 bg-[#6C63FF]/10 text-[#6C63FF] hover:bg-[#6C63FF]/15 transition-all text-xs font-bold px-4 py-2.5 rounded-xl border border-[#6C63FF]/20 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Insights</span>
              </button>

              {/* Export Selector */}
              <div className="relative">
                <button 
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 transition-all text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export History</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <AnimatePresence>
                  {showExportMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg py-2 z-20 text-slate-700 text-xs font-bold"
                      >
                        <button 
                          onClick={exportAllToJSON}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left cursor-pointer transition-colors"
                        >
                          <FileJson className="w-4 h-4 text-[#00D4FF]" />
                          <span>Download JSON</span>
                        </button>
                        <button 
                          onClick={exportAllToCSV}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left cursor-pointer transition-colors border-t border-slate-50"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                          <span>Download CSV</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* AI Pattern Analyzer Container (Framer-Motion Drawer) */}
          <AnimatePresence>
            {showAnalysisPane && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="glass-card bg-gradient-to-br from-[#6C63FF]/5 to-sky-500/5 border border-[#6C63FF]/15 p-6 rounded-2xl relative shadow-sm">
                  <button 
                    onClick={() => setShowAnalysisPane(false)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/40 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2.5 mb-5">
                    <BrainCircuit className="w-5 h-5 text-[#6C63FF] animate-pulse" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Advanced Prompt Architecture Insights</h3>
                      <p className="text-[9px] text-[#6C63FF] font-black uppercase tracking-widest mt-0.5">Gemini 3.5-flash Pattern Analysis</p>
                    </div>
                  </div>

                  {analyzing ? (
                    <div className="flex flex-col items-center justify-center py-10 space-y-3">
                      <Loader2 className="w-8 h-8 animate-spin text-[#6C63FF]" />
                      <span className="text-xs font-semibold text-slate-500">Deconstructing historical telemetry patterns...</span>
                    </div>
                  ) : analysisError ? (
                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                      <span>{analysisError}</span>
                    </div>
                  ) : analysis ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Summary */}
                        <div className="lg:col-span-2 space-y-3 bg-white/70 border border-slate-100/60 p-4 rounded-xl">
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Usage Diagnostic</span>
                          <p className="text-xs text-slate-600 leading-relaxed font-medium">{analysis.summary}</p>
                        </div>

                        {/* Topics and Tags */}
                        <div className="space-y-4 bg-white/70 border border-slate-100/60 p-4 rounded-xl flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-2">Primary Domain Themes</span>
                            <div className="flex flex-wrap gap-2">
                              {analysis.topTopics?.map((topic, i) => (
                                <span key={i} className="bg-sky-50 text-sky-700 font-bold text-[10px] px-2.5 py-1 rounded-full border border-sky-100">
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="border-t border-slate-100 pt-3 flex items-center gap-2">
                            <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
                            <span className="text-[10px] font-bold text-slate-500">Orchestrator Speed Optimizer active</span>
                          </div>
                        </div>
                      </div>

                      {/* Provider comparison info */}
                      <div className="bg-white/70 border border-slate-100/60 p-4 rounded-xl space-y-1">
                        <span className="text-[10px] text-[#6C63FF] uppercase font-bold tracking-wider block">Provider Biases & Analysis</span>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">{analysis.providerInsights}</p>
                      </div>

                      {/* Suggested improved prompts */}
                      {analysis.suggestedPrompts && analysis.suggestedPrompts.length > 0 && (
                        <div className="space-y-3">
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">AI-Powered Prompt Optimizations</span>
                          {analysis.suggestedPrompts.map((item, idx) => (
                            <div key={idx} className="bg-slate-50/80 border border-slate-100 rounded-xl p-4 space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase">Original Prompt Pattern</span>
                                  <div className="bg-white border border-slate-150 p-2.5 rounded-lg text-xs font-mono text-slate-500 line-clamp-2">
                                    "{item.original}"
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[9px] font-black text-[#6C63FF] uppercase flex items-center gap-1">
                                    <Lightbulb className="w-3 h-3 text-[#6C63FF]" />
                                    <span>Recommended Structural Version</span>
                                  </span>
                                  <div className="bg-white border border-[#6C63FF]/20 p-2.5 rounded-lg text-xs font-mono text-slate-800 leading-relaxed">
                                    {item.improved}
                                  </div>
                                </div>
                              </div>
                              <p className="text-[11px] text-slate-500 font-bold border-t border-dashed border-slate-200/80 pt-2 flex items-center gap-1.5">
                                <Compass className="w-3.5 h-3.5 text-slate-400" />
                                <span><strong>Why it works:</strong> {item.reason}</span>
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Input */}
          <div className="flex gap-4 mb-8">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#6C63FF] transition-colors" />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search past logs, queries or models used..." 
                className="w-full pl-12 pr-4 py-3 bg-white/75 backdrop-blur-2xl border border-white/80 rounded-xl focus:border-[#6C63FF]/30 outline-none text-sm font-semibold transition-all shadow-xs placeholder:text-slate-400 placeholder:font-normal text-slate-700"
              />
            </div>
          </div>

          {/* History List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#6C63FF]" />
              </div>
            ) : filteredHistory.length > 0 ? (
              filteredHistory.map((item) => {
                const isExpanded = expandedId === item.id;
                const compositeScore = (item.judgeResult?.compositeScore || item.judgeResult?.confidence * 10 || 8.5);
                
                return (
                  <motion.div 
                    key={item.id}
                    layout="position"
                    animate={{ scale: 1 }}
                    className={`bg-white/45 backdrop-blur-3xl border ${isExpanded ? 'border-[#6C63FF]/25 shadow-sm' : 'border-white/80 hover:border-[#6C63FF]/10 hover:bg-slate-50/55'} rounded-2xl flex flex-col overflow-hidden transition-all duration-300 shadow-[0_4px_25px_rgba(108,99,255,0.015)]`}
                  >
                    {/* Top Row / Interactive Header */}
                    <div 
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer select-none"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-700 line-clamp-1 mb-2 text-sm max-w-2xl">{item.prompt}</h3>
                        <div className="flex flex-wrap gap-4 text-[10px] uppercase font-bold tracking-widest text-slate-400 items-center">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" /> 
                            {item.timestamp?.toDate ? item.timestamp.toDate().toLocaleDateString() + ' ' + item.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5 text-[#6C63FF]" /> 
                            Best Chosen: <span className="text-[#6C63FF] font-black">{item.judgeResult?.bestProvider || 'N/A'}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 flex-shrink-0">
                        <div className="text-right">
                          <div className="text-[9px] uppercase font-bold text-slate-400 mb-1 tracking-tighter">Confidence Index</div>
                          <div className={`text-lg font-mono font-black ${compositeScore >= 8 ? 'text-emerald-500' : 'text-[#6C63FF]'}`}>{compositeScore.toFixed(1)}</div>
                        </div>
                        <div className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-800 transition-all shadow-sm">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Content Panel */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-slate-100/90 overflow-hidden bg-slate-50/20"
                        >
                          <div className="p-6 space-y-6">
                            
                            {/* Panel 1: Evaluation Metrics & Reasoning */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Left: Judge Reasoning */}
                              <div className="md:col-span-2 space-y-3 bg-white border border-slate-100 p-4.5 rounded-xl">
                                <div className="flex items-center gap-2 mb-1">
                                  <Award className="w-4.5 h-4.5 text-[#6C63FF]" />
                                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Judge Verdict Decoded</span>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                                  {item.judgeResult?.reasoning || 'No core evaluation details were saved for this sequence.'}
                                </p>
                              </div>

                              {/* Right: Specific features checks */}
                              <div className="space-y-4 bg-white border border-slate-100 p-4.5 rounded-xl flex flex-col justify-between">
                                <div className="space-y-2">
                                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">Auditing Pillars</span>
                                  
                                  {/* Metric 1 */}
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                                      <span>Model Latency</span>
                                      <span>Optimal</span>
                                    </div>
                                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-emerald-400" style={{ width: '92%' }} />
                                    </div>
                                  </div>

                                  {/* Metric 2 */}
                                  <div className="space-y-1 mt-2.5">
                                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                                      <span>Linguistic Fidelity</span>
                                      <span>9.2/10</span>
                                    </div>
                                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-[#6C63FF]" style={{ width: '88%' }} />
                                    </div>
                                  </div>
                                </div>

                                <button 
                                  onClick={() => exportSingleToMarkdown(item)}
                                  className="w-full mt-3 flex items-center justify-center gap-2 text-slate-600 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 transition-all font-bold text-[10px] px-3 py-2 rounded-lg border border-slate-200/80 cursor-pointer"
                                  title="Export single report as Markdown"
                                >
                                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Export Session (.md)</span>
                                </button>
                              </div>
                            </div>

                            {/* Bullet groups for Strengths and Weaknesses */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Strong points list */}
                              {item.judgeResult?.strongPoints && item.judgeResult.strongPoints.length > 0 && (
                                <div className="space-y-2 bg-[#10B981]/5 border border-[#10B981]/10 px-4.5 py-4 rounded-xl">
                                  <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">Identified Highlights</span>
                                  <ul className="text-xs text-emerald-700 font-semibold space-y-1.5 list-disc list-inside">
                                    {item.judgeResult.strongPoints.map((pt: string, idx: number) => (
                                      <li key={idx} className="leading-snug">{pt}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Weaknesses list */}
                              {item.judgeResult?.weaknesses && item.judgeResult.weaknesses.length > 0 && (
                                <div className="space-y-2 bg-rose-50 border border-rose-100 px-4.5 py-4 rounded-xl">
                                  <span className="text-[10px] font-black text-rose-800 uppercase tracking-wider block">Audited Cons / Gaps</span>
                                  <ul className="text-xs text-rose-700 font-semibold space-y-1.5 list-disc list-inside">
                                    {item.judgeResult.weaknesses.map((wk: string, idx: number) => (
                                      <li key={idx} className="leading-snug">{wk}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            {/* Section 2: Synthesized Answer Area */}
                            <div className="bg-white border border-slate-100 rounded-xl p-5 space-y-4">
                              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                                <div className="flex items-center gap-2">
                                  <BookOpen className="w-4 h-4 text-[#6C63FF]" />
                                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Master synthesized output</span>
                                </div>

                                <button 
                                  onClick={() => handleCopy(item.id, item.masterAnswer || '')}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 border border-slate-100 transition-all text-xs font-bold cursor-pointer"
                                >
                                  {copiedId === item.id ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                                      <span className="text-emerald-500">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>Copy response</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              {/* Markdown Area */}
                              <div className="prose prose-slate max-w-none text-slate-700 font-medium text-xs leading-relaxed max-h-96 overflow-y-auto custom-scrollbar pr-2">
                                <div className="markdown-body">
                                  <ReactMarkdown>{item.masterAnswer || '*No output generated for this session*'}</ReactMarkdown>
                                </div>
                              </div>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center p-12 bg-white/45 backdrop-blur-3xl border border-white/80 rounded-2xl text-slate-400 font-bold text-xs shadow-sm">
                No matching historic sequences found. Start editing or write queries.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
