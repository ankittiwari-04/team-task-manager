import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('Admin123!');
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen grid place-items-center p-4">
      <form className="w-full max-w-md border rounded p-6 space-y-3" onSubmit={async (e) => { e.preventDefault(); setLoading(true); await login(email, password); setLoading(false); navigate('/dashboard'); }}>
        <h1 className="text-2xl font-bold">TaskFlow Login</h1>
        <input className="w-full border rounded p-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border rounded p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button disabled={loading} className="w-full border rounded p-2">{loading ? 'Signing in...' : 'Login'}</button>
        <p className="text-sm">New account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
}
