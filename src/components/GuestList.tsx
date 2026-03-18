import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Users, Search, Pencil, Armchair } from "lucide-react";
import DeleteButton from "./DeleteButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Guest {
  id: string;
  name: string;
  note: string | null;
  seatCount: number;
  confirmed: boolean;
}

type Side = "groom" | "bride";

interface GuestFormData {
  name: string;
  note: string;
  seatCount: number;
}

const emptyForm: GuestFormData = { name: "", note: "", seatCount: 1 };

const GuestList = () => {
  const [groomGuests, setGroomGuests] = useState<Guest[]>([
    { id: "1", name: "Ông Nội", note: null, seatCount: 1, confirmed: true },
    { id: "2", name: "Bà Nội", note: null, seatCount: 1, confirmed: true },
    { id: "3", name: "Chú Ba", note: "Cả gia đình", seatCount: 3, confirmed: false },
  ]);
  const [brideGuests, setBrideGuests] = useState<Guest[]>([
    { id: "1", name: "Ông Ngoại", note: null, seatCount: 1, confirmed: true },
    { id: "2", name: "Bà Ngoại", note: null, seatCount: 1, confirmed: true },
    { id: "3", name: "Dì Hai", note: "Đi cùng chồng", seatCount: 2, confirmed: true },
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSide, setDialogSide] = useState<Side>("groom");
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [form, setForm] = useState<GuestFormData>(emptyForm);

  const setter = (side: Side) => (side === "groom" ? setGroomGuests : setBrideGuests);

  const openAddDialog = (side: Side) => {
    setDialogSide(side);
    setEditingGuest(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (side: Side, guest: Guest) => {
    setDialogSide(side);
    setEditingGuest(guest);
    setForm({ name: guest.name, note: guest.note ?? "", seatCount: guest.seatCount });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    const set = setter(dialogSide);
    if (editingGuest) {
      set((prev) =>
        prev.map((g) =>
          g.id === editingGuest.id
            ? { ...g, name: form.name.trim(), note: form.note.trim() || null, seatCount: Math.max(1, form.seatCount) }
            : g
        )
      );
    } else {
      const guest: Guest = {
        id: Date.now().toString(),
        name: form.name.trim(),
        note: form.note.trim() || null,
        seatCount: Math.max(1, form.seatCount),
        confirmed: false,
      };
      set((prev) => [guest, ...prev]);
    }
    setDialogOpen(false);
  };

  const removeGuest = (side: Side, id: string) => {
    setter(side)((prev) => prev.filter((g) => g.id !== id));
  };

  const toggleConfirm = (side: Side, id: string) => {
    setter(side)((prev) => prev.map((g) => (g.id === id ? { ...g, confirmed: !g.confirmed } : g)));
  };

  const filterGuests = (guests: Guest[]) =>
    searchQuery.trim()
      ? guests.filter((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : guests;

  const totalGuests = groomGuests.length + brideGuests.length;
  const totalConfirmed = groomGuests.filter((g) => g.confirmed).length + brideGuests.filter((g) => g.confirmed).length;
  const totalSeats = groomGuests.reduce((s, g) => s + g.seatCount, 0) + brideGuests.reduce((s, g) => s + g.seatCount, 0);
  const groomSeats = groomGuests.reduce((s, g) => s + g.seatCount, 0);
  const brideSeats = brideGuests.reduce((s, g) => s + g.seatCount, 0);

  return (
    <section className="min-h-screen py-20 px-4 paper-texture">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="font-handwritten text-xl text-cinnabar mb-2">Ai sẽ đến vui cùng?</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">Danh Sách Khách Mời</h2>
        </motion.div>

        {/* Summary Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-6 bg-paper rounded-2xl shadow-card p-5"
        >
          <div className="flex items-center justify-center gap-6 sm:gap-8 flex-wrap">
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-cinnabar">{groomGuests.length}</p>
              <p className="font-body text-xs text-muted-foreground">Nhà Trai</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                <Users size={16} />
              </div>
              <p className="font-display text-3xl font-bold text-foreground">{totalGuests}</p>
              <p className="font-body text-xs text-muted-foreground">{totalConfirmed} đã xác nhận</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-gold">{brideGuests.length}</p>
              <p className="font-body text-xs text-muted-foreground">Nhà Gái</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                <Armchair size={16} />
              </div>
              <p className="font-display text-2xl font-bold text-foreground">{totalSeats}</p>
              <p className="font-body text-xs text-muted-foreground">
                {groomSeats} + {brideSeats} ghế
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search bar */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm khách mời..."
            className="w-full bg-paper rounded-2xl shadow-card pl-10 pr-4 py-3 text-sm font-body outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Guest Lists */}
        <div className="flex flex-col md:flex-row gap-6">
          <GuestCard
            title="Nhà Trai 🤵"
            guests={filterGuests(groomGuests)}
            tint="bg-cinnabar"
            side="groom"
            onAdd={() => openAddDialog("groom")}
            onEdit={(g) => openEditDialog("groom", g)}
            onRemove={(id) => removeGuest("groom", id)}
            onToggle={(id) => toggleConfirm("groom", id)}
          />
          <GuestCard
            title="Nhà Gái 👰"
            guests={filterGuests(brideGuests)}
            tint="bg-gold"
            side="bride"
            onAdd={() => openAddDialog("bride")}
            onEdit={(g) => openEditDialog("bride", g)}
            onRemove={(id) => removeGuest("bride", id)}
            onToggle={(id) => toggleConfirm("bride", id)}
          />
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingGuest ? "Chỉnh sửa khách mời" : "Thêm khách mời"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="font-body text-sm text-muted-foreground mb-1 block">Tên khách mời *</label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Nhập tên..."
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
            </div>
            <div>
              <label className="font-body text-sm text-muted-foreground mb-1 block">Số ghế</label>
              <Input
                type="number"
                min={1}
                value={form.seatCount}
                onChange={(e) => setForm((f) => ({ ...f, seatCount: parseInt(e.target.value) || 1 }))}
              />
            </div>
            <div>
              <label className="font-body text-sm text-muted-foreground mb-1 block">Ghi chú</label>
              <Textarea
                value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                placeholder="Ghi chú thêm..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSave} disabled={!form.name.trim()}>
              {editingGuest ? "Lưu" : "Thêm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

/* ── Guest Card Sub-component ── */

interface GuestCardProps {
  title: string;
  guests: Guest[];
  tint: string;
  side: Side;
  onAdd: () => void;
  onEdit: (guest: Guest) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}

const GuestCard = ({ title, guests, tint, side, onAdd, onEdit, onRemove, onToggle }: GuestCardProps) => {
  const confirmed = guests.filter((g) => g.confirmed).length;
  const seats = guests.reduce((s, g) => s + g.seatCount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex-1 min-w-[280px]"
    >
      <div className="bg-paper rounded-2xl shadow-card overflow-hidden">
        <div className={`px-6 py-4 ${tint} flex items-center justify-between`}>
          <div>
            <h3 className="font-display text-xl font-semibold text-primary-foreground">{title}</h3>
            <p className="font-body text-sm text-primary-foreground/80">
              {confirmed}/{guests.length} xác nhận · {seats} ghế
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onAdd}
            className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground p-2 rounded-xl transition-colors"
          >
            <Plus size={18} />
          </motion.button>
        </div>

        <ScrollArea className="h-[320px]">
          <div className="p-4 space-y-2">
            <AnimatePresence mode="popLayout">
              {guests.map((guest, i) => (
                <motion.div
                  key={guest.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                >
                  <button
                    onClick={() => onToggle(guest.id)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                      guest.confirmed
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-muted-foreground/30"
                    }`}
                  >
                    {guest.confirmed && <span className="text-[10px]">✓</span>}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-foreground truncate">{guest.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-body text-xs text-muted-foreground">{guest.seatCount} ghế</span>
                      {guest.note && (
                        <span className="font-body text-xs text-muted-foreground/70 truncate">· {guest.note}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => onEdit(guest)}
                      className="text-muted-foreground hover:text-foreground transition-colors p-1"
                    >
                      <Pencil size={13} />
                    </button>
                    <DeleteButton onDelete={() => onRemove(guest.id)} size={13} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {guests.length === 0 && (
              <p className="text-center text-sm text-muted-foreground/50 font-body py-8">
                Chưa có khách mời
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  );
};

export default GuestList;
