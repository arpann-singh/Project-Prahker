import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Paperclip, Library, Bookmark, Send, Sparkles, Loader2, Settings, Sliders, Target, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useAIDispatch } from '../../hooks/useAIDispatch';
import { useAIResponseStore } from '../../store/aiResponseStore';
import { useUserProfile } from '../../hooks/useUserProfile';

const PROVIDERS = [
  { id: 'gemini', name: 'Gemini', color: '#4285F4' },
  { id: 'groq', name: 'Groq', color: '#F55036' },
  { id: 'openrouter', name: 'DeepSeek', color: '#6C63FF' },
  { id: 'ollama', name: 'Ollama', color: '#FFFFFF' },
];

export default function PromptBox() {
  const { currentWorkspace, updatePrompt, toggleProvider, updateConfig } = useWorkspaceStore();
  const { isGenerating } = useAIResponseStore();
  const { dispatchToAllAIs } = useAIDispatch();
  const { profile } = useUserProfile();
  const [optimizerActive, setOptimizerActive] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [timeLeft, setTimeLeft] = useState('');

  const isOutOfTokens = profile ? profile.tokensUsed >= profile.tokenLimit : false;

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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [currentWorkspace?.currentPrompt]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      if (!isOutOfTokens) {
        dispatchToAllAIs();
      }
    }
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] rounded-2xl opacity-10 group-focus-within:opacity-20 transition-opacity"></div>
      <div className="relative bg-white/75 backdrop-blur-2xl border border-white/80 rounded-2xl p-6 shadow-[0_15px_50px_-15px_rgba(108,99,255,0.06)]">
        <div className="flex flex-col gap-4">
          {/* Model Selector */}
          <div className="flex items-center gap-4 border-b border-slate-100 pb-4 justify-between">
            <div className="flex flex-wrap gap-2">
              {PROVIDERS.map((p) => (
                <button 
                  key={p.id}
                  onClick={() => toggleProvider(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                    currentWorkspace?.selectedProviders.includes(p.id)
                      ? 'bg-[#6C63FF]/8 text-[#4E44E5] border border-[#6C63FF]/15 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: currentWorkspace?.selectedProviders.includes(p.id) ? p.color : '#CBD5E1' }} 
                  />
                  {p.name}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setOptimizerActive(!optimizerActive)}
                className={`flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold transition-all ${optimizerActive ? 'text-[#00A4D8]' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Optimizer
              </button>
              <div className="h-4 w-[1px] bg-slate-200" />
              <button 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold transition-all ${showAdvanced ? 'text-[#6C63FF]' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Settings className="w-3.5 h-3.5" />
                Parameters
              </button>
            </div>
          </div>

          {/* Advanced config accordion */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-b border-slate-100 pb-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs">
                  {/* Left Parameters */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 font-bold text-slate-500 uppercase tracking-wider text-[9px]">
                        <span className="flex items-center gap-1"><Sliders className="w-3 h-3" /> Temperature</span>
                        <span className="font-mono text-slate-800 font-extrabold">{currentWorkspace?.temperature ?? 0.7}</span>
                      </div>
                      <input 
                        type="range"
                        min="0.1"
                        max="1.5"
                        step="0.1"
                        value={currentWorkspace?.temperature ?? 0.7}
                        onChange={(e) => updateConfig({ temperature: parseFloat(e.target.value) })}
                        className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#6C63FF]"
                      />
                      <span className="text-[9px] text-slate-400 font-medium block mt-0.5">Lower = focused & factual, higher = creative & diverse.</span>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1 font-bold text-slate-500 uppercase tracking-wider text-[9px]">
                        <span className="flex items-center gap-1"><Sliders className="w-3 h-3" /> Max Response Tokens</span>
                        <span className="font-mono text-slate-800 font-extrabold">{currentWorkspace?.maxTokens ?? 2048}</span>
                      </div>
                      <input 
                        type="range"
                        min="256"
                        max="4096"
                        step="128"
                        value={currentWorkspace?.maxTokens ?? 2048}
                        onChange={(e) => updateConfig({ maxTokens: parseInt(e.target.value) })}
                        className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#6C63FF]"
                      />
                      <span className="text-[9px] text-slate-400 font-medium block mt-0.5">Defines execution length constraints for all adapters.</span>
                    </div>
                  </div>

                  {/* Right Parameters */}
                  <div className="space-y-3">
                    <div>
                      <label className="block mb-1 font-bold text-slate-500 uppercase tracking-wider text-[9px] flex items-center gap-1">
                        <Target className="w-3 h-3" /> System Instruction / Persona
                      </label>
                      <input
                        type="text"
                        value={currentWorkspace?.systemInstruction ?? ''}
                        onChange={(e) => updateConfig({ systemInstruction: e.target.value })}
                        placeholder="e.g. Answer with extreme markdown tables..."
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#6C63FF] text-[11px] font-semibold text-slate-700 placeholder:text-slate-400 placeholder:font-normal"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-bold text-slate-500 uppercase tracking-wider text-[9px] flex items-center gap-1">
                        <Target className="w-3 h-3" /> Custom AI Judge Criteria
                      </label>
                      <input
                        type="text"
                        value={currentWorkspace?.evalGoal ?? ''}
                        onChange={(e) => updateConfig({ evalGoal: e.target.value })}
                        placeholder="e.g. Focus on execution speed and technical code quality..."
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#6C63FF] text-[11px] font-semibold text-slate-700 placeholder:text-slate-400 placeholder:font-normal"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
   
          {/* Quota Exhausted Warning Banner */}
          {isOutOfTokens && (
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-start gap-3 text-xs text-rose-700 font-semibold animate-pulse">
              <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-rose-800 block">Daily Free Tier Quota Exhausted</span>
                You have reached your limit of {profile?.tokenLimit.toLocaleString()} tokens today. Your balance will automatically replenish at midnight UTC.
                <span className="block mt-1 font-mono text-[10px] text-rose-500 uppercase tracking-widest">{timeLeft || 'Resetting shortly'} remaining</span>
              </div>
            </div>
          )}

          {/* Textarea */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={currentWorkspace?.currentPrompt}
              onChange={(e) => updatePrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isOutOfTokens}
              placeholder={isOutOfTokens ? `Quota depleted (100k limit). Replenishing in ${timeLeft || 'a few hours'}...` : "Describe the architecture for a real-time analytics engine..."}
              className={`w-full bg-transparent border-none focus:ring-0 text-slate-800 placeholder:text-slate-400 resize-none min-h-[64px] font-medium text-base outline-none ${isOutOfTokens ? 'opacity-50 cursor-not-allowed select-none' : ''}`}
            />
          </div>
   
          {/* Toolbar */}
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-4">
              <button disabled={isOutOfTokens} className={`text-slate-400 hover:text-slate-700 transition-colors ${isOutOfTokens ? 'opacity-40 cursor-not-allowed' : ''}`} title="Voice Input">
                <Mic className="w-4 h-4" />
              </button>
              <button disabled={isOutOfTokens} className={`text-slate-400 hover:text-slate-700 transition-colors ${isOutOfTokens ? 'opacity-40 cursor-not-allowed' : ''}`} title="Attach Files">
                <Paperclip className="w-4 h-4" />
              </button>
              <div className="h-4 w-[1px] bg-slate-200" />
              <div className="flex items-center gap-2">
                 <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-tight font-medium">Gemini</span>
                 <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-[#6C63FF]/30 bg-[#6C63FF]/8 text-[#6C63FF] uppercase tracking-tight font-bold">+2 Models</span>
              </div>
            </div>
            
            <button 
              onClick={dispatchToAllAIs}
              disabled={isGenerating || !currentWorkspace?.currentPrompt || isOutOfTokens}
              className="px-4 py-2 bg-[#6C63FF] text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-[0_4px_12px_rgba(108,99,255,0.3)] hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100 cursor-pointer"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>ECHO PROMPT</span><Send className="w-3 h-3" /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
