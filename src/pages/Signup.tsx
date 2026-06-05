import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { saveUserProfile } from '../services/firebaseService';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, User, Loader2, ArrowRight, Sparkles, ShieldCheck, Activity, Terminal } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await updateProfile(userCredential.user, {
        displayName: data.name
      });
      await saveUserProfile({
        uid: userCredential.user.uid,
        email: data.email,
        displayName: data.name
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F6F8FC] selection:bg-[#6C63FF]/15 select-none font-sans overflow-x-hidden">
      {/* Left Pane: Immersive branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-16 relative overflow-hidden bg-gradient-to-br from-[#1E1B4B] via-[#0F0E26] to-[#090816] text-white">
        {/* Glow Effects */}
        <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-[#6C63FF]/15 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />

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

        {/* Dynamic messaging & mock console verification widget */}
        <div className="z-10 w-full max-w-md my-auto space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Professional Access Tier
            </div>
            <h2 className="font-display text-5xl font-black leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-350">
              Join the intelligence <br /><span className="text-cyan-300 italic font-extrabold">orchestration</span> network.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
              Deploy queries to multiple deep learning endpoints side-by-side. Free for individual builders, enterprise-grade capabilities.
            </p>
          </motion.div>

          {/* Visual mock: Connection Pipeline Status */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] space-y-3.5"
          >
            <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Terminal className="text-cyan-400 w-4 h-4" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Node Activation Protocol</span>
              </div>
              <span className="text-[9px] font-mono text-cyan-300 bg-cyan-400/10 px-2 py-0.5 rounded-full font-bold">READY TO INITIALIZE</span>
            </div>

            <div className="space-y-2.5">
              {[
                { name: "Gemini Router Gateway", latency: "110ms", active: true },
                { name: "Llama-3 High-Speed Pipeline", latency: "85ms", active: true },
                { name: "DeepSeek Reasoning Link", latency: "380ms", active: true }
              ].map((node, i) => (
                <div key={i} className="flex justify-between items-center text-xs p-2.5 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-slate-300 font-semibold">{node.name}</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[10px] font-bold">{node.latency}</span>
                </div>
              ))}
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
          <span className="font-mono">ENCRYPTED GATEWAY</span>
        </motion.div>
      </div>

      {/* Right Pane: Sign up Form panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-16 bg-[#F6F8FC] min-h-screen relative overflow-hidden">
        {/* Subtle decorative circles for background interest */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#6C63FF]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/3 right-10 w-80 h-80 bg-indigo-200/20 blur-[100px] rounded-full pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-white border border-slate-150 p-8 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(108,99,255,0.03)] space-y-5 relative z-10"
        >
          {/* Back Home link on mobile */}
          <div className="lg:hidden flex justify-between items-center mb-2">
            <Link to="/" className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#6C63FF]" />
              <span className="font-display tracking-tight text-slate-800 font-extrabold text-sm uppercase">AI Echo Lens</span>
            </Link>
          </div>

          <div>
            <h1 className="text-3xl font-display font-black text-slate-800 leading-none">Register Account</h1>
            <p className="text-slate-450 text-sm mt-2 font-medium">Create your credentials to launch consensus dashboards.</p>
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 block">Your Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-350 group-focus-within:text-[#6C63FF] transition-colors" />
                <input
                  {...register('name')}
                  type="text"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:outline-none focus:border-[#6C63FF]/60 focus:ring-4 focus:ring-[#6C63FF]/5 text-slate-700 transition-all font-semibold placeholder:text-slate-350 text-sm placeholder:font-normal"
                  placeholder="e.g. John Doe"
                />
              </div>
              {errors.name && (
                <p className="text-[11px] text-red-500 font-bold flex items-center gap-1 mt-1">
                  • {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 block">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-350 group-focus-within:text-[#6C63FF] transition-colors" />
                <input
                  {...register('email')}
                  type="email"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:outline-none focus:border-[#6C63FF]/60 focus:ring-4 focus:ring-[#6C63FF]/5 text-slate-700 transition-all font-semibold placeholder:text-slate-350 text-sm placeholder:font-normal"
                  placeholder="e.g. name@company.com"
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-500 font-bold flex items-center gap-1 mt-1">
                  • {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 block">Secret Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-350 group-focus-within:text-[#6C63FF] transition-colors" />
                <input
                  {...register('password')}
                  type="password"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:outline-none focus:border-[#6C63FF]/60 focus:ring-4 focus:ring-[#6C63FF]/5 text-slate-700 transition-all font-semibold placeholder:text-slate-350 text-sm placeholder:font-normal animate-none"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-500 font-bold flex items-center gap-1 mt-1">
                  • {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 block">Confirm Secret Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-350 group-focus-within:text-[#6C63FF] transition-colors" />
                <input
                  {...register('confirmPassword')}
                  type="password"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:outline-none focus:border-[#6C63FF]/60 focus:ring-4 focus:ring-[#6C63FF]/5 text-slate-700 transition-all font-semibold placeholder:text-slate-350 text-sm placeholder:font-normal"
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-500 font-bold flex items-center gap-1 mt-1">
                  • {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-3.5 bg-[#6C63FF] hover:bg-[#5B54D6] disabled:bg-slate-200 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 shadow-md shadow-[#6C63FF]/10 text-sm cursor-pointer mt-3"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Initialize Dashboard Access <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Account transition */}
          <p className="text-center text-xs text-slate-450 font-semibold pt-4 border-t border-slate-100">
            Already registered with us?{' '}
            <Link to="/login" className="text-[#6C63FF] hover:underline hover:text-[#5B54D6] font-extrabold">
              Sign In Instead
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
