package config

import "os"

type Config struct {
	DATABASE_DSN string
	JWT_SECRET   string
	CLIENT_URL   string
	PORT   string
}

func LoadConfig() *Config {
	return &Config{
		DATABASE_DSN: os.Getenv("DATABASE_DSN"),
		JWT_SECRET:   os.Getenv("JWT_SECRET"),
		CLIENT_URL:   os.Getenv("CLIENT_URL"),
		PORT:   os.Getenv("PORT"),
	}
}

func GetVnv(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}
