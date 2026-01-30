package model

type ExpensesModel struct {
	Expense_id string  `json:"expense_id"`
	User_id    string  `json:"user_id"`
	Item       string  `json:"item"`
	Cost       float64 `json:"cost"`
	Date       string  `json:"date"`
	Type       string  `json:"type"`
	Created_at string  `json:"created_at"`
	Updated_at string  `json:"updated_at"`
}

type KpisModel struct {
	Total_income float64 `json:"total_income"`
	Total_expense float64 `json:"total_expense"`
	Total_balance float64 `json:"total_balance"`
}

type ExpenseGroupModel struct{
	Item string `json:"item"`
	Total_cost float64 `json:"total_cost"`
}

type DashboardModel struct{
	Kpis KpisModel `json:"kpis"`
	Recent_transactions []ExpensesModel `json:"recent_transactions"`
	Expenses_latest []ExpensesModel `json:"expenses_latest"`
	Expenses_group []ExpenseGroupModel `json:"expenses_group"`
	Incomes_latest []ExpensesModel `json:"incomes_latest"`
	Incomes_group []ExpenseGroupModel `json:"incomes_group"`
}
