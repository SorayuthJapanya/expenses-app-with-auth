package repository

import (
	"database/sql"
	"fmt"
	"go_expense_app/internal/model"
)

type ExpenseRepository interface {
	GetExpenses(user_id string) ([]model.ExpensesModel, error)
	GetExpense(expense_id, user_id string) (model.ExpensesModel, error)
	CreateExpense(expense model.ExpensesModel) error
	UpdateExpense(expense model.ExpensesModel) error
	DeleteExpense(expense_id string) error
}

type mySqlExpenseRepository struct {
	DB *sql.DB
}

func NewExpenseRepository(db *sql.DB) ExpenseRepository {
	return &mySqlExpenseRepository{
		DB: db,
	}
}

func (repo *mySqlExpenseRepository) GetExpenses(user_id string) ([]model.ExpensesModel, error) {
	query := "SELECT * FROM expenses WHERE user_id = ?"

	rows, err := repo.DB.Query(query, user_id)
	if err != nil {
		return nil, err
	}

	var expenses []model.ExpensesModel

	// loop for append data
	for rows.Next() {
		var expense model.ExpensesModel
		if err := rows.Scan(&expense.Expense_id, &expense.User_id, &expense.Item, &expense.Cost, &expense.Date, &expense.Created_at, &expense.Updated_at); err != nil {
			return nil, err
		}
		expenses = append(expenses, expense)
	}

	return expenses, nil
}

func (repo *mySqlExpenseRepository) GetExpense(expense_id, user_id string) (model.ExpensesModel, error) {
	query := `
		SELECT expense_id, user_id, item, cost, date, created_at, updated_at
		FROM expenses
		WHERE expense_id = ? AND user_id = ?`

	var e model.ExpensesModel

	err := repo.DB.QueryRow(query, expense_id, user_id).Scan(
		&e.Expense_id,
		&e.User_id,
		&e.Item,
		&e.Cost,
		&e.Date,
		&e.Created_at,
		&e.Updated_at,
	)

	if err == sql.ErrNoRows {
		return e, fmt.Errorf("expense not found")
	}

	if err != nil {
		return e, err
	}

	return e, nil
}

func (repo *mySqlExpenseRepository) CreateExpense(e model.ExpensesModel) error {
	query := "INSERT INTO expenses (expense_id, user_id, item, cost, date) VALUES (?, ?, ?, ?, ?)"

	_, err := repo.DB.Exec(query, e.Expense_id, e.User_id, e.Item, e.Cost, e.Date)
	if err != nil {
		return err
	}

	return nil
}

func (repo *mySqlExpenseRepository) UpdateExpense(e model.ExpensesModel) error {
	query := `
		UPDATE expenses
		SET item = ?, cost = ?, ` + "`date`" + ` = ?
		WHERE expense_id = ?
	`

	_, err := repo.DB.Exec(query, e.Item, e.Cost, e.Date, e.Expense_id)

	if err == sql.ErrNoRows {
		return fmt.Errorf("expense not found")
	}

	if err != nil {
		return err
	}

	return nil
}

func (repo *mySqlExpenseRepository) DeleteExpense(expense_id string) error {
	query := "DELETE FROM expenses WHERE expense_id = ?"

	_, err := repo.DB.Exec(query, expense_id)

	if err == sql.ErrNoRows {
		return fmt.Errorf("expense not found")
	}

	if err != nil {
		return err
	}

	return nil
}
