
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

// Serve the static frontend
const clientPath = path.join(__dirname, '..', 'dist');
app.use(express.static(clientPath));

// API endpoint for the frontend to call
app.post('/api/run-process', async (req, res) => {
    const { token, channelId } = req.body;

    if (!token || !channelId) {
        return res.status(400).json({ success: false, message: 'Telegram Token or Channel ID is missing.' });
    }
    
    // We use the token from the request, but the Gemini key from the server's environment
    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is not set on the server.");
        return res.status(500).json({ success: false, message: 'Server configuration error: Missing Gemini API Key.' });
    }

    try {
        const article = getLatestNews();
        const processedNews = await processNewsArticle(article, process.env.GEMINI_API_KEY);
        await sendTelegramMessage(token, channelId, processedNews);
        
        // Send back the processed news for the preview
        res.json({ success: true, message: 'Successfully published to Telegram.', processedNews });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Error during process run:', errorMessage);
        res.status(500).json({ success: false, message: `An error occurred: ${errorMessage}` });
    }
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
