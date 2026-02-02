"use client";

import ExpenseOverviewChart from "@/components/expense/expense-overview-chart";
import ExpenseSources from "@/components/expense/expense-sources";
import { useGetExpenseOverview } from "@/hooks/expenses.hook";
import { Loader2 } from "lucide-react";
import React, { useMemo } from "react";

export default function ExpensePage() {
  const { data: expenseData, isLoading: isExpenseLoading } =
    useGetExpenseOverview();

  const formattedData = useMemo(() => {
    if (!expenseData) return [];

    const now = new Date();
    const currMonth = now.getMonth();
    const currYear = now.getFullYear();

    const formatDateWithSuffix = (dateObj: Date) => {
      const day = dateObj.getDate();
      const month = dateObj.toLocaleDateString("en-US", { month: "short" });
      const year = dateObj.getFullYear();

      const getSuffix = (n: number) => {
        if (n > 3 && n < 21) return "th";
        switch (n % 10) {
          case 1:
            return "st";
          case 2:
            return "nd";
          case 3:
            return "rd";
          default:
            return "th";
        }
      };

      return `${day}${getSuffix(day)} ${month} ${year}`;
    };

    const result = expenseData
      .filter((data) => {
        const date = new Date(data.date);
        return date.getMonth() === currMonth && date.getFullYear() === currYear;
      })
      .sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      })
      .map((data) => {
        return {
          ...data,
          date: formatDateWithSuffix(new Date(data.date)),
        };
      });

    return result;
  }, [expenseData]);

  if (isExpenseLoading) {
    return (
      <div className="w-full flex justify-center p-8">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-8 space-y-8">
      <ExpenseOverviewChart overviewData={formattedData ?? []} />
      <ExpenseSources data={formattedData ?? []} />
    </div>
  );
}
