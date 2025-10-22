package main

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
	"io"
	"net/http"
	"net/url"
	"os"
	"time"
)

// ---------- Structs ----------

type newsItem struct {
	ArticleID   string   `json:"article_id"`
	Title       string   `json:"title"`
	Link        string   `json:"link"`
	Creator     []string `json:"creator"`
	Description string   `json:"description"`
	PubDate     string   `json:"pubDate"`
	ImageURL    string   `json:"image_url"`
	VideoURL    string   `json:"video_url"`
	SourceID    string   `json:"source_id"`
	SourceName  string   `json:"source_name"`
	SourceURL   string   `json:"source_url"`
	SourceIcon  string   `json:"source_icon"`
	Language    string   `json:"language"`
	Country     []string `json:"country"`
	Category    []string `json:"category"`
}

type newsDataIoResponse struct {
	Status       string     `json:"status"`
	TotalResults int        `json:"totalResults"`
	NextPage     string     `json:"nextPage"`
	Results      []newsItem `json:"results"`
}

type newsResponse struct {
	Status       string     `json:"status"`
	TotalResults int        `json:"totalResults"`
	NextPage     string     `json:"nextPage"`
	Results      []newsItem `json:"results"`
}

// ---------- Main ----------

func main() {
	// Load environment variables
	_ = godotenv.Load()

	// Logger setup
	logger := logrus.New()
	logger.SetFormatter(&logrus.JSONFormatter{
		TimestampFormat: time.RFC3339,
	})
	logger.SetOutput(os.Stdout)
	logger.SetLevel(logrus.InfoLevel)

	router := gin.Default()

	// Cors
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Next()
	})

	// Routes
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	router.GET("/news", func(c *gin.Context) {
		getNewsItemsUsingAPI(c, logger)
	})

	// Port configuration
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	logger.WithField("port", port).Info("🚀 Starting server")
	if err := router.Run("0.0.0.0:" + port); err != nil {
		logger.WithError(err).Fatal("Failed to start server")
	}
}

func getNewsItemsUsingAPI(c *gin.Context, logger *logrus.Logger) {
	query := c.Query("query")
	language := c.DefaultQuery("language", "en")
	nextPage := c.Query("page")
	country := c.Query("country")
	category := c.Query("category")

	if query == "" {
		logger.Warn("Missing 'query' parameter")
		c.JSON(http.StatusBadRequest, gin.H{"error": "query parameter is required"})
		return
	}

	apiKey := os.Getenv("NEWS_API_KEY")
	if apiKey == "" {
		logger.Error("NEWS_API_KEY not set in environment")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "API key not configured"})
		return
	}

	baseURL := "https://newsdata.io/api/1/latest"
	params := url.Values{}
	params.Add("apikey", apiKey)
	params.Add("q", query)
	params.Add("language", language)
	if nextPage != "" {
		params.Add("page", nextPage)
	}
	if country != "" {
		params.Add("country", country)
	}
	if category != "" {
		params.Add("category", category)
	}

	fullURL := baseURL + "?" + params.Encode()
	logger.WithFields(logrus.Fields{
		"query":    query,
		"language": language,
		"country":  country,
		"category": category,
	}).Info("📡 Fetching news")

	resp, err := http.Get(fullURL)
	if err != nil {
		logger.WithError(err).Error("Failed to call NewsData.io API")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to call NewsData.io API"})
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		logger.WithError(err).Error("Failed to read API response")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read API response"})
		return
	}

	var ndResp newsDataIoResponse
	if err := json.Unmarshal(body, &ndResp); err != nil {
		logger.WithError(err).Error("Failed to parse JSON from API")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse API response"})
		return
	}

	myNewsResp := newsResponse{
		Status:       ndResp.Status,
		TotalResults: ndResp.TotalResults,
		NextPage:     ndResp.NextPage,
		Results:      ndResp.Results,
	}

	logger.WithFields(logrus.Fields{
		"results_count": len(myNewsResp.Results),
		"next_page":     myNewsResp.NextPage,
	}).Info("✅ Returning news results")

	c.JSON(http.StatusOK, myNewsResp)
}
