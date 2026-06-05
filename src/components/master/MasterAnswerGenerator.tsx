import { useAIResponseStore } from '../../store/aiResponseStore';
import { motion } from 'framer-motion';
import { Sparkles, Copy, Share, Download, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

export default function MasterAnswerGenerator() {
  const { masterAnswer } = useAIResponseStore();
  const [copied, setCopied] = useState(false);

  if (!masterAnswer) return (
    <div className="text-center py-12 text-slate-400/60 italic font-semibold">Master Answer is being synthesized...</div>
  );

  const copyToClipboard = () => {
    navigator.clipboard.writeText(masterAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    if (!masterAnswer) return;
    const blob = new Blob([masterAnswer], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `echo_lens_master_answer_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    if (!masterAnswer) return;
    const currentState = useAIResponseStore.getState();
    const data = {
      source: 'AI Echo Lens Orchestrator',
      timestamp: new Date().toISOString(),
      masterAnswer,
      judgeResult: currentState.judgeResult,
      responses: Object.entries(currentState.responses).reduce((acc, [p, r]: any) => {
        acc[p] = {
          model: r.model,
          content: r.content,
          latencyMs: r.latencyMs,
          scores: r.scores
        };
        return acc;
      }, {} as any)
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `echo_lens_session_bundle_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-[#6C63FF]/10 rounded-2xl flex items-center justify-center text-[#6C63FF] border border-[#6C63FF]/20 shadow-[0_0_15px_rgba(108,99,255,0.1)]">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-slate-800 tracking-tight">Master Answer</h2>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Synthesized Definitive Version</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={copyToClipboard}
            title="Copy Master Answer"
            className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[#6C63FF] hover:border-[#6C63FF]/30 transition-all shadow-sm"
          >
            {copied ? <Check className="w-5 h-5 text-[#10B981]" /> : <Copy className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={downloadMarkdown}
            title="Download MD"
            className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[#6C63FF] hover:border-[#6C63FF]/30 transition-all shadow-sm flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            MD
          </button>

          <button 
            onClick={downloadJSON}
            title="Export JSON metadata"
            className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[#6C63FF] hover:border-[#6C63FF]/30 transition-all shadow-sm flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
          >
            <Download className="w-4 h-4 text-[#00D4FF]" />
            JSON
          </button>
        </div>
      </div>

      <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100/80 shadow-inner relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#6C63FF] to-[#00D4FF]" />
        <div className="prose prose-slate max-w-none prose-sm prose-p:leading-relaxed prose-pre:bg-slate-105 prose-pre:border prose-pre:border-slate-150">
          <ReactMarkdown>{masterAnswer}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}
