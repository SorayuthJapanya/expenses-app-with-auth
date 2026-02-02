"use client"

import { IExpense } from "@/types/expenses";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddIncomeModal from "../modal/add-income-modal";

export default function IncomeOverviewChart({
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
      label: "Total Income",
      color: "#E1BEE7",
    },
  } satisfies ChartConfig;

  return (
    <Card className="w-full rounded-me hover:shadow-lg duration-200">
      <CardHeader className="flex items-center justify-between">
        <div>
          <p>Income Overview</p>
          <CardDescription>
            Track your earning over time and analyze your income trends.
          </CardDescription>
        </div>

        <Button
          variant="outline"
          className="flex items-center gap-2 bg-violet-50 border-violet-300 text-violet-700 hover:bg-violet-200 hover:border-violet-400 hover:text-violet-700 cursor-pointer duration-300 font-medium"
          onClick={() => setIsOpenAddModal(true)}
        >
          <Plus className="size-4" />
          Add Income
        </Button>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-72 w-full"
        >
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              dataKey="value"
              tickLine={false}
              axisLine={false}
              tickCount={5}
              className="font-semibold"
            />

            <ChartTooltip
              cursor={{ fill: "transparent" }}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" radius={8}>
              {chartData?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index % 2 === 0 ? "#7c3aed" : "#c4b5fd"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>

      {isOpenAddModal && (
        <AddIncomeModal onClose={() => setIsOpenAddModal(false)}/>
      )}
    </Card>
  );
}
