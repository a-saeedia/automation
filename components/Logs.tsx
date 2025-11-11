
import React from 'react';
import type { LogEntry } from '../types';

interface LogsProps {
  logs: LogEntry[];
}

const getLogColor = (type: LogEntry['type']) => {
  switch (type) {
    case 'success':
      return 'text-green-400';
    case 'error':
      return 'text-red-400';
    case 'info':
    default:
      return 'text-gray-400';
  }
};

const Logs: React.FC<LogsProps> = ({ logs }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6 h-full">
      <h2 className="text-xl font-semibold text-white mb-4">Activity Logs</h2>
      <div className="bg-black/50 rounded-md p-4 h-[400px] overflow-y-auto font-mono text-sm">
        {logs.length === 0 ? (
           <p className="text-gray-500">No activity yet...</p>
        ) : (
            logs.map((log) => (
                <div key={log.id} className={`flex items-start ${getLogColor(log.type)}`}>
                    <span className="mr-3 shrink-0">[{log.timestamp}]</span>
                    <p className="break-words">{log.message}</p>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Logs;
