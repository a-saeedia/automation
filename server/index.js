require('dotenv').config();
const express = require('express');
const path =require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { getLatestNews } = require('./newsService');
const { processNewsArticle } = require('./geminiService');
const { sendTelegramMessage } = require('./telegramService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// --- Automation State ---
const state = {
  isRunning: false,
  intervalId: null,
  logs: [],
  latestNews: null,
  telegramToken: '',
  telegramChannelId: '',
  logCounter: 0,
};

// --- Helper Functions ---
const addLog = (message, type) => {
  const newLog = {
    id: state.logCounter++,
    timestamp: new Date().toLocaleTimeString(),
    message,
    type,
  };
  state.logs = [newLog, ...state.logs].slice(0, 100);
  console.log(`[${type}] ${message}`);
};

const stopAutomationProcess = () => {
    if (state.intervalId) {
        clearInterval(state.intervalId);
        state.intervalId = null;
    }
    state.isRunning = false;
    addLog('Automation has been stopped.', 'info');
};

const runNewsCycle = async (token, channelId) => {
  addLog('Starting news processing cycle...', 'info');
  
  if (!process.env.GEMINI_API_KEY) {
    const errorMsg = 'Server configuration error: Missing Gemini API Key.';
    addLog(errorMsg, 'error');
    console.error(errorMsg);
    // Stop automation if critical config is missing
    if (state.isRunning) {
        stopAutomationProcess();
    }
    return;
  }
  
  try {
    const article = getLatestNews();
    addLog(`Fetched article: "${article.title}"`, 'info');

    const processedNews = await processNewsArticle(article, process.env.GEMINI_API_KEY);
    state.latestNews = processedNews;
    addLog('AI processing complete.', 'success');

    await sendTelegramMessage(token, channelId, processedNews);
    addLog(`Successfully published to Telegram channel: ${channelId}`, 'success');
    return processedNews;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    addLog(`An error occurred: ${errorMessage}`, 'error');
    console.error('Error during news cycle:', error);
    // Don't stop the whole automation for one failed run
  }
};


// Serve the static frontend
const clientPath = path.join(__dirname, '..', 'dist');
app.use(express.static(clientPath));

// --- API Endpoints ---
app.post('/api/automation/start', (req, res) => {
    const { token, channelId } = req.body;
    if (!token || !channelId) {
        return res.status(400).json({ success: false, message: 'Telegram Token or Channel ID is missing.' });
    }
    if (state.isRunning) {
        return res.status(400).json({ success: false, message: 'Automation is already running.' });
    }

    state.telegramToken = token;
    state.telegramChannelId = channelId;
    state.isRunning = true;

    addLog('Automation starting...', 'info');
    runNewsCycle(token, channelId); // Run immediately
    state.intervalId = setInterval(() => runNewsCycle(state.telegramToken, state.telegramChannelId), 30 * 60 * 1000);
    
    res.json({ success: true, message: 'Automation started.' });
});

app.post('/api/automation/stop', (req, res) => {
    if (!state.isRunning) {
        return res.status(400).json({ success: false, message: 'Automation is not running.' });
    }
    stopAutomationProcess();
    res.json({ success: true, message: 'Automation stopped.' });
});

app.post('/api/automation/run-manual', async (req, res) => {
    const { token, channelId } = req.body;
    if (!token || !channelId) {
        return res.status(400).json({ success: false, message: 'Telegram Token or Channel ID is missing.' });
    }
    try {
        const processedNews = await runNewsCycle(token, channelId);
        res.json({ success: true, message: 'Manual run complete.', processedNews });
    } catch(error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ success: false, message: `Manual run failed: ${errorMessage}` });
    }
});

app.get('/api/automation/status', (req, res) => {
    const { isRunning, logs, latestNews } = state;
    res.json({ isRunning, logs, latestNews });
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  addLog(`Server started on port ${PORT}.`, 'info')
});