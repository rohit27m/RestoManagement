'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
    } catch (err) {
      setError('The credentials provided do not match our records.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen mesh-bg flex flex-col md:flex-row items-stretch overflow-hidden">
      {/* Left Decoration (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative p-12 flex-col justify-between">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M12 12c-3.5 0-6.5-1.5-6.5-4.5S8.5 3 12 3s6.5 1.5 6.5 4.5-3 4.5-6.5 4.5Z" /><path d="M12 12c3.5 0 6.5 1.5 6.5 4.5S15.5 21 12 21s-6.5-1.5-6.5-4.5 3-4.5 6.5-4.5Z" /></svg>
          </motion.div>
        </div>

        <div className="relative z-10 max-w-md">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-black text-white leading-none tracking-tighter"
          >
            RESTO <span className="text-primary-foreground">PRO</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-xl text-white/70 font-medium leading-relaxed"
          >
            The world's most advanced restaurant intelligence platform.
            Designed for those who lead the industry.
          </motion.p>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/4 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px]" />
        </div>
      </div>

      {/* Login Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-[420px]"
        >
          <Card variant="glass" className="border-white/10 shadow-2xl overflow-visible relative">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-t-xl" />

            <CardHeader className="space-y-1 pb-8">
              <CardTitle className="text-3xl font-bold text-white">Identity Access</CardTitle>
              <p className="text-white/50 text-sm font-medium">Verify your credentials to continue</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Universal ID</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. administrator"
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Passkey</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 transition-all"
                      required
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/50 text-rose-500 text-xs font-bold leading-relaxed"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full h-14 rounded-xl text-lg font-bold"
                >
                  Authorize Access
                </Button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-4 bg-transparent text-white/30 backdrop-blur font-bold tracking-widest">Nodes</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleQuickLogin('admin', 'admin123')}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/10 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-black group-hover:scale-110 transition-transform">A</div>
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest group-hover:text-white/60">Admin</div>
                </button>
                <button
                  onClick={() => handleQuickLogin('manager', 'manager123')}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/10 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-black group-hover:scale-110 transition-transform">M</div>
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest group-hover:text-white/60">Manager</div>
                </button>
              </div>
            </CardContent>
          </Card>

          <p className="mt-8 text-center text-white/30 text-[10px] font-bold tracking-[0.2em] uppercase">
            RestoPro Collective © All Rights Reserved 2026
          </p>
        </motion.div>
      </div>
    </div>
  );
}
