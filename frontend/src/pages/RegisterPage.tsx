import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckSquare, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-hidden order-2 lg:order-1">
        {/* Subtle background ambient light */}
        <div className="absolute inset-0 pointer-events-none flex justify-center z-0">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="glass-card rounded-2xl p-8 sm:p-10 shadow-xl border border-border/50 bg-white/80 dark:bg-gray-900/80">
            <div className="mb-8 text-center lg:text-left">
              <div className="flex lg:hidden items-center justify-center gap-2 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-glow">
                  <CheckSquare className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold tracking-tight">TaskFlow</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2 flex items-center gap-2 justify-center lg:justify-start">
                Create Account <Sparkles className="h-5 w-5 text-yellow-500" />
              </h2>
              <p className="text-muted-foreground text-sm">Join thousands of teams already using TaskFlow</p>
            </div>

            <form 
              className="space-y-5" 
              onSubmit={async (e) => { 
                e.preventDefault(); 
                setLoading(true);
                setError('');
                try {
                  await register(form.name, form.email, form.password); 
                  navigate('/dashboard'); 
                } catch (err: any) {
                  setError(err.response?.data?.message || 'Failed to register. Please try again.');
                  console.error(err);
                } finally {
                  setLoading(false);
                }
              }}
            >
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="name">Full Name</label>
                  <input 
                    id="name"
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-border/80" 
                    placeholder="John Doe"
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="email">Email Address</label>
                  <input 
                    id="email"
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-border/80" 
                    type="email"
                    placeholder="john@example.com"
                    value={form.email} 
                    onChange={(e) => setForm({ ...form, email: e.target.value })} 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="password">Password</label>
                  <input 
                    id="password"
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-border/80" 
                    type="password" 
                    placeholder="Create a strong password (min 8 chars)"
                    value={form.password} 
                    onChange={(e) => setForm({ ...form, password: e.target.value })} 
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <button 
                disabled={loading} 
                className="group relative w-full flex justify-center items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70 disabled:cursor-not-allowed mt-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create your account
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                Sign in instead
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:flex w-1/2 relative bg-primary items-center justify-center overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-indigo-600 opacity-90 z-0"></div>
        {/* Abstract shapes */}
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 p-12 text-white max-w-xl text-right ml-auto">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-end gap-3 mb-8">
              <span className="text-2xl font-bold tracking-tight">TaskFlow</span>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-glass">
                <CheckSquare className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Start doing your best work today.
            </h1>
            <p className="text-lg text-indigo-100/80">
              Set up your workspace in seconds and invite your team to start collaborating.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
