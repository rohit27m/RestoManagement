'use client';

import { useState } from 'react';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-4">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-blue-600 shadow-lg mb-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M3 3h18v18H3zM8 12h8M12 8v8" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            RestaurantOS
          </h1>
          <p className="text-slate-400">
            Sign in to your account
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-white">Welcome Back</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
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
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg 
                         text-slate-900 dark:text-white placeholder-slate-400
                         focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
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
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg 
                         text-slate-900 dark:text-white placeholder-slate-400
                         focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg
                       hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
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
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-white dark:bg-slate-900 rounded-xl p-5 shadow-xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Demo Accounts</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <button
              onClick={() => { setUsername('admin'); setPassword('admin123'); }}
              className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg text-left transition-all 
                       border border-slate-200 dark:border-slate-700 hover:border-green-500"
            >
              <div className="font-semibold text-slate-900 dark:text-white">Admin</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">admin / admin123</div>
            </button>
            <button
              onClick={() => { setUsername('manager'); setPassword('manager123'); }}
              className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-left transition-all 
                       border border-slate-200 dark:border-slate-700 hover:border-blue-500"
            >
              <div className="font-semibold text-slate-900 dark:text-white">Manager</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">manager / manager123</div>
            </button>
            <button
              onClick={() => { setUsername('waiter1'); setPassword('waiter123'); }}
              className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg text-left transition-all 
                       border border-slate-200 dark:border-slate-700 hover:border-green-500"
            >
              <div className="font-semibold text-slate-900 dark:text-white">Waiter</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">waiter1 / waiter123</div>
            </button>
            <button
              onClick={() => { setUsername('chef1'); setPassword('chef123'); }}
              className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-left transition-all 
                       border border-slate-200 dark:border-slate-700 hover:border-blue-500"
            >
              <div className="font-semibold text-slate-900 dark:text-white">Chef</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">chef1 / chef123</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
