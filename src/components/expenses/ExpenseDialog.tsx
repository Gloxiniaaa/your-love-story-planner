import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Expense } from "./types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Expense, "id">) => void;
  expense?: Expense | null;
}

const ExpenseDialog = ({ open, onClose, onSave, expense }: Props) => {
  const [name, setName] = useState("");
  const [estimateCost, setEstimateCost] = useState("");
  const [actualCost, setActualCost] = useState("");
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (expense) {
      setName(expense.name);
      setEstimateCost(String(expense.estimateCost));
      setActualCost(String(expense.actualCost));
      setPaid(expense.paid);
    } else {
      setName("");
      setEstimateCost("");
      setActualCost("0");
      setPaid(false);
    }
  }, [expense, open]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      estimateCost: Number(estimateCost) || 0,
      actualCost: Number(actualCost) || 0,
      paid,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-paper">
        <DialogHeader>
          <DialogTitle className="font-display">{expense ? "Sửa chi phí" : "Thêm chi phí"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên chi phí..."
            className="w-full bg-muted/50 rounded-xl px-4 py-2 text-sm font-body outline-none focus:ring-2 focus:ring-primary/20"
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-body text-xs text-muted-foreground mb-1 block">Dự kiến (VNĐ)</label>
              <input
                value={estimateCost}
                onChange={(e) => setEstimateCost(e.target.value.replace(/\D/g, ""))}
                placeholder="0"
                className="w-full bg-muted/50 rounded-xl px-4 py-2 text-sm font-body outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="font-body text-xs text-muted-foreground mb-1 block">Thực tế (VNĐ)</label>
              <input
                value={actualCost}
                onChange={(e) => setActualCost(e.target.value.replace(/\D/g, ""))}
                placeholder="0"
                className="w-full bg-muted/50 rounded-xl px-4 py-2 text-sm font-body outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={paid}
              onChange={(e) => setPaid(e.target.checked)}
              className="w-4 h-4 rounded accent-primary"
            />
            <span className="font-body text-sm">Đã thanh toán</span>
          </label>
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl font-body text-sm font-semibold"
            >
              {expense ? "Cập nhật" : "Thêm"}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-body text-sm text-muted-foreground bg-muted"
            >
              Huỷ
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseDialog;
