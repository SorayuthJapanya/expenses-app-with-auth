import { IExpenseDashboard } from "@/types/expenses";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Cell, Label, Pie, PieChart } from "recharts";

interface FinancialOverviewChartProps {
  data?: IExpenseDashboard["kpis"];
}

export default function FinancialOverviewChart({
  data,
}: FinancialOverviewChartProps) {
  const chartData = [
    {
      label: "total_balance",
      value: data?.total_balance ?? 0,
      fill: "#8E24AA",
    },
    { label: "total_income", value: data?.total_income ?? 0, fill: "#43A047" },
    {
      label: "total_expense",
      value: data?.total_expense ?? 0,
      fill: "#E53935",
    },
  ];

  const chartConfig = {
    total_balance: {
      label: "Total Balance",
      color: "#8E24AA",
    },
    total_income: {
      label: "Total Income",
      color: "#43A047",
    },
    total_expense: {
      label: "Total Expense",
      color: "#E53935",
    },
  } satisfies ChartConfig;

  return (
    <Card className="w-full mx-auto rounded-md hover:shadow-lg duration-200">
      <CardHeader>Financial Overview</CardHeader>
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
              nameKey="label"
              innerRadius={65}
              strokeWidth={5}
              paddingAngle={1}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}

              {/* 2. The Center Label Logic */}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {/* The Value */}
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {data?.total_balance?.toLocaleString()}
                        </tspan>
                        {/* The Label */}
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-xs"
                        >
                          Balance
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            {/* 3. The Legend */}
            <ChartLegend
              content={<ChartLegendContent nameKey="label" />}
              className="-translate-y-2 flex-wrap gap-4"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
