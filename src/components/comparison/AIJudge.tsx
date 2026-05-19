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
      className="bg-gradient-to-br from-[#12121A] to-[#0A0A0F] border border-[#6C63FF]/30 rounded-2xl overflow-hidden flex shadow-2xl relative"
    >
      <div className="w-[40px] border-r border-white/5 flex flex-col items-center py-4 gap-6 bg-white/[0.02]">
         <div className="text-[#6C63FF]"><Trophy className="w-5 h-5" /></div>
         <div className="opacity-30 hover:opacity-100 transition-opacity"><ThumbsUp className="w-5 h-5" /></div>
         <div className="opacity-30 hover:opacity-100 transition-opacity"><ThumbsDown className="w-5 h-5" /></div>
      </div>
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              AI Judge Recommendation
              <span className="px-2 py-0.5 rounded text-[10px] bg-[#6C63FF]/20 text-[#6C63FF] border border-[#6C63FF]/30">{(judgeResult.confidence * 100).toFixed(0)}% Confidence</span>
            </h3>
          </div>
          <button className="text-[10px] font-bold text-[#00D4FF] hover:underline uppercase tracking-tight">View Full Scorecard</button>
        </div>
        
        <div className="flex gap-6 items-start">
          <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl p-3 text-xs leading-relaxed text-white/70">
            <span className="text-[#6C63FF] font-bold uppercase block mb-1">Winner: {judgeResult.bestProvider}</span>
            {judgeResult.reasoning}
          </div>
          
          <div className="w-[240px] space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-medium text-white/30 tracking-wider">Master Answer Synthesis</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_8px_#10B981]"></span>
            </div>
            <button className="w-full py-2.5 bg-white/5 border border-white/10 rounded-lg text-[11px] font-bold hover:bg-white/10 transition-colors uppercase tracking-widest text-[#6C63FF]">
              Synthesize Final Solution
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
