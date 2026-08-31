import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ExpenseCategory } from "@/data/finance";

const categories: ExpenseCategory[] = [
  "Software",
  "Contractors",
  "Travel",
  "Media Spend",
  "Office",
  "Production",
  "Professional Services",
];

export function ExpenseFormDialog({
  onCreate,
}: {
  onCreate?: (vendor: string, amount: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [vendor, setVendor] = useState("");
  const [category, setCategory] = useState<string>("");
  const [amount, setAmount] = useState("");

  const reset = () => {
    setVendor("");
    setCategory("");
    setAmount("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" /> New expense
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New expense</DialogTitle>
          <DialogDescription>Log a new expense for approval.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label>Vendor</Label>
            <Input
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              placeholder="e.g. Adobe"
            />
          </div>
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Amount</Label>
            <Input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!vendor || !category || !amount) {
                toast.error("Fill in all fields before submitting.");
                return;
              }
              onCreate?.(vendor, Number(amount));
              toast.success(`Expense submitted for ${vendor}`);
              setOpen(false);
              reset();
            }}
          >
            Submit expense
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
