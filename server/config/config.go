package config

import (
	"log"
	"os"
)

type Config struct {
	GO_ENV       string
	DATABASE_DSN string
	JWT_SECRET   string
	CLIENT_URL   string
	PORT         string
}

func LoadConfig() *Config {
	cfg := &Config{
		GO_ENV:       os.Getenv("GO_ENV"),
		DATABASE_DSN: os.Getenv("DATABASE_DSN"),
		JWT_SECRET:   os.Getenv("JWT_SECRET"),
		CLIENT_URL:   os.Getenv("CLIENT_URL"),
		PORT:         os.Getenv("PORT"),
	}

	if cfg.GO_ENV == "" {
		cfg.GO_ENV = "development"
	}

	if cfg.DATABASE_DSN == "" {
		log.Fatal("DATABASE_DSN is required")
	}
	if cfg.JWT_SECRET == "" {
		log.Fatal("JWT_SECRET is required")
	}

	return cfg
}

func GetVnv(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}
