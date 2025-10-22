import React from 'react';
import { NewsItem } from '../types/news';
import { ExternalLink, Calendar, User, Globe } from 'lucide-react';
import { safeArray, safeFirst, hasItems } from '../utils/arrayUtils';

interface NewsCardProps {
  news: NewsItem;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const handleCardClick = () => {
    window.open(news.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group">
      <div onClick={handleCardClick}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={news.image_url || '/news-placeholder.svg'}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/news-placeholder.svg';
            }}
          />
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {news.source_icon && (
                <img
                  src={news.source_icon}
                  alt={news.source_name}
                  className="w-5 h-5 rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              )}
              <span className="text-sm font-medium text-primary-600">
                {news.source_name}
              </span>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-700 transition-colors">
            {news.title}
          </h2>

          {news.description && (
            <p className="text-gray-600 mb-4 line-clamp-3">
              {news.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {safeArray(news.category).map((cat, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>

          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{formatDate(news.pubDate)}</span>
            </div>
            
            {(hasItems(news.creator) || hasItems(news.country)) && (
              <div className="flex items-center justify-between gap-2">
                {hasItems(news.creator) && (
                  <div className="flex items-center space-x-1 min-w-0 flex-1">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate" title={safeFirst(news.creator)}>
                      {safeFirst(news.creator)}
                    </span>
                  </div>
                )}

                {hasItems(news.country) && (
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <Globe className="w-4 h-4" />
                    <span className="font-medium text-xs px-1.5 py-0.5 bg-gray-100 rounded">
                      {safeFirst(news.country)?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
