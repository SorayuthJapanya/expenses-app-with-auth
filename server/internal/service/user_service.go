package service

import (
	"fmt"
	"go_expense_app/config"
	"go_expense_app/internal/model"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateToken(user model.User) (string, error) {
	// Load env
	config.LoadEnv()
	cfg := config.LoadConfig()

	// Create claims
	claims := jwt.MapClaims{
		"user_id":  user.User_id,
		"username": user.Username,
		"email":    user.Email,
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	}

	// Generate token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(cfg.JWT_SECRET))

	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func VerifyToken(tokenString string) (*jwt.MapClaims, error) {
	// Load env
	config.LoadEnv()
	cfg := config.LoadConfig()

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(cfg.JWT_SECRET), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return &claims, nil
	}

	return nil, fmt.Errorf("Invalid token")
}
