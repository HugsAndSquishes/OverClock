'use client';
import ModelTable from '@/components/ModelTable';
import { useRouter } from 'next/navigation';
import { Typography } from '@mui/material';

export default function UsersPage() {
  const router = useRouter();
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/`;

  const columns = [
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'first_name', headerName: 'First Name', width: 150 },
    { field: 'last_name', headerName: 'Last Name', width: 150 },
    { field: 'employee_id', headerName: 'Employee ID', width: 120 },
    {
      field: 'department_name',
      headerName: 'Department',
      width: 180
    }
    
  ];

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Users
      </Typography>
      <ModelTable
        modelName="User"
        apiUrl={apiUrl} 
        addUrl='/admin-dashboard/employee-management/add'
        editUrlPrefix="/admin-dashboard/employee-management"
        columns={columns}
        filterField="username"
        pageSize={10}
        title="User List"
      />
    </div>
  );
}

