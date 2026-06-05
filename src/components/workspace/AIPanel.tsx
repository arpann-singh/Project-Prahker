import { motion } from 'framer-motion';
import { Copy, RefreshCcw, Save, Maximize2, ExternalLink, Terminal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface AIPanelProps {
  provider: string;
  model: string;
  content: string;
  isLoading: boolean;
  latencyMs?: number;
  scores?: any;
  error?: string;
}

const PROVIDER_CONFIG: Record<string, any> = {
  gemini: { name: 'Gemini', color: '#4285F4', logo: 'G' },
  groq: { name: 'Groq', color: '#F55036', logo: 'Q' },
  openrouter: { name: 'DeepSeek', color: '#6C63FF', logo: 'D' },
  ollama: { name: 'Ollama', color: '#FFFFFF', logo: 'O' },
};

export default function AIPanel({ provider, model, content, isLoading, latencyMs, scores, error }: AIPanelProps) {
  const config = PROVIDER_CONFIG[provider] || { name: provider, color: '#666', logo: '?' };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/60 hover:bg-white/70 backdrop-blur-3xl border border-white/80 rounded-2xl flex flex-col h-[500px] relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_15px_40px_rgba(108,99,255,0.05)] transition-all duration-500"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-white/40 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }}></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: config.color }}>{config.name}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">{model}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {latencyMs && (
            <span className="text-[10px] font-mono text-slate-400 font-bold">
              {latencyMs}ms
            </span>
          )}
          <button className="p-1 hover:bg-slate-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
            <Maximize2 className="w-3.5 h-3.5 text-slate-400/80" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar text-sm leading-relaxed text-slate-700 font-sans">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-4 bg-slate-200/50 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-slate-200/50 rounded w-full animate-pulse" />
            <div className="h-4 bg-slate-200/50 rounded w-5/6 animate-pulse" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] h-full text-center p-6 border border-red-500/10 rounded-2xl bg-red-500/[0.02]">
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl mb-4 shadow-sm animate-pulse">
              <Terminal className="w-5 h-5 text-red-500" />
            </div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-red-500 mb-2 font-mono">Service Execution Halted</h4>
            <p className="text-xs text-slate-600 max-w-[280px] leading-relaxed select-all font-medium">
              {error}
            </p>
          </div>
        ) : (
          <div className="prose prose-slate prose-sm max-w-none">
            <ReactMarkdown
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return match ? (
                    <SyntaxHighlighter
                      language={match[1]}
                      style={atomDark}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {content}
            </ReactMarkdown>
            {!content && !isLoading && <p className="text-slate-400/60 font-medium italic">Awaiting dispatch...</p>}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto p-3 border-t border-slate-100 flex items-center justify-between bg-white/30">
        <div className="flex gap-2">
          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-all">
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-all">
            <Save className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          {scores && (
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${(scores.composite || 0) * 10}%`, backgroundColor: config.color }} 
                />
              </div>
              <span className="text-[10px] font-bold text-[#10B981]">{(scores.composite || 0).toFixed(1)}</span>
            </div>
          )}
          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-all">
            <RefreshCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar during generation */}
      {isLoading && (
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5 overflow-hidden">
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="w-full h-full bg-gradient-to-r from-transparent via-[#6C63FF] to-transparent"
          />
        </div>
      )}
    </motion.div>
  );
}
