'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

const DEMO_ACCOUNTS = [
  {
    role: 'Admin',
    username: 'admin',
    password: 'admin123',
    description: 'Full system access',
    color: 'from-violet-500/20 to-purple-500/10',
    border: 'border-violet-500/30',
    badge: 'bg-violet-500/20 text-violet-300',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/>
        <path d="m16 13 2 2 4-4"/>
      </svg>
    ),
  },
  {
    role: 'Manager',
    username: 'manager',
    password: 'manager123',
    description: 'Restaurant operations',
    color: 'from-blue-500/20 to-cyan-500/10',
    border: 'border-blue-500/30',
    badge: 'bg-blue-500/20 text-blue-300',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"/>
      </svg>
    ),
  },
  {
    role: 'Waiter',
    username: 'waiter1',
    password: 'waiter123',
    description: 'Tables & order taking',
    color: 'from-emerald-500/20 to-green-500/10',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/20 text-emerald-300',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
      </svg>
    ),
  },
  {
    role: 'Chef',
    username: 'chef1',
    password: 'chef123',
    description: 'Kitchen & orders view',
    color: 'from-orange-500/20 to-amber-500/10',
    border: 'border-orange-500/30',
    badge: 'bg-orange-500/20 text-orange-300',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 7.05C14.19 12.78 13 15 12 17"/><path d="M9 18h6"/><path d="M10 22h4"/>
      </svg>
    ),
  },
];

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [demoLoadingRole, setDemoLoadingRole] = useState<string | null>(null);
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

  const handleDemoLogin = async (u: string, p: string, role: string) => {
    setUsername(u);
    setPassword(p);
    setError('');
    setDemoLoadingRole(role);
    try {
      await login(u, p);
    } catch (err) {
      setError('Demo login failed. Please ensure the server is running.');
    } finally {
      setDemoLoadingRole(null);
    }
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
                  <span className="px-4 bg-transparent text-white/30 backdrop-blur font-bold tracking-widest">Demo Accounts</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {DEMO_ACCOUNTS.map((account, i) => (
                  <motion.button
                    key={account.role}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    onClick={() => handleDemoLogin(account.username, account.password, account.role)}
                    disabled={!!demoLoadingRole || isLoading}
                    className={`relative flex flex-col items-start gap-2.5 p-4 rounded-xl bg-gradient-to-br ${account.color} border ${account.border} hover:brightness-110 transition-all group text-left disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden`}
                  >
                    {/* Loading overlay */}
                    {demoLoadingRole === account.role && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-xl z-10"
                      >
                        <svg className="animate-spin w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                      </motion.div>
                    )}

                    {/* Header row */}
                    <div className="flex items-center justify-between w-full">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${account.badge}`}>
                        {account.icon}
                        {account.role}
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/30 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all">
                        <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                      </svg>
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-white/50 font-medium leading-snug">{account.description}</p>

                    {/* Credentials */}
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-mono text-white/30 bg-white/5 px-1.5 py-0.5 rounded">{account.username}</span>
                      <span className="text-[10px] text-white/20">·</span>
                      <span className="text-[10px] font-mono text-white/30 bg-white/5 px-1.5 py-0.5 rounded">{account.password}</span>
                    </div>
                  </motion.button>
                ))}
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
