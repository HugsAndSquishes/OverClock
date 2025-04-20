import React from 'react';
import NavBar from '../components/NavBar';
import ClockInOut from '../components/ClockInOut';

export default function Home({ onLogout }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar onLogout={onLogout} />

      <main className="p-6">
        <ClockInOut />
      </main>
    </div>
  );
}
