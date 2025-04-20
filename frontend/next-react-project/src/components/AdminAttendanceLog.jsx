import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminAttendanceLog = () => {
  const [punches, setPunches] = useState([]);
  const [filters, setFilters] = useState({ first_name: 'John', last_name: 'Rivers' });

  const fetchPunches = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/punches/', {
        params: filters,
      });
      setPunches(response.data);
    } catch (err) {
      console.error("Failed to fetch punches", err);
    }
  };

  useEffect(() => {
    fetchPunches();
  }, [filters]);

  const handleRemoveFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: '' }));
  };

  return (
    <div style={{ padding: '1rem', background: '#f5f8fc', minHeight: '100vh' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button>🔍 Filters</button>
        {Object.entries(filters).map(([key, value]) => (
          value && (
            <span key={key} style={{ background: '#fff', padding: '0.3rem 0.6rem', borderRadius: '20px', boxShadow: '0 0 2px rgba(0,0,0,0.1)' }}>
                {key.replace('_', ' ')}: {value}
              <button onClick={() => handleRemoveFilter(key)} style={{ marginLeft: '0.3rem' }}>x</button>
            </span>
          )
        ))}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
        <thead style={{ background: '#f0f3f8' }}>
          <tr>
            <th style={thStyle}>Employee ID</th>
            <th style={thStyle}>First Name</th>
            <th style={thStyle}>Last Name</th>
            <th style={thStyle}>Department</th>
            <th style={thStyle}>Punch Type</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Time</th>
          </tr>
        </thead>
        <tbody>
          {punches.map((p, i) => (
            <tr key={i} style={{ textAlign: 'center' }}>
              <td>{p.employee_id}</td>
              <td>{p.first_name}</td>
              <td>{p.last_name}</td>
              <td>{p.department}</td>
              <td>{p.punch_type}</td>
              <td>{new Date(p.date).toLocaleDateString()}</td>
              <td>{p.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const thStyle = {
  padding: '0.75rem',
  fontWeight: 'bold',
  textAlign: 'left',
};

export default AdminAttendanceLog;