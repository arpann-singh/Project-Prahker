import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, Loader2, ArrowRight, Sparkles, Cpu, Award, Shield, CheckCircle2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F6F8FC] selection:bg-[#6C63FF]/15 select-none font-sans overflow-x-hidden">
      {/* Left Pane: Immersive, Beautiful Brand Presentation */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-16 relative overflow-hidden bg-gradient-to-br from-[#1E1B4B] via-[#0F0E26] to-[#090816] text-white">
        {/* Abstract Glowing Aura Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-[#6C63FF]/15 blur-[140px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Brand Logo Header */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="z-10"
        >
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-[#6C63FF] to-[#00D4FF] rounded-xl flex items-center justify-center shadow-[0_4px_20px_rgba(108,99,255,0.4)] transition-all group-hover:scale-105 active:scale-95 duration-300">
              <Zap className="w-6 h-6 text-white animate-pulse" />
            </div>
            <span className="font-display text-2xl tracking-tighter text-white font-black uppercase">AI Echo Lens</span>
          </Link>
        </motion.div>
        
        {/* Engaging Live CSS Mock Consensus Verdict Container */}
        <div className="z-10 w-full max-w-md my-auto space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-[#A5B4FC]">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Consensus Analytics Sandbox
            </div>
            <h2 className="font-display text-5xl font-black leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-350">
              Welcome back to <br /><span className="text-[#818CF8] italic font-extrabold">orchestrated</span> power.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
              Consolidate inputs, measure cross-model hallucinations, and yield single-source answers in micro-seconds.
            </p>
          </motion.div>

          {/* Visual Consensus Verdict Mock Component */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] space-y-4 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#6C63FF]/10 blur-xl rounded-full" />
            
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#818CF8]" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Consensus Audit #4810</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Passed Bias Check</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-semibold">Gemini vs LLaMA alignment ratio</span>
                <span className="text-indigo-300 font-bold font-mono">98.4%</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="w-[98.4%] h-full bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] rounded-full" />
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-indigo-500/5 border border-indigo-500/10 p-3 rounded-xl">
              <Award className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-300 leading-normal font-medium">
                <span className="font-bold text-white block">Synthesized Output Generated</span>
                Unimodal accuracy consensus reached from multiple neural arrays.
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="z-10 flex justify-between text-xs text-slate-500"
        >
          <span>© 2026 AI Echo Lens Inc.</span>
          <span className="font-mono">SECURE INTERNET PROT. 2.0</span>
        </motion.div>
      </div>

      {/* Right Pane: Premium Form Container */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-16 bg-[#F6F8FC] min-h-screen relative overflow-hidden">
        {/* Subtle decorative circles for background interest */}
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#6C63FF]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-200/20 blur-[100px] rounded-full pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-white border border-slate-150 p-8 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(108,99,255,0.03)] space-y-6 relative z-10"
        >
          {/* Back Home link on mobile */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <Link to="/" className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#6C63FF]" />
              <span className="font-display tracking-tight text-slate-800 font-extrabold text-sm uppercase">AI Echo Lens</span>
            </Link>
          </div>

          <div>
            <h1 className="text-3xl font-display font-black text-slate-800 leading-none">Login to Dashboard</h1>
            <p className="text-slate-450 text-sm mt-2 font-medium">Streamlined entrance to your intelligence hub.</p>
          </div>

          {error && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 block">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-350 group-focus-within:text-[#6C63FF] transition-colors" />
                <input
                  {...register('email')}
                  type="email"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:outline-none focus:border-[#6C63FF]/60 focus:ring-4 focus:ring-[#6C63FF]/5 text-slate-700 transition-all font-semibold placeholder:text-slate-350 text-sm placeholder:font-normal"
                  placeholder="e.g. workspace@company.com"
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-500 font-bold flex items-center gap-1 mt-1">
                  • {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 block">Password</label>
                <a href="#" className="text-[10px] text-[#6C63FF] hover:underline font-extrabold uppercase tracking-wide">Forgot password?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-350 group-focus-within:text-[#6C63FF] transition-colors" />
                <input
                  {...register('password')}
                  type="password"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:outline-none focus:border-[#6C63FF]/60 focus:ring-4 focus:ring-[#6C63FF]/5 text-slate-700 transition-all font-semibold placeholder:text-slate-350 text-sm placeholder:font-normal animate-none"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-500 font-bold flex items-center gap-1 mt-1">
                  • {errors.password.message}
                </p>
              )}
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-3.5 bg-[#6C63FF] hover:bg-[#5B54D6] disabled:bg-slate-200 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 shadow-md shadow-[#6C63FF]/10 text-sm cursor-pointer mt-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Sign In Securely <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="w-full border-t border-slate-150 absolute" />
            <span className="bg-white px-3 text-[10px] uppercase font-bold tracking-widest text-slate-400 relative z-10">Or Access with</span>
          </div>

          {/* Google SSO Button */}
          <button 
            type="button"
            onClick={signInWithGoogle}
            className="w-full py-3 bg-white border border-slate-200 hover:border-slate-300 rounded-xl flex items-center justify-center gap-3 font-bold text-slate-650 hover:bg-slate-50/50 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)] active:scale-[0.99] cursor-pointer text-sm"
          >
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Google Workspace Auth
          </button>

          {/* Prompt to register */}
          <p className="text-center text-xs text-slate-450 font-semibold pt-2">
            Don't have an intelligence account?{' '}
            <Link to="/signup" className="text-[#6C63FF] hover:underline hover:text-[#5B54D6] font-extrabold">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
