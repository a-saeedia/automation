
import React from 'react';
import type { ProcessedNews } from '../types';

interface NewsPreviewProps {
  news: ProcessedNews | null;
}

const NewsPreview: React.FC<NewsPreviewProps> = ({ news }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Latest Processed News Preview</h2>
      {news ? (
        <div className="space-y-4 text-right" dir="rtl">
          <h3 className="text-lg font-bold text-cyan-400">{news.farsiTitle}</h3>
          <p className="text-gray-300 whitespace-pre-wrap">{news.farsiBody}</p>
          <div 
            className="text-sm text-gray-400" 
            dangerouslySetInnerHTML={{ __html: news.formattedSource }}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-40 bg-gray-700/50 rounded-md">
          <p className="text-gray-500">No news processed yet. Run the automation to see a preview.</p>
        </div>
      )}
    </div>
  );
};

export default NewsPreview;
