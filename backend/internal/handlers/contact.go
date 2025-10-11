package handlers

import (
	"net/http"

	"portfolio-backend/internal/models"

	"github.com/gin-gonic/gin"
)

// ContactForm 處理聯絡表單提交
func ContactForm(c *gin.Context) {
	var form models.ContactForm

	// 綁定 JSON 資料到結構體
	if err := c.ShouldBindJSON(&form); err != nil {
		response := models.APIResponse{
			Success: false,
			Message: "Invalid form data: " + err.Error(),
		}
		c.JSON(http.StatusBadRequest, response)
		return
	}

	// 這裡可以加入實際的處理邏輯，例如：
	// - 發送 email
	// - 儲存到資料庫
	// - 整合第三方服務

	// 目前只是回傳成功訊息
	response := models.APIResponse{
		Success: true,
		Message: "Contact form submitted successfully",
		Data: gin.H{
			"name":    form.Name,
			"email":   form.Email,
			"subject": form.Subject,
		},
	}
	c.JSON(http.StatusOK, response)
}
