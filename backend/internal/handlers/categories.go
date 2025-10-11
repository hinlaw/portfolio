package handlers

import (
	"net/http"

	"portfolio-backend/internal/models"

	"github.com/gin-gonic/gin"
)

// GetCategories 取得作品分類列表
func GetCategories(c *gin.Context) {
	categories := []models.Category{
		{
			ID:          1,
			Title:       "Web Development",
			Description: "Full-stack web applications using modern technologies",
			Icon:        "🌐",
			Color:       "blue",
		},
		{
			ID:          2,
			Title:       "Mobile Apps",
			Description: "iOS and Android applications with native and cross-platform solutions",
			Icon:        "📱",
			Color:       "green",
		},
		{
			ID:          3,
			Title:       "Technical Consulting",
			Description: "Architecture design and technical guidance for complex projects",
			Icon:        "🔧",
			Color:       "purple",
		},
		{
			ID:          4,
			Title:       "Data Analytics",
			Description: "Data processing, visualization, and machine learning solutions",
			Icon:        "📊",
			Color:       "orange",
		},
	}

	response := models.APIResponse{
		Success: true,
		Message: "Categories retrieved successfully",
		Data:    categories,
	}
	c.JSON(http.StatusOK, response)
}
