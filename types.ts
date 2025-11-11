
export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
}

export interface ProcessedNews {
  farsiTitle: string;
  farsiBody: string;
  formattedSource: string;
}

export interface LogEntry {
  id: number;
  timestamp: string;
  message: string;
  type: 'info' | 'error' | 'success';
}
