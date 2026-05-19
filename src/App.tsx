/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Settings from './pages/Settings';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex bg-[#0A0A0F] items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#6C63FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#0A0A0F] text-white selection:bg-[#6C63FF]/30">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/signup" element={!session ? <Signup /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/history" element={session ? <History /> : <Navigate to="/login" />} />
            <Route path="/settings" element={session ? <Settings /> : <Navigate to="/login" />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

