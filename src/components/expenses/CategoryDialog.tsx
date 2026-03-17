import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; emoji: string }) => void;
  initial?: { name: string; emoji: string } | null;
}

const emojiOptions = ["🏮", "👗", "📸", "🏛️", "💐", "💌", "🎤", "🚗", "🎁", "📋", "💍", "🎊", "🍽️", "✨"];

const CategoryDialog = ({ open, onClose, onSave, initial }: Props) => {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("📋");

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setEmoji(initial.emoji);
    } else {
      setName("");
      setEmoji("📋");
    }
  }, [initial, open]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), emoji });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-paper">
        <DialogHeader>
          <DialogTitle className="font-display">{initial ? "Sửa danh mục" : "Thêm danh mục"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên danh mục..."
            className="w-full bg-muted/50 rounded-xl px-4 py-2 text-sm font-body outline-none focus:ring-2 focus:ring-primary/20"
          />
          <div>
            <label className="font-body text-xs text-muted-foreground mb-1 block">Biểu tượng</label>
            <div className="flex flex-wrap gap-2">
              {emojiOptions.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                    emoji === e ? "bg-primary/20 ring-2 ring-primary" : "bg-muted/50 hover:bg-muted"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl font-body text-sm font-semibold"
            >
              {initial ? "Cập nhật" : "Thêm"}
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

export default CategoryDialog;
