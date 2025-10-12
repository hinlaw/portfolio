package main

import (
	"log"
	"os"

	"portfolio-backend/internal/handlers"
	"portfolio-backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

func main() {
	// 設置 Gin 模式
	if os.Getenv("GIN_MODE") == "" {
		gin.SetMode(gin.ReleaseMode)
	}

	// 建立 Gin router
	r := gin.Default()

	// 設置 CORS middleware
	r.Use(middleware.CORS())

	// API routes
	api := r.Group("/api")
	{
		api.GET("/health", handlers.HealthCheck)
		api.GET("/categories", handlers.GetCategories)
		api.POST("/contact", handlers.ContactForm)
	}

	// 啟動伺服器
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
