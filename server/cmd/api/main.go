package main

import (
	"go_expense_app/config"
	"go_expense_app/internal/database"
	"go_expense_app/internal/handler"
	"go_expense_app/internal/middleware"
	"go_expense_app/internal/repository"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load env
	config.LoadEnv()
	cfg := config.LoadConfig()

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

	// Create CORS middleware
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{cfg.CLIENT_URL},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

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

		// Expenses Dashboard Route
		protectedGroup.GET("/expenses/dashboard", expenseHandler.GetDashBoardExpenseHandler)

	}

	port := cfg.PORT
	if port == "" {
		port = "8080"
	}

	// Run server
	router.Run(":" + port)
}
