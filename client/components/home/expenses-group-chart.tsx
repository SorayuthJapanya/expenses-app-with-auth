import { IExpenseDashboard } from "@/types/expenses";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Bar, BarChart, Cell, XAxis } from "recharts";

interface ExpensesGroupProps {
  data?: IExpenseDashboard["expenses_group"];
}

export default function ExpensesGroupChart({ data }: ExpensesGroupProps) {
  const chartData = data?.map((item) => ({
    name: item.item,
    value: item.total_cost,
  }));

  const chartConfig = {
    value: {
      label: "Total Cost",
      color: "#E1BEE7",
    },
  } satisfies ChartConfig;

  return (
    <Card className="w-full mx-auto rounded-me hover:shadow-lg">
      <CardHeader>Last 30 Days Expenses</CardHeader>
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
    </Card>
  );
}
