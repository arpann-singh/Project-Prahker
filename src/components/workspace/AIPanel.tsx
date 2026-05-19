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
}

const PROVIDER_CONFIG: Record<string, any> = {
  gemini: { name: 'Gemini', color: '#4285F4', logo: 'G' },
  groq: { name: 'Groq', color: '#F55036', logo: 'Q' },
  openrouter: { name: 'DeepSeek', color: '#6C63FF', logo: 'D' },
  ollama: { name: 'Ollama', color: '#FFFFFF', logo: 'O' },
};

export default function AIPanel({ provider, model, content, isLoading, latencyMs, scores }: AIPanelProps) {
  const config = PROVIDER_CONFIG[provider] || { name: provider, color: '#666', logo: '?' };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-2xl flex flex-col h-[500px] relative overflow-hidden group shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/[0.02] backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }}></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: config.color }}>{config.name}</span>
            <span className="text-[9px] font-medium text-white/30 uppercase tracking-tighter">{model}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {latencyMs && (
            <span className="text-[10px] font-mono text-white/30">
              {latencyMs}ms
            </span>
          )}
          <button className="p-1 hover:bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
            <Maximize2 className="w-3.5 h-3.5 text-white/30" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar text-sm leading-relaxed text-white/70 font-sans">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
            <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse" />
          </div>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
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
            {!content && !isLoading && <p className="text-white/20 italic">Awaiting dispatch...</p>}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto p-3 border-t border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex gap-2">
          <button className="p-1.5 hover:bg-white/10 rounded-lg text-white/20 hover:text-white transition-all">
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 hover:bg-white/10 rounded-lg text-white/20 hover:text-white transition-all">
            <Save className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          {scores && (
            <div className="flex items-center gap-2">
              <div className="h-1 w-16 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${(scores.composite || 0) * 10}%`, backgroundColor: config.color }} 
                />
              </div>
              <span className="text-[10px] font-bold text-[#10B981]">{(scores.composite || 0).toFixed(1)}</span>
            </div>
          )}
          <button className="p-1.5 hover:bg-white/10 rounded-lg text-white/20 hover:text-white transition-all">
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
