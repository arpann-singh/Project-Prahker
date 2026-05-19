import { useState } from 'react';
import { useAIResponseStore } from '../../store/aiResponseStore';
import { motion, AnimatePresence } from 'framer-motion';
import AIJudge from './AIJudge';
import MasterAnswerGenerator from '../master/MasterAnswerGenerator';
import { Shield, Sparkles, Table as TableIcon } from 'lucide-react';

export default function ComparisonEngine() {
  const { judgeResult, responses } = useAIResponseStore();
  const [activeTab, setActiveTab] = useState<'rankings' | 'judge' | 'master'>('rankings');

  if (Object.keys(responses).length === 0) return null;

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-3xl mt-12 overflow-hidden shadow-2xl">
      <div className="flex gap-1 p-2 bg-black/40 border-b border-white/5">
        {[
          { id: 'rankings', label: 'Rankings', icon: TableIcon },
          { id: 'judge', label: 'AI Judge', icon: Shield },
          { id: 'master', label: 'Master Answer', icon: Sparkles },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-[#6C63FF]/20 text-[#6C63FF] border border-[#6C63FF]/30 shadow-[0_0_15px_rgba(108,99,255,0.1)]' 
                : 'text-white/30 hover:text-white/60'
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
              className="overflow-x-auto"
            >
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="py-4 text-[10px] uppercase font-bold text-white/20 tracking-widest">Provider</th>
                    <th className="py-4 text-[10px] uppercase font-bold text-white/20 tracking-widest">Quality</th>
                    <th className="py-4 text-[10px] uppercase font-bold text-white/20 tracking-widest">Accuracy</th>
                    <th className="py-4 text-[10px] uppercase font-bold text-white/20 tracking-widest">Creativity</th>
                    <th className="py-4 text-[10px] uppercase font-bold text-white/20 tracking-widest text-right">Composite</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {Object.entries(responses).map(([p, r]: [string, any]) => (
                    <tr key={p} className="group hover:bg-white/[0.01] transition-colors">
                      <td className="py-5 font-bold text-xs uppercase tracking-widest text-white/80">{p}</td>
                      <td className="py-5">
                        <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-[#10B981] group-hover:bg-[#34D399] transition-colors" style={{ width: `${(r.scores?.quality || 0) * 10}%` }} />
                        </div>
                      </td>
                      <td className="py-5">
                        <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-[#00D4FF] group-hover:bg-[#38BDF8] transition-colors" style={{ width: `${(r.scores?.accuracy || 0) * 10}%` }} />
                        </div>
                      </td>
                      <td className="py-5">
                        <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
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
            </motion.div>
          )}

          {activeTab === 'judge' && (
            <div key="judge">
              {!judgeResult ? (
                <div className="text-center py-12 text-white/20 italic">Judge is analyzing...</div>
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
