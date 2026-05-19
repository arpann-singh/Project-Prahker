import { Link, useLocation } from 'react-router-dom';
import { Zap, Layout, History, BarChart, Settings, Plus, LogOut, ChevronLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const location = useLocation();
  
  const navItems = [
    { icon: Layout, label: 'Dashboard', path: '/dashboard' },
    { icon: Layout, label: 'Workspace', path: '/workspace' },
    { icon: History, label: 'History', path: '/history' },
    { icon: BarChart, label: 'Analytics', path: '/analytics' },
  ];

  return (
    <div className="w-[220px] flex-shrink-0 flex flex-col h-screen border-r border-white/10 bg-[#0A0A0F]">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 mb-8 group">
          <div className="w-8 h-8 bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(108,99,255,0.4)] group-hover:scale-110 transition-transform">
            <span className="font-black text-white text-xs">EL</span>
          </div>
          <span className="font-display text-lg tracking-tight text-white font-bold">Echo Lens</span>
        </Link>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center gap-3 p-2 rounded-md transition-all ${
                  isActive 
                    ? 'bg-white/5 text-[#6C63FF] border-l-2 border-[#6C63FF]' 
                    : 'text-white/60 hover:text-white hover:bg-white/5 opacity-60 hover:opacity-100'
                }`}
              >
                <div className={`w-4 h-4 rounded-sm border ${isActive ? 'border-[#6C63FF]' : 'border-current'}`} />
                <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-white/50">Usage</span>
            <span className="text-[10px] font-mono text-[#00D4FF]">72%</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '72%' }}
              className="h-full bg-gradient-to-r from-[#6C63FF] to-[#00D4FF]"
            />
          </div>
          <p className="text-[10px] mt-2 text-white/50">842 / 1,200 Prompts</p>
        </div>

        <button 
          onClick={() => supabase.auth.signOut()}
          className="mt-6 flex items-center gap-3 px-2 py-2 w-full rounded-lg text-xs font-medium text-red-400/40 hover:text-red-400 hover:bg-red-400/5 transition-all"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}
