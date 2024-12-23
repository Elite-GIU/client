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
          if (response.ok) {
            const data = await response.json();
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
      <div className="font-sans p-5 bg-gray-100 min-h-screen">
        <main className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="mb-5 text-black">System Logs</h2>

          {logs && logs.length > 0 ? (
            <table className="w-full border-collapse text-black">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-2 border border-gray-300">Event</th>
                  <th className="p-2 border border-gray-300">Timestamp</th>
                  <th className="p-2 border border-gray-300">Status</th>
                  <th className="p-2 border border-gray-300">Type</th>
                  <th className="p-2 border border-gray-300">User Id</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr key={index} className={log.status === 200 ? 'bg-gray-200' : 'bg-red-100'}>
                    <td className="p-2 border border-gray-300">{log.event}</td>
                    <td className="p-2 border border-gray-300">{log.timestamp}</td>
                    <td className="p-2 border border-gray-300">{log.status}</td>
                    <td className="p-2 border border-gray-300">{log.type}</td>
                    <td className="p-2 border border-gray-300">{log.user_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600">No logs available.</p>
          )}
        </main>
      </div>
    );
  };

  export default LogsPage;
