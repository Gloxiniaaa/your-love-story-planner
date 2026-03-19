import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import BalloonSvg from "./BalloonSvg";
import DeleteButton from "./DeleteButton";
import {
  useCreateMilestone,
  useDeleteMilestone,
  useMilestones,
  useToggleMilestone,
  useUpdateMilestone,
} from "@/api/Milestone/queries";
import type { Milestone } from "@/api/Milestone/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const parseDateDMY = (d: string) => {
  const [day, month, year] = d.split("/").map(Number);
  return new Date(year, month - 1, day).getTime();
};

const initialMilestones: Milestone[] = [
  { id: "1", title: "Lễ Dạm Ngõ", subtitle: "Lễ chạm ngõ — gặp gỡ hai gia đình", date: "01/06/2025", completed: true, emoji: "🏠" },
  { id: "2", title: "Lễ Ăn Hỏi", subtitle: "Lễ đính hôn — trao tráp và sính lễ", date: "01/09/2025", completed: true, emoji: "🎁" },
  { id: "3", title: "Lễ Cưới Nhà Trai", subtitle: "Đám cưới bên nhà trai", date: "14/12/2025", completed: false, emoji: "🎊" },
  { id: "4", title: "Lễ Cưới Nhà Gái", subtitle: "Đám cưới bên nhà gái", date: "15/12/2025", completed: false, emoji: "💒" },
  { id: "5", title: "Lễ Vu Quy", subtitle: "Rước dâu về nhà chồng", date: "15/12/2025", completed: false, emoji: "🎀" },
  { id: "6", title: "Tuần Trăng Mật", subtitle: "Khoảng thời gian cho riêng hai người", date: "20/12/2025", completed: false, emoji: "✈️" },
];

interface MilestoneForm {
  title: string;
  subtitle: string;
  date: string;
  emoji: string;
}

const emptyForm: MilestoneForm = { title: "", subtitle: "", date: "", emoji: "🎉" };

const MilestoneTimeline = () => {
  const hasToken = !!localStorage.getItem("access_token");
  const milestonesQuery = useMilestones();
  const createMutation = useCreateMilestone();
  const toggleMutation = useToggleMilestone();
  const updateMutation = useUpdateMilestone();
  const deleteMutation = useDeleteMilestone();

  const [localMilestones, setLocalMilestones] = useState(initialMilestones);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Milestone | null>(null);
  const [form, setForm] = useState<MilestoneForm>(emptyForm);

  const milestones = hasToken ? milestonesQuery.data ?? [] : localMilestones;
  const sorted = [...milestones].sort((a, b) => parseDateDMY(a.date) - parseDateDMY(b.date));

  const toggleMilestone = (id: string) => {
    const m = milestones.find((x) => x.id === id);
    if (!m) return;

    if (!hasToken) {
      setLocalMilestones((prev) =>
        prev.map((x) => (x.id === id ? { ...x, completed: !x.completed } : x))
      );
      return;
    }

    toggleMutation.mutate(id);
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (m: Milestone) => {
    setEditing(m);
    setForm({ title: m.title, subtitle: m.subtitle, date: m.date, emoji: m.emoji });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.date.trim()) return;
    if (editing) {
      if (!hasToken) {
        setLocalMilestones((prev) =>
          prev.map((m) => (m.id === editing.id ? { ...m, ...form } : m))
        );
      } else {
        updateMutation.mutate({ id: editing.id, data: { ...form } });
      }
    } else {
      if (!hasToken) {
        setLocalMilestones((prev) => [
          ...prev,
          { id: Date.now().toString(), ...form, completed: false },
        ]);
      } else {
        createMutation.mutate({ ...form, completed: false });
      }
    }
    setDialogOpen(false);
  };

  const deleteMilestone = (id: string) => {
    if (!hasToken) {
      setLocalMilestones((prev) => prev.filter((m) => m.id !== id));
      return;
    }
    deleteMutation.mutate(id);
  };

  const completedCount = milestones.filter((m) => m.completed).length;
  const saveError =
    (createMutation.error as any)?.message ||
    (toggleMutation.error as any)?.message ||
    (updateMutation.error as any)?.message ||
    (deleteMutation.error as any)?.message ||
    "";

  return (
    <section className="min-h-screen py-20 px-4 paper-texture">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-handwritten text-xl text-cinnabar mb-2">Hành trình của chúng mình</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">Cột Mốc Quan Trọng</h2>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-3 flex-1 max-w-xs bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: `${(completedCount / milestones.length) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              />
            </div>
            <span className="font-body text-sm text-muted-foreground">
              {completedCount}/{milestones.length}
            </span>
          </div>
        </motion.div>

        {/* Add button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={openAdd}
          disabled={hasToken && milestonesQuery.isLoading}
          className="w-full bg-paper rounded-2xl shadow-card p-3 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm mb-8"
        >
          <Plus size={16} />
          <span>Thêm cột mốc mới</span>
        </motion.button>

        {hasToken && milestonesQuery.isLoading && (
          <p className="font-body text-sm text-muted-foreground mb-6 text-center">Đang tải cột mốc…</p>
        )}
        {hasToken && milestonesQuery.isError && (
          <p className="font-body text-sm text-destructive mb-6 text-center">
            Không thể tải cột mốc. Vui lòng thử lại.
          </p>
        )}

        <div className="relative border-l-2 border-dashed border-cinnabar/30 ml-6 pl-8 space-y-12">
          <AnimatePresence mode="popLayout">
            {sorted.map((m, i) => (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative group"
              >
                {/* Node */}
                <div className="absolute -left-[41px] top-1">
                  {m.completed ? (
                    <BalloonSvg size={28} color="hsl(5, 75%, 45%)" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 bg-paper mt-1 ml-1.5" />
                  )}
                </div>

                <motion.div
                  whileHover={{ x: 4 }}
                  className={`bg-paper rounded-xl p-5 shadow-card transition-all ${
                    m.completed ? "border-l-4 border-l-cinnabar" : "opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => toggleMilestone(m.id)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{m.emoji}</span>
                        <h3 className="font-display text-xl font-semibold text-foreground">{m.title}</h3>
                      </div>
                      <p className="font-body text-sm text-muted-foreground mt-1">{m.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <span className="font-body text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                        {m.date}
                      </span>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => openEdit(m)}
                          className="p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                        >
                          <Pencil size={13} />
                        </button>
                        <DeleteButton
                          onDelete={() => deleteMilestone(m.id)}
                          size={13}
                          disabled={deleteMutation.isPending}
                        />
                      </div>
                    </div>
                  </div>
                  {m.completed && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-handwritten text-cinnabar text-sm mt-2"
                    >
                      ✓ Đã hoàn thành!
                    </motion.p>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editing ? "Chỉnh sửa cột mốc" : "Thêm cột mốc mới"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="font-body text-sm text-muted-foreground mb-1 block">Emoji</label>
              <Input
                value={form.emoji}
                onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
                placeholder="🎉"
                className="w-20"
              />
            </div>
            <div>
              <label className="font-body text-sm text-muted-foreground mb-1 block">Tên cột mốc *</label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Nhập tên..."
              />
            </div>
            <div>
              <label className="font-body text-sm text-muted-foreground mb-1 block">Mô tả</label>
              <Input
                value={form.subtitle}
                onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                placeholder="Mô tả ngắn..."
              />
            </div>
            <div>
              <label className="font-body text-sm text-muted-foreground mb-1 block">Ngày (dd/mm/yyyy) *</label>
              <Input
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                placeholder="01/01/2025"
              />
            </div>
            {hasToken && saveError && (
              <p className="text-sm text-destructive font-body">Thao tác thất bại: {saveError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button
              onClick={handleSave}
              disabled={
                !form.title.trim() ||
                !form.date.trim() ||
                createMutation.isPending ||
                updateMutation.isPending
              }
            >
              {createMutation.isPending || updateMutation.isPending ? "Đang lưu…" : editing ? "Lưu" : "Thêm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default MilestoneTimeline;
