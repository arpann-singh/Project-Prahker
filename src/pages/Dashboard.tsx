import Sidebar from '../components/layout/Sidebar';
import PromptBox from '../components/prompt/PromptBox';
import AIPanelGrid from '../components/workspace/AIPanelGrid';
import ComparisonEngine from '../components/comparison/ComparisonEngine';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Activity, Clock, ChevronRight, Plus, Cpu, Award, RefreshCw, Sparkles, Zap, Coins, ChevronDown, ChevronUp } from 'lucide-react';
import { useAIResponseStore } from '../store/aiResponseStore';
import { useUserProfile } from '../hooks/useUserProfile';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const { isGenerating } = useAIResponseStore();
  const { profile } = useUserProfile();
  const [resetTimeLeft, setResetTimeLeft] = useState('');
  const [isQuotaExpanded, setIsQuotaExpanded] = useState(true);

  useEffect(() => {
    if (!profile?.tokenResetTime) return;

    const updateTimer = () => {
      const diff = new Date(profile.tokenResetTime).getTime() - Date.now();
      if (diff <= 0) {
        setResetTimeLeft('Resetting...');
        return;
      }
      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setResetTimeLeft(`${hrs}h ${mins}m`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 60000);
    return () => clearInterval(timer);
  }, [profile?.tokenResetTime]);

  const monthlyUsed = profile?.monthlyTokensUsed || 0;
  const monthlyLimit = profile?.monthlyTokenLimit || 3000000;
  const monthlyRemaining = Math.max(0, monthlyLimit - monthlyUsed);
  const monthlyPercent = Math.min(100, Math.max(0, (monthlyUsed / monthlyLimit) * 100));

  const dailyUsed = profile?.tokensUsed || 0;
  const dailyLimit = profile?.tokenLimit || 100000;
  const dailyRemaining = Math.max(0, dailyLimit - dailyUsed);
  const dailyPercent = Math.min(100, Math.max(0, (dailyUsed / dailyLimit) * 100));

  const donutData = [
    { name: 'Consumed Limit', value: monthlyUsed || 1, color: '#6C63FF' },
    { name: 'Free Space Left', value: monthlyRemaining, color: '#E2E8F0' }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F8FC]">
      <Sidebar />
      
      <main className="flex-1 flex bg-[#F6F8FC]/50 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-12 custom-scrollbar">
          <div className="w-full max-w-7xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-slate-100 pb-6">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-display font-medium mb-1 tracking-tight text-slate-800"
                >
                  Dashboard
                </motion.h1>
                <div className="flex gap-2 items-center text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                   <Clock className="w-3 h-3" />
                   Last active: 2 mins ago
                   <ChevronRight className="w-2.5 h-2.5" />
                   <span className="text-slate-500 font-semibold">Workspace Alpha</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Compute Infrastructure</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse" />
                    <span className="text-[11px] font-mono font-bold text-[#10B981]/80">OPTIMIZED</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Token Quota Visualization Panel (Interactive Recharts Donut) */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="glass-card p-6 border-slate-100/90 bg-white/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(108,99,255,0.03)]"
            >
              <div 
                onClick={() => setIsQuotaExpanded(!isQuotaExpanded)}
                className={`flex items-center justify-between cursor-pointer select-none transition-all ${
                  isQuotaExpanded ? 'mb-6 border-b border-slate-100/80 pb-4' : 'mb-0 pb-0'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-[#6C63FF]" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Free Tier Quota Monitor</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Real-time Telemetry</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                  {/* Collapsed inline telemetry preview */}
                  {!isQuotaExpanded && (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="hidden md:flex items-center gap-4 text-xs font-mono font-bold"
                    >
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Daily:</span>
                        <span>{dailyUsed.toLocaleString()} / {dailyLimit.toLocaleString()}</span>
                        <span className="text-slate-500">({dailyPercent.toFixed(0)}%)</span>
                      </div>
                      <div className="text-slate-300 font-normal">|</div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Monthly:</span>
                        <span>{monthlyUsed.toLocaleString()} / {monthlyLimit.toLocaleString()}</span>
                        <span className="text-[#6C63FF]">({monthlyPercent.toFixed(1)}%)</span>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full px-3 py-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">ACTIVE SYNC</span>
                  </div>

                  <button 
                    onClick={() => setIsQuotaExpanded(!isQuotaExpanded)}
                    className="p-1.5 bg-slate-50 border border-slate-100/90 rounded-lg text-slate-400 hover:text-slate-800 transition-all hover:bg-slate-100 cursor-pointer"
                  >
                    {isQuotaExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isQuotaExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center pt-2">
                      {/* Left: Recharts Donut Chart */}
                      <div className="flex flex-col items-center justify-center bg-slate-50/40 border border-slate-100/60 rounded-2xl p-6 relative">
                        <div className="absolute top-3 left-3 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-[#6C63FF]" />
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Monthly Core</span>
                        </div>

                        <div className="relative w-44 h-44 flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={donutData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={70}
                                paddingAngle={3}
                                dataKey="value"
                                stroke="none"
                              >
                                {donutData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value: any) => [`${Math.round(value).toLocaleString()} tokens`, '']}
                                contentStyle={{ background: 'white', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '11px', fontWeight: 'bold' }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                          {/* Centered details */}
                          <div className="absolute text-center">
                            <span className="text-2xl font-black text-slate-800 font-mono tracking-tighter block leading-none">
                              {monthlyPercent === 0 && monthlyUsed > 0 ? '0.1%' : `${monthlyPercent.toFixed(1)}%`}
                            </span>
                            <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold mt-1 block">
                              Consumed
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-4 text-[10px] font-bold mt-2">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <span className="w-2.5 h-2.5 rounded bg-[#6C63FF]" />
                            <span>Spent</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <span className="w-2.5 h-2.5 rounded bg-[#E2E8F0]" />
                            <span>Free Left</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Detailed breakdown */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Monthly telemetry card */}
                          <div className="bg-white/80 border border-slate-100/80 p-4 rounded-xl shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Monthly Allowance</span>
                              <Sparkles className="w-4 h-4 text-[#00D4FF]" />
                            </div>
                            <div className="text-xl font-black text-slate-800 font-mono tracking-tight">
                              {monthlyUsed.toLocaleString()} <span className="text-xs text-slate-400 font-medium">/ {monthlyLimit.toLocaleString()}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-3">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${monthlyPercent}%` }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-[#6C63FF] to-[#00D4FF]"
                              />
                            </div>
                          </div>

                          {/* Daily telemetry card */}
                          <div className="bg-white/80 border border-slate-100/80 p-4 rounded-xl shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Daily Allowance</span>
                              <Cpu className="w-4 h-4 text-[#6C63FF]" />
                            </div>
                            <div className="text-xl font-black text-slate-800 font-mono tracking-tight">
                              {dailyUsed.toLocaleString()} <span className="text-xs text-slate-400 font-medium">/ {dailyLimit.toLocaleString()}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-3">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${dailyPercent}%` }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className={`h-full bg-gradient-to-r ${dailyPercent > 85 ? 'from-rose-500 to-red-400' : 'from-[#6C63FF] to-sky-400'}`}
                              />
                            </div>
                          </div>
                        </div>

                        {/* System limits notice */}
                        <div className="bg-slate-50/70 border border-slate-100/80 p-4 rounded-xl">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Quota Policy</span>
                              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                These quotas replenish automatically. The daily <strong>100k token allowance</strong> resets at UTC midnight. The <strong>3M monthly allowance</strong> resets monthly.
                              </p>
                            </div>
                            
                            <div className="flex-shrink-0 flex items-center gap-3 bg-white border border-slate-100 px-4 py-2.5 rounded-lg">
                              <RefreshCw className="w-4 h-4 text-[#6C63FF] animate-spin" style={{ animationDuration: '8s' }} />
                              <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Time to reset</span>
                                <span className="text-xs font-mono font-bold text-slate-800 leading-none">{resetTimeLeft || 'Resetting...'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Prompt Box Area */}
            <div className="relative">
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#6C63FF]/5 blur-[120px] pointer-events-none" />
              <PromptBox />
            </div>

            {/* AI Panels Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.3em] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#6C63FF]" /> Orchestration Output
                </h2>
                <button className="text-[9px] font-bold uppercase tracking-widest text-[#6C63FF]/60 hover:text-[#6C63FF] transition-colors flex items-center gap-1 group">
                   Add Provider <Plus className="w-3 h-3 group-hover:rotate-90 transition-transform" />
                </button>
              </div>
              <AIPanelGrid />
            </div>

            {/* Comparison Section */}
            <ComparisonEngine />
          </div>
        </div>

        {/* Right Insights Sidebar - Strategic integration */}
        <aside className="w-[320px] border-l border-slate-100 bg-white/45 backdrop-blur-3xl p-8 hidden xl:flex flex-col overflow-y-auto custom-scrollbar shadow-[-4px_0_24px_rgba(108,99,255,0.015)]">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-400">Telemetry</h3>
            <Layers className="w-4 h-4 text-slate-400/60" />
          </div>
          
          <div className="space-y-8 mb-12">
            <div className="space-y-4">
              <label className="text-[9px] font-bold uppercase text-slate-400 tracking-[0.2em]">Active Context</label>
              <div className="glass-card p-4 group hover:bg-[#6C63FF]/5 border-slate-100 transition-all duration-500">
                <div className="flex justify-between text-[10px] mb-2 uppercase font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                  <span>Project</span>
                  <span className="text-[#00B4D8] font-bold">Analytics v2</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium transition-colors group-hover:text-slate-700">Standardizing the telemetry ingress for legacy event systems.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="text-[9px] font-bold uppercase text-slate-400 tracking-[0.2em]">Protocol Stack</label>
              <div className="flex flex-wrap gap-2">
                {['Latency-First', 'TypeScript', 'Edge-Native', 'Strict-Types'].map(tag => (
                  <span key={tag} className="text-[9px] px-2.5 py-1.5 bg-white/60 text-slate-500 rounded-lg border border-slate-100 font-bold uppercase tracking-tight hover:border-[#6C63FF]/30 hover:text-slate-800 transition-all cursor-default shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-8">
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400 mb-8 flex items-center gap-2">
                Neural History
              </h3>
              <div className="space-y-8 relative ml-1">
                <div className="absolute left-0 top-1 bottom-1 w-[1px] bg-slate-100" />
                {[
                  { title: 'Optimized Prompt #42', time: '2m ago', color: '#6C63FF' },
                  { title: 'Synthesized Answer', time: '15m ago', color: '#00D4FF' },
                  { title: 'History Restored', time: '1h ago', color: '#10B981' }
                ].map((activity, i) => (
                  <div key={i} className="flex gap-4 relative pl-6 group">
                    <div className="absolute left-[-2px] top-1.5 w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-[#6C63FF] transition-colors" />
                    <div className="flex-1">
                      <div className="text-[11px] font-bold text-slate-400 group-hover:text-slate-700 transition-colors cursor-pointer">{activity.title}</div>
                      <div className="text-[9px] text-slate-400 font-mono tracking-tighter uppercase">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] rounded-2xl blur opacity-10 group-hover:opacity-25 transition duration-1000"></div>
                <div className="relative flex items-center justify-between gap-4 p-4 rounded-xl bg-white/80 border border-slate-100 backdrop-blur-xl shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-[#6C63FF] uppercase tracking-widest">Inference Node</span>
                    <span className="text-[12px] font-bold text-slate-800">ECHO-LENS-01</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <Activity className="w-4 h-4 text-[#6C63FF]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
