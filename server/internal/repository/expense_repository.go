package repository

import (
	"database/sql"
	"fmt"
	"go_expense_app/internal/model"
	"time"
)

type ExpenseRepository interface {
	GetExpenses(user_id, expense_type string) ([]model.ExpensesModel, error)
	GetExpense(expense_id, user_id string) (model.ExpensesModel, error)
	CreateExpense(expense model.ExpensesModel) error
	UpdateExpense(expense model.ExpensesModel, user_id string) error
	DeleteExpense(expense_id string, user_id string) error

	// Dashboard Expense
	GetKpisExpense(user_id string) (model.KpisModel, error)
	GetExpensesGroup(user_id string) ([]model.ExpenseGroupModel, error)
	GetIncomesGroup(user_id string) ([]model.ExpenseGroupModel, error)
}

type mySqlExpenseRepository struct {
	DB *sql.DB
}

func NewExpenseRepository(db *sql.DB) ExpenseRepository {
	return &mySqlExpenseRepository{
		DB: db,
	}
}

func (repo *mySqlExpenseRepository) GetExpenses(user_id, expense_type string) ([]model.ExpensesModel, error) {
	query := "SELECT * FROM expenses WHERE user_id = ?"

	args := []interface{}{user_id}

	// add filtered
	if expense_type != "" {
		query += " AND type = ?"
		args = append(args, expense_type)
	}

	// add order by
	query += " ORDER BY date DESC"

	rows, err := repo.DB.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var expenses []model.ExpensesModel

	// loop for append data
	for rows.Next() {
		var expense model.ExpensesModel
		if err := rows.Scan(&expense.Expense_id, &expense.User_id, &expense.Item, &expense.Cost, &expense.Date, &expense.Type, &expense.Created_at, &expense.Updated_at); err != nil {
			return nil, err
		}
		expenses = append(expenses, expense)
	}

	return expenses, nil
}

func (repo *mySqlExpenseRepository) GetExpense(expense_id, user_id string) (model.ExpensesModel, error) {
	query := `
		SELECT expense_id, user_id, item, cost, date, type, created_at, updated_at
		FROM expenses
		WHERE expense_id = ? AND user_id = ?`

	var e model.ExpensesModel

	err := repo.DB.QueryRow(query, expense_id, user_id).Scan(
		&e.Expense_id,
		&e.User_id,
		&e.Item,
		&e.Cost,
		&e.Date,
		&e.Type,
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
	query := "INSERT INTO expenses (expense_id, user_id, item, cost, date, type) VALUES (?, ?, ?, ?, ?, ?)"

	_, err := repo.DB.Exec(query, e.Expense_id, e.User_id, e.Item, e.Cost, e.Date, e.Type)
	if err != nil {
		return err
	}

	return nil
}

func (repo *mySqlExpenseRepository) UpdateExpense(e model.ExpensesModel, user_id string) error {
	query := `
		UPDATE expenses
		SET item = ?, cost = ?, ` + "`date`" + ` = ?, type = ?, updated_at = NOW()
		WHERE expense_id = ? AND user_id = ?
	`

	_, err := repo.DB.Exec(query, e.Item, e.Cost, e.Date, e.Type, e.Expense_id, user_id)

	if err == sql.ErrNoRows {
		return fmt.Errorf("expense not found")
	}

	if err != nil {
		return err
	}

	return nil
}

func (repo *mySqlExpenseRepository) DeleteExpense(expense_id, user_id string) error {
	query := "DELETE FROM expenses WHERE expense_id = ? AND user_id = ?"

	_, err := repo.DB.Exec(query, expense_id, user_id)

	if err == sql.ErrNoRows {
		return fmt.Errorf("expense not found")
	}

	if err != nil {
		return err
	}

	return nil
}

func (repo *mySqlExpenseRepository) GetKpisExpense(user_id string) (model.KpisModel, error) {
	query := `
		SELECT 
			total_income,
			total_expense,
			(total_income - total_expense) AS total_balance
		FROM (
			 SELECT 
		    	SUM(CASE WHEN e.type = 'income' THEN e.cost ELSE 0 END) AS total_income,
		    	SUM(CASE WHEN e.type = 'expense' THEN e.cost ELSE 0 END) AS total_expense
		  	FROM expenses e
			WHERE e.user_id = ?
		) t;`

	var kpi model.KpisModel

	err := repo.DB.QueryRow(query, user_id).Scan(&kpi.Total_income, &kpi.Total_expense, &kpi.Total_balance)
	if err != nil {
		return kpi, err
	}

	return kpi, nil
}

func (repo *mySqlExpenseRepository) GetExpensesGroup(user_id string) ([]model.ExpenseGroupModel, error) {
	now := time.Now()
	last30Days := now.AddDate(0, 0, -30)
	const YYYYMMDD = "2006-01-02"

	query := `
		SELECT item, SUM(cost) as total_cost
		FROM expenses
		where user_id = ? AND type = 'expense' AND date BETWEEN ? AND ?
		GROUP BY item
		ORDER BY total_cost DESC
	`

	var last30DaysExpenses []model.ExpenseGroupModel
	rows, err := repo.DB.Query(query, user_id, last30Days.Format(YYYYMMDD), now.Format(YYYYMMDD))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var expense model.ExpenseGroupModel
		if err := rows.Scan(&expense.Item, &expense.Total_cost); err != nil {
			return nil, err
		}
		last30DaysExpenses = append(last30DaysExpenses, expense)
	}

	return last30DaysExpenses, nil

}

func (repo *mySqlExpenseRepository) GetIncomesGroup(user_id string) ([]model.ExpenseGroupModel, error) {
	now := time.Now()
	last60Days := now.AddDate(0, 0, -60)
	const YYYYMMDD = "2006-01-02"

	query := `
		SELECT item, SUM(cost) as total_cost
		FROM expenses
		where user_id = ? AND type = 'income' AND date BETWEEN ? AND ?
		GROUP BY item
		ORDER BY total_cost DESC
	`

	var last60DaysIncomes []model.ExpenseGroupModel
	rows, err := repo.DB.Query(query, user_id, last60Days.Format(YYYYMMDD), now.Format(YYYYMMDD))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var income model.ExpenseGroupModel
		if err := rows.Scan(&income.Item, &income.Total_cost); err != nil {
			return nil, err
		}
		last60DaysIncomes = append(last60DaysIncomes, income)
	}

	return last60DaysIncomes, nil

}
