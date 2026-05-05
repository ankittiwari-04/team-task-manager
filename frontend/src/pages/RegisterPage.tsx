import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  return (
    <div className="min-h-screen grid place-items-center p-4">
      <form className="w-full max-w-md border rounded p-6 space-y-3" onSubmit={async (e) => { e.preventDefault(); await register(form.name, form.email, form.password); navigate('/dashboard'); }}>
        <h1 className="text-2xl font-bold">Create Account</h1>
        <input className="w-full border rounded p-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="w-full border rounded p-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full border rounded p-2" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="w-full border rounded p-2">Register</button>
        <p className="text-sm">Have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}
