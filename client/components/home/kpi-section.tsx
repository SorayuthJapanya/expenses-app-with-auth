"use client";

import { IExpenseDashboard } from "@/types/expenses";
import { Card, CardContent } from "../ui/card";
import { BanknoteArrowDown, CreditCard, HandCoins } from "lucide-react";

interface KpiSectionProps {
  kpiData?: IExpenseDashboard["kpis"];
}

export default function KpiSection({
  kpiData,
}: {
  kpiData: KpiSectionProps["kpiData"];
}) {
  return (
    <div className="w-full relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Total Balance */}
        <Card className="w-full max-w-lg mx-auto rounded-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200">
          <CardContent className="flex items-center gap-4">
            {/* Icon */}
            <div className="flex items-center justify-center size-10 rounded-full bg-violet-600 text-white">
              <CreditCard className="size-5" />
            </div>

            {/* Details */}
            <div className="flex flex-col items-start">
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <h3 className="text-xl">$ {kpiData?.total_balance.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>

        {/* Total Income */}
        <Card className="w-full max-w-lg mx-auto rounded-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200">
          <CardContent className="flex items-center gap-4">
            {/* Icon */}
            <div className="flex items-center justify-center size-10 rounded-full bg-emerald-600 text-white">
              <HandCoins className="size-5" />
            </div>

            {/* Details */}
            <div className="flex flex-col items-start">
                <p className="text-sm text-muted-foreground">Total Income</p>
                <h3 className="text-xl">$ {kpiData?.total_income.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>

        {/* Total Expense */}
        <Card className="w-full max-w-lg mx-auto rounded-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200">
          <CardContent className="flex items-center gap-4">
            {/* Icon */}
            <div className="flex items-center justify-center size-10 rounded-full bg-red-600 text-white">
              <BanknoteArrowDown className="size-5" />
            </div>

            {/* Details */}
            <div className="flex flex-col items-start">
                <p className="text-sm text-muted-foreground">Total Expense</p>
                <h3 className="text-xl">$ {kpiData?.total_expense.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
