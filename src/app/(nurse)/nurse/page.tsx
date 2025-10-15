"use client";
import React from 'react';
import NurseDashboard from './NurseDashboard';
import AuthGuard from '@/components/AuthGuard';

function App() {
  return (
      <div className="min-h-screen bg-gray-50">
        <NurseDashboard />
      </div>
  );
}
export default App;