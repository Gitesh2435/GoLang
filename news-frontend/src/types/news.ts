export interface NewsItem {
  article_id: string;
  title: string;
  link: string;
  creator: string[] | null;
  description: string | null;
  pubDate: string;
  image_url: string | null;
  video_url: string | null;
  source_id: string;
  source_name: string;
  source_url: string;
  source_icon: string | null;
  language: string;
  country: string[] | null;
  category: string[] | null;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  nextPage: string | null;
  results: NewsItem[];
}

export interface NewsFilters {
  query: string;
  language?: string;
  country?: string;
  category?: string;
  page?: string;
}
