import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Shield, Cpu, Layout, History, BarChart, Settings, ArrowRight, Play } from 'lucide-react';

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-[#6C63FF] to-[#00D4FF] rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl tracking-tight">AI ECHO LENS</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium hover:text-[#6C63FF] transition-colors">Login</Link>
            <Link to="/signup" className="px-5 py-2.5 bg-[#6C63FF] hover:bg-[#5B54D6] rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 min-h-[90vh] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#6C63FF]/20 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl z-10"
        >
          <h1 className="font-display text-6xl md:text-8xl mb-6 tracking-tighter leading-none bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            One Prompt. All AIs.<br />One <span className="text-[#6C63FF]">Perfect</span> Answer.
          </h1>
          <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto">
            Experience the next generation of AI workspaces. Simultaneous prompting, intelligent comparison, and master synthesis across the world's most powerful models.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link to="/signup" className="group px-8 py-4 bg-[#6C63FF] rounded-full font-bold flex items-center gap-2 hover:bg-[#5B54D6] transition-all hover:scale-105 electric-glow">
              Start Free Workspace <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 glass rounded-full font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
              <Play className="w-5 h-5 fill-white" /> View Demo
            </button>
          </div>
        </motion.div>

        {/* Live Demo Mock */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 w-full max-w-5xl mx-auto glass-card p-4 aspect-video relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A0F]/80 z-10" />
          <div className="grid grid-cols-2 gap-4 h-full">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass rounded-xl p-4 flex flex-col gap-3 relative">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <div className={`w-3 h-3 rounded-full ${i === 1 ? 'bg-blue-400' : i === 2 ? 'bg-orange-400' : i === 3 ? 'bg-purple-400' : 'bg-cyan-400'}`} />
                  <div className="h-3 w-20 bg-white/10 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-white/5 rounded" />
                  <div className="h-2 w-5/6 bg-white/5 rounded" />
                  <div className="h-2 w-4/6 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-3/4 bg-[#6C63FF] h-1 rounded-full overflow-hidden">
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-full h-full bg-white/50"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl mb-4">Precision Engineered Features</h2>
            <p className="text-white/40 max-w-xl mx-auto">Everything you need to orchestrate multiple intelligence systems in perfect harmony.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: "Simul-Prompting", desc: "Fire one prompt to multiple AI models simultaneously with zero latency." },
              { icon: Shield, title: "AI Judge", desc: "Our proprietary judge model scores each response for quality and accuracy." },
              { icon: Cpu, title: "Master Synthesis", desc: "Generate one perfect answer synthesized from the best elements of all outputs." },
              { icon: Layout, title: "Glass UI", desc: "Beautiful, distraction-free interface optimized for high-performance workflows." },
              { icon: History, title: "Full History", desc: "Restore any past session instantly with full context and scoring metrics preserved." },
              { icon: BarChart, title: "Advanced Metrics", desc: "Track token usage, latency, and composite scores for every provider." },
              { icon: Layout, title: "Multi-Modal", desc: "Upload images, docs, and code snippets to all models in one go." },
              { icon: Settings, title: "Custom Keys", desc: "Bring your own API keys for Gemini, Groq, and OpenRouter." }
            ].map((f, i) => (
              <div key={i} className="glass-card p-8 group">
                <div className="w-12 h-12 bg-[#6C63FF]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#6C63FF]/20 transition-colors">
                  <f.icon className="w-6 h-6 text-[#6C63FF]" />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-[#6C63FF]" />
            <span className="font-display text-lg tracking-tight">AI ECHO LENS</span>
          </div>
          <div className="flex gap-8 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
          <p className="text-sm text-white/20">© 2026 AI Echo Lens. Engineered for Intelligence.</p>
        </div>
      </footer>
    </div>
  );
}
