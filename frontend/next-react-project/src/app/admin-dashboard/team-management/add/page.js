'use client';
import { useState, useEffect } from 'react';
import { Button, TextField, MenuItem, Select, InputLabel, FormControl, FormHelperText } from '@mui/material';

export default function DepartmentForm() {
    const [formData, setFormData] = useState({
        name: '',
        manager: '',
    });

    const [managers, setManagers] = useState([]);
    const [error, setError] = useState({});

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/`);
                const data = await response.json();
                console.log("User data:", data); 

                // Normalize group format to IDs
                const managerList = data.filter(user => {
                    const groupIds = user.groups.map(g => (typeof g === 'object' ? g.id : g));
                    return groupIds.includes(2);
                });

                setManagers(managerList);
            } catch (err) {
                console.error('Failed to fetch managers', err);
            }
        };

        fetchManagers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/departments/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data);
        } else {
            setError({});
            alert('Department created!');
            setFormData({ name: '', manager: '' });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Department Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!error.name}
                helperText={error.name?.[0]}
            />

            <FormControl fullWidth margin="normal" error={!!error.manager}>
                <InputLabel>Manager</InputLabel>
                <Select
                    name="manager"
                    value={formData.manager}
                    onChange={handleChange}
                    label="Manager"
                >
                    {managers.map((manager) => (
                        <MenuItem key={manager.id} value={manager.id}>
                            {manager.username} {manager.first_name} {manager.last_name}
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText>{error.manager?.[0]}</FormHelperText>
            </FormControl>

            <Button variant="contained" type="submit">
                Create Department
            </Button>
        </form>
    );
}
