package main

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"io"
	"net/url"

	"net/http"
)

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
	Status       string `json:"status"`
	TotalResults int    `json:"totalResults"`
	NextPage     string `json:"nextPage"`
	Results      []struct {
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
	} `json:"results"`
}

type newsRequest struct {
	Query    string `json:"query"`
	Language string `json:"language"`
}

type newsResponse struct {
	Status       string     `json:"status"`
	TotalResults int        `json:"totalResults"`
	NextPage     string     `json:"nextPage"`
	Results      []newsItem `json:"results"`
}

func main() {
	router := gin.Default()
	router.GET("/news", getNewsItemsUsingAPI)

	router.Run("localhost:8080")
}

func getNewsItemsUsingAPI(c *gin.Context) {
	query := c.Query("query")
	language := c.DefaultQuery("language", "en")
	nextPage := c.Query("page")
	country := c.Query("country")
	category := c.Query("category")

	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "query is required"})
		return
	}

	baseURL := "https://newsdata.io/api/1/latest"

	params := url.Values{}
	params.Add("apikey", "pub_62f82742c94b4551b14f1d6e060851ed")
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

	fullURL := fmt.Sprintf("%s?%s", baseURL, params.Encode())
	fmt.Println("Calling:", fullURL)

	resp, err := http.Get(fullURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Unmarshal NewsData.io response
	var ndResp newsDataIoResponse
	if err := json.Unmarshal(body, &ndResp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Map to your struct
	var myNewsResp newsResponse
	myNewsResp.Status = ndResp.Status
	myNewsResp.TotalResults = ndResp.TotalResults
	myNewsResp.NextPage = ndResp.NextPage

	for _, r := range ndResp.Results {
		item := newsItem{
			ArticleID:   r.ArticleID,
			Title:       r.Title,
			Link:        r.Link,
			Creator:     r.Creator,
			Description: r.Description,
			PubDate:     r.PubDate,
			ImageURL:    r.ImageURL,
			VideoURL:    r.VideoURL,
			SourceID:    r.SourceID,
			SourceName:  r.SourceName,
			SourceURL:   r.SourceURL,
			SourceIcon:  r.SourceIcon,
			Language:    r.Language,
			Country:     r.Country,
			Category:    r.Category,
		}
		myNewsResp.Results = append(myNewsResp.Results, item)
	}

	c.JSON(http.StatusOK, myNewsResp)
}
