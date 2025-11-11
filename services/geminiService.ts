
import { GoogleGenAI, Type } from "@google/genai";
import type { NewsArticle, ProcessedNews } from '../types';

const processNewsArticle = async (article: NewsArticle): Promise<ProcessedNews> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are an expert crypto news analyst and editor for a popular Farsi-language Telegram channel. Your goal is to make complex news accessible, engaging, and viral.

    Here is a raw news article:
    Title: ${article.title}
    Content: ${article.content}
    Source Name: ${article.sourceName}
    URL: ${article.sourceUrl}

    Your task is to process this article and return a JSON object.

    Instructions:
    1.  **Humanize:** First, understand the core message of the content. Rewrite it in a clear, conversational, and engaging style. Avoid jargon where possible or explain it simply.
    2.  **Translate:** Translate the humanized content into fluent, modern Farsi. The language should be smooth and natural, not a literal, robotic translation.
    3.  **Create Viral Title:** Based on the Farsi content, create a short, attention-grabbing title. Use techniques that encourage clicks, like asking a question or highlighting a surprising fact.
    4.  **Format Source:** Create the source string in Farsi. It must be an HTML anchor tag like this: 'منبع: <a href="${article.sourceUrl}">${article.sourceName}</a>'.
    5.  **Output JSON:** Ensure your final output is ONLY the valid JSON object described in the schema. Do not include any other text, explanations, or markdown formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            farsiTitle: {
              type: Type.STRING,
              description: "A catchy, viral title in Farsi.",
            },
            farsiBody: {
              type: Type.STRING,
              description: "The news content, rewritten to sound human and natural, and translated smoothly into Farsi.",
            },
            formattedSource: {
              type: Type.STRING,
              description: `A formatted source string in Farsi as an HTML anchor tag. e.g. 'منبع: <a href="${article.sourceUrl}">${article.sourceName}</a>'`,
            },
          },
          required: ["farsiTitle", "farsiBody", "formattedSource"],
        },
      },
    });

    const jsonText = response.text.trim();
    const processedNews: ProcessedNews = JSON.parse(jsonText);
    return processedNews;

  } catch (error) {
    console.error("Error processing news with Gemini:", error);
    throw new Error("Failed to process news article with Gemini AI.");
  }
};

export { processNewsArticle };
