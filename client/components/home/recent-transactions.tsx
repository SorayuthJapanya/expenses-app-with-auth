import { IExpenseDashboard } from "@/types/expenses";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import ExpenseBadge from "../expense-badge";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function RecentTransactions({
  recent_data,
}: {
  recent_data?: IExpenseDashboard["recent_transactions"];
}) {
  const router = useRouter();

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

  return (
    <Card className="w-full mx-auto rounded-md hover:shadow-lg duration-200">
      <CardHeader className="flex items-center justify-between">
        <h2>Recent Transactions</h2>
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => router.push("/expense")}
        >
          See All
          <ArrowRight className="size-5" />
        </Button>
      </CardHeader>
      <CardContent>
        {recent_data?.map((transaction) => (
          <div
            key={transaction.expense_id}
            className="hover:bg-accent rounded-md px-4 p-2"
          >
            <div className="flex items-center justify-between">
              {/* Details */}
              <div className="flex flex-col items-start">
                <h3 className="text-sm font-medium">{transaction.item}</h3>
                <p className="text-xs text-muted-foreground">
                  {formatDateWithSuffix(new Date(transaction.date))}
                </p>
              </div>

              {/* badge-trend */}
              <ExpenseBadge cost={transaction.cost} type={transaction.type} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
