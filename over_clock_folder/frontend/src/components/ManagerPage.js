import React, { useEffect, useState } from 'react';

function ManagerPage() {
  const [managerData, setManagerData] = useState(null);
  const [error, setError] = useState(null);

  const MANAGER_API_URL = 'http://127.0.0.1:8000/api/manager/overview/';

  useEffect(() => {
    fetch(MANAGER_API_URL, {
      method: 'GET',
      credentials: 'include',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => setManagerData(data))
    .catch(err => {
      console.error('Error fetching manager data:', err);
      setError(err.message);
    });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!managerData) {
    return <div>Loading...</div>;
  }


  return (
    <div>
      <h1>Manager Dashboard</h1>
      <p>Welcome, Manager!</p>
      {}
      <pre>{JSON.stringify(managerData, null, 2)}</pre>
    </div>
  );
}

export default ManagerPage;
