
import React from 'react';

interface StatusIndicatorProps {
  isRunning: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ isRunning }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className={`h-3 w-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
      <span className="text-sm font-medium text-gray-300">
        {isRunning ? 'Automation Active' : 'Automation Idle'}
      </span>
    </div>
  );
};

export default StatusIndicator;
