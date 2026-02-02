import {
  createExpense,
  deleteExpense,
  getDashboardData,
  getExpense,
  getExpenseOverview,
  getExpenses,
  getIncomeOverview,
  updateExpense,
} from "@/services/expense.services";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const invalidateExpenseRelatedQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ["expenses"] });
  queryClient.invalidateQueries({ queryKey: ["income-overview"] });
  queryClient.invalidateQueries({ queryKey: ["expense-overview"] });
  queryClient.invalidateQueries({ queryKey: ["expenses-dashboard"] });
};

export const useGetExpensesDashboard = () => {
  return useQuery({
    queryKey: ["expenses-dashboard"],
    queryFn: getDashboardData,
  });
};

export const useGetExpenses = () => {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
  });
};

export const useGetIncomeOverview = () => {
  return useQuery({
    queryKey: ["income-overview"],
    queryFn: getIncomeOverview,
  });
};

export const useGetExpenseOverview = () => {
  return useQuery({
    queryKey: ["expense-overview"],
    queryFn: getExpenseOverview,
  });
};

export const useGetExpense = (expense_id: string) => {
  return useQuery({
    queryKey: ["expense", expense_id],
    queryFn: () => getExpense(expense_id),
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExpense,
    onSuccess: (res) => {
      toast.success(res.message);
      invalidateExpenseRelatedQueries(queryClient);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message ?? "Create failed");
    },
  });
};

export const useUpdateExpenses = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateExpense,
    onSuccess: (res) => {
      toast.success(res.message);
      invalidateExpenseRelatedQueries(queryClient);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message ?? "Update failed");
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: (res) => {
      toast.success(res.message);
      invalidateExpenseRelatedQueries(queryClient);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message ?? "Delete failed");
    },
  });
};
