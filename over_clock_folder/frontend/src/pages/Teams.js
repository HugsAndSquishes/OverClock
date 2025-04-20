// src/pages/Teams.js
import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';

export default function Teams({ onLogout }) {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    // fetch only employees (you can adjust the query params as your API expects)
    fetch('/api/users/?role=employee', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load team');
        return res.json();
      })
      .then(data => setTeamMembers(data))
      .catch(err => {
        console.error(err);
        setTeamMembers([]);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar onLogout={onLogout} />
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Team Members</h1>
        <ul className="space-y-2">
          {teamMembers.length > 0 ? (
            teamMembers.map(u => (
              <li key={u.id} className="bg-gray-800 p-4 rounded flex items-center justify-between">
                <div>
                  <div className="font-semibold">{u.username}</div>
                  <div className="text-sm text-gray-400">ID: {u.employee_id}</div>
                </div>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No team members found.</li>
          )}
        </ul>
      </main>
    </div>
  );
}
