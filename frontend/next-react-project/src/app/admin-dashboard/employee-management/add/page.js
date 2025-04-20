/*
'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ModelForm from '@/components/ModelForm';

export default function AddEditPage() {
  const pathname = usePathname(); // Get the current path
  const [id, setId] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Extract the ID from the URL manually
  useEffect(() => {
    const parts = pathname.split('/');
    const potentialId = parts.includes('edit') ? parts[parts.indexOf('edit') - 1] : null;
    setId(potentialId);
  }, [pathname]);

  // Fetch data if editing
  useEffect(() => {
    if (id) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const res = await fetch(`/api/users/${id}`);
          const data = await res.json();
          setInitialData(data);
        } catch (error) {
          console.error('Error fetching data', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <ModelForm
      modelName="User"
      apiUrl={`/api/users/${id || ''}`} // If ID is present, use it for edit
      initialData={initialData} // Pass data for edit mode
    />
  );
}
*/

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';

export default function AddUserPage() {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    group: '',
    department: '', 
  });

  const [groupOptions, setGroupOptions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/departments/`);
        const data = await response.json();
        setDepartments(data);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
      }
    };

    fetchDepartments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value); // Log input field name and value
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    setErrors({});

    const validationErrors = {};
    if (!formData.username) validationErrors.username = 'Username is required';
    if (!formData.first_name) validationErrors.first_name = 'First name is required';
    if (!formData.last_name) validationErrors.last_name = 'Last name is required';
    //if (!formData.email) validationErrors.email = 'Email is required';
    if (!formData.password) validationErrors.password = 'Password is required';
    //if (!formData.department) validationErrors.department = 'Department is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
        console.log('Form data:', formData);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const createdUser = await response.json();
        console.log('Created User:', createdUser); 
        router.push('/admin-dashboard/employee-management');
      } else {
        const data = await response.json();
        console.error('Error:', data);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add User</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            fullWidth
            error={Boolean(errors.username)}
            helperText={errors.username}
          />
        </div>
        <div className="mb-4">
          <TextField
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            fullWidth
            error={Boolean(errors.first_name)}
            helperText={errors.first_name}
          />
        </div>
        <div className="mb-4">
          <TextField
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            fullWidth
            error={Boolean(errors.last_name)}
            helperText={errors.last_name}
          />
        </div>
        <div className="mb-4">
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            error={Boolean(errors.email)}
            helperText={errors.email}
          />
        </div>
        <div className="mb-4">
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            fullWidth
            error={Boolean(errors.password)}
            helperText={errors.password}
          />
        </div>

        <div className="mb-4">
          <FormControl fullWidth>
            <InputLabel>Group</InputLabel>
            <Select
              name="group"
              value={formData.group}
              onChange={handleInputChange}
              label="Group"
            >
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="admin">Administrator</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="mb-4">
            <FormControl fullWidth error={Boolean(errors.department)}>
                <InputLabel id="department-label">Department</InputLabel>
                <Select
                    labelId="department-label"
                    id="department"
                    name="department"
                    value={formData.department || ''}
                    onChange={handleInputChange}
                    label="Department"
                >
                    {departments.map((department) => (
                        <MenuItem key={department.id} value={department.id}>
                            {department.name}
                        </MenuItem>
                    ))}
                </Select>
                {errors.department && (
                    <p className="text-red-500 text-sm mt-1">{errors.department}</p>
                )}
            </FormControl>
        </div>

        <Button variant="contained" color="primary" type="submit">
          Create User
        </Button>
      </form>
    </div>
  );
}
