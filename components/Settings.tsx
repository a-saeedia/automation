import React from 'react';

interface SettingsProps {
  token: string;
  setToken: (token: string) => void;
  channelId: string;
  setChannelId: (id: string) => void;
  disabled: boolean;
}

const Settings: React.FC<SettingsProps> = ({ token, setToken, channelId, setChannelId, disabled }) => {
  const [showToken, setShowToken] = React.useState(false);

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="telegram-token" className="block text-sm font-medium text-gray-300 mb-1">
          Telegram Bot Token
        </label>
        <div className="relative">
          <input
            type={showToken ? 'text' : 'password'}
            id="telegram-token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            disabled={disabled}
            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-600"
            placeholder="Enter your bot token"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-200"
            onClick={() => setShowToken(!showToken)}
            aria-label={showToken ? "Hide token" : "Show token"}
          >
            {showToken ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-1.563 3.029m0 0l-3.59-3.59m0 0l-3.59 3.59" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div>
        <label htmlFor="telegram-channel" className="block text-sm font-medium text-gray-300 mb-1">
          Telegram Channel ID
        </label>
        <input
          type="text"
          id="telegram-channel"
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
          disabled={disabled}
          className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-600"
          placeholder="@your_channel_name or -100..."
        />
        <p className="text-xs text-gray-400 mt-2">
            For public channels, use <code className="bg-gray-900 px-1 rounded">@channelusername</code>. For private channels, you must use the numerical chat ID (e.g., <code className="bg-gray-900 px-1 rounded">-100123...</code>).
            <br />
            <strong>Important:</strong> The bot must be added to the channel as an administrator.
        </p>
      </div>
    </div>
  );
};

export default Settings;