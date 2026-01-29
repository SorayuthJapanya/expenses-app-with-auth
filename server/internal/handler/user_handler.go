package handler

import (
	"fmt"
	"go_expense_app/internal/model"
	"go_expense_app/internal/repository"
	"go_expense_app/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type UserHandler struct {
	userRepo repository.UserRepository
}

func NewUserHandler(userRepo repository.UserRepository) *UserHandler {
	return &UserHandler{
		userRepo: userRepo,
	}
}

// RegisterUserHandler
func (h *UserHandler) RegisterUserHandler(c *gin.Context) {
	// Define variable
	var newUser model.User

	// Get data
	if err := c.ShouldBindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "All fields are required."})
		return
	}

	// Validation All Data
	if newUser.Username == "" || newUser.Email == "" || newUser.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "All fields are required."})
		return
	}

	// Validation Password
	if len(newUser.Password) < 6 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Password must be at least 6 characters."})
		return
	}

	// if exists email
	isExist, err := h.userRepo.ExistEmail(newUser.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error."})
		return
	}

	if isExist {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Email already exists."})
		return
	}

	// hash password
	if err := newUser.HashPassword(newUser.Password); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error."})
		return
	}

	// Add uuid
	newUser.User_id = uuid.NewString()

	// Insert to database
	user, err := h.userRepo.RegisterUser(newUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error."})
		return
	}

	// generate token
	token, err := service.GenerateToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error."})
		return
	}

	// Set cookies options
	cookiesOption := &http.Cookie{
		Name:     "Authorization",
		Value:    token,
		MaxAge:   3600 * 24,
		Path:     "/",
		Domain:   "",
		Secure:   false,
		HttpOnly: true,
	}

	// Set Cookies
	c.SetCookie(
		cookiesOption.Name,
		cookiesOption.Value,
		cookiesOption.MaxAge,
		cookiesOption.Path,
		cookiesOption.Domain,
		cookiesOption.Secure,
		cookiesOption.HttpOnly,
	)

	// Send Response
	c.JSON(http.StatusCreated, gin.H{"message": "Register successfully", "token": token})

}

// LoginUserHandler
func (h *UserHandler) LoginUserHandler(c *gin.Context) {
	// Define variable
	var requestUser model.User

	// Get data
	if err := c.ShouldBindJSON(&requestUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "All fields are required."})
		return
	}

	// Validation All Data
	if requestUser.Email == "" || requestUser.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "All fields are required."})
		return
	}

	// Get user from database
	user, err := h.userRepo.LoginUser(requestUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error."})
		return
	}

	fmt.Println("User: ", user)

	// compare password
	if err := user.CheckPassword(requestUser.Password); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid Credentials."})
		return
	}

	// generate token
	token, err := service.GenerateToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error."})
		return
	}

	// Set cookies options
	cookiesOption := &http.Cookie{
		Name:     "Authorization",
		Value:    token,
		MaxAge:   3600 * 24,
		Path:     "/",
		Domain:   "",
		Secure:   false,
		HttpOnly: true,
	}

	// Set Cookies
	c.SetCookie(
		cookiesOption.Name,
		cookiesOption.Value,
		cookiesOption.MaxAge,
		cookiesOption.Path,
		cookiesOption.Domain,
		cookiesOption.Secure,
		cookiesOption.HttpOnly,
	)

	// Send Response
	c.JSON(http.StatusCreated, gin.H{"message": "login successfully", "token": token})
}

// LogoutUserHandler
func (h *UserHandler) LogoutUserHandler(c *gin.Context) {
	c.SetCookie("Authorization", "", -1, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "Logout successfully"})
}

// GetCurrentUserHandler
func (h *UserHandler) GetCurrentUserHandler(c *gin.Context) {
	authUser, exist := c.Get("authUser")
	if !exist {
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": authUser})
}
