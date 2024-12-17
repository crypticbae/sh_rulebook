import React from 'react';
import { LogIn, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-black/50 backdrop-blur-sm border-b border-gray-200 dark:border-white/10 z-50">
      <div className="px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="https://i.imgur.com/nQPMLVE.png"
              alt="SwisshubRP Logo" 
              className="h-8 w-auto"
            />
            <span className="text-gray-900 dark:text-white font-bold text-xl">Regelwerk</span>
          </Link>
          
          <div className="flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>
          <div className="flex items-center space-x-6">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;