package model

type ExpensesModel struct {
	Expense_id string  `json:"expense_id"`
	User_id    string  `json:"user_id"`
	Item       string  `json:"item"`
	Cost       float64 `json:"cost"`
	Date       string  `json:"date"`
	Created_at string  `json:"created_at"`
	Updated_at string  `json:"updated_at"`
}
