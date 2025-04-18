import { useState } from 'react';
import { UserCheck, UserMinus, Calendar, Clock } from 'lucide-react';

export default function TeamDashboard() {
  // Sample team member data
  const [teamMembers, setTeamMembers] = useState([
    { 
      id: 1, 
      name: "John Doe", 
      role: "Frontend Developer", 
      online: true, 
      avatar: "/api/placeholder/40/40",
      attendanceTime: { start: "09:00", end: "17:00" }
    },
    { 
      id: 2, 
      name: "Jane Smith", 
      role: "UI/UX Designer", 
      online: false, 
      avatar: "/api/placeholder/40/40",
      attendanceTime: { start: "10:00", end: "18:00" }
    },
    { 
      id: 3, 
      name: "Mike Johnson", 
      role: "Backend Developer", 
      online: true, 
      avatar: "/api/placeholder/40/40",
      attendanceTime: { start: "08:30", end: "16:30" }
    },
    { 
      id: 4, 
      name: "Sarah Williams", 
      role: "Project Manager", 
      online: false, 
      avatar: "/api/placeholder/40/40",
      attendanceTime: { start: "09:30", end: "17:30" }
    },
    { 
      id: 5, 
      name: "Alex Chen", 
      role: "Data Analyst", 
      online: true, 
      avatar: "/api/placeholder/40/40",
      attendanceTime: { start: "09:00", end: "17:00" }
    },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [tempAttendance, setTempAttendance] = useState({ start: "", end: "" });
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          member.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'online') return member.online && matchesSearch;
    if (filterStatus === 'offline') return !member.online && matchesSearch;
    return matchesSearch;
  });

  const handleEdit = (member) => {
    setEditingId(member.id);
    setTempAttendance({ ...member.attendanceTime });
  };

  const handleSave = () => {
    setTeamMembers(teamMembers.map(member => 
      member.id === editingId 
        ? { ...member, attendanceTime: tempAttendance } 
        : member
    ));
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const toggleStatus = (id) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id 
        ? { ...member, online: !member.online } 
        : member
    ));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
      {/* Main Content */}
      <main className="container mx-auto p-4 flex-grow">
        {/* Filter and Search */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex space-x-2">
            <button 
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-xl border transition-all ${
                filterStatus === 'all' 
                  ? 'bg-gray-800 border-gray-600 text-gray-100' 
                  : 'border-gray-600 text-gray-400 hover:bg-gray-800'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setFilterStatus('online')}
              className={`px-4 py-2 rounded-xl border transition-all flex items-center ${
                filterStatus === 'online' 
                  ? 'bg-gray-800 border-gray-600 text-green-400' 
                  : 'border-gray-600 text-gray-400 hover:bg-gray-800'
              }`}
            >
              <UserCheck size={16} className="mr-1" /> Online
            </button>
            <button 
              onClick={() => setFilterStatus('offline')}
              className={`px-4 py-2 rounded-xl border transition-all flex items-center ${
                filterStatus === 'offline' 
                  ? 'bg-gray-800 border-gray-600 text-gray-300' 
                  : 'border-gray-600 text-gray-400 hover:bg-gray-800'
              }`}
            >
              <UserMinus size={16} className="mr-1" /> Offline
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search team members..."
              className="w-full md:w-64 px-4 py-2 rounded-xl bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Team Members List */}
        <div className="bg-gray-700 rounded-2xl shadow-xl border border-gray-600 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-600 bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-100">Team Members</h2>
          </div>
          
          <div className="divide-y divide-gray-600">
            {filteredMembers.length > 0 ? (
              filteredMembers.map(member => (
                <div key={member.id} className="p-4 hover:bg-gray-800/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center">
                      <div className="relative">
                        <img 
                          src={member.avatar} 
                          alt={member.name} 
                          className="w-10 h-10 rounded-full mr-4 border border-gray-600"
                        />
                        <div className={`absolute bottom-0 right-3 w-3 h-3 rounded-full border-2 border-gray-700 ${member.online ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-100">{member.name}</h3>
                        <p className="text-sm text-gray-400">{member.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        member.online ? 'bg-green-900/30 text-green-400' : 'bg-gray-600 text-gray-300'
                      }`}>
                        {member.online ? 'Online' : 'Offline'}
                      </span>
                      <button 
                        onClick={() => toggleStatus(member.id)}
                        className="text-xs bg-gray-600 text-gray-100 px-2 py-1 rounded-xl hover:bg-gray-500 transition-colors"
                      >
                        Toggle Status
                      </button>
                    </div>
                    
                    {editingId === member.id ? (
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Clock size={16} className="mr-1 text-gray-400" />
                          <input
                            type="time"
                            value={tempAttendance.start}
                            onChange={(e) => setTempAttendance({...tempAttendance, start: e.target.value})}
                            className="px-2 py-1 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 text-sm w-24"
                          />
                          <span className="mx-1 text-gray-400">to</span>
                          <input
                            type="time"
                            value={tempAttendance.end}
                            onChange={(e) => setTempAttendance({...tempAttendance, end: e.target.value})}
                            className="px-2 py-1 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 text-sm w-24"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSave}
                            className="px-3 py-1 bg-green-500 text-gray-900 rounded-xl text-sm hover:bg-green-400 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="px-3 py-1 bg-gray-600 text-gray-100 rounded-xl text-sm hover:bg-gray-500 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <div className="flex items-center mr-4">
                          <Calendar size={16} className="mr-1 text-gray-400" />
                          <span className="text-sm text-gray-300">
                            {member.attendanceTime.start} - {member.attendanceTime.end}
                          </span>
                        </div>
                        <button
                          onClick={() => handleEdit(member)}
                          className="px-3 py-1 bg-gray-600 text-gray-100 rounded-xl text-sm hover:bg-gray-500 transition-colors"
                        >
                          Edit Time
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400">
                No team members found matching your search criteria.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}