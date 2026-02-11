'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('waiter');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Redirect based on role
        if (data.role === 'waiter' || data.role === 'admin') {
          router.push('/waiter');
        } else if (data.role === 'chef') {
          router.push('/chef');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-900 rounded-2xl mb-4">
            <span className="text-4xl">🍽️</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Restaurant Management</h1>
          <p className="text-slate-500 text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition bg-white"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition bg-white"
              placeholder="Enter password"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-semibold text-slate-700 mb-2">
              Login As
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition bg-white text-slate-900 font-medium"
            >
              <option value="waiter">Waiter</option>
              <option value="chef">Chef</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 px-4 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {error && (
            <div className="text-red-700 text-center text-sm bg-red-50 border border-red-200 p-3 rounded-xl">
              {error}
            </div>
          )}
        </form>

        <div className="mt-8 p-5 bg-slate-50 border border-slate-200 rounded-xl">
          <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wide">Demo Credentials</h3>
          <div className="text-sm text-slate-600 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium text-slate-700">Waiter:</span>
              <span className="font-mono text-xs">waiter1 / waiter123</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-slate-700">Chef:</span>
              <span className="font-mono text-xs">chef1 / chef123</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-slate-700">Admin:</span>
              <span className="font-mono text-xs">admin / admin123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
