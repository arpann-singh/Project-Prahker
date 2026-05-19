import Sidebar from '../components/layout/Sidebar';
import PromptBox from '../components/prompt/PromptBox';
import AIPanelGrid from '../components/workspace/AIPanelGrid';
import ComparisonEngine from '../components/comparison/ComparisonEngine';
import { motion } from 'framer-motion';
import { Layers, Activity, Clock, ChevronRight, Plus } from 'lucide-react';
import { useAIResponseStore } from '../store/aiResponseStore';

export default function Dashboard() {
  const { isGenerating } = useAIResponseStore();

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0F]">
      <Sidebar />
      
      <main className="flex-1 flex flex-col bg-[#0C0C12] overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar">
          <div className="max-w-5xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-white/5 pb-6">
              <div>
                <h1 className="text-2xl font-display font-bold mb-1 tracking-tight text-white">Dashboard</h1>
                <div className="flex gap-2 items-center text-[10px] uppercase font-bold text-white/30 tracking-widest">
                   <Clock className="w-3 h-3" />
                   Last active: 2 mins ago
                   <ChevronRight className="w-2.5 h-2.5" />
                   Workspace Alpha
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Inference Hub</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
                    <span className="text-[11px] font-bold text-white/60">SYSTEM READY</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt Box */}
            <PromptBox />

            {/* AI Panels Grid */}
            <AIPanelGrid />

            {/* Comparison Section */}
            <ComparisonEngine />
          </div>
        </div>

        {/* Right Info Panel */}
        <aside className="w-[240px] border-l border-white/10 bg-[#0A0A0F] p-6 hidden xl:flex flex-col overflow-y-auto custom-scrollbar">
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-6">Session Context</h3>
          
          <div className="space-y-4 mb-10 overflow-y-auto">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-[#6C63FF]/30 transition-all">
              <div className="flex justify-between text-[10px] mb-2 uppercase font-bold text-white/30">
                <span>Last Project</span>
                <span className="text-[#00D4FF]">Analytics API</span>
              </div>
              <p className="text-xs text-white/60 line-clamp-2 italic leading-relaxed">"Develop a high-throughput endpoint for event tracking..."</p>
            </div>
            
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <div className="flex justify-between text-[10px] mb-2 uppercase font-bold text-white/30">
                <span>Constraint Stack</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {['No AWS', 'Rust-based', 'OpenSource'].map(tag => (
                  <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-[#6C63FF]/10 text-[#6C63FF] rounded border border-[#6C63FF]/20 font-bold uppercase tracking-tighter">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-6 flex items-center gap-2">
              Recent Activity
            </h3>
            <div className="space-y-5">
              {[
                { title: 'Optimized Prompt #42', time: '2 mins ago', color: '#6C63FF' },
                { title: 'Saved Master Answer', time: '15 mins ago', color: '#00D4FF' }
              ].map((activity, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-1 h-8 rounded-full" style={{ backgroundColor: activity.color }} />
                  <div>
                    <div className="text-[11px] font-bold text-white/80">{activity.title}</div>
                    <div className="text-[9px] text-white/40 italic">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
