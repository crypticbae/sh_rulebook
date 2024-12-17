import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (!session) {
        navigate('/login');
      } else {
        setLoading(false);
      }
    };

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
      } else {
        localStorage.setItem('isAuthenticated', 'true');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);
  
  if (loading) {
    return null;
  }

  if (!session) {
    navigate('/login');
    return null;
  }
  
  return children;
};

export default ProtectedRoute;