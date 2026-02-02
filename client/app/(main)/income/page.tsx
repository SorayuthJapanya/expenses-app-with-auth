"use client";

import IncomeOverviewChart from "@/components/income/income-overview-chart";
import IncomeSources from "@/components/income/income-sources";
import { useGetIncomeOverview } from "@/hooks/expenses.hook";
import { Loader2 } from "lucide-react";
import React, { useMemo } from "react";

export interface GroupedCost {
  [date: string]: number;
}

export default function IncomePage() {
  const { data: incomeData, isLoading: isIncomeLoading } =
    useGetIncomeOverview();

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

  const formattedData = useMemo(() => {
    if (!incomeData) return [];

    const now = new Date();
    const currMonth = now.getMonth();
    const currYear = now.getFullYear();

    return incomeData
      .filter((item) => {
        const itemDate = new Date(item.date);
        return (
          itemDate.getMonth() === currMonth &&
          itemDate.getFullYear() === currYear
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      })
      .map((item) => ({
        ...item,
        date: formatDateWithSuffix(new Date(item.date)),
      }));
  }, [incomeData]);

  if (isIncomeLoading) {
    return (
      <div className="w-full flex justify-center p-8">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-8 space-y-8">
      <IncomeOverviewChart overviewData={formattedData ?? []} />
      <IncomeSources overviewData={formattedData ?? []} />
    </div>
  );
}
