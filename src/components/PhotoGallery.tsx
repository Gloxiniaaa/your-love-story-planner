import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, ZoomIn } from "lucide-react";
import DeleteButton from "./DeleteButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type AspectRatio = "1:1" | "4:3" | "3:4" | "16:9" | "9:16";

interface Photo {
  id: string;
  src: string;
  caption: string;
  rotation: number;
  aspect: AspectRatio;
}

const ASPECT_OPTIONS: { value: AspectRatio; label: string }[] = [
  { value: "1:1", label: "1:1" },
  { value: "4:3", label: "4:3" },
  { value: "3:4", label: "3:4" },
  { value: "16:9", label: "16:9" },
  { value: "9:16", label: "9:16" },
];

const ASPECT_RATIOS: Record<AspectRatio, number> = {
  "1:1":  1 / 1,
  "4:3":  4 / 3,
  "3:4":  3 / 4,
  "16:9": 16 / 9,
  "9:16": 9 / 16,
};

const BULB_COLORS = [
  "hsl(5, 75%, 45%)",
  "hsl(35, 85%, 60%)",
  "hsl(150, 50%, 45%)",
  "hsl(210, 60%, 55%)",
  "hsl(320, 55%, 50%)",
  "hsl(45, 90%, 55%)",
];

const generateRotation = () => (Math.random() - 0.5) * 8;

// Card metrics (px) — must stay in sync with inline styles
const CARD_PADDING  = 12; // p-3
const CARD_PB       = 40; // pb-10 (white area below image)
const CAPTION_H     = 32; // caption line + mt-2
const CARD_HEIGHT   = 256; // fixed for all cards

// Derive card width so the image area respects the aspect ratio exactly
const getCardWidth = (aspect: AspectRatio): number => {
  const imageH = CARD_HEIGHT - CARD_PADDING - CARD_PB - CAPTION_H;
  const imageW = imageH * ASPECT_RATIOS[aspect];
  return Math.round(imageW + CARD_PADDING * 2);
};

const PhotoGallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [caption, setCaption] = useState("");
  const [aspect, setAspect] = useState<AspectRatio>("1:1");
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [viewPhoto, setViewPhoto] = useState<Photo | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewFile(reader.result as string);
      setCaption("");
      setAspect("1:1");
      setEditingPhoto(null);
      setDialogOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSave = () => {
    if (editingPhoto) {
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === editingPhoto.id ? { ...p, caption, aspect } : p
        )
      );
    } else if (previewFile) {
      setPhotos((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          src: previewFile,
          caption,
          aspect,
          rotation: generateRotation(),
        },
      ]);
    }
    setDialogOpen(false);
    setPreviewFile(null);
    setEditingPhoto(null);
  };

  const openEditCaption = (photo: Photo) => {
    setEditingPhoto(photo);
    setCaption(photo.caption);
    setAspect(photo.aspect);
    setPreviewFile(null);
    setDialogOpen(true);
  };

  const deletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const displayPhotos = photos.slice(0, 6);

  return (
    <section className="min-h-screen py-20 px-4 paper-texture">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-handwritten text-xl text-cinnabar mb-2">Khoảnh khắc đáng nhớ</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Ảnh Cưới
          </h2>
          <p className="font-body text-muted-foreground">
            {photos.length} bức ảnh kỷ niệm
          </p>
        </motion.div>

        {/* Lightbulb chain */}
        <div className="relative mb-8">
          <svg className="w-full h-8 overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 40">
            <path
              d="M0,5 Q250,35 500,10 Q750,35 1000,5"
              fill="none"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="2"
              strokeDasharray="6 4"
              opacity="0.3"
            />
          </svg>
          <div className="flex justify-around -mt-3 px-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: i * 0.3 }}
                className="flex flex-col items-center"
              >
                <div className="w-1 h-3 bg-muted-foreground/30 rounded-full" />
                <div
                  className="w-3 h-4 rounded-full"
                  style={{
                    background: BULB_COLORS[i % BULB_COLORS.length],
                    boxShadow: `0 0 8px ${BULB_COLORS[i % BULB_COLORS.length]}80`,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* flex-wrap lets variable-width cards flow naturally */}
        <div className="flex flex-wrap gap-10 justify-center">
          <AnimatePresence>
            {displayPhotos.map((photo, i) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, y: 30, rotate: photo.rotation }}
                animate={{ opacity: 1, y: 0, rotate: photo.rotation }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative group"
              >
                {/* Clip / pin */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
                  <div
                    className="w-2 h-6 rounded-full"
                    style={{ background: BULB_COLORS[i % BULB_COLORS.length] }}
                  />
                  <div
                    className="w-4 h-2 rounded-b-full -mt-1"
                    style={{ background: BULB_COLORS[i % BULB_COLORS.length], opacity: 0.6 }}
                  />
                </div>

                {/* Polaroid card: fixed height, width derived from aspect ratio */}
                <div
                  className="bg-paper rounded shadow-card flex flex-col cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    height: CARD_HEIGHT,
                    width: getCardWidth(photo.aspect),
                    padding: `${CARD_PADDING}px ${CARD_PADDING}px ${CARD_PB}px`,
                  }}
                >
                  <div
                    className="relative flex-1 rounded-sm overflow-hidden bg-muted"
                    onClick={() => setViewPhoto(photo)}
                  >
                    <img
                      src={photo.src}
                      alt={photo.caption}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                      <ZoomIn
                        size={24}
                        className="text-primary-foreground opacity-0 group-hover:opacity-80 transition-opacity drop-shadow"
                      />
                    </div>
                  </div>
                  <p className="font-handwritten text-sm text-center mt-2 text-muted-foreground truncate px-1 shrink-0">
                    {photo.caption || "Chưa có chú thích"}
                  </p>

                  {/* Action buttons */}
                  <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditCaption(photo);
                      }}
                      className="p-1 rounded-lg bg-paper/80 backdrop-blur-sm hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Sửa chú thích"
                    >
                      <Pencil size={12} />
                    </button>
                    <DeleteButton onDelete={() => deletePhoto(photo.id)} size={12} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add button — matches card height */}
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => fileRef.current?.click()}
            className="bg-paper/60 border-2 border-dashed border-muted-foreground/20 rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-cinnabar/40 hover:text-cinnabar transition-colors"
            style={{ height: CARD_HEIGHT, width: getCardWidth("1:1") }}
          >
            <Plus size={28} />
            <span className="font-body text-sm">Thêm ảnh</span>
          </motion.button>
        </div>

        {photos.length > 6 && (
          <p className="text-center font-body text-sm text-muted-foreground mt-8">
            Đang hiển thị 6/{photos.length} ảnh
          </p>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Add / Edit dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">
                {editingPhoto ? "Sửa ảnh" : "Thêm ảnh mới"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              {previewFile && (
                <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted">
                  <img src={previewFile} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              {editingPhoto && !previewFile && (
                <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted">
                  <img src={editingPhoto.src} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <label className="font-body text-sm text-muted-foreground mb-2 block">
                  Tỷ lệ khung hình
                </label>
                <RadioGroup
                  value={aspect}
                  onValueChange={(v) => setAspect(v as AspectRatio)}
                  className="flex flex-wrap gap-3"
                >
                  {ASPECT_OPTIONS.map((opt) => (
                    <div key={opt.value} className="flex items-center gap-1.5">
                      <RadioGroupItem value={opt.value} id={`aspect-${opt.value}`} />
                      <Label htmlFor={`aspect-${opt.value}`} className="font-body text-sm cursor-pointer">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <label className="font-body text-sm text-muted-foreground mb-1 block">
                  Chú thích
                </label>
                <Input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Khoảnh khắc hạnh phúc..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
              <Button onClick={handleSave}>Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Fullscreen view dialog */}
        <Dialog open={!!viewPhoto} onOpenChange={() => setViewPhoto(null)}>
          <DialogContent className="sm:max-w-3xl p-2">
            {viewPhoto && (
              <div className="space-y-2">
                <img
                  src={viewPhoto.src}
                  alt={viewPhoto.caption}
                  className="w-full max-h-[75vh] object-contain rounded-lg"
                />
                {viewPhoto.caption && (
                  <p className="font-handwritten text-lg text-center text-muted-foreground py-2">
                    {viewPhoto.caption}
                  </p>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default PhotoGallery;
