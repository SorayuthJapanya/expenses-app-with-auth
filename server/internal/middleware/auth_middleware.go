package middleware

import (
	"go_expense_app/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc{
	return  func(c *gin.Context) {
		tokenString, err := c.Cookie("Authorization")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorize"})
			return 
		}

		claims, err := service.VerifyToken(tokenString)

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorize"})
			return 
		}

		c.Set("authUser", claims)
		c.Next()
	}
}