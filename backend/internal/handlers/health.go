package handlers

import (
	"net/http"

	"portfolio-backend/internal/models"

	"github.com/gin-gonic/gin"
)

// HealthCheck 健康檢查端點
func HealthCheck(c *gin.Context) {
	response := models.APIResponse{
		Success: true,
		Message: "Portfolio backend is running",
		Data: gin.H{
			"status":  "healthy",
			"version": "1.0.0",
		},
	}
	c.JSON(http.StatusOK, response)
}
