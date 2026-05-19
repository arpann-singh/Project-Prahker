import Sidebar from '../components/layout/Sidebar';
import { motion } from 'framer-motion';
import { Search, Filter, Trash2, ExternalLink, Calendar, Cpu } from 'lucide-react';
import { useState } from 'react';

export default function History() {
  const [search, setSearch] = useState('');

  const mockHistory = [
    { id: '1', prompt: 'Optimizing high-concurrency Node.js servers...', date: '2024-03-24', models: ['Gemini', 'Groq'], rating: 9.2 },
    { id: '2', prompt: 'Explain quantum entanglement to a five year old...', date: '2024-03-23', models: ['DeepSeek'], rating: 8.5 },
    { id: '3', prompt: 'Write a React hook for managing global state...', date: '2024-03-22', models: ['Gemini', 'DeepSeek', 'Groq'], rating: 9.8 },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0F]">
      <Sidebar />
      <main className="flex-1 flex flex-col bg-[#0C0C12] overflow-y-auto px-8 py-10 custom-scrollbar">
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex justify-between items-end mb-10 border-b border-white/5 pb-6">
            <div>
              <h1 className="text-2xl font-display font-bold text-white mb-1">Session History</h1>
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/30">Review and restore your past orchestrations.</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-red-400/40 hover:text-red-400 transition-all">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex gap-4 mb-8">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#6C63FF] transition-colors" />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search past sequences..." 
                className="w-full pl-12 pr-4 py-3 bg-[#12121A] border border-white/10 rounded-xl focus:border-[#6C63FF]/50 outline-none text-sm font-medium transition-all"
              />
            </div>
            <button className="px-5 py-3 bg-[#12121A] border border-white/10 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>

          {/* History List */}
          <div className="space-y-3">
            {mockHistory.map((item) => (
              <motion.div 
                key={item.id}
                whileHover={{ scale: 1.005, x: 5 }}
                className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer group hover:bg-white/[0.07] transition-all"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-white/90 group-hover:text-[#6C63FF] transition-colors line-clamp-1 mb-2">{item.prompt}</h3>
                  <div className="flex gap-4 text-[10px] uppercase font-bold tracking-widest text-white/30">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {item.date}</span>
                    <span className="flex items-center gap-1.5"><Cpu className="w-3 h-3" /> {item.models.join(', ')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-[9px] uppercase font-bold text-white/20 mb-1 tracking-tighter">Composite</div>
                    <div className="text-lg font-mono font-bold text-[#10B981]">{item.rating}</div>
                  </div>
                  <div className="p-2 bg-black/20 rounded-lg text-white/20 group-hover:text-white transition-all">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
