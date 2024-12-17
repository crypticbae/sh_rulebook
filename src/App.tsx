import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import MainLayout from './components/MainLayout';
import Login from './pages/Login';
import CategoryView from './pages/CategoryView';
import FactionView from './pages/FactionView';
import RulebookView from './pages/RulebookView';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)'
            }
          }}
        />
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/category/:categoryId" element={<CategoryView />} />
          <Route path="/rulebook/:rulebookId" element={<RulebookView />} />
          <Route path="/factions/:categoryId" element={<FactionView />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;