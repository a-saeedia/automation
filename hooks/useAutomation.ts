
import { useState, useRef, useCallback } from 'react';
import type { NewsArticle, ProcessedNews, LogEntry } from '../types';
import { getLatestNews } from '../services/newsService';
import { processNewsArticle } from '../services/geminiService';
import { sendTelegramMessage } from '../services/telegramService';

export const useAutomation = (token: string, channelId: string) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [latestNews, setLatestNews] = useState<ProcessedNews | null>(null);
  const intervalRef = useRef<number | null>(null);
  const logCounterRef = useRef(0);

  const addLog = useCallback((message: string, type: LogEntry['type']) => {
    setLogs(prevLogs => {
      const newLog: LogEntry = {
        id: logCounterRef.current++,
        timestamp: new Date().toLocaleTimeString(),
        message,
        type,
      };
      // Keep only the last 100 logs
      return [newLog, ...prevLogs].slice(0, 100);
    });
  }, []);

  const runProcess = useCallback(async () => {
    if (!token || !channelId) {
      addLog('Telegram Token or Channel ID is missing.', 'error');
      setIsRunning(false);
      if(intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    setIsLoading(true);
    try {
      addLog('Fetching latest crypto news...', 'info');
      const article: NewsArticle = getLatestNews();
      addLog(`Found article: "${article.title}"`, 'info');

      addLog('Processing with Gemini AI...', 'info');
      const processedNews = await processNewsArticle(article);
      setLatestNews(processedNews);
      addLog('AI processing complete.', 'success');

      addLog('Sending to Telegram channel...', 'info');
      await sendTelegramMessage(token, channelId, processedNews);
      addLog('Successfully published to Telegram.', 'success');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      addLog(`An error occurred: ${errorMessage}`, 'error');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, channelId, addLog]);


  const startAutomation = () => {
    addLog('Starting automation...', 'info');
    setIsRunning(true);
    runProcess(); // Run immediately on start
    intervalRef.current = window.setInterval(runProcess, 30 * 60 * 1000); // 30 minutes
  };

  const stopAutomation = () => {
    addLog('Stopping automation...', 'info');
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  const runManual = () => {
    addLog('Manual run triggered...', 'info');
    runProcess();
  };

  return { isRunning, isLoading, logs, latestNews, startAutomation, stopAutomation, runManual };
};
