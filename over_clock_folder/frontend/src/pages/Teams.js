import { useState, useEffect } from 'react';
import { UserCheck, UserMinus, Calendar, Edit, Save, X } from 'lucide-react';
import { apiFetch, ENDPOINTS } from '../utils/api';

export default function TeamDashboard() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeRecords, setEmployeeRecords] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editFormData, setEditFormData] = useState({
    clock_in_time: '',
    clock_out_time: ''
  });
  const isManager = localStorage.getItem('is_manager') === 'yes';

  useEffect(() => {
    apiFetch(ENDPOINTS.TEAM)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        // Format depends on the response structure from updated team_view
        let members = [];
        
        if (isManager && data.employees) {
          // Manager view shows all employees
          members = data.employees.map(user => ({
            id: user.id || Math.random().toString(),
            name: user.username,
            role: "Employee",
            online: Math.random() > 0.5,
            attendanceTime: { start: "9:00 AM", end: "5:00 PM" }
          }));
        } else if (Array.isArray(data) && data.length > 0) {
          // Regular user view shows team members
          members = data[0].members.map(member => ({
            id: member.id || Math.random().toString(),
            name: member.username || "Unknown",
            role: "Team Member",
            online: Math.random() > 0.5,
            attendanceTime: { start: "9:00 AM", end: "5:00 PM" }
          }));
        }
        
        setTeamMembers(members);
      })
      .catch(err => console.error(err));
  }, [isManager]);
  
  const fetchEmployeeRecords = (username) => {
    // Get last 7 days of records
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    apiFetch(`${ENDPOINTS.API_BASE_URL}/employee/${username}/records/?start_date=${startDate}&end_date=${endDate}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setEmployeeRecords(data);
      })
      .catch(err => console.error("Error fetching employee records:", err));
  };
  
  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    fetchEmployeeRecords(employee.name);
  };
  
  const handleEditRecord = (record) => {
    setEditingRecord(record.id);
    setEditFormData({
      clock_in_time: record.clock_in_time ? new Date(record.clock_in_time).toISOString().substr(0, 16) : '',
      clock_out_time: record.clock_out_time ? new Date(record.clock_out_time).toISOString().substr(0, 16) : ''
    });
  };
  
  const handleCancelEdit = () => {
    setEditingRecord(null);
  };
  
  const handleSaveEdit = (recordId) => {
    apiFetch(`${ENDPOINTS.API_BASE_URL}/clock/record/${recordId}/`, {
      method: 'PUT',
      body: JSON.stringify(editFormData)
    })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      return res.json();
    })
    .then(data => {
      // Update the records list with the updated record
      setEmployeeRecords(records => 
        records.map(record => record.id === recordId ? data : record)
      );
      setEditingRecord(null);
    })
    .catch(err => console.error("Error updating record:", err));
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          member.role.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'online') return member.online && matchesSearch;
    if (filterStatus === 'offline') return !member.online && matchesSearch;
    return matchesSearch;
  });

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'N/A';
    return new Date(dateTimeStr).toLocaleString();
  };
  
  const calculateHours = (record) => {
    if (!record.clock_in_time || !record.clock_out_time) return 'N/A';
    
    const start = new Date(record.clock_in_time);
    const end = new Date(record.clock_out_time);
    const diffHours = (end - start) / (1000 * 60 * 60);
    
    return diffHours.toFixed(2);
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Employee List */}
          <div className="bg-gray-700 rounded-2xl shadow-xl border border-gray-600">
            <div className="px-6 py-4 border-b border-gray-600 bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-100">Team Members</h2>
            </div>
            <div className="divide-y divide-gray-600">
              {filteredMembers.map(member => (
                <div 
                  key={member.id} 
                  className={`p-4 flex justify-between items-center cursor-pointer hover:bg-gray-600/30 ${
                    selectedEmployee?.name === member.name ? 'bg-gray-600/50' : ''
                  }`}
                  onClick={() => handleEmployeeSelect(member)}
                >
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
                  <div className="flex items-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${member.online ? 'bg-green-800 text-green-400' : 'bg-gray-600 text-gray-300'}`}>
                      {member.online ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Employee Records (when selected) */}
          {selectedEmployee && (
            <div className="lg:col-span-2 bg-gray-700 rounded-2xl shadow-xl border border-gray-600">
              <div className="px-6 py-4 border-b border-gray-600 bg-gray-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-100">
                  {selectedEmployee.name}'s Clock Records
                </h2>
                <button 
                  className="text-gray-400 hover:text-gray-100"
                  onClick={() => fetchEmployeeRecords(selectedEmployee.name)}
                >
                  <Calendar size={18} />
                </button>
              </div>
              
              <div className="p-4">
                {employeeRecords.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No records found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-600">
                          <th className="px-4 py-2 text-left text-gray-300">Date</th>
                          <th className="px-4 py-2 text-left text-gray-300">Clock In</th>
                          <th className="px-4 py-2 text-left text-gray-300">Clock Out</th>
                          <th className="px-4 py-2 text-left text-gray-300">Hours</th>
                          {isManager && <th className="px-4 py-2 text-right text-gray-300">Actions</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {employeeRecords.map(record => (
                          <tr key={record.id} className="border-b border-gray-600/50 hover:bg-gray-600/20">
                            <td className="px-4 py-3 text-gray-100">
                              {new Date(record.day).toLocaleDateString()}
                            </td>
                            
                            {editingRecord === record.id ? (
                              <>
                                <td className="px-4 py-3">
                                  <input
                                    type="datetime-local"
                                    name="clock_in_time"
                                    value={editFormData.clock_in_time}
                                    onChange={handleInputChange}
                                    className="bg-gray-800 text-white px-2 py-1 rounded border border-gray-600"
                                  />
                                </td>
                                <td className="px-4 py-3">
                                  <input
                                    type="datetime-local"
                                    name="clock_out_time"
                                    value={editFormData.clock_out_time}
                                    onChange={handleInputChange}
                                    className="bg-gray-800 text-white px-2 py-1 rounded border border-gray-600"
                                  />
                                </td>
                                <td className="px-4 py-3 text-gray-300">
                                  {calculateHours(record)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <button 
                                    onClick={() => handleSaveEdit(record.id)}
                                    className="p-1 text-green-400 hover:text-green-300 mr-2"
                                  >
                                    <Save size={16} />
                                  </button>
                                  <button 
                                    onClick={handleCancelEdit}
                                    className="p-1 text-red-400 hover:text-red-300"
                                  >
                                    <X size={16} />
                                  </button>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="px-4 py-3 text-gray-300">
                                  {formatDateTime(record.clock_in_time)}
                                </td>
                                <td className="px-4 py-3 text-gray-300">
                                  {formatDateTime(record.clock_out_time)}
                                </td>
                                <td className="px-4 py-3 text-gray-300">
                                  {calculateHours(record)}
                                </td>
                                {isManager && (
                                  <td className="px-4 py-3 text-right">
                                    <button 
                                      onClick={() => handleEditRecord(record)}
                                      className="p-1 text-blue-400 hover:text-blue-300"
                                    >
                                      <Edit size={16} />
                                    </button>
                                  </td>
                                )}
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}