import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import AddExpenseForm from "../form/add-expense-form";

export default function AddExpenseModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose}></div>
      <Card className="relative z-50 w-full max-w-md rounded-md">
        <CardHeader className="flex items-center justify-between border-b border-muted-foreground/20">
          <h2 className="text-lg">Add Expense</h2>
          <Button
            variant="outline"
            size="icon"
            onClick={onClose}
            className="rounded-full cursor-pointer"
          >
            <X />
          </Button>
        </CardHeader>
        <CardContent>
          <AddExpenseForm onClose={onClose} />
        </CardContent>
      </Card>
    </div>
  );
}
