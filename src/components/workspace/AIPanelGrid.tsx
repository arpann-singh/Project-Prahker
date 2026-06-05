import { useAIResponseStore } from '../../store/aiResponseStore';
import AIPanel from './AIPanel';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIPanelGrid() {
  const { responses } = useAIResponseStore();
  const activeProviders = Object.keys(responses);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
      <AnimatePresence>
        {activeProviders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:col-span-2 h-[400px] flex flex-col items-center justify-center text-center p-12 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]"
          >
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <div className="w-8 h-8 border border-white/20 rounded-lg animate-pulse bg-white/5" />
            </div>
            <h3 className="text-xl font-display font-bold mb-2 text-white/80">Ready for Intelligence?</h3>
            <p className="text-white/30 max-w-sm text-sm">Selected AI models will appear here. Fire your first prompt to begin the orchestration.</p>
          </motion.div>
        ) : (
          activeProviders.map((provider) => (
            <AIPanel 
              key={provider}
              provider={provider}
              {...responses[provider]}
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
