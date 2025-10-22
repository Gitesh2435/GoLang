# NewsHub Frontend

A modern React.js frontend for the NewsHub application that provides a beautiful interface to search and browse news articles with infinite scroll pagination.

## Features

- 🔍 **Advanced Search**: Search news with filters for language, country, and category
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- ♾️ **Infinite Scroll**: Seamlessly load more articles as you scroll
- 🎨 **Modern UI**: Clean, intuitive interface with Tailwind CSS
- 🌐 **Offline Detection**: Shows connection status and handles offline scenarios
- ⚡ **Fast Loading**: Optimized performance with React hooks and TypeScript

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- The backend news-app service running on port 8080

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
# Copy env.example to .env.local and update if needed:
cp env.example .env.local

# The default API URL is already set to the hosted backend:
# REACT_APP_API_URL=https://news-monk-p2dt.onrender.com
```

3. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
npm run build
```

## API Integration

The frontend connects to the Go backend service at `/news` endpoint with the following parameters:

- `query` (required): Search term
- `language`: Language filter (default: 'en')
- `country`: Country filter
- `category`: Category filter  
- `page`: Pagination token for infinite scroll

## Project Structure

```
src/
├── components/          # React components
│   ├── NewsCard.tsx    # Individual news article card
│   ├── SearchForm.tsx  # Search form with filters
│   └── LoadingSpinner.tsx # Loading indicator
├── hooks/              # Custom React hooks
│   ├── useNews.ts      # News data management
│   └── useInfiniteScroll.ts # Infinite scroll logic
├── services/           # API services
│   └── newsApi.ts      # Backend API integration
├── types/              # TypeScript type definitions
│   └── news.ts         # News data types
└── App.tsx             # Main application component
```

## Technologies Used

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Axios** for HTTP requests
- **Lucide React** for icons
- **Custom hooks** for state management and infinite scroll

## Usage

1. Enter a search term in the search box
2. Optionally use filters to narrow results by language, country, or category
3. Click "Search" to fetch news articles
4. Scroll down to automatically load more articles (infinite scroll)
5. Click on any article card to open the full article in a new tab

## Environment Variables

- `REACT_APP_API_URL`: Backend API URL (default: https://news-monk-p2dt.onrender.com)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request