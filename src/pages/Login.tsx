import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { signIn, supabase } from '../lib/supabase';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/admin/categories');
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      await signIn(email, password);
      toast.success('Logged in successfully');
      navigate('/admin/categories');
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Invalid credentials');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533134486753-c833f0ed4866?q=80&w=3270&auto=format&fit=crop')] opacity-5 bg-cover bg-center" />
      <div className="relative w-full max-w-md">
        <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-8">
          <div className="flex items-center justify-center mb-8">
            <Shield className="w-12 h-12 text-[#911111]" />
          </div>
          
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Admin Login
          </h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 text-white border border-white/10 rounded-md px-4 py-2"
                required
                autoComplete="email"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 text-white border border-white/10 rounded-md px-4 py-2"
                required
                autoComplete="current-password"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#911111] to-[#b92a2a] text-white py-2 rounded-md hover:opacity-90 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;