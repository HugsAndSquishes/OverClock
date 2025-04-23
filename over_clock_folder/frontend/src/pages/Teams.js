import { useState, useEffect } from 'react';
import { UserCheck, UserMinus, Clock } from 'lucide-react';
import { apiFetch, ENDPOINTS } from '../utils/api';

export default function TeamDashboard() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Use apiFetch instead of direct fetch
    apiFetch(ENDPOINTS.TEAM)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        // Your existing logic to process team data
        if (Array.isArray(data) && data.length > 0) {
          const teamMembers = data[0].members.map(member => ({
            id: member.id || Math.random().toString(),
            name: member.username || "Unknown",
            role: "Team Member",
            online: Math.random() > 0.5,
            attendanceTime: { start: "9:00 AM", end: "5:00 PM" }
          }));
          setTeamMembers(teamMembers);
        } else {
          setTeamMembers([]);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          member.role.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'online') return member.online && matchesSearch;
    if (filterStatus === 'offline') return !member.online && matchesSearch;
    return matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
      <main className="container mx-auto p-4 flex-grow">
        <div className="mb-6 flex justify-between gap-4">
          <div className="flex space-x-2">
            {['all', 'online', 'offline'].map(status => (
              <button 
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl border transition-all ${
                  filterStatus === status
                    ? 'bg-gray-800 border-gray-600 text-white'
                    : 'border-gray-600 text-gray-400 hover:bg-gray-800'
                }`}
              >
                {status === 'online' && <UserCheck size={16} className="inline mr-1" />}
                {status === 'offline' && <UserMinus size={16} className="inline mr-1" />}
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search team members..."
            className="px-4 py-2 rounded-xl bg-gray-700 border border-gray-600 text-gray-100"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="bg-gray-700 rounded-2xl shadow-xl border border-gray-600">
          <div className="px-6 py-4 border-b border-gray-600 bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-100">Team Members</h2>
          </div>
          <div className="divide-y divide-gray-600">
            {filteredMembers.map(member => (
              <div key={member.id} className="p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="relative">
                    <div className={`size-10 rounded-full flex items-center justify-center bg-gray-600 text-white`}>
                      {member.name.charAt(0)}
                    </div>
                    <span className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-gray-700 ${member.online ? 'bg-green-400' : 'bg-gray-500'}`}></span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-gray-100">{member.name}</h3>
                    <p className="text-gray-400 text-sm">{member.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center text-gray-300">
                    <Clock size={16} className="mr-1" />
                    <span>{member.attendanceTime.start || '--'} - {member.attendanceTime.end || '--'}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${member.online ? 'bg-green-800 text-green-400' : 'bg-gray-600 text-gray-300'}`}>
                    {member.online ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
