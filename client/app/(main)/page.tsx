"use client";

import ExpensesGroupChart from "@/components/home/expenses-group-chart";
import FinancialOverviewChart from "@/components/home/financial-overview-chart";
import IncomeGroupChart from "@/components/home/income-group-chart";
import KpiSection from "@/components/home/kpi-section";
import ExpensesLatest from "@/components/home/latest_expense";
import IncomeLatest from "@/components/home/latest_income";
import RecentTransactions from "@/components/home/recent-transactions";
import { useGetExpensesDashboard } from "@/hooks/expenses.hook";
import { Loader2 } from "lucide-react";
import React from "react";

export default function HomePage() {
  const { data: dashboardData, isLoading: isDashboardLoading } =
    useGetExpensesDashboard();

  if (isDashboardLoading)
    return (
      <div className="w-full max-w-7xl mx-auto p-8 flex justify-center">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  return (
    <div className="w-full max-w-7xl mx-auto p-8 space-y-8">
      <KpiSection kpiData={dashboardData?.kpis} />

      {/* Recent Transactions & Financial Overview */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RecentTransactions recent_data={dashboardData?.recent_transactions} />
        <FinancialOverviewChart data={dashboardData?.kpis} />
      </div>

      {/* Expenses Group & Latest Expenses */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="order-2 lg:order-1">
          <ExpensesGroupChart data={dashboardData?.expenses_group} />
        </div>

        <div className="order-1 lg:order-2">
          <ExpensesLatest expenses_latest={dashboardData?.expenses_latest} />
        </div>
      </div>

      {/* Incomes Group & Latest Incomes */}
      <div className="grid lg:grid-cols-2 gap-6">
        <IncomeLatest income_latest={dashboardData?.incomes_latest} />
        <IncomeGroupChart data={dashboardData?.incomes_group} />
      </div>
    </div>
  );
}
