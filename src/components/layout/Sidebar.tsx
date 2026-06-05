import { Link, useLocation } from 'react-router-dom';
import { Zap, LayoutDashboard, History, BarChart, Settings, Plus, LogOut, ChevronLeft } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { motion } from 'framer-motion';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const location = useLocation();
  const { profile } = useUserProfile();
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!profile?.tokenResetTime) return;

    const updateTimer = () => {
      const diff = new Date(profile.tokenResetTime).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('Resetting...');
        return;
      }
      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hrs}h ${mins}m left`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 60000);
    return () => clearInterval(timer);
  }, [profile?.tokenResetTime]);

  const tokensLeft = profile ? Math.max(0, profile.tokenLimit - profile.tokensUsed) : 0;
  const percentageLeft = profile ? (tokensLeft / profile.tokenLimit) * 100 : 0;
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return (
    <div className="w-[240px] flex-shrink-0 flex flex-col h-screen border-r border-slate-100/80 bg-white/35 backdrop-blur-3xl shadow-[4px_0_24px_rgba(108,99,255,0.01)]">
      <div className="p-8 flex-1">
        <Link to="/" className="flex items-center gap-3 mb-10 group">
          <div className="w-10 h-10 bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] rounded-xl flex items-center justify-center shadow-[0_8px_20px_rgba(108,99,255,0.2)] group-hover:scale-105 transition-all duration-500">
            <Zap className="w-5 h-5 text-white fill-white/20" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg tracking-tight text-slate-900 font-bold leading-none">Echo Lens</span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#6C63FF] font-black mt-1">Orchestrator</span>
          </div>
        </Link>
 
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-[#6C63FF]/8 text-[#4E44E5] shadow-[0_4px_15px_rgba(108,99,255,0.05)] border border-[#6C63FF]/15' 
                    : 'text-slate-500 hover:text-slate-950 hover:bg-slate-100/50'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 transition-colors ${isActive ? 'text-[#6C63FF]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span className={`text-[13px] tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-[#6C63FF]" 
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
 
      <div className="p-8 space-y-6">
        {profile ? (
          <div className="glass-card p-5 border-slate-100 bg-white/45 hover:bg-white/60 transition-all">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] uppercase tracking-[0.12em] font-bold text-slate-400 truncate">Free Quota Left</span>
              <span className="text-[11px] font-mono font-bold text-[#6C63FF]">{Math.round(percentageLeft)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
              <motion.div 
                key={profile.tokensUsed}
                initial={{ width: 0 }}
                animate={{ width: `${percentageLeft}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full bg-gradient-to-r ${percentageLeft > 20 ? 'from-[#6C63FF] to-[#00D4FF]' : 'from-rose-500 to-red-400'}`}
              />
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <p className="text-slate-500 font-bold font-mono">
                {tokensLeft.toLocaleString()} / {profile.tokenLimit.toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold text-slate-400 font-mono">{timeLeft || 'Resetting...'}</span>
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${percentageLeft > 0 ? 'bg-[#10B981]' : 'bg-rose-500'}`} />
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card p-5 border-slate-100 bg-white/45 animate-pulse">
            <div className="h-3 bg-slate-200 rounded w-1/2 mb-3"></div>
            <div className="h-1.5 bg-slate-100 rounded mb-3"></div>
            <div className="h-2.5 bg-slate-100 rounded w-3/4"></div>
          </div>
        )}
 
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-xs font-bold uppercase tracking-widest text-[#E11D48]/70 hover:text-rose-600 hover:bg-rose-50 transition-all duration-300 border border-transparent hover:border-rose-100"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}
