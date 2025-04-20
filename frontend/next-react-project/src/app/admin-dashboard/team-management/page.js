'use client';
import ModelTable from '@/components/ModelTable';
import { useRouter } from 'next/navigation';
import { Typography } from '@mui/material';

export default function DepartmentsPage() {
  const router = useRouter();
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/departments/`;

  const columns = [
    { field: 'name', headerName: 'Department Name', width: 150 },
    { field: 'manager', headerName: 'Manager ID', width: 150 },
    { field: 'manager_username', headerName: 'Manager Username', width: 150 },
    { field: 'manager_full_name', headerName: 'Manager Name', width: 120 },
  ];

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Departments
      </Typography>
      <ModelTable
        modelName="Departments"
        apiUrl={apiUrl} 
        addUrl='/admin-dashboard/team-management/add'
        editUrlPrefix="/admin-dashboard/team-management"
        columns={columns}
        filterField="username"
        pageSize={10}
        title="Department List"
      />
    </div>
  );
}


/*
'use client';
import { useState, useEffect } from 'react';
import { Button } from '@mui/material'; 
import { DataGrid } from '@mui/x-data-grid'; 
import { useRouter } from 'next/navigation';

export default function DepartmentList() {
    const [departments, setDepartments] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchDepartments() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/departments/`);
                if (!res.ok) throw new Error('Failed to fetch departments.');
                const data = await res.json();
                // Ensure each department has an id, name, and manager for rendering
                const formattedData = data.map(department => ({
                    id: department.id, // Ensure `id` is present
                    name: department.name,
                    manager: department.manager || { username: 'No Manager' }, // Default if no manager is set
                }));
                setDepartments(formattedData);
            } catch (err) {
                setError('Unable to load departments.');
            } finally {
                setLoading(false);
            }
        }

        fetchDepartments();
    }, []);

    const handleRowDoubleClick = (params) => {
        if (params.row) {
            router.push(`/admin-dashboard/edit-department/${params.row.id}`);
        } else {
            console.error('Invalid row data');
        }
    };

    const handleAddDepartment = () => {
        router.push('/admin-dashboard/add-department');
    };

    const columns = [
        { field: 'name', headerName: 'Department Name', width: 200 },
        {
          field: 'manager',
          headerName: 'Manager',
          width: 200,
          valueGetter: ({ row }) => row?.manager?.username || 'No Manager'
        },
      ];
    if (loading) {
        return <div className="text-center mt-10">Loading departments...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-6 text-center">Department List</h1>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <Button
                variant="contained"
                color="primary"
                onClick={handleAddDepartment}
                className="mb-4"
            >
                Add New Department
            </Button>

            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={departments}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    onRowDoubleClick={handleRowDoubleClick}
                />
            </div>
        </div>
    );
}
    */