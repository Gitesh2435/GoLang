import axios from 'axios';
import { NewsResponse, NewsFilters } from '../types/news';

const API_BASE_URL = process.env.REACT_APP_API_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const newsApi = {
  async fetchNews(filters: NewsFilters): Promise<NewsResponse> {
    const params = new URLSearchParams();
    
    params.append('query', filters.query);
    
    if (filters.language) {
      params.append('language', filters.language);
    }
    
    if (filters.country) {
      params.append('country', filters.country);
    }
    
    if (filters.category) {
      params.append('category', filters.category);
    }
    
    if (filters.page) {
      params.append('page', filters.page);
    }

    const response = await api.get<NewsResponse>(`/news?${params.toString()}`);
    return response.data;
  },

  async checkHealth(): Promise<{ status: string }> {
    const response = await api.get<{ status: string }>('/health');
    return response.data;
  }
};
