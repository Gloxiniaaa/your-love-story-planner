import { motion } from "framer-motion";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BalloonCluster } from "./BalloonSvg";
import FlipClock from "./FlipClock";
import { useCreateWedding, useMyWedding, useUpdateWedding } from "@/api/Wedding/querries";
import type { WeddingInfo } from "@/api/Wedding/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type { WeddingInfo };

const defaultInfo: WeddingInfo = {
  name1: "Minh",
  name2: "Anh",
  date: "15/12/2026",
  location: "Hà Nội",
  tagline: "Cuộc phiêu lưu vĩ đại nhất bắt đầu từ một tiếng 'Dạ'",
};

interface HeroSectionProps {
  info?: WeddingInfo;
  onInfoChange?: (info: WeddingInfo) => void;
  readOnly?: boolean;
}

const HeroSection = ({ info, onInfoChange, readOnly = false }: HeroSectionProps) => {
  const isControlled = !!info;
  const isTokenAvailable = !!localStorage.getItem("access_token");

  const weddingQuery = useMyWedding();
  const createWeddingMutation = useCreateWedding();
  const updateWeddingMutation = useUpdateWedding();

  const apiInfo = weddingQuery.data ?? null;
  const data = info ?? apiInfo ?? defaultInfo;
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<WeddingInfo>(data);
  const navigate = useNavigate();

  const openEdit = () => {
    setForm(data);
    setEditOpen(true);
  };

  const handleSave = () => {
    if (onInfoChange) {
      onInfoChange(form);
      setEditOpen(false);
      return;
    }

    if (!isTokenAvailable) return;

    const hasWedding = !!apiInfo;
    const mutation = hasWedding ? updateWeddingMutation : createWeddingMutation;
    mutation.mutate(form, {
      onSuccess: () => setEditOpen(false),
    });
  };

  const formattedDate = data.date.replace(/\//g, " · ");
  const canEdit = !readOnly && (onInfoChange || isTokenAvailable);
  const isSaving = createWeddingMutation.isPending || updateWeddingMutation.isPending;
  const saveError =
    (createWeddingMutation.error as any)?.message || (updateWeddingMutation.error as any)?.message || "";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden paper-texture px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 opacity-30">
          <BalloonCluster />
        </div>
        <div className="absolute bottom-20 left-10 opacity-20">
          <BalloonCluster />
        </div>
      </div>

      {/* Edit button */}
      {canEdit && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={openEdit}
          className="absolute top-6 right-6 z-20 p-2.5 rounded-xl bg-paper/80 backdrop-blur-sm shadow-card text-muted-foreground hover:text-foreground transition-colors"
          title="Chỉnh sửa thông tin"
        >
          <Pencil size={16} />
        </motion.button>
      )}

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        {/* Handwritten label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-handwritten text-2xl text-cinnabar mb-2"
        >
          Chúng mình sắp cưới!
        </motion.p>

        {/* Couple names */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="font-display text-6xl sm:text-7xl md:text-8xl font-bold text-foreground leading-tight mb-4"
        >
          {data.name1} <span className="text-cinnabar">&</span> {data.name2}
        </motion.h1>

        {/* Date & Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex items-center justify-center gap-4 mb-3"
        >
          <div className="h-px w-16 bg-cinnabar/30" />
          <p className="font-body text-lg text-muted-foreground tracking-widest uppercase">
            {formattedDate}
          </p>
          <div className="h-px w-16 bg-cinnabar/30" />
        </motion.div>

        {data.location && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="font-body text-sm text-muted-foreground mb-6"
          >
            📍 {data.location}
          </motion.p>
        )}

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="font-handwritten text-xl text-muted-foreground mb-8"
        >
          "{data.tagline}"
        </motion.p>

        {/* Flip Clock Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex justify-center mb-10"
        >
          <FlipClock targetDate={data.date} />
        </motion.div>

        {/* CTA */}
        {readOnly ? null : (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3, ease: [0.34, 1.56, 0.64, 1] }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98, y: 2 }}
            onClick={() => navigate("/invitation", { state: { weddingInfo: data } })}
            className="bg-primary text-primary-foreground px-10 py-4 rounded-2xl shadow-button active:shadow-none active:translate-y-[2px] transition-all font-body font-semibold text-lg"
          >
            Gửi Lời Mời 💌
          </motion.button>
        )}

        {/* Floating balloon cluster */}
        <motion.div
          className="absolute -top-8 right-0 sm:right-12"
          animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <BalloonCluster />
        </motion.div>
      </div>

      {/* Polaroid photos */}
      <motion.div
        className="absolute left-4 sm:left-12 top-1/4 hidden md:block"
        initial={{ opacity: 0, rotate: -8, x: -40 }}
        animate={{ opacity: 1, rotate: -6, x: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <div className="bg-paper p-3 pb-10 rounded shadow-card rotate-[-6deg] w-44">
          <div className="w-full h-32 bg-muted rounded-sm flex items-center justify-center">
            <span className="text-4xl">💑</span>
          </div>
          <p className="font-handwritten text-sm text-center mt-2 text-muted-foreground">Ngày đầu tiên</p>
        </div>
      </motion.div>

      <motion.div
        className="absolute right-4 sm:right-16 bottom-1/4 hidden md:block"
        initial={{ opacity: 0, rotate: 5, x: 40 }}
        animate={{ opacity: 1, rotate: 4, x: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="bg-paper p-3 pb-10 rounded shadow-card rotate-[4deg] w-44">
          <div className="w-full h-32 bg-muted rounded-sm flex items-center justify-center">
            <span className="text-4xl">💍</span>
          </div>
          <p className="font-handwritten text-sm text-center mt-2 text-muted-foreground">Lời hứa</p>
        </div>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Chỉnh sửa thông tin</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {!isControlled && weddingQuery.isLoading && (
              <p className="text-sm text-muted-foreground font-body">Đang tải dữ liệu từ máy chủ…</p>
            )}
            {!isControlled && weddingQuery.isError && (
              <p className="text-sm text-destructive font-body">
                Không thể tải dữ liệu cưới. Bạn vẫn có thể chỉnh sửa và lưu lại.
              </p>
            )}
            <div>
              <label className="font-body text-sm text-muted-foreground mb-1 block">Tên cô dâu</label>
              <Input value={form.name1} onChange={(e) => setForm((f) => ({ ...f, name1: e.target.value }))} />
            </div>
            <div>
              <label className="font-body text-sm text-muted-foreground mb-1 block">Tên chú rể</label>
              <Input value={form.name2} onChange={(e) => setForm((f) => ({ ...f, name2: e.target.value }))} />
            </div>
            <div>
              <label className="font-body text-sm text-muted-foreground mb-1 block">Ngày cưới (dd/mm/yyyy)</label>
              <Input value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} placeholder="15/12/2025" />
            </div>
            <div>
              <label className="font-body text-sm text-muted-foreground mb-1 block">Địa điểm</label>
              <Input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="Hà Nội" />
            </div>
            <div>
              <label className="font-body text-sm text-muted-foreground mb-1 block">Slogan</label>
              <Input value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} />
            </div>
            {!isControlled && saveError && (
              <p className="text-sm text-destructive font-body">Lưu thất bại: {saveError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Hủy</Button>
            <Button onClick={handleSave} disabled={!onInfoChange && !isTokenAvailable || isSaving}>
              {isSaving ? "Đang lưu…" : "Lưu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default HeroSection;
