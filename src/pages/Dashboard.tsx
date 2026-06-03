import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import PromptBox from '../components/prompt/PromptBox';
import AIPanelGrid from '../components/workspace/AIPanelGrid';
import ComparisonEngine from '../components/comparison/ComparisonEngine';
import { motion } from 'framer-motion';
import { Clock, ChevronRight, Command, Search, Sparkles } from 'lucide-react';
import { useAIResponseStore } from '../store/aiResponseStore';

// Animation variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  const { isGenerating } = useAIResponseStore();

  return (
    <div className="flex h-screen overflow-hidden bg-[#050508] relative selection:bg-[#6C63FF]/30 selection:text-white">

      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#6C63FF]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-[#00D4FF]/10 blur-[120px] pointer-events-none" />

      <Sidebar />

      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">

        {/* Top Navigation / Command Bar */}
        <header className="h-16 border-b border-white/[0.05] bg-white/[0.01] backdrop-blur-xl flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-white/50 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/[0.05]">
              <Sparkles className="w-3.5 h-3.5 text-[#6C63FF]" />
              <span>Workspace Alpha</span>
            </div>
          </div>

          {/* Fake Command Palette Trigger */}
          <button className="flex items-center gap-3 px-4 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-white/40 hover:text-white/70 hover:bg-white/[0.05] transition-all group">
            <Search className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Search or jump to...</span>
            <div className="flex items-center gap-1 ml-4 opacity-50 group-hover:opacity-100 transition-opacity">
              <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-sans flex items-center"><Command className="w-3 h-3" /></kbd>
              <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-sans">K</kbd>
            </div>
          </button>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar flex flex-col scroll-smooth">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-6xl mx-auto space-y-8 flex flex-col flex-1 w-full"
          >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="flex justify-between items-end pb-4">
              <div>
                <h1 className="text-3xl font-display font-bold mb-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                  Intelligence Orchestration
                </h1>
                <div className="flex gap-2 items-center text-[11px] uppercase font-bold text-white/40 tracking-widest">
                  <Clock className="w-3.5 h-3.5" />
                  Session active
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-[#10B981] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                    All Systems Nominal
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Prompt Box */}
            <motion.div variants={itemVariants} className="relative z-20">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#6C63FF]/20 to-[#00D4FF]/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition duration-500" />
              <PromptBox />
            </motion.div>

            {/* AI Panels Grid */}
            <motion.div variants={itemVariants} className="flex-1 flex flex-col">
              <AIPanelGrid />
            </motion.div>

            {/* Comparison Section */}
            <motion.div variants={itemVariants}>
              <ComparisonEngine />
            </motion.div>
          </motion.div>
        </div>

      </main>
    </div>
  );
}