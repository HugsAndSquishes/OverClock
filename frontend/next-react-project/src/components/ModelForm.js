'use client';
import { useState, useEffect } from 'react';

export default function ModelForm({ modelName, apiUrl, initialData }) {
  const [formData, setFormData] = useState(initialData || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(apiUrl, {
        method: initialData ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Submission failed');
      alert(`${modelName} saved successfully!`);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{initialData ? `Edit ${modelName}` : `Add ${modelName}`}</h2>

      <label>
        Username:
        <input
          type="text"
          name="username"
          value={formData.username || ''}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          required
        />
      </label>

      {/* Add more fields as needed... */}

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}

/*

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Button, 
  Stack, 
  TextField,
  MenuItem, 
  FormControl,
  InputLabel,
  Select,
  Typography,
  CircularProgress,
  Paper,
  Alert,
  Grid,
  Divider
} from '@mui/material';

export default function ModelForm({
  modelName,
  fields,            
  apiUrl,            
  redirectUrl,      
  id = null,         
  title = null,     
}) {

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fieldOptions, setFieldOptions] = useState({});

  const router = useRouter();
  
  // Load instance data if editing
  useEffect(() => {
    const fetchInstance = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const res = await fetch(`${apiUrl}${id}/`);
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        
        const data = await res.json();
        console.log('Form data loaded:', data);
        setFormData(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(`Error loading ${modelName}: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchInstance();
  }, [id, apiUrl, modelName]);

  // Load options for relationship fields (foreign keys, etc.)
  useEffect(() => {
    const fetchOptions = async () => {
      const optionsToFetch = fields.filter(field => field.type === 'select' && field.optionsUrl);
      
      if (optionsToFetch.length === 0) return;
      
      const options = {};
      
      for (const field of optionsToFetch) {
        try {
          const res = await fetch(field.optionsUrl);
          if (!res.ok) throw new Error(`Error fetching options for ${field.name}`);
          
          const data = await res.json();
          console.log(`Options for ${field.name}:`, data); // Debug log
          options[field.name] = data;
        } catch (error) {
          console.error(`Error fetching options for ${field.name}:`, error);
          setError(`Error loading options: ${error.message}`);
        }
      }
      
      setFieldOptions(options);
    };
    
    fetchOptions();
  }, [fields]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      const submissionData = { ...formData };
      console.log('Submitting data:', submissionData);
      
      const url = id ? `${apiUrl}${id}/` : apiUrl;
      const method = id ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });
      
      if (!res.ok) {
        let errorDetail = 'An unknown error occurred';
        try {
          const errorData = await res.json();
          errorDetail = errorData.detail || JSON.stringify(errorData);
        } catch (_) {
          errorDetail = `Error ${res.status}: ${res.statusText}`;
        }
        throw new Error(errorDetail);
      }
      
      setSuccess(true);
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push(redirectUrl);
      }, 1500);
      
    } catch (err) {
      console.error('Save error:', err);
      setError(`Error saving ${modelName}: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Generate form fields based on field definitions
  const renderFormField = (field) => {
    const value = formData[field.name] !== undefined ? formData[field.name] : '';
    
    switch (field.type) {
      case 'select':
        return (
          <FormControl fullWidth key={field.name} margin="normal">
            <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
            <Select
              labelId={`${field.name}-label`}
              name={field.name}
              value={value !== null ? value : ''}
              onChange={handleInputChange}
              label={field.label}
              disabled={field.readOnly || saving}
              required={field.required}
            >
              {!field.required && (
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
              )}
              
              {fieldOptions[field.name]?.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option[field.displayField || 'name']}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
        
      case 'textarea':
        return (
          <TextField
            key={field.name}
            name={field.name}
            label={field.label}
            value={value !== null ? value : ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            disabled={field.readOnly || saving}
            required={field.required}
          />
        );
        
      case 'date':
        return (
          <TextField
            key={field.name}
            name={field.name}
            label={field.label}
            type="date"
            value={value !== null ? value : ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            disabled={field.readOnly || saving}
            required={field.required}
          />
        );
        
      case 'datetime':
        return (
          <TextField
            key={field.name}
            name={field.name}
            label={field.label}
            type="datetime-local"
            value={value !== null ? value : ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            disabled={field.readOnly || saving}
            required={field.required}
          />
        );
        
      case 'number':
        return (
          <TextField
            key={field.name}
            name={field.name}
            label={field.label}
            type="number"
            value={value !== null ? value : ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={field.readOnly || saving}
            required={field.required}
          />
        );
      
      case 'password':
        return (
          <TextField
            key={field.name}
            name={field.name}
            label={field.label}
            type="password"
            value={value !== null ? value : ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={field.readOnly || saving}
            required={field.required}
          />
        );
        
      default: // Text input is default
        return (
          <TextField
            key={field.name}
            name={field.name}
            label={field.label}
            value={value !== null ? value : ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={field.readOnly || saving}
            required={field.required}
          />
        );
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {title || `${id ? 'Edit' : 'Add New'} ${modelName}`}
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {modelName} saved successfully!
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {fields.map(field => (
            <Grid item xs={12} md={field.fullWidth ? 12 : 6} key={field.name}>
              {renderFormField(field)}
            </Grid>
          ))}
        </Grid>
        
        <Stack direction="row" spacing={2} mt={4} justifyContent="flex-end">
          <Button 
            variant="outlined" 
            onClick={() => router.push(redirectUrl)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={saving}
          >
            {saving ? <CircularProgress size={24} /> : (id ? 'Save Changes' : `Create ${modelName}`)}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
*/