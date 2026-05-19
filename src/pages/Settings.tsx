import Sidebar from '../components/layout/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, User, Bell, CreditCard, Shield, Globe, Moon, Save } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'api' | 'account' | 'billing'>('api');

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-display mb-10">Control Center</h1>

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
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.id ? 'bg-[#6C63FF] text-white' : 'text-white/40 hover:text-white hover:bg-white/5'
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
                    className="space-y-8"
                  >
                    <section>
                      <h3 className="text-xl font-bold mb-6">Provider Endpoints</h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Gemini API Key', description: 'Used for Gemini 1.5 Pro and Flash models' },
                          { label: 'Groq API Key', description: 'Ultra-fast Llama 3 70B inference' },
                          { label: 'OpenRouter Key', description: 'Universal gateway for 100+ models' }
                        ].map((key, i) => (
                          <div key={i} className="glass-card p-6">
                            <div className="mb-4">
                              <h4 className="font-bold mb-1">{key.label}</h4>
                              <p className="text-xs text-white/40">{key.description}</p>
                            </div>
                            <div className="flex gap-2">
                              <input 
                                type="password" 
                                value="••••••••••••••••••••"
                                className="flex-1 bg-black/40 border border-white/5 rounded-lg px-4 py-2 text-sm text-white/40 outline-none"
                                readOnly
                              />
                              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold transition-all">Update</button>
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
                    <div className="glass-card p-8 flex items-center gap-6">
                      <div className="w-20 h-20 bg-[#6C63FF] rounded-2xl flex items-center justify-center text-3xl font-display">JD</div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">John Doe</h3>
                        <p className="text-sm text-white/40 mb-4">john@example.com</p>
                        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all uppercase tracking-widest">Update Profile</button>
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
                    <div className="glass-card p-8 border-l-4 border-[#00D4FF]">
                       <div className="flex justify-between items-start mb-6">
                        <div>
                           <h3 className="text-xl font-bold mb-1">Professional Plan</h3>
                           <p className="text-sm text-white/40">Active since March 2024</p>
                        </div>
                        <span className="px-3 py-1 bg-[#00D4FF]/20 text-[#00D4FF] text-[10px] font-bold rounded-full uppercase tracking-widest">Active</span>
                       </div>
                       <div className="text-3xl font-display mb-8">$12<span className="text-sm text-white/40 font-sans">/mo</span></div>
                       <button className="w-full py-4 glass-card font-bold hover:bg-white/10 transition-all">Manage Subscription</button>
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
