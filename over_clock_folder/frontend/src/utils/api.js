/**
 * API fetching utility that ensures credentials are always included
 */
export const apiFetch = async (url, options = {}) => {
    // Ensure we always send credentials with every request
    const fetchOptions = {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };
    
    try {
      const response = await fetch(url, fetchOptions);
      
      // Handle 401 errors globally
      if (response.status === 401) {
        // If unauthorized and we thought we were logged in, clear state
        if (localStorage.getItem('logged_in') === 'yes') {
          localStorage.removeItem('logged_in');
          localStorage.removeItem('username');
          // Optionally redirect to login
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      }
      
      return response;
    } catch (error) {
      console.error("API fetch error:", error);
      throw error;
    }
  };
  
  // Base API URL
  export const API_BASE_URL = 'http://localhost:8000/api';
  
  // API endpoints
  export const ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/login/`,
    LOGOUT: `${API_BASE_URL}/logout/`,
    AUTHENTICATED: `${API_BASE_URL}/authenticated/`,
    CLOCK: `${API_BASE_URL}/clock/`,
    LEADERBOARD: `${API_BASE_URL}/leaderboard/`,
    TEAM: `${API_BASE_URL}/team/`,
    HISTORY: `${API_BASE_URL}/history/`
  };