import { IExpenseForm } from "@/types/expenses";
import { useState } from "react";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { ChevronDown, Loader2 } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { useCreateExpense } from "@/hooks/expenses.hook";

export default function AddIncomeForm({ onClose }: { onClose: () => void }) {
  const [addIncomeForm, setAddIncomeForm] = useState<IExpenseForm>({
    item: "",
    cost: 0,
    date: "",
    type: "income",
  });
  const { mutate: addIncome, isPending: isAddIncomePending } =
    useCreateExpense();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddIncomeForm((prev) => ({
      ...prev,
      [name]: name === "cost" ? (value === "" ? 0 : parseFloat(value)) : value,
    }));
  };

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formattedData = {
      ...addIncomeForm,
      date: addIncomeForm.date
        ? format(new Date(addIncomeForm.date), "yyyy-MM-dd")
        : "",
    };

    try {
      addIncome(formattedData);
    } finally {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmitForm}>
      <FieldSet className="w-full">
        <FieldGroup className="gap-10">
          {/* Item */}
          <Field>
            <FieldLabel htmlFor="item">Item</FieldLabel>
            <Input
              type="text"
              id="item"
              name="item"
              onChange={handleInputChange}
              value={addIncomeForm.item}
              placeholder="Enter item name"
              required
            />

            {/* Cost */}
            <Field>
              <FieldLabel htmlFor="cost">Cost</FieldLabel>
              <Input
                type="number"
                id="cost"
                name="cost"
                onChange={handleInputChange}
                value={addIncomeForm.cost}
                required
              />
            </Field>

            {/* Date */}
            <Field className="flex flex-col gap-2">
              <FieldLabel>Date</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!addIncomeForm.date}
                    className="justify-between"
                  >
                    {addIncomeForm.date ? (
                      format(new Date(addIncomeForm.date), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}

                    <ChevronDown />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      addIncomeForm.date
                        ? new Date(addIncomeForm.date)
                        : undefined
                    }
                    onSelect={(date) =>
                      setAddIncomeForm((prev) => ({
                        ...prev,
                        date: date ? date.toISOString() : "",
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </Field>
          </Field>
        </FieldGroup>

        <div>
          <Button
            type="submit"
            className="w-full bg-violet-800 hover:bg-violet-600 text-white duration-200"
          >
            {isAddIncomePending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              "Add Income"
            )}
          </Button>
        </div>
      </FieldSet>
    </form>
  );
}
