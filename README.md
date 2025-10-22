# NewsHub - Full Stack News Application

A modern full-stack news application built with Go backend and React frontend, featuring infinite scroll pagination and real-time news fetching from NewsData.io API.

## 🏗️ Architecture

This is a monorepo containing:

- **`news-app/`** - Go backend service with Gin framework
- **`news-frontend/`** - React TypeScript frontend with Tailwind CSS
- **`web-service-gin/`** - Additional Go web service

## ✨ Features

### Backend (Go + Gin)
- 🔌 RESTful API with NewsData.io integration
- 📄 Paginated news fetching (10 articles per request)
- 🌐 CORS enabled for frontend integration
- 🔍 Advanced filtering (language, country, category)
- 📊 Structured logging with Logrus
- ⚡ High-performance HTTP server

### Frontend (React + TypeScript)
- 🎨 Modern, responsive UI with Tailwind CSS
- ♾️ **Infinite scroll pagination** - seamlessly load more articles
- 🔍 Advanced search with multiple filters
- 📱 Mobile-first responsive design
- 🌐 Offline detection and handling
- ⚡ Optimized performance with React hooks
- 🎯 TypeScript for type safety

## 🚀 Quick Start

### Prerequisites
- Go 1.24+ 
- Node.js 16+
- NewsData.io API key

### Environment Setup

1. **Get NewsData.io API Key**
   - Sign up at [NewsData.io](https://newsdata.io/)
   - Get your free API key

2. **Set Environment Variables**
   ```bash
   export NEWS_API_KEY=your_newsdata_io_api_key
   ```

3. **Start Development Servers**
   ```bash
   # Option 1: Use the convenient startup script
   ./start-dev.sh
   
   # Option 2: Start manually
   # Terminal 1 - Backend
   cd news-app && go run main.go
   
   # Terminal 2 - Frontend  
   cd news-frontend && npm install && npm start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080 (local) or https://news-monk-p2dt.onrender.com (hosted)

## 📡 API Endpoints

### Backend API (`localhost:8080` or `https://news-monk-p2dt.onrender.com`)

#### `GET /health`
Health check endpoint
```json
{
  "status": "ok"
}
```

#### `GET /news`
Fetch news articles with pagination and filtering

**Query Parameters:**
- `query` (required) - Search term
- `language` (optional) - Language code (default: "en")
- `country` (optional) - Country code (e.g., "us", "gb")
- `category` (optional) - Category (e.g., "technology", "sports")
- `page` (optional) - Pagination token for next page

**Example:**
```bash
# Local development
curl "http://localhost:8080/news?query=technology&language=en&country=us"

# Hosted on Render
curl "https://news-monk-p2dt.onrender.com/news?query=technology&language=en&country=us"
```

**Response:**
```json
{
  "status": "success",
  "totalResults": 1000,
  "nextPage": "next_page_token",
  "results": [
    {
      "article_id": "unique_id",
      "title": "Article Title",
      "description": "Article description...",
      "link": "https://example.com/article",
      "image_url": "https://example.com/image.jpg",
      "source_name": "Source Name",
      "pubDate": "2024-01-01T12:00:00Z",
      "category": ["technology"],
      "country": ["us"],
      "creator": ["Author Name"]
    }
  ]
}
```

## 🎯 Usage Guide

### Searching for News
1. Enter a search term (e.g., "artificial intelligence", "climate change")
2. Optionally apply filters:
   - **Language**: Choose from 10+ languages
   - **Country**: Filter by specific countries
   - **Category**: Select from business, tech, sports, etc.
3. Click "Search" to fetch articles
4. **Scroll down** to automatically load more articles (infinite scroll)

### Infinite Scroll Behavior
- Articles load automatically as you scroll near the bottom
- Loading indicator shows when fetching more content
- Seamlessly appends new articles to the existing list
- Handles end-of-results gracefully

## 🛠️ Development

### Backend Development
```bash
cd news-app
go mod tidy
go run main.go
```

### Frontend Development
```bash
cd news-frontend
npm install
npm start        # Development server
npm run build    # Production build
npm test         # Run tests
```

### Project Structure
```
GoLang/
├── news-app/                 # Go backend
│   ├── main.go              # Main server file
│   ├── go.mod               # Go dependencies
│   └── go.sum               # Go checksums
├── news-frontend/           # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/          # Custom hooks (including infinite scroll)
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript types
│   ├── package.json        # Node dependencies
│   └── tailwind.config.js  # Tailwind configuration
├── start-dev.sh            # Development startup script
└── README.md               # This file
```

## 🔧 Configuration

### Backend Configuration
- **Port**: Set `PORT` environment variable (default: 8080)
- **API Key**: Set `NEWS_API_KEY` environment variable
- **CORS**: Configured to allow all origins for development

### Frontend Configuration
- **API URL**: Set `REACT_APP_API_URL` (default: http://localhost:8080)
- **Build**: Optimized production builds with code splitting

## 🚀 Deployment

### Backend Deployment (Render)
The backend is already deployed on Render at: `https://news-monk-p2dt.onrender.com`

For your own deployment:
```bash
cd news-app
go build -o news-server main.go
./news-server
```

### Frontend Deployment (Render)
1. **Build the application:**
   ```bash
   cd news-frontend
   npm run build
   ```

2. **Deploy to Render:**
   - Connect your GitHub repository to Render
   - Set build command: `cd news-frontend && npm install && npm run build`
   - Set publish directory: `news-frontend/build`
   - Add environment variable: `REACT_APP_API_URL=https://news-monk-p2dt.onrender.com`

3. **Alternative static hosting:**
   ```bash
   # Serve the build/ directory with any static server
   npm install -g serve
   serve -s news-frontend/build
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [NewsData.io](https://newsdata.io/) for providing the news API
- [Gin](https://gin-gonic.com/) for the Go web framework
- [React](https://reactjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
