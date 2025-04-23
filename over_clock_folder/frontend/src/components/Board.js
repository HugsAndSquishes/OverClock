import React, { useState, useEffect } from 'react';
import { apiFetch, ENDPOINTS } from '../utils/api';

const Board = () => {
  const [boardData, setBoardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Use apiFetch instead of direct fetch
    apiFetch(ENDPOINTS.LEADERBOARD)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setBoardData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="p-8 w-full max-w-2xl mx-4 bg-gray-700 rounded-2xl shadow-xl border border-gray-600">
        <h2 className="text-3xl font-bold text-gray-100 mb-6 text-center">Leaderboard</h2>

        <div className="space-y-4">
          {loading ? (
            <p className="text-gray-300 text-center">Loading...</p>
          ) : (
            boardData.map((user, index) => (
              <div
                key={user.employee_name}
                className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-600"
              >
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
                    {user.employee_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-100">{user.employee_name}</h4>
                    <p className="text-gray-400">{user.total_hours.toFixed(2)} hrs</p>
                  </div>
                </div>
                <span className="text-xl font-semibold text-gray-100">
                  #{index + 1}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Board;
