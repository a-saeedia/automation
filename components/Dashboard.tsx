
import React, { useState } from 'react';
import Settings from './Settings';
import NewsPreview from './NewsPreview';
import Logs from './Logs';
import StatusIndicator from './StatusIndicator';
import { useAutomation } from '../hooks/useAutomation';

const Dashboard: React.FC = () => {
  const [telegramToken, setTelegramToken] = useState('');
  const [telegramChannelId, setTelegramChannelId] = useState('');

  const {
    isRunning,
    isLoading,
    logs,
    latestNews,
    startAutomation,
    stopAutomation,
    runManual,
  } = useAutomation(telegramToken, telegramChannelId);

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-gray-800 rounded-lg shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Automation Controls</h2>
            <StatusIndicator isRunning={isRunning} />
          </div>
          <p className="text-gray-400 mb-6">
            Configure your Telegram settings and control the automated news publisher.
          </p>
          <Settings
            token={telegramToken}
            setToken={setTelegramToken}
            channelId={telegramChannelId}
            setChannelId={setTelegramChannelId}
            disabled={isRunning || isLoading}
          />
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={isRunning ? stopAutomation : startAutomation}
              disabled={isLoading || !telegramToken || !telegramChannelId}
              className={`w-full sm:w-auto flex-1 px-6 py-3 text-sm font-bold rounded-md transition-all duration-300 flex items-center justify-center gap-2 ${
                isRunning
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              } disabled:bg-gray-600 disabled:cursor-not-allowed`}
            >
              {isRunning ? 'Stop Automation' : 'Start Automation (30 min)'}
            </button>
            <button
              onClick={runManual}
              disabled={isRunning || isLoading || !telegramToken || !telegramChannelId}
              className="w-full sm:w-auto flex-1 px-6 py-3 text-sm font-bold bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Run Now'}
            </button>
          </div>
        </div>
        <NewsPreview news={latestNews} />
      </div>
      <div className="lg:col-span-1">
        <Logs logs={logs} />
      </div>
    </div>
  );
};

export default Dashboard;
