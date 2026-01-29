package repository

import (
	"database/sql"
	"go_expense_app/internal/model"
)

type UserRepository interface {
	RegisterUser(user model.User) (model.User, error)
	LoginUser(user model.User) (model.User, error)
	ExistEmail(email string) (bool, error)
}

type mySqlUserRepository struct {
	DB *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &mySqlUserRepository{
		DB: db,
	}
}

func (repo *mySqlUserRepository) RegisterUser(user model.User) (model.User, error) {
	query := "INSERT INTO users (user_id, username, email, password) VALUES (?, ?, ?, ?)"

	_, err := repo.DB.Exec(query, user.User_id, user.Username, user.Email, user.Password)
	if err != nil {
		return user, err
	}

	return user, nil
}

func (repo *mySqlUserRepository) LoginUser(user model.User) (model.User, error) {
	query := "SELECT * FROM users WHERE email = ?"
	
	err := repo.DB.QueryRow(query, user.Email).Scan(&user.User_id, &user.Username, &user.Email, &user.Password, &user.Created_at, &user.Updated_at)
	if err != nil {
		return user, err
	}

	return user, nil
}

func (repo *mySqlUserRepository) ExistEmail(email string) (bool, error) {
	query := "SELECT COUNT(email) FROM users WHERE email =?"

	var count int

	err := repo.DB.QueryRow(query, email).Scan(&count)
	if err != nil {
		return false, err
	}

	if count > 0 {
		return true, nil
	}

	return false, nil
}