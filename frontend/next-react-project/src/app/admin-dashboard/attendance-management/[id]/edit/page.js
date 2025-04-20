'use client';
import ModelForm from '@/components/ModelForm';

export default function EditAttendance({ params }) {
  const id = params.id === 'add' ? null : params.id;
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/attendance/`;
  
  return (
    <ModelForm
      modelName="Attendance"
      apiUrl={`${process.env.NEXT_PUBLIC_API_URL}/attendance/`}
      redirectUrl="/admin-dashboard/attendance-management"
      addUrl='/admin-dashboard/attendance-management/add'
      id={id}
      fields={[
        { name: 'employee_id', label: 'Username', required: true },
        { name: 'clock_in', label: 'First Name', required: true },
        { name: 'clock_out', label: 'Last Name', required: true },
      ]}
    />
  );
}
/*
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';

export default function AdminUserDashboard() {
    const [rows, setRows] = useState([]);
    const router = useRouter();

    useEffect(() => {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/`;
      console.log('Fetching users from:', apiUrl);
      fetch(apiUrl)
          .then(res => res.json())
          .then(data => {
              console.log('Fetched users:', data);
              setRows(data);
          })
          .catch(err => console.error('Error fetching users:', err));
  }, []);
  

    useEffect(() => {
        // Fetching all users from the backend
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/`)
        .then(res => res.json())
        .then(data => {
            console.log('Fetched users:', data);
            setRows(data);
        })
        .catch(err => console.error('Error fetching users:', err));
    }, []);

    const handleRowDoubleClick = (params) => {
        // Redirect to user edit page
        router.push(`/admin-dashboard/employee-management/${params.id}/edit`);
    };

    const handleAddClick = () => {
        // Redirect to add user page
        router.push('/admin-dashboard/employee-management/add');
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'first_name', headerName: 'First Name', minWidth: 100, flex: 1 },
        { field: 'last_name', headerName: 'Last Name', minWidth: 100, flex: 1 },
        { field: 'employee_id', headerName: 'Employee ID', minWidth: 150, flex: 1 },
        //{ field: 'role', headerName: 'Role', minWidth: 100, flex: 1 },
        { field: 'department', headerName: 'Department', minWidth: 150, flex: 1 },
    ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Employee Manager</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddClick}
        className="mb-4"
      >
        Add User
      </Button>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          onRowDoubleClick={handleRowDoubleClick}
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
}
  */


/*
'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, TextField, MenuItem, Select, InputLabel, FormControl, Checkbox, ListItemText } from '@mui/material';

function InputField({ name, type = 'text', placeholder, value, onChange }) {
    return (
        <input
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required
        />
    );
}

async function updateUser(id, formData) {
    const cleanedData = { ...formData };

    for (let key in cleanedData) {
        if ((!cleanedData[key] || cleanedData[key].toString().trim() === '') && key !== 'department') {
            return { success: false, error: `Please fill in the ${key.replace('_', ' ')} field.` };
        }
    }

    // Remove department if not selected
    if (!cleanedData.department || cleanedData.department.toString().trim() === '') {
        delete cleanedData.department;
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/users/${id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cleanedData),
        });

        if (!response.ok) {
            const data = await response.json();
            return { success: false, error: data?.detail || 'Failed to update user.' };
        }

        return { success: true };
    } catch (err) {
        return { success: false, error: 'An error occurred. Please try again.' };
    }
}

export default function EditUserPage() {
    const router = useRouter();
    const params = useParams();
    const userId = params?.id;

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        employee_id: '',
        username: '',
        groups: [],  // Array of selected group IDs
        department: '', // Department ID
        sub_rank: ''
    });

    const [groups, setGroups] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/users/${userId}/`);
                if (!res.ok) throw new Error('Failed to fetch user.');
                const data = await res.json();
                setFormData({
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    employee_id: data.employee_id || '',
                    username: data.username || '',
                    groups: data.groups || [],  // Ensure groups are populated with the user's current group IDs
                    department: data.department || '',
                    sub_rank: data.sub_rank || ''
                });
            } catch (err) {
                setError('Unable to load user data.');
            } finally {
                setLoading(false);
            }
        }

        async function fetchGroups() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/groups/`);
                if (res.ok) {
                    const data = await res.json();
                    setGroups(data);
                }
            } catch (err) {
                console.error('Failed to load groups');
            }
        }

        async function fetchDepartments() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/departments/`);
                if (res.ok) {
                    const data = await res.json();
                    setDepartments(data);
                }
            } catch (err) {
                console.error('Failed to load departments');
            }
        }

        if (userId) {
            fetchUser();
            fetchGroups();
            fetchDepartments();
        }
    }, [userId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGroupChange = (e) => {
        const { value } = e.target;
        setFormData({ ...formData, groups: typeof value === 'string' ? value.split(',') : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const result = await updateUser(userId, formData);
        if (!result.success) {
            setError(result.error);
            setIsSubmitting(false);
            return;
        }
        router.push('/admin-dashboard/employee-management');
    };

    if (loading) {
        return <div className="text-center mt-10">Loading user data...</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-6 text-center">Edit User</h1>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
                <InputField name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} />
                <InputField name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} />
                <InputField name="employee_id" placeholder="Employee ID" value={formData.employee_id} onChange={handleChange} />
                <InputField name="username" placeholder="Username" value={formData.username} onChange={handleChange} />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Group</InputLabel>
                    <Select
                        name="groups"
                        value={formData.groups}
                        onChange={handleGroupChange}
                        label="Group"
                        multiple
                    >
                        {groups.map((group) => (
                            <MenuItem key={group.id} value={group.id}>
                                <Checkbox checked={formData.groups.includes(group.id)} />
                                <ListItemText primary={group.name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel>Department</InputLabel>
                    <Select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        label="Department"
                    >
                        {departments.map((department) => (
                            <MenuItem key={department.id} value={department.id}>
                                {department.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <InputField name="sub_rank" placeholder="Sub Rank" value={formData.sub_rank} onChange={handleChange} />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Updating...' : 'Update User'}
                </Button>
            </form>
        </div>
    );
}
    */