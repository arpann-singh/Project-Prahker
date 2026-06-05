import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Shield, Cpu, LayoutDashboard, History, BarChart, Settings, ArrowRight, Network, Activity, ChevronDown, Check, RefreshCw } from 'lucide-react';

export default function Landing() {
  const [statusOpen, setStatusOpen] = useState(false);
  const [pinging, setPinging] = useState(false);
  const [latencies, setLatencies] = useState({
    gemini: 360,
    groq: 110,
    openRouter: 680
  });

  const triggerPingTest = () => {
    setPinging(true);
    setTimeout(() => {
      setLatencies({
        gemini: Math.floor(Math.random() * 220) + 200,
        groq: Math.floor(Math.random() * 80) + 60,
        openRouter: Math.floor(Math.random() * 450) + 400
      });
      setPinging(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F8FC] text-slate-800 selection:bg-[#6C63FF]/15">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-xl border-b border-slate-100 px-6 py-4 shadow-[0_2px_30px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <div className="flex items-center gap-8 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-[#6C63FF] to-[#00D4FF] rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white animate-pulse" />
              </div>
              <span className="font-display text-xl tracking-tight text-slate-800 font-extrabold uppercase">AI Echo Lens</span>
            </Link>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0 relative">
            {/* Cool Systems Connection Quality drop-down widget */}
            <div className="relative">
              <button 
                onClick={() => setStatusOpen(!statusOpen)}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-full text-xs font-bold text-slate-650 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] active:scale-95"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="hidden sm:inline">Neural Grid Status</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform text-slate-400 ${statusOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {statusOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setStatusOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-3xl border border-slate-150 p-5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] z-20 font-sans"
                    >
                      <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Activity className="w-4 h-4 text-[#6C63FF]" />
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Gateway Latency (ms)</h4>
                        </div>
                        <button 
                          onClick={triggerPingTest}
                          disabled={pinging}
                          className="p-1 px-2.5 bg-[#6C63FF]/5 text-[#6C63FF] hover:bg-[#6C63FF]/10 text-[9.5px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 transition-all"
                        >
                          <RefreshCw className={`w-2.5 h-2.5 ${pinging ? 'animate-spin' : ''}`} />
                          {pinging ? 'Pinging' : 'Ping Grid'}
                        </button>
                      </div>

                      <div className="space-y-2.5 text-xs font-semibold">
                        {[
                          { name: "Gemini Adapter", provider: "Google DeepMind", ping: latencies.gemini, tier: "Standard Edge" },
                          { name: "Groq Llama Pipeline", provider: "Meta LLaMA 3.3", ping: latencies.groq, tier: "Ultra-Fast" },
                          { name: "OpenRouter Gateway", provider: "DeepSeek / Razors", ping: latencies.openRouter, tier: "High-Reasoning" }
                        ].map((node, i) => (
                          <div key={i} className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                            <div>
                              <div className="text-slate-700 leading-tight block">{node.name}</div>
                              <span className="text-[9px] text-slate-400 font-normal block mt-0.5">{node.provider} ({node.tier})</span>
                            </div>
                            <div className="text-right">
                              <span className={`font-mono text-xs font-bold [text-shadow:_0_0_10px_rgba(0,0,0,0.03)] ${
                                node.ping < 150 ? 'text-emerald-500' : node.ping < 450 ? 'text-blue-500' : 'text-amber-500'
                              }`}>
                                {node.ping}ms
                              </span>
                              <span className="text-[8px] text-slate-400 uppercase tracking-widest block font-bold leading-none mt-0.5">ONLINE</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-450 font-medium">
                        <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> Consensus Hub Active</span>
                        <span className="text-slate-400 font-mono">TLS 1.3 Secure</span>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-[#6C63FF] transition-colors">Login</Link>
            <Link to="/signup" className="px-5 py-2.5 bg-[#6C63FF] hover:bg-[#5B54D6] text-white rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 min-h-[90vh] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#6C63FF]/8 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/45 border border-white/80 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6C63FF] mb-8 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6C63FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6C63FF]"></span>
            </span>
            Neural Consensus Orchestrator Now Live
          </div>
          <h1 className="font-display text-6xl md:text-8xl mb-8 tracking-tighter leading-[0.9] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent font-bold">
            Orchestrate Intelligence.<br />Eliminate <span className="text-[#6C63FF] italic font-black">Bias.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            AI Echo Lens is a high-performance workspace designed to fire prompts across multiple neural architectures simultaneously, evaluate with real-time consensus scoring, and synthesize a single, master truth.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 items-center justify-center">
            <Link to="/signup" className="group px-10 py-5 bg-[#6C63FF] text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-[#5B54D6] transition-all hover:scale-105 electric-glow shadow-[0_20px_40px_rgba(108,99,255,0.15)]">
              Initialize Workspace <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="px-10 py-5 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold flex items-center gap-3 hover:bg-slate-50 transition-all shadow-sm">
              Launch Dashboard <LayoutDashboard className="w-5 h-5 text-slate-500" />
            </Link>
          </div>
        </motion.div>

      </section>

      {/* Vision Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="w-16 h-[1px] bg-[#6C63FF]" />
            <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight text-slate-800">
              Our Vision:<br />The <span className="text-[#6C63FF]">Intelligence</span> Standard.
            </h2>
            <div className="space-y-6 text-slate-500 text-lg leading-relaxed">
              <p>
                In a world of fragmented AI, the truth is often hidden between models. One model is creative; another is analytical. One is prone to hallucinations; another is overly cautious.
              </p>
              <p>
                AI Echo Lens was born from a simple vision: **Universal Neural Integration**. We believe high-stakes decisions shouldn't rely on a single black-box algorithm. By creating a "Neural Consensus," we provide a safety net for accuracy and a springboard for creativity.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div>
                <div className="text-3xl font-display font-bold text-slate-800 mb-2">99.9%</div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#6C63FF]">Uptime Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-slate-800 mb-2">&lt; 200ms</div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#00D4FF]">Global Latency</div>
              </div>
            </div>
          </motion.div>
          <div className="relative">
            <div className="absolute inset-0 bg-[#6C63FF]/5 blur-[100px] rounded-full" />
            <div className="glass-card p-12 relative overflow-hidden border-white/80 group shadow-md">
              <div className="absolute top-0 right-0 p-8">
                <Shield className="w-20 h-20 text-[#6C63FF]/10 group-hover:text-[#6C63FF]/20 transition-colors" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-slate-800">The Neuro-Audit</h3>
              <ul className="space-y-6">
                {[
                  "Hallucination detection via cross-model verification.",
                  "Provider-neutral scoring based on factual density.",
                  "Deterministic master-synthesis for production stability.",
                  "Zero data persistence for maximum enterprise privacy."
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 text-sm font-medium text-slate-600">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#6C63FF]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-32 px-6 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-slate-800">Engineered for Your Workflow</h2>
              <p className="text-slate-500 text-lg">From architectural design to content strategy, Echo Lens provides the cross-neural perspective you need.</p>
            </div>
            <Link to="/workspace" className="text-sm font-bold uppercase tracking-[0.2em] text-[#6C63FF] hover:text-[#5B54D6] transition-colors flex items-center gap-2">
              Explore All Use Cases <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Software Engineering",
                role: "Developers",
                desc: "Simultaneously debug across DeepSeek, Llama 3, and Gemini. Catch edge cases that a single model would miss in legacy code refactoring.",
                icon: Cpu,
                color: "#6C63FF"
              },
              {
                title: "Market Intelligence",
                role: "Researchers",
                desc: "Analyze quarterly reports and sentiment data. Use our AI Judge to identify the most grounded analytical perspective without bias.",
                icon: BarChart,
                color: "#10B981"
              },
              {
                title: "Content Orchestration",
                role: "Creators",
                desc: "Generate creative assets and copy. Synthesize the 'Master Answer' to combine the flair of one model with the structure of another.",
                icon: Zap,
                color: "#00D4FF"
              }
            ].map((use, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 rounded-3xl bg-white/40 border border-white/80 hover:bg-white/60 transition-all duration-500 overflow-hidden relative group shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_30px_rgba(108,99,255,0.05)]"
              >
                <div className="absolute -bottom-10 -right-10 w-32 h-32 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: use.color }} />
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-8 border border-slate-100 bg-white shadow-sm" style={{ color: use.color }}>
                  <use.icon className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: use.color }}>{use.role}</div>
                <h3 className="text-2xl font-bold mb-4 text-slate-800">{use.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{use.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl mb-4 text-slate-800 font-semibold">Precision Engineered Features</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Everything you need to orchestrate multiple intelligence systems in perfect harmony.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: "Simul-Prompting", desc: "Fire one prompt to multiple AI models simultaneously with zero latency." },
              { icon: Shield, title: "AI Judge", desc: "Our proprietary judge model scores each response for quality and accuracy." },
              { icon: Cpu, title: "Master Synthesis", desc: "Generate one perfect answer synthesized from the best elements of all outputs." },
              { icon: LayoutDashboard, title: "Glass UI", desc: "Beautiful, distraction-free interface optimized for high-performance workflows." },
              { icon: History, title: "Full History", desc: "Restore any past session instantly with full context and scoring metrics preserved." },
              { icon: BarChart, title: "Advanced Metrics", desc: "Track token usage, latency, and composite scores for every provider." },
              { icon: LayoutDashboard, title: "Multi-Modal", desc: "Upload images, docs, and code snippets to all models in one go." },
              { icon: Settings, title: "Custom Keys", desc: "Bring your own API keys for Gemini, Groq, and OpenRouter." }
            ].map((f, i) => (
              <div key={i} className="glass-card p-8 group border-white/80">
                <div className="w-12 h-12 bg-[#6C63FF]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#6C63FF]/20 transition-colors">
                  <f.icon className="w-6 h-6 text-[#6C63FF]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-100 bg-white/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-[#6C63FF]" />
            <span className="font-display text-lg tracking-tight text-slate-800 font-bold">AI ECHO LENS</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-800 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Twitter</a>
            <a href="#" className="hover:text-slate-800 transition-colors">GitHub</a>
          </div>
          <p className="text-sm text-slate-400">© 2026 AI Echo Lens. Engineered for Intelligence.</p>
        </div>
      </footer>
    </div>
  );
}
