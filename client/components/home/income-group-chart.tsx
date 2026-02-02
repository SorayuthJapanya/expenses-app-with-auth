"use client";

import { IExpenseDashboard } from "@/types/expenses";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Cell, Pie, PieChart } from "recharts";

interface IncomeGroupChartProps {
  data?: IExpenseDashboard["incomes_group"];
}

const COLORS = [
  "#10b981", // Emerald 500
  "#3b82f6", // Blue 500
  "#f59e0b", // Amber 500
  "#8b5cf6", // Violet 500
  "#ec4899", // Pink 500
  "#06b6d4", // Cyan 500
];

export default function IncomeGroupChart({ data }: IncomeGroupChartProps) {
  const chartData =
    data?.map((item, index) => ({
      name: item.item,
      value: item.total_cost,
      fill: COLORS[index % COLORS.length],
    })) || [];

  const chartConfig = chartData.reduce((acc, item) => {
    acc[item.name] = {
      label: item.name,
      color: item.fill,
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">Last 60 Days Income</CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-72 w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={0} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="-translate-y-2 flex-wrap gap-2"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
