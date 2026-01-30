package database

import (
	"database/sql"
	"fmt"
	"go_expense_app/config"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func ConnectDB() {
	var err error

	// Load env
	config.LoadEnv()
	cfg := config.LoadConfig()
	dsn := cfg.DATABASE_DSN

	// Connect to database
	DB, err = sql.Open("mysql", dsn)

	if err != nil {
		log.Fatal("Failed to connect database: ", err)
	}

	if err := DB.Ping(); err != nil {
		log.Fatal("Failed to ping database: ", err)
	}

	fmt.Println("Connect to database successfully")

	// Create table
	CreateUserTable()
	CreateExpenseTable()
}

func CreateUserTable() {
	userTableSql := `
    CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR(64) PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
		)`

	_, err := DB.Exec(userTableSql)
	if err != nil {
		log.Fatal("Failed to create user table: ", err)
	}

	fmt.Println("Create user table successfully")
}

func CreateExpenseTable() {
	expenseTableSql := `
    CREATE TABLE IF NOT EXISTS expenses (
        expense_id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL,
        item VARCHAR(255) NOT NULL,
        cost DOUBLE NOT NULL,
        date DATE NOT NULL,
		type ENUM('income', 'expense') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
		)`

	_, err := DB.Exec(expenseTableSql)
	if err != nil {
		log.Fatal("Failed to create expense table: ", err)
	}

	fmt.Println("Create expense table successfully")
}
