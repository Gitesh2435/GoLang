import React, { useState, useCallback } from 'react';
import { Newspaper, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { SearchForm } from './components/SearchForm';
import { NewsCard } from './components/NewsCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useNews } from './hooks/useNews';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { NewsFilters } from './types/news';

function App() {
  const [currentFilters, setCurrentFilters] = useState<NewsFilters | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const {
    news,
    loading,
    error,
    totalResults,
    hasSearched,
    hasNextPage,
    fetchNews,
    loadMore,
    clearNews
  } = useNews();

  // Handle online/offline status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load default news on component mount
  React.useEffect(() => {
    const loadDefaultNews = async () => {
      const defaultFilters: NewsFilters = {
        query: 'latest',
        language: 'en'
      };
      setCurrentFilters(defaultFilters);
      await fetchNews(defaultFilters);
    };

    loadDefaultNews();
  }, [fetchNews]);

  const handleSearch = useCallback(async (filters: NewsFilters) => {
    setCurrentFilters(filters);
    clearNews();
    await fetchNews(filters);
  }, [fetchNews, clearNews]);

  const handleLoadMore = useCallback(async () => {
    if (currentFilters && hasNextPage) {
      await loadMore(currentFilters);
    }
  }, [currentFilters, hasNextPage, loadMore]);

  useInfiniteScroll({
    hasNextPage,
    isLoading: loading,
    onLoadMore: handleLoadMore,
    threshold: 200
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Newspaper className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">NewsHub</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <div className="flex items-center space-x-1 text-green-600">
                  <Wifi className="w-4 h-4" />
                  <span className="text-sm">Online</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-red-600">
                  <WifiOff className="w-4 h-4" />
                  <span className="text-sm">Offline</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <SearchForm onSearch={handleSearch} loading={loading} />

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">
                <span className="font-medium">Error:</span> {error}
              </p>
            </div>
          </div>
        )}

        {/* Offline Warning */}
        {!isOnline && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-2">
              <WifiOff className="w-5 h-5 text-yellow-500" />
              <p className="text-yellow-700">
                <span className="font-medium">You're offline.</span> Some features may not work properly.
              </p>
            </div>
          </div>
        )}

        {/* Results Header */}
        {hasSearched && !loading && (
          <div className="mb-6">
            <p className="text-gray-600">
              {totalResults > 0 
                ? `Found ${totalResults.toLocaleString()} articles`
                : 'No articles found'
              }
              {currentFilters && currentFilters.query !== 'latest' && (
                <span className="ml-2">
                  for "<span className="font-medium">{currentFilters.query}</span>"
                </span>
              )}
              {currentFilters && currentFilters.query === 'latest' && (
                <span className="ml-2 text-blue-600 font-medium">
                  - Latest News
                </span>
              )}
            </p>
          </div>
        )}

        {/* News Grid */}
        {news.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {news.map((article) => (
              <NewsCard key={article.article_id} news={article} />
            ))}
          </div>
        )}

        {/* Loading States */}
        {loading && news.length === 0 && (
          <LoadingSpinner text="Searching for news..." />
        )}

        {loading && news.length > 0 && (
          <div className="text-center py-8">
            <LoadingSpinner size="sm" text="Loading more articles..." />
          </div>
        )}

        {/* No More Results */}
        {hasSearched && news.length > 0 && !hasNextPage && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              You've reached the end of the results.
            </p>
          </div>
        )}

        {/* Empty State */}
        {hasSearched && news.length === 0 && !loading && !error && (
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Try adjusting your search terms or filters to find more relevant articles.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 NewsHub. Powered by NewsData.io API.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
