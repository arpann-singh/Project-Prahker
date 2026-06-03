import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Paperclip, Library, Bookmark, Send, Sparkles, Loader2 } from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useAIDispatch } from '../../hooks/useAIDispatch';
import { useAIResponseStore } from '../../store/aiResponseStore';

const PROVIDERS = [
  { id: 'gemini', name: 'Gemini', color: '#4285F4' },
  { id: 'groq', name: 'Groq', color: '#F55036' },
  { id: 'openrouter', name: 'DeepSeek', color: '#6C63FF' },
  { id: 'ollama', name: 'Ollama', color: '#FFFFFF' },
  { id: 'cohere', name: 'Cohere', color: '#39594D' },
];

export default function PromptBox() {
  const { currentWorkspace, updatePrompt, toggleProvider } = useWorkspaceStore();
  const { isGenerating } = useAIResponseStore();
  const { dispatchToAllAIs } = useAIDispatch();
  const [optimizerActive, setOptimizerActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [currentWorkspace?.currentPrompt]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      dispatchToAllAIs();
    }
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] rounded-2xl opacity-10 group-focus-within:opacity-20 transition-opacity"></div>
      <div className="relative bg-[#12121A] border border-white/10 rounded-xl p-4 shadow-2xl">
        <div className="flex flex-col gap-4">
          {/* Model Selector */}
          <div className="flex items-center gap-4 border-b border-white/5 pb-4">
            <div className="flex gap-2">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => toggleProvider(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${currentWorkspace?.selectedProviders.includes(p.id)
                      ? 'bg-white/10 text-white border border-white/10 shadow-sm'
                      : 'text-white/20 hover:text-white/40'
                    }`}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: currentWorkspace?.selectedProviders.includes(p.id) ? p.color : '#333' }}
                  />
                  {p.name}
                </button>
              ))}
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            <button
              onClick={() => setOptimizerActive(!optimizerActive)}
              className={`flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold transition-all ${optimizerActive ? 'text-[#00D4FF]' : 'text-white/20'}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Optimizer
            </button>
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={currentWorkspace?.currentPrompt}
              onChange={(e) => updatePrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the architecture for a real-time analytics engine..."
              className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-white/20 resize-none min-h-[64px] font-medium"
            />
          </div>

          {/* Toolbar */}
          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-4">
              <button className="text-white/40 hover:text-white transition-colors" title="Voice Input">
                <Mic className="w-4 h-4" />
              </button>
              <button className="text-white/40 hover:text-white transition-colors" title="Attach Files">
                <Paperclip className="w-4 h-4" />
              </button>
              <div className="h-4 w-[1px] bg-white/10" />
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-white/60 uppercase tracking-tighter">Gemini</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full border border-[#6C63FF]/40 bg-[#6C63FF]/10 text-[#6C63FF] uppercase tracking-tighter font-bold">+2 Models</span>
              </div>
            </div>

            <button
              onClick={dispatchToAllAIs}
              disabled={isGenerating || !currentWorkspace?.currentPrompt}
              className="px-4 py-2 bg-[#6C63FF] text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-[0_4px_12px_rgba(108,99,255,0.3)] hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>ECHO PROMPT</span><Send className="w-3 h-3" /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
