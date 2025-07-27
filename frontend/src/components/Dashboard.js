// src/components/Dashboard.js
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone'; // Import the hook
import { Box, Button, Typography, Alert, CircularProgress, LinearProgress } from '@mui/material'; // Import LinearProgress
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reportPath, setReportPath] = useState('');
  const [error, setError] = useState('');
  // New state for detailed loading status
  const [loadingStatusText, setLoadingStatusText] = useState('');

  // This callback function will be called when files are dropped or selected
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      // Basic validation from our project spec
      if (file.size > 50 * 1024 * 1024) {
        setError('File is too large. Maximum size is 50MB.');
        return;
      }
      setSelectedFile(file);
      setError('');
      setReportPath('');
    }
  }, []);

  // Configure the dropzone hook
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    // ... (This function remains the same, but we will call it from a new button)
    if (!selectedFile) {
        setError('Please select a file first.');
        return;
      }
  
      setIsLoading(true);
      setError('');
      setReportPath('');
  
      // --- Enhanced Loading Text ---
      setLoadingStatusText('Uploading presentation...');
      const formData = new FormData();
      formData.append('pitchDeck', selectedFile);
  
      try {
        const token = localStorage.getItem('token');
        setLoadingStatusText('Extracting text & analyzing content with AI...');
        const response = await axios.post('/api/analysis/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
        });
        setLoadingStatusText('Generating your PDF report...');
        setReportPath(response.data.filePath);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred during upload.');
      } finally {
        setIsLoading(false);
        setLoadingStatusText('');
      }
  };

  return (
    <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <UploadFileIcon sx={{ fontSize: 40, color: 'primary.main' }}/>
        <Typography variant="h4" component="h1" gutterBottom>
            Upload Pitch Deck for Analysis
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: '550px', textAlign: 'center' }}>
            Upload your presentation to get an AI-powered investment analysis report, including risk assessment, market potential, and investment recommendations.
        </Typography>

        {/* The Dropzone */}
        <Box
            {...getRootProps()}
            sx={{
                border: `2px dashed ${isDragActive ? '#1976d2' : '#ccc'}`, // Highlight on drag
                borderRadius: 2,
                p: 6,
                textAlign: 'center',
                cursor: 'pointer',
                width: '100%',
                maxWidth: '600px',
                mb: 2,
                backgroundColor: isDragActive ? '#e3f2fd' : 'transparent'
            }}
        >
            <input {...getInputProps()} />
            <UploadFileIcon sx={{ fontSize: 50, color: 'text.secondary', mb: 2 }} />
            {selectedFile ? (
                <Box>
                    <CheckCircleIcon color="success" sx={{ verticalAlign: 'middle', mr: 1 }}/>
                    <Typography variant="h6">{selectedFile.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Ready to analyze!
                    </Typography>
                </Box>
            ) : (
                isDragActive ?
                    <Typography variant="h6">Drop the file here ...</Typography> :
                    <Typography variant="h6">Drag & Drop your file here <br/> or <span style={{color: '#1976d2', textDecoration: 'underline'}}>browse files</span></Typography>
            )}
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                Supports PowerPoint files (.ppt, .pptx) up to 50MB
            </Typography>
        </Box>

        {/* Analyze Button */}
        <Button 
          variant="contained" 
          disabled={isLoading || !selectedFile}
          onClick={handleUpload}
          sx={{ minWidth: 200, py: 1.5, textTransform: 'none', fontSize: '1rem' }}
        >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Analyze Pitch Deck'}
        </Button>
        
        {/* Loading and Results Section */}
        {isLoading && (
            <Box sx={{ width: '100%', maxWidth: '600px', mt: 4 }}>
                <Typography sx={{ mb: 1 }}>{loadingStatusText}</Typography>
                <LinearProgress />
            </Box>
        )}
        
        {error && <Alert severity="error" sx={{ mt: 2, width: '100%', maxWidth: '600px' }}>{error}</Alert>}
        
        {reportPath && !isLoading && (
            <Alert severity="success" sx={{ mt: 2, width: '100%', maxWidth: '600px' }}>
                Analysis complete! Your report has been sent to your email.
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
