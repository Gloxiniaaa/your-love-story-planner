import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type AspectRatio = "1:1" | "4:3" | "3:4" | "16:9" | "9:16";

interface Photo {
  id: string;
  src: string;
  caption: string;
  rotation: number;
  aspect: AspectRatio;
}

const BULB_COLORS = [
  "hsl(5, 75%, 45%)",
  "hsl(35, 85%, 60%)",
  "hsl(150, 50%, 45%)",
  "hsl(210, 60%, 55%)",
  "hsl(320, 55%, 50%)",
  "hsl(45, 90%, 55%)",
];

const ASPECT_MAP: Record<AspectRatio, string> = {
  "1:1": "aspect-square",
  "4:3": "aspect-[4/3]",
  "3:4": "aspect-[3/4]",
  "16:9": "aspect-video",
  "9:16": "aspect-[9/16]",
};

const demoPhotos: Photo[] = [];

interface Props {
  photos?: Photo[];
}

const PhotoGalleryReadOnly = ({ photos = demoPhotos }: Props) => {
  const [viewPhoto, setViewPhoto] = useState<Photo | null>(null);
  const displayPhotos = photos.slice(0, 6);

  if (photos.length === 0) return null;

  return (
    <section className="min-h-[60vh] py-20 px-4 paper-texture">
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

        {/* Photo grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 justify-items-center">
          <AnimatePresence>
            {displayPhotos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 30, rotate: photo.rotation }}
                whileInView={{ opacity: 1, y: 0, rotate: photo.rotation }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative group"
              >
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

                <div
                  className="bg-paper p-3 pb-10 rounded shadow-card w-48 sm:w-56 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  onClick={() => setViewPhoto(photo)}
                >
                  <div className={`relative w-full ${ASPECT_MAP[photo.aspect] ?? "aspect-square"} rounded-sm overflow-hidden bg-muted`}>
                    <img src={photo.src} alt={photo.caption} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                      <ZoomIn size={24} className="text-primary-foreground opacity-0 group-hover:opacity-80 transition-opacity drop-shadow" />
                    </div>
                  </div>
                  <p className="font-handwritten text-sm text-center mt-2 text-muted-foreground truncate px-1">
                    {photo.caption || ""}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <Dialog open={!!viewPhoto} onOpenChange={() => setViewPhoto(null)}>
          <DialogContent className="sm:max-w-3xl p-2">
            {viewPhoto && (
              <div className="space-y-2">
                <img src={viewPhoto.src} alt={viewPhoto.caption} className="w-full max-h-[75vh] object-contain rounded-lg" />
                {viewPhoto.caption && (
                  <p className="font-handwritten text-lg text-center text-muted-foreground py-2">{viewPhoto.caption}</p>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default PhotoGalleryReadOnly;
