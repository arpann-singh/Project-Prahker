import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

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
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
     const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard',
      }
    });
    if (error) setError(error.message);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left: Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden bg-gradient-to-br from-[#0A0A0F] to-[#12121A]">
        <div className="absolute top-0 left-0 w-full h-full bg-[#6C63FF]/5 blur-[120px] pointer-events-none" />
        <Link to="/" className="flex items-center gap-2 z-10">
          <Zap className="w-8 h-8 text-[#6C63FF]" />
          <span className="font-display text-2xl tracking-tight">AI ECHO LENS</span>
        </Link>
        
        <div className="z-10 max-w-md">
          <h2 className="font-display text-5xl mb-6 leading-tight">Welcome back to the future of search.</h2>
          <p className="text-white/60 text-lg">Access your workspaces, view your intelligence history, and continue orchestrating the AIs.</p>
        </div>

        <div className="z-10 text-white/20 text-sm">© 2026 AI Echo Lens. Built for speed.</div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm space-y-8"
        >
          <div>
            <h1 className="text-3xl font-display mb-2">Login to Dashboard</h1>
            <p className="text-white/40">Continuum awaits. Enterprise grade focus.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/40">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input
                  {...register('email')}
                  type="email"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#6C63FF] transition-all"
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-white/40">Password</label>
                <a href="#" className="text-xs text-[#6C63FF] hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input
                  {...register('password')}
                  type="password"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#6C63FF] transition-all"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-[#6C63FF] hover:bg-[#5B54D6] rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0A0A0F] px-4 text-white/20">Or continue with</span></div>
          </div>

          <button 
            onClick={signInWithGoogle}
            className="w-full py-3 glass-card flex items-center justify-center gap-3 font-medium"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            Google Workspace
          </button>

          <p className="text-center text-sm text-white/40">
            Don't have an account? <Link to="/signup" className="text-[#6C63FF] hover:underline">Create for free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
