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
	userID := (*claims)["user_id"].(string)

	// Get expenses from database with authUser.user_id
	expenses, err := h.expenseRepo.GetExpenses(userID)
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
	userID := (*claims)["user_id"].(string)

	// Get expense from database with expense_id
	expense, err := h.expenseRepo.GetExpense(expense_id, userID)
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
	userID := (*claims)["user_id"].(string)

	// Get data form request body
	var expense model.ExpensesModel
	if err := c.ShouldBindJSON(&expense); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "All fields are required."})
		return
	}

	// Validate data
	if expense.Item == "" || expense.Cost == 0 || expense.Date == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "All fields are required."})
		return
	}

	// Create payload
	expense.Expense_id = uuid.NewString()
	expense.User_id = userID

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
	userID := (*claims)["user_id"].(string)

	// Get data form request body
	var reqExpense model.ExpensesModel
	if err := c.ShouldBindJSON(&reqExpense); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "All fields are required."})
		return
	}

	// Validate data
	if reqExpense.Item == "" || reqExpense.Cost == 0 || reqExpense.Date == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "All fields are required."})
		return
	}

	// Get data from database with expense_id
	expense, err := h.expenseRepo.GetExpense(expense_id, userID)

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

	// Update data to database
	if err := h.expenseRepo.UpdateExpense(expense); err != nil {
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
	userID := (*claims)["user_id"].(string)

	// Get data from database with expense_id
	_, err := h.expenseRepo.GetExpense(expense_id, userID)

	if err != nil {
		if err.Error() == "expense not found" {
			c.JSON(http.StatusNotFound, gin.H{"message": "Expense not found"})
			return
		}

		fmt.Println(err.Error())

		c.JSON(http.StatusInternalServerError, gin.H{"message": "internal server error"})
		return
	}

	// Delete data out of database
	if err := h.expenseRepo.DeleteExpense(expense_id); err != nil {
		if err.Error() == "expense not found" {
			c.JSON(http.StatusNotFound, gin.H{"message": "Expense not found"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"message": "internal server error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Expense deleted successfully"})
}
