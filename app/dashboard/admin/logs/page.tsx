'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Paper, Toolbar, AppBar, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
interface Log {
  user_id?: string;
  event: string;
  timestamp: string;
  status: number;
  type: 'auth' | 'general';
}

const LogsPage = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLogs = async () => {
      const token = Cookies.get('Token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('/api/admin/logs', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        console.error(response);
        console.log(response.ok);
        console.log(response.status);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setLogs(data || []);
        } else {
          console.error('Failed to fetch logs:', response);
        }
      } catch (error) {
        console.log(error);
        console.error('Error fetching logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading state
  }

  return (
    <Box sx={{ height: '100vh', bgcolor: '#f5f5f5', padding: 2 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Logs
          </Typography>
          <Button color="inherit" startIcon={<RefreshIcon />} onClick={handleRefresh}>
            Refresh
          </Button>
        </Toolbar>
      </AppBar>

      <Paper elevation={3} sx={{ marginTop: 4, padding: 2 }}>
        <Typography variant="h5" gutterBottom>
          System Logs
        </Typography>

        {logs && logs.length > 0 ? (
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={logs}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
              sx={{ bgcolor: 'white' }}
            />
          </div>
        ) : (
          <Typography variant="body1">No logs available.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default LogsPage;
