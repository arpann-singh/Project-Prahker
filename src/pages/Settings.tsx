import Sidebar from '../components/layout/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, User, Bell, CreditCard, Shield, Globe, Moon, Save } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'api' | 'account' | 'billing'>('api');

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F8FC]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar text-slate-800 bg-[#F6F8FC]/50">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-display font-medium mb-10 tracking-tight text-slate-850">Control Center</h1>

          <div className="flex flex-col md:flex-row gap-10">
            {/* Tabs */}
            <aside className="w-full md:w-[200px] flex-shrink-0">
              <nav className="flex md:flex-col gap-2">
                {[
                  { id: 'api', label: 'API Keys', icon: Key },
                  { id: 'account', label: 'Account', icon: User },
                  { id: 'billing', label: 'Billing', icon: CreditCard },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      activeTab === tab.id 
                        ? 'bg-[#6C63FF] text-white shadow-[0_4px_15px_rgba(108,99,255,0.2)]' 
                        : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100/50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Content */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                {activeTab === 'api' && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <section>
                      <h3 className="text-base font-bold mb-6 text-slate-700 uppercase tracking-wider text-xs">Provider Endpoints & Keys</h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Gemini API Key', description: 'Used for Gemini 1.5 Pro and 3.5 Flash models' },
                          { label: 'Groq API Key', description: 'Ultra-fast Llama 3.3 70B inference' },
                          { label: 'OpenRouter Key', description: 'Universal gateway for deep reasoning models (DeepSeek)' }
                        ].map((key, i) => (
                          <div key={i} className="bg-white/45 backdrop-blur-3xl border border-white/80 p-6 rounded-2xl shadow-sm">
                            <div className="mb-4">
                              <h4 className="font-bold text-slate-800 mb-1 text-sm">{key.label}</h4>
                              <p className="text-xs text-slate-400 font-medium">{key.description}</p>
                            </div>
                            <div className="flex gap-2">
                              <input 
                                type="password" 
                                value="••••••••••••••••••••••••••••••••"
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-400 outline-none"
                                readOnly
                              />
                              <button className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold transition-all shadow-sm text-slate-600">Update</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </motion.div>
                )}

                {activeTab === 'account' && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                  >
                    <div className="bg-white/45 backdrop-blur-3xl border border-white/80 p-8 rounded-3xl flex items-center gap-6 shadow-sm">
                      <div className="w-20 h-20 bg-[#6C63FF]/10 text-[#6C63FF] border border-[#6C63FF]/20 rounded-2xl flex items-center justify-center text-3xl font-display font-extrabold shadow-sm">JD</div>
                      <div>
                        <h3 className="text-xl font-display font-bold text-slate-800 mb-1">John Doe</h3>
                        <p className="text-sm text-slate-400 font-medium mb-4">john@example.com</p>
                        <button className="px-4 py-2 border border-[#6C63FF]/20 text-[#6D63FF] bg-white hover:bg-[#6C63FF]/5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest shadow-sm">Update Profile</button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'billing' && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                  >
                    <div className="bg-white/45 backdrop-blur-3xl border border-white/80 p-8 rounded-3xl border-l-4 border-l-[#00D4FF] shadow-sm">
                       <div className="flex justify-between items-start mb-6">
                        <div>
                           <h3 className="text-xl font-display font-bold text-slate-850 mb-1">Professional Plan</h3>
                           <p className="text-sm text-slate-400 font-medium">Active since March 2024</p>
                        </div>
                        <span className="px-3 py-1 bg-[#00D4FF]/10 border border-[#00D4FF]/25 text-[#00A4D8] text-[9px] font-extrabold rounded-full uppercase tracking-wider">Active</span>
                       </div>
                       <div className="text-3xl font-display font-extrabold text-slate-800 mb-8">$12<span className="text-sm text-slate-400 font-sans font-medium">/mo</span></div>
                       <button className="w-full py-4 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl font-bold hover:shadow transition-all text-slate-700 text-sm">Manage Subscription</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
