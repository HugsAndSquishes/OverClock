'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Alert,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ModelTable({
  modelName,
  columns = [],       // Add default empty array for columns
  apiUrl,            // Base API URL for fetching/manipulating data
  addUrl,            // URL for adding new instances
  editUrlPrefix,     // Prefix for edit URLs (will append ID)
  pageSize = 10,     // Default page size
  title = null,      // Custom title (optional)
  filterField = '',  // Field to filter by (optional)
}) {
    //console.log(`YOU HAVE ${apiUrl}`)
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    pageSize,
    page: 0,
  });
  const [totalRows, setTotalRows] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [filterValue, setFilterValue] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const router = useRouter();

  // Prepare action column with edit/delete buttons
  //console.log(`${editUrlPrefix}`);
  //console.log(`${params.row.id}`);
  const actionColumn = {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => router.push(`${editUrlPrefix}/${params.row.id}/edit`)}
        >
          Edit
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => handleDeleteClick(params.row)}
        >
          Delete
        </Button>
      </Stack>
    ),
  };

  // Combine provided columns with action column - safely handle undefined columns
  const allColumns = [...(columns || []), actionColumn];

  // Fetch data with pagination and optional filtering
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Build query parameters for pagination and filtering
        const params = new URLSearchParams({
          page: paginationModel.page + 1, // API typically uses 1-based indexing
          page_size: paginationModel.pageSize,
        });
        
        // Add filter parameter if provided
        if (filterField && filterValue) {
          params.append(filterField, filterValue);
        }
        console.log(`${apiUrl}`);
        console.log(`${apiUrl}?${params.toString()}`);
        
        const res = await fetch(`${apiUrl}?${params.toString()}`);
        
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        
        const responseData = await res.json();
        
        // Handle both array responses and paginated responses
        if (Array.isArray(responseData)) {
          setData(responseData);
          setTotalRows(responseData.length);
        } else {
          setData(responseData.results || []);
          setTotalRows(responseData.count || 0);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(`Error loading ${modelName}: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, paginationModel, filterField, filterValue, refreshTrigger]);

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    try {
      const res = await fetch(`${apiUrl}${itemToDelete.id}/`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        let errorDetail = 'Failed to delete item';
        try {
          const errorData = await res.json();
          errorDetail = errorData.detail || JSON.stringify(errorData);
        } catch (_) {
          errorDetail = `Error ${res.status}: ${res.statusText}`;
        }
        throw new Error(errorDetail);
      }
      
      // Refresh the data
      setRefreshTrigger(prev => prev + 1);
      
    } catch (err) {
      console.error('Delete error:', err);
      setError(`Error deleting ${modelName}: ${err.message}`);
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
    // Reset to first page when filter changes
    setPaginationModel(prev => ({ ...prev, page: 0 }));
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          {title || `${modelName} List`}
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => router.push(addUrl)}
        >
          Add {modelName}
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {filterField && (
        <Box mb={3}>
          <TextField
            label={`Filter by ${filterField}`}
            variant="outlined"
            size="small"
            value={filterValue}
            onChange={handleFilterChange}
            fullWidth
          />
        </Box>
      )}
      
      <Box height={650} width="100%">
        <DataGrid
          rows={data}
          columns={allColumns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25, 50]}
          rowCount={totalRows}
          paginationMode="server"
          loading={loading}
          disableRowSelectionOnClick
          autoHeight
        />
      </Box>
      
      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this {modelName.toLowerCase()}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}