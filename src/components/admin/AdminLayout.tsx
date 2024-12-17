import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Shield, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import AdminSidebar from './AdminSidebar';
import { signOut, supabase } from '../../lib/supabase';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B]">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-black/50 backdrop-blur-sm border-b border-gray-200 dark:border-white/10 px-4 z-50">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-[#911111]" />
            <span className="text-gray-900 dark:text-white font-bold text-xl">Admin Panel</span>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-white/5"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <div className="flex pt-16">
        <AdminSidebar />
        <main className="flex justify-center flex-1">
          <div className="w-full max-w-7xl px-8 py-12 ml-64">
          <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;