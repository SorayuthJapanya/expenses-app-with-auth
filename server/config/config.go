package config

import "os"

type Config struct {
	DATABASE_DSN string
	JWT_SECRET   string
}

func LoadConfig() *Config {
	return &Config{
		DATABASE_DSN: os.Getenv("DATABASE_DSN"),
		JWT_SECRET:   os.Getenv("JWT_SECRET"),
	}
}

func GetVnv(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}