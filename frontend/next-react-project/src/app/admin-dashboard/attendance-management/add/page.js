'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button } from '@mui/material';

export default function AddAttendanceEntry() {
  const [form, setForm] = useState({
    employee_id: '',
    clock_in: '',
    clock_out: ''
  });
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await fetch('http://localhost:8000/api/attendance/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      router.push('/attendance-management');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Add Attendance Entry</h1>
      <TextField
        label="Employee ID"
        name="employee_id"
        value={form.employee_id}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Clock In"
        name="clock_in"
        type="datetime-local"
        value={form.clock_in}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Clock Out"
        name="clock_out"
        type="datetime-local"
        value={form.clock_out}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit} className="mt-4">
        Submit
      </Button>
    </div>
  );
}
