'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

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
    <div>
      <h1>Logs</h1>
      {logs && logs.length > 0 ? (
        <ul>
          {logs.map((log, index) => (
            <li key={index}>{JSON.stringify(log)}</li>
          ))}
        </ul>
      ) : (
        <p>No logs available.</p>
      )}
    </div>
  );
};

export default LogsPage;
