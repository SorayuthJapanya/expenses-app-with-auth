package main

import (
	"go_expense_app/internal/database"
	"go_expense_app/internal/handler"
	"go_expense_app/internal/middleware"
	"go_expense_app/internal/repository"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	// Connect to database
	database.ConnectDB()
	defer database.DB.Close()

	// Initialize repository and handler
	userRepo := repository.NewUserRepository(database.DB)
	userHandler := handler.NewUserHandler(userRepo)

	expenseRepo := repository.NewExpenseRepository(database.DB)
	expenseHandler := handler.NewExpenseHandler(expenseRepo)

	// Create router
	router := gin.Default()

	// Create Test Route
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Hello world!!"})
	})

	// Authentication Group Router
	userGroup := router.Group("/api/auth")
	{
		userGroup.POST("/register", userHandler.RegisterUserHandler)
		userGroup.POST("/login", userHandler.LoginUserHandler)
	}

	// Protected Group Router
	protectedGroup := router.Group("/api")
	protectedGroup.Use(middleware.AuthMiddleware())
	{
		// Authenticated Route
		protectedGroup.GET("/auth/me", userHandler.GetCurrentUserHandler)
		protectedGroup.POST("/auth/logout", userHandler.LogoutUserHandler)

		// Expenses Route
		protectedGroup.GET("/expenses", expenseHandler.GetExpensesHandler)
		protectedGroup.GET("/expenses/:id", expenseHandler.GetExpenseHandler)
		protectedGroup.POST("/expenses", expenseHandler.CreateExpenseHandler)
		protectedGroup.PUT("/expenses/:id", expenseHandler.UpdateExpenseHandler)
		protectedGroup.DELETE("/expenses/:id", expenseHandler.DeleteExpenseHandler)
	}

	router.Run(":8080")
}
