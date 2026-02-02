import { IExpense } from "@/types/expenses";
import { Card, CardContent, CardHeader } from "../ui/card";
import Swal from "sweetalert2";
import { Trash2 } from "lucide-react";
import ExpenseBadge from "../expense-badge";
import { useDeleteExpense } from "@/hooks/expenses.hook";

export default function ExpenseSources({ data }: { data: IExpense[] }) {
  const { mutate: deleteExpense } = useDeleteExpense();

  const handleDeleteExpense = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteExpense(id);
      }
    });
  };

  return (
    <Card className="w-full rounded-md hover:shadow-lg duration-200">
      <CardHeader>Expenses Sources</CardHeader>
      <CardContent className="grid sm:grid-cols-2 gap-4">
        {data?.map((item) => (
          <div
            key={item.expense_id}
            className="group hover:bg-accent rounded-md px-4 p-2"
          >
            <div className="flex items-center justify-between">
              {/* Details */}
              <div className="flex flex-col items-start">
                <h3 className="text-sm font-medium">{item.item}</h3>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>

              {/* badge-trend */}
              <div className="flex items-center gap-2">
                <span
                  className="hidden group-hover:inline-block text-muted-foreground/40 hover:text-red-400"
                  onClick={() => handleDeleteExpense(item.expense_id)}
                >
                  <Trash2 className="size-4" />
                </span>
                <ExpenseBadge cost={item.cost} type={item.type} />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
