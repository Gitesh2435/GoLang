import { useState, useCallback } from 'react';
import { NewsItem, NewsFilters } from '../types/news';
import { newsApi } from '../services/newsApi';

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchNews = useCallback(async (filters: NewsFilters, append = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await newsApi.fetchNews(filters);
      
      if (append) {
        setNews(prevNews => [...prevNews, ...response.results]);
      } else {
        setNews(response.results);
        setHasSearched(true);
      }
      
      setNextPage(response.nextPage || null);
      setTotalResults(response.totalResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async (filters: NewsFilters) => {
    if (nextPage && !loading) {
      await fetchNews({ ...filters, page: nextPage }, true);
    }
  }, [nextPage, loading, fetchNews]);

  const clearNews = useCallback(() => {
    setNews([]);
    setNextPage(null);
    setTotalResults(0);
    setHasSearched(false);
    setError(null);
  }, []);

  return {
    news,
    loading,
    error,
    nextPage,
    totalResults,
    hasSearched,
    hasNextPage: !!nextPage,
    fetchNews,
    loadMore,
    clearNews
  };
};
