"use client";

import { IExpense } from "@/types/expenses";
import { useState } from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import AddExpenseModal from "../modal/add-expense-modal";

export default function ExpenseOverviewChart({
  overviewData,
}: {
  overviewData: IExpense[];
}) {
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  if (!overviewData) return null;

  const chartData = overviewData?.map((item) => ({
    name: item.date,
    value: item.cost,
  }));

  const chartConfig = {
    value: {
      label: "Amount",
      color: "#E1BEE7",
    },
  } satisfies ChartConfig;

  return (
    <Card className="w-full rounded-md hover:shadow-lg duration-200">
      <CardHeader className="flex items-center justify-between">
        <div>
          <p>Expense Overview</p>
          <CardDescription>
            Track your spending over time and analyze your expense trends.
          </CardDescription>
        </div>

        <Button
          variant="outline"
          className="flex items-center gap-2 bg-violet-50 border-violet-300 text-violet-700 hover:bg-violet-200 hover:border-violet-400 hover:text-violet-700 cursor-pointer duration-300 font-medium"
          onClick={() => setIsOpenAddModal(true)}
        >
          <Plus className="size-4" />
          Add Expense
        </Button>
      </CardHeader>

      <CardContent className="w-full pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-72 w-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E1BEE7" stopOpacity={1} />
                <stop offset="95%" stopColor="#E1BEE7" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <Area
              dataKey="value"
              type="natural"
              fill="url(#fillValue)"
              fillOpacity={1}
              stroke="#E1BEE7"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      {isOpenAddModal && (
        <AddExpenseModal onClose={() => setIsOpenAddModal(false)} />
      )}
    </Card>
  );
}
