import { axiosInstance } from "@/lib/axios";
import {
  IExpense,
  IExpenseDashboard,
  IExpenseForm,
  IExpenseUpdateForm,
} from "@/types/expenses";

export const getDashboardData = async (): Promise<IExpenseDashboard> => {
  const res = await axiosInstance.get("api/expenses/dashboard");
  return res.data.data;
};

export const getExpenses = async (): Promise<IExpense[]> => {
  const res = await axiosInstance.get("/api/expenses");
  return res.data.data;
};

export const getIncomeOverview = async (): Promise<IExpense[]> => {
  const type = "income";
  const res = await axiosInstance.get(`/api/expenses?type=${type}`);
  return res.data.data;
};

export const getExpenseOverview = async (): Promise<IExpense[]> => {
  const type = "expense";
  const res = await axiosInstance.get(`/api/expenses?type=${type}`);
  return res.data.data;
};

export const getExpensesOverview = async (): Promise<IExpense[]> => {
  const type = "expense";
  const res = await axiosInstance.get(`/api/expenses?type=${type}`);
  return res.data.data;
};

export const getExpense = async (expense_id: string): Promise<IExpense> => {
  const res = await axiosInstance.get(`/api/expenses/${expense_id}`);
  return res.data;
};

export const createExpense = async (payload: IExpenseForm) => {
  const res = await axiosInstance.post("/api/expenses", payload);
  return res.data;
};

export const updateExpense = async (payload: IExpenseUpdateForm) => {
  const res = await axiosInstance.put(
    `/api/expenses/${payload.expense_id}`,
    payload,
  );
  return res.data;
};

export const deleteExpense = async (expense_id: string) => {
  const res = await axiosInstance.delete(`/api/expenses/${expense_id}`);
  return res.data;
};
