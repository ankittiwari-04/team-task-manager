import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckSquare, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('Admin123!');
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex w-1/2 relative bg-primary items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-800 to-slate-900 opacity-90 z-0"></div>
        {/* Abstract shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 p-12 text-white max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-glass">
                <CheckSquare className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">TaskFlow</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Manage your team's work in one place.
            </h1>
            <p className="text-lg text-indigo-100/80">
              The professional way to organize projects, track progress, and collaborate seamlessly.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Subtle background ambient light for right side */}
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
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">Welcome back</h2>
              <p className="text-muted-foreground text-sm">Enter your credentials to access your account</p>
            </div>

            <form 
              className="space-y-5" 
              onSubmit={async (e) => { 
                e.preventDefault(); 
                setLoading(true); 
                try {
                  await login(email, password); 
                  toast.success('Successfully logged in!');
                  navigate('/dashboard'); 
                } catch (error: any) {
                  console.error(error);
                  toast.error(error.response?.data?.message || 'Invalid email or password. Please try again or create an account.');
                } finally {
                  setLoading(false); 
                }
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="email">Email Address</label>
                  <input 
                    id="email"
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-border/80" 
                    type="email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-foreground" htmlFor="password">Password</label>
                    <a href="#" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">Forgot password?</a>
                  </div>
                  <input 
                    id="password"
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-border/80" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required
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
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to your account
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs uppercase font-semibold tracking-wider"><span className="bg-white dark:bg-gray-950 px-2 text-muted-foreground">Or test with</span></div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <button 
                  type="button"
                  onClick={() => { setEmail('admin@demo.com'); setPassword('Admin123!'); }}
                  className="flex items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 dark:border-indigo-900/50 dark:bg-indigo-900/20 px-4 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                >
                  Demo Manager
                </button>
                <button 
                  type="button"
                  onClick={() => { setEmail('sarah@demo.com'); setPassword('Member123!'); }}
                  className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Demo Employee
                </button>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                Create one now
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
