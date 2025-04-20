'use client';
import ModelTable from '@/components/ModelTable';
import { useRouter } from 'next/navigation';
import { Typography } from '@mui/material';

export default function AttendancePage() {
  const router = useRouter();
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/attendance/`;

  const columns = [
    { field: 'employee_id', headerName: 'Employee ID', width: 150 },
    { field: 'user.first_name', headerName: 'First Name', width: 150 },
    { field: 'user.department_name', headerName: 'Department', width: 150 },
    { field: 'user.last_name', headerName: 'Last Name', width: 150 },
    { field: 'clock_in', headerName: 'First Name', width: 150 },
    { field: 'clock_out', headerName: 'Last Name', width: 150 },
    { field: 'total_hours', headerName: 'Employee ID', width: 120 },    
  ];

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Attendance
      </Typography>
      <ModelTable
        modelName="Attendance"
        apiUrl={apiUrl} 
        addUrl='/admin-dashboard/attendance-management/add'
        editUrlPrefix="/admin-dashboard/attendance-management"
        columns={columns}
        filterField="employee_id"
        pageSize={10}
        title="Attendance Manager"
      />
    </div>
  );
}
