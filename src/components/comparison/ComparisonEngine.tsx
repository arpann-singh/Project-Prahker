import { useState } from 'react';
import { useAIResponseStore } from '../../store/aiResponseStore';
import { motion, AnimatePresence } from 'framer-motion';
import AIJudge from './AIJudge';
import MasterAnswerGenerator from '../master/MasterAnswerGenerator';
import { Shield, Sparkles, Table as TableIcon, Award, Zap, Clock, Star, ArrowRight } from 'lucide-react';

export default function ComparisonEngine() {
  const { judgeResult, responses } = useAIResponseStore();
  const [activeTab, setActiveTab] = useState<'rankings' | 'judge' | 'master'>('rankings');
  const [viewMode, setViewMode] = useState<'leaderboard' | 'grid'>('leaderboard');

  if (Object.keys(responses).length === 0) return null;

  // Compute best provider local state if judgeResult hasn't completed yet
  const sortedByComposite = Object.entries(responses).map(([p, r]: [string, any]) => ({
    provider: p,
    composite: r.scores?.composite || 0,
    quality: r.scores?.quality || 0,
    accuracy: r.scores?.accuracy || 0,
    creativity: r.scores?.creativity || 0,
    latencyMs: r.latencyMs || 0,
    modelName: r.model || 'Unknown Model'
  })).sort((a, b) => b.composite - a.composite);

  const highestScoreObj = sortedByComposite[0];

  return (
    <div className="bg-white/45 backdrop-blur-3xl border border-white/80 rounded-3xl mt-12 overflow-hidden shadow-[0_15px_50px_rgba(108,99,255,0.03)] text-slate-800">
      <div className="flex gap-1 p-2 bg-slate-100/50 border-b border-slate-100">
        {[
          { id: 'rankings', label: 'Evaluation Rankings', icon: TableIcon },
          { id: 'judge', label: 'AI Evaluator & Diff', icon: Shield },
          { id: 'master', label: 'Master Synthesis', icon: Sparkles },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-[#6C63FF]/15 text-[#4E44E5] border border-[#6C63FF]/30 shadow-[0_4px_15px_rgba(108,99,255,0.05)]' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'rankings' && (
            <motion.div 
              key="rankings"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Toggle Sub Views */}
              <div className="flex justify-between items-center bg-slate-50/50 p-1.5 rounded-xl border border-slate-100 max-w-sm">
                <button
                  onClick={() => setViewMode('leaderboard')}
                  className={`flex-1 text-[10px] font-bold uppercase py-1.5 rounded-lg transition-all tracking-wider ${
                    viewMode === 'leaderboard' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Visual Leaderboard
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 text-[10px] font-bold uppercase py-1.5 rounded-lg transition-all tracking-wider ${
                    viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Comparison Grid
                </button>
              </div>

              {viewMode === 'leaderboard' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Top Performer Card */}
                  <div className="lg:col-span-1 bg-gradient-to-br from-[#6C63FF]/5 to-[#00D4FF]/5 border border-[#6C63FF]/20 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#6C63FF]/5 rounded-bl-full pointer-events-none" />
                    <div>
                      <div className="w-10 h-10 bg-[#6C63FF]/15 border border-[#6C63FF]/20 text-[#6C63FF] rounded-xl flex items-center justify-center mb-4">
                        <Award className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#6C63FF] block mb-1">Session Champion</span>
                      <h3 className="text-xl font-display font-extrabold text-slate-800 uppercase tracking-wide truncate">
                        {highestScoreObj?.provider || 'Calculating'}
                      </h3>
                      <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase leading-none font-bold italic">{highestScoreObj?.modelName}</p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-slate-100 space-y-3">
                      <div className="flex justify-between text-xs font-semibold text-slate-500">
                        <span>Latency Benchmark</span>
                        <span className="font-mono text-slate-850 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#00D4FF]" /> {highestScoreObj?.latencyMs} ms</span>
                      </div>
                      <div className="flex justify-between text-xs font-semibold text-slate-500">
                        <span>Composite Accuracy</span>
                        <span className="font-mono text-[#6C63FF] font-extrabold flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {highestScoreObj?.composite?.toFixed(1) ?? '0.0'} / 10</span>
                      </div>
                    </div>
                  </div>

                  {/* Leaderboard Chart List */}
                  <div className="lg:col-span-2 space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Response Speed vs Quality Metric Score</h4>
                    <div className="space-y-3">
                      {sortedByComposite.map((item, idx) => (
                        <div key={item.provider} className="bg-white/60 border border-slate-105 p-4 rounded-xl flex items-center justify-between gap-4 hover:border-slate-205 transition-all">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span className="font-mono font-black text-slate-350 text-xs w-5">#0{idx + 1}</span>
                            <div className="min-w-0">
                              <span className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider block">{item.provider}</span>
                              <span className="text-[9px] font-mono font-bold uppercase text-slate-400 truncate block mt-0.5 leading-none">{item.modelName}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-8 flex-shrink-0">
                            {/* SVG mini latency dot line */}
                            <div className="hidden sm:flex flex-col text-right">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Latency</span>
                              <span className="text-[11px] font-mono font-semibold text-slate-600">{item.latencyMs}ms</span>
                            </div>

                            {/* Bar score meter */}
                            <div className="w-[120px] bg-slate-100 h-2 rounded-full overflow-hidden relative">
                              <div 
                                className="h-full bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] rounded-full"
                                style={{ width: `${item.composite * 10}%` }}
                              />
                            </div>

                            <span className="font-mono text-xs font-black text-[#6C63FF] w-8 text-right">
                              {item.composite.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="py-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest">Provider</th>
                        <th className="py-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest">Quality</th>
                        <th className="py-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest">Accuracy</th>
                        <th className="py-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest">Creativity</th>
                        <th className="py-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest text-right">Composite</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {Object.entries(responses).map(([p, r]: [string, any]) => (
                        <tr key={p} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="py-5 font-bold text-xs uppercase tracking-widest text-slate-700">{p}</td>
                          <td className="py-5">
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#10B981] group-hover:bg-[#34D399] transition-colors" style={{ width: `${(r.scores?.quality || 0) * 10}%` }} />
                            </div>
                          </td>
                          <td className="py-5">
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#00D4FF] group-hover:bg-[#38BDF8] transition-colors" style={{ width: `${(r.scores?.accuracy || 0) * 10}%` }} />
                            </div>
                          </td>
                          <td className="py-5">
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#F59E0B] group-hover:bg-[#FBBF24] transition-colors" style={{ width: `${(r.scores?.creativity || 0) * 10}%` }} />
                            </div>
                          </td>
                          <td className="py-5 text-right font-mono text-xs font-bold text-[#6C63FF]">
                            {(r.scores?.composite || 0).toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'judge' && (
            <div key="judge">
              {!judgeResult ? (
                <div className="text-center py-12 text-slate-400/60 italic font-semibold">Judge is analyzing...</div>
              ) : (
                <AIJudge />
              )}
            </div>
          )}

          {activeTab === 'master' && (
            <div key="master">
              <MasterAnswerGenerator />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
