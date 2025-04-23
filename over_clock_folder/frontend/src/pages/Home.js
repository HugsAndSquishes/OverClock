import React from 'react';
import { useNavigate } from 'react-router-dom';
import ClockInOut from '../components/ClockInOut';
import { apiFetch, ENDPOINTS } from '../utils/api';

const Home = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await apiFetch(ENDPOINTS.LOGOUT, {
        method: 'POST'
      });

      if (response.ok) {
        localStorage.removeItem('logged_in');
        localStorage.removeItem('username');
        setIsAuthenticated(false);
        navigate('/login', { replace: true });
      } else {
        alert('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed');
    }
  };
  
  
  return (
    <div>
      <div className="flex justify-end p-4">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
      <ClockInOut />
    </div>
  );
};

export default Home;