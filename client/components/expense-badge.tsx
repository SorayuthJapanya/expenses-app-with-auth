import { TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "./ui/badge";

interface ExpenseBadgeProps {
  cost: number;
  type: string;
}

export default function ExpenseBadge({ cost, type }: ExpenseBadgeProps) {
  const isExpense = type === "expense";
  return (
    <Badge
      className={
        isExpense
          ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
          : "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
      }
    >
      {isExpense ? `- $${cost.toLocaleString()}` : `+ $${cost.toLocaleString()}`}
      {isExpense ? <TrendingDown /> : <TrendingUp />}
    </Badge>
  );
}
