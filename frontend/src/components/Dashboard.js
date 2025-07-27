// src/components/Dashboard.js
import React, { useState} from 'react';
import axios from 'axios';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reportPath, setReportPath] = useState('');
  const [error, setError] = useState('');

  // --- THIS IS THE NEW LOGIC FOR GOOGLE OAUTH ---
  // This useEffect hook runs only once when the component first loads.


  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError('');
    setReportPath('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setReportPath('');

    const formData = new FormData();
    formData.append('pitchDeck', selectedFile);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/analysis/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      setReportPath(response.data.filePath);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during upload.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ my: 4, textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Pitch Deck Analyzer
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Upload your PowerPoint (.ppt, .pptx) file for analysis.
      </Typography>
      
      <Button variant="contained" component="label">
        Choose File
        <input type="file" hidden onChange={handleFileChange} accept=".ppt,.pptx" />
      </Button>
      
      {selectedFile && <Typography sx={{ display: 'inline', ml: 2 }}>{selectedFile.name}</Typography>}
      
      <Box sx={{ my: 3 }}>
        <Button 
          variant="contained" 
          color="success"
          disabled={isLoading || !selectedFile}
          onClick={handleUpload}
          sx={{ minWidth: 120, minHeight: 40 }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Analyze'}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      
      {reportPath && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Analysis complete! Your report is ready.
          <br />
          <Button 
            variant="contained" 
            color="primary" 
            href={reportPath} 
            target="_blank"
            rel="noopener noreferrer"
            sx={{ mt: 2 }}
          >
            Download Report
          </Button>
        </Alert>
      )}
    </Box>
  );
};

export default Dashboard;