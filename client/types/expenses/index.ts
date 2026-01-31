export interface IExpense {
  expense_id: string;
  user_id: string;
  item: string;
  cost: number;
  date: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface IExpenseForm {
  item: string;
  cost: number;
  date: string;
  type: string;
}

export interface IExpenseUpdateForm {
  expense_id: string;
  item?: string;
  cost?: number;
  date?: string;
  type?: string;
}

export interface IExpenseKpi {
  total_income: number;
  total_expense: number;
  total_balance: number;
}

export interface IExpenseGroup {
  item: string;
  total_cost: number;
}

export interface IExpenseDashboard {
  kpis: IExpenseKpi;
  recent_transactions: IExpense[];
  expenses_latest: IExpense[];
  expenses_group: IExpenseGroup[];
  incomes_latest: IExpense[];
  incomes_group: IExpenseGroup[];
}
