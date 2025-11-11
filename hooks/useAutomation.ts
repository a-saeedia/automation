import { useState, useCallback, useEffect } from 'react';
import type { ProcessedNews, LogEntry } from '../types';

export const useAutomation = (token: string, channelId: string) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isToggleLoading, setToggleLoading] = useState(false);
  const [isManualLoading, setManualLoading] = useState(false);

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [latestNews, setLatestNews] = useState<ProcessedNews | null>(null);

  const addFrontendLog = useCallback((message: string, type: LogEntry['type']) => {
    // This is for client-side errors or actions, not for replacing server logs.
    setLogs(prevLogs => {
      const newLog: LogEntry = {
        id: Math.random(), // Server logs have real IDs.
        timestamp: new Date().toLocaleTimeString(),
        message,
        type,
      };
      return [newLog, ...prevLogs].slice(0, 100);
    });
  }, []);

  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/automation/status');
      if (response.ok) {
        const data = await response.json();
        setIsRunning(data.isRunning);
        setLogs(data.logs);
        setLatestNews(data.latestNews);
      } else {
        console.error('Failed to fetch status:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
      // Don't log here, it would be noisy. Could add a "disconnected" status.
    }
  }, []);

  useEffect(() => {
    fetchStatus(); // Fetch status on initial load
    const intervalId = setInterval(fetchStatus, 5000); // Poll every 5 seconds
    return () => clearInterval(intervalId);
  }, [fetchStatus]);


  const startAutomation = async () => {
    if (isToggleLoading || isManualLoading) return;
    setToggleLoading(true);
    try {
        const response = await fetch('/api/automation/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, channelId }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to start automation.');
        await fetchStatus(); // Update state immediately
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        addFrontendLog(`Error starting automation: ${message}`, 'error');
    } finally {
        setToggleLoading(false);
    }
  };

  const stopAutomation = async () => {
    if (isToggleLoading || isManualLoading) return;
    setToggleLoading(true);
    try {
        const response = await fetch('/api/automation/stop', { method: 'POST' });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to stop automation.');
        await fetchStatus(); // Update state immediately
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        addFrontendLog(`Error stopping automation: ${message}`, 'error');
    } finally {
        setToggleLoading(false);
    }
  };
  
  const runManual = async () => {
    if (isToggleLoading || isManualLoading) return;
    setManualLoading(true);
    try {
        const response = await fetch('/api/automation/run-manual', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, channelId }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Manual run failed.');
        
        // Manual run API returns latest news, update it directly for better UX
        if (result.processedNews) {
            setLatestNews(result.processedNews);
        }
        await fetchStatus(); // Refresh logs and status
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        addFrontendLog(`Manual run error: ${message}`, 'error');
    } finally {
        setManualLoading(false);
    }
  };

  return { isRunning, isToggleLoading, isManualLoading, logs, latestNews, startAutomation, stopAutomation, runManual };
};
