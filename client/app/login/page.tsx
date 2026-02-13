'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

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
      setError('Invalid username or password');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { role: 'Admin', username: 'admin', password: 'admin123' },
    { role: 'Manager', username: 'manager', password: 'manager123' },
    { role: 'Waiter', username: 'waiter1', password: 'waiter123' },
    { role: 'Chef', username: 'chef1', password: 'chef123' },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-success mb-4"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3h18v18H3zM8 12h8M12 8v8" />
            </svg>
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">RestaurantOS</h1>
          <p className="text-sm text-secondary">Enterprise Management Platform</p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface border border-default rounded-2xl p-8 shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-6">Sign in to your account</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                autoFocus
                disabled={isLoading}
                className="w-full h-11 px-4 bg-background border border-default rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-success focus:border-transparent
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
                className="w-full h-11 px-4 bg-background border border-default rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-success focus:border-transparent
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200"
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-sm text-danger bg-danger-light border border-danger/20 rounded-xl p-3"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-success hover:bg-success-hover text-white font-medium rounded-xl
                       transition-all duration-200 active:scale-[0.98]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </motion.div>

        {/* Demo Credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-surface border border-default rounded-2xl p-6"
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider text-tertiary mb-4">
            Demo Credentials
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {demoAccounts.map((account) => (
              <button
                key={account.username}
                onClick={() => {
                  setUsername(account.username);
                  setPassword(account.password);
                }}
                className="text-left p-3 rounded-xl border border-default hover:border-success/50 hover:bg-background
                         transition-all duration-200 group"
              >
                <div className="text-xs font-medium text-tertiary mb-1">{account.role}</div>
                <div className="text-sm font-mono text-xs">{account.username}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-tertiary mt-8"
        >
          Built with precision for modern restaurants
        </motion.p>
      </motion.div>
    </div>
  );
}
