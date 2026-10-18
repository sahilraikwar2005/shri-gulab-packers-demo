import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ButtonLoader } from '../components/common/States';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@moveeasy.com');
  const [password, setPassword] = useState('Admin@12345');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy">
      <form onSubmit={submit} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-navy text-center">Shri Gulab Admin Login</h1>
        <label className="sr-only" htmlFor="admin-email">Email</label>
        <input id="admin-email" type="email" autoComplete="username" required className="w-full border rounded p-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <label className="sr-only" htmlFor="admin-password">Password</label>
        <input id="admin-password" autoComplete="current-password" required className="w-full border rounded p-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-orange text-white py-2.5 rounded font-semibold disabled:opacity-60">{loading ? <ButtonLoader label="Signing in..." /> : 'Sign In'}</button>
      </form>
    </div>
  );
}