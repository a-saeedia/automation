import type { ProcessedNews } from '../types';

export const sendTelegramMessage = async (botToken: string, chatId: string, news: ProcessedNews): Promise<void> => {
  const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  // Combine the news parts into a single message.
  // Using <b> for the title for HTML parse mode.
  const messageText = `<b>${news.farsiTitle}</b>\n\n${news.farsiBody}\n\n${news.formattedSource}`;
  
  const payload = {
    chat_id: chatId,
    text: messageText,
    parse_mode: 'HTML', // Using HTML to support the anchor tag in the source
    disable_web_page_preview: true,
  };

  try {
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!result.ok) {
      throw new Error(`Telegram API Error: ${result.description || 'Unknown error'}`);
    }

  } catch (error) {
    console.error('Failed to send message to Telegram:', error);
    if (error instanceof Error) {
        throw new Error(`Failed to publish to Telegram: ${error.message}`);
    }
    throw new Error('An unknown error occurred while publishing to Telegram.');
  }
};
