package handler

import (
	"fmt"
	"go_expense_app/internal/model"
	"go_expense_app/internal/repository"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type ExpenseHandler struct {
	expenseRepo repository.ExpenseRepository
}

func NewExpenseHandler(expenseRepo repository.ExpenseRepository) *ExpenseHandler {
	return &ExpenseHandler{
		expenseRepo: expenseRepo,
	}
}

// GetExpensesHandler
func (h *ExpenseHandler) GetExpensesHandler(c *gin.Context) {
	// Get user_id form auth middleware
	authUserAny, exist := c.Get("authUser")
	if !exist {
		return
	}

	claims := authUserAny.(*jwt.MapClaims)
	user_id := (*claims)["user_id"].(string)

	// get query
	expense_type := c.Query("type")

	// Get expenses from database with authUser.user_id
	expenses, err := h.expenseRepo.GetExpenses(user_id, expense_type)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
		return
	}

	if len(expenses) == 0 {
		c.JSON(http.StatusOK, gin.H{"data": []model.ExpensesModel{}})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": expenses})

}

// GetExpenseHandler
func (h *ExpenseHandler) GetExpenseHandler(c *gin.Context) {
	// Get param
	expense_id := c.Param("id")
	if expense_id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "expense id is required"})
		return
	}

	// Get user_id form auth middleware
	authUserAny, exist := c.Get("authUser")
	if !exist {
		return
	}

	claims := authUserAny.(*jwt.MapClaims)
	user_id := (*claims)["user_id"].(string)

	// Get expense from database with expense_id
	expense, err := h.expenseRepo.GetExpense(expense_id, user_id)
	if err != nil {
		if err.Error() == "expense not found" {
			c.JSON(http.StatusNotFound, gin.H{"message": "Expense not found"})
			return
		}

		fmt.Println(err.Error())

		c.JSON(http.StatusInternalServerError, gin.H{"message": "internal server error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": expense})
}

// CreateExpenseHandler
func (h *ExpenseHandler) CreateExpenseHandler(c *gin.Context) {
	// Get authUser form auth middleware
	authUserAny, exist := c.Get("authUser")
	if !exist {
		return
	}

	claims := authUserAny.(*jwt.MapClaims)
	user_id := (*claims)["user_id"].(string)

	// Get data form request body
	var expense model.ExpensesModel
	if err := c.ShouldBindJSON(&expense); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "All fields are required."})
		return
	}

	// Validate data
	if expense.Item == "" || expense.Cost == 0 || expense.Date == "" || expense.Type == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "All fields are required."})
		return
	}

	if expense.Type != "income" && expense.Type != "expense" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Type must be income or expense."})
		return
	}

	// Create payload
	expense.Expense_id = uuid.NewString()
	expense.User_id = user_id

	// Create expense in database
	if err := h.expenseRepo.CreateExpense(expense); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Expense created successfully", "data": expense})
}

// UpdateExpenseHandler
func (h *ExpenseHandler) UpdateExpenseHandler(c *gin.Context) {
	// Get param
	expense_id := c.Param("id")

	// Get authUser form auth middleware
	authUserAny, exist := c.Get("authUser")
	if !exist {
		return
	}

	claims := authUserAny.(*jwt.MapClaims)
	user_id := (*claims)["user_id"].(string)

	// Get data form request body
	var reqExpense model.ExpensesModel
	if err := c.ShouldBindJSON(&reqExpense); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "All fields are required."})
		return
	}

	// Validate data
	if reqExpense.Item == "" || reqExpense.Cost == 0 || reqExpense.Date == "" || reqExpense.Type == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "All fields are required."})
		return
	}

	if reqExpense.Type != "income" && reqExpense.Type != "expense" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Type must be income or expense."})
		return
	}

	// Get data from database with expense_id
	expense, err := h.expenseRepo.GetExpense(expense_id, user_id)

	if err != nil {
		if err.Error() == "expense not found" {
			c.JSON(http.StatusNotFound, gin.H{"message": "Expense not found"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"message": "internal server error"})
		return
	}

	// Update data
	expense.Item = reqExpense.Item
	expense.Cost = reqExpense.Cost
	expense.Date = reqExpense.Date
	expense.Type = reqExpense.Type

	// Update data to database
	if err := h.expenseRepo.UpdateExpense(expense, user_id); err != nil {
		if err.Error() == "expense not found" {
			c.JSON(http.StatusNotFound, gin.H{"message": "Expense not found"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"message": "internal server error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Expense updated successfully"})
}

// DeleteExpenseHandler
func (h *ExpenseHandler) DeleteExpenseHandler(c *gin.Context) {
	// Get param
	expense_id := c.Param("id")

	// Get authUser form auth middleware
	authUserAny, exist := c.Get("authUser")
	if !exist {
		return
	}

	claims := authUserAny.(*jwt.MapClaims)
	user_id := (*claims)["user_id"].(string)

	// Delete data out of database
	if err := h.expenseRepo.DeleteExpense(expense_id, user_id); err != nil {
		if err.Error() == "expense not found" {
			c.JSON(http.StatusNotFound, gin.H{"message": "Expense not found"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"message": "internal server error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Expense deleted successfully"})
}

func (h *ExpenseHandler) GetDashBoardExpenseHandler(c *gin.Context) {
	// Get authUser form auth middleware
	authUserAny, exist := c.Get("authUser")
	if !exist {
		return
	}

	claims := authUserAny.(*jwt.MapClaims)
	user_id := (*claims)["user_id"].(string)

	var dashboardData model.DashboardModel

	// Get Kpis data from database
	kpis, err := h.expenseRepo.GetKpisExpense(user_id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "internal server error"})
		return
	}

	// Set kpis data to dashboard data
	dashboardData.Kpis = kpis

	// Get recent transactions from database
	recent_transactions, err := h.expenseRepo.GetExpenses(user_id, "")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"data": dashboardData})
		return
	}

	// Set recent transactions to dashboard data
	if len(recent_transactions) > 5 {
		dashboardData.Recent_transactions = recent_transactions[0:5]
	} else {
		dashboardData.Recent_transactions = recent_transactions
	}

	// Get latest expenses from database
	latest_expenses, err := h.expenseRepo.GetExpenses(user_id, "expense")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"data": dashboardData})
		return
	}

	// Set latest expenses to dashboard data
	if len(latest_expenses) > 5 {
		dashboardData.Expenses_latest = latest_expenses[0:5]
	} else {
		dashboardData.Expenses_latest = latest_expenses
	}

	// Get expenses group from database
	expenses_group, err := h.expenseRepo.GetExpensesGroup(user_id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"data": dashboardData})
		return
	}

	// Set expenses group to dashboard data
	dashboardData.Expenses_group = expenses_group

	// Get latest incomes from database
	incomes_latest, err := h.expenseRepo.GetExpenses(user_id, "income")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"data": dashboardData})
		return
	}

	// Set latest incomes to dashboard data
	dashboardData.Incomes_latest = incomes_latest

	// Get incomes group from database
	incomes_group, err := h.expenseRepo.GetIncomesGroup(user_id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"data": dashboardData})
		return
	}

	// Set incomes group to dashboard data
	dashboardData.Incomes_group = incomes_group

	// Send Response
	c.JSON(http.StatusOK, gin.H{
		"data": dashboardData,
	},
	)
}
