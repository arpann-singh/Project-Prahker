import { useAIResponseStore } from '../../store/aiResponseStore';
import { motion } from 'framer-motion';
import { Trophy, Info, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function AIJudge() {
  const { judgeResult } = useAIResponseStore();

  if (!judgeResult) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white to-[#F5F8FF] border border-[#6C63FF]/25 rounded-2xl overflow-hidden flex shadow-[0_8px_32px_rgba(108,99,255,0.04)] relative"
    >
      <div className="w-[40px] border-r border-slate-100 flex flex-col items-center py-4 gap-6 bg-slate-50/50">
         <div className="text-[#6C63FF]"><Trophy className="w-5 h-5" /></div>
         <div className="opacity-30 hover:opacity-105 hover:text-[#6C63FF] transition-all"><ThumbsUp className="w-5 h-5" /></div>
         <div className="opacity-30 hover:opacity-105 hover:text-rose-500 transition-all"><ThumbsDown className="w-5 h-5" /></div>
      </div>
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
              AI Judge Recommendation
              <span className="px-2 py-0.5 rounded text-[10px] bg-[#6C63FF]/10 text-[#6C63FF] border border-[#6C63FF]/25">{(judgeResult.confidence * 100).toFixed(0)}% Confidence</span>
            </h3>
          </div>
          <button className="text-[10px] font-bold text-[#00A4D8] hover:underline uppercase tracking-tight">View Full Scorecard</button>
        </div>
        
        <div className="flex gap-6 items-start">
          <div className="flex-1 bg-white/70 border border-slate-100/80 rounded-xl p-4 text-xs leading-relaxed text-slate-600 shadow-sm">
            <span className="text-[#4E44E5] font-bold uppercase block mb-1">Winner: {judgeResult.bestProvider}</span>
            {judgeResult.reasoning}
          </div>
          
          <div className="w-[240px] space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-medium text-slate-400 tracking-wider">Master Answer Synthesis</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_8px_#10B981]"></span>
            </div>
            <button className="w-full py-2.5 bg-white/80 border border-[#6C63FF]/20 rounded-lg text-[11px] font-bold hover:bg-[#6C63FF]/5 hover:border-[#6C63FF]/30 transition-all uppercase tracking-widest text-[#6C63FF] shadow-sm">
              Synthesize Final Solution
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
