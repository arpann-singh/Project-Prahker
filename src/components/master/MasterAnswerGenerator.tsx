import { useAIResponseStore } from '../../store/aiResponseStore';
import { motion } from 'framer-motion';
import { Sparkles, Copy, Share, Download, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

export default function MasterAnswerGenerator() {
  const { masterAnswer } = useAIResponseStore();
  const [copied, setCopied] = useState(false);

  if (!masterAnswer) return (
    <div className="text-center py-12 text-white/20 italic">Master Answer is being synthesized...</div>
  );

  const copyToClipboard = () => {
    navigator.clipboard.writeText(masterAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <h2 className="text-xl font-display font-bold text-white tracking-tight">Master Answer</h2>
            <p className="text-xs font-bold uppercase tracking-widest text-white/30">Synthesized Definitive Version</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={copyToClipboard}
            className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-[#6C63FF] hover:border-[#6C63FF]/30 transition-all shadow-sm"
          >
            {copied ? <Check className="w-5 h-5 text-[#10B981]" /> : <Copy className="w-5 h-5" />}
          </button>
          <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all"><Download className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="bg-[#0A0A0F] p-8 rounded-3xl border border-white/10 shadow-inner relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#6C63FF] to-[#00D4FF]" />
        <div className="prose prose-invert max-w-none prose-sm prose-p:leading-relaxed prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/5">
          <ReactMarkdown>{masterAnswer}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}
