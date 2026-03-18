import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FlipUnitProps {
  value: number;
  label: string;
}

const FlipUnit = ({ value, label }: FlipUnitProps) => {
  const display = String(value).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-14 h-16 sm:w-16 sm:h-20">
        {/* Card background */}
        <div className="absolute inset-0 bg-foreground/90 rounded-lg shadow-md" />
        {/* Center line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-foreground/50 z-10" />
        {/* Number */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={value}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ perspective: 200, backfaceVisibility: "hidden" }}
          >
            <span className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground tabular-nums">
              {display}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="font-body text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
};

interface FlipClockProps {
  targetDate: string; // dd/mm/yyyy
}

const parseDMY = (d: string) => {
  const [day, month, year] = d.split("/").map(Number);
  return new Date(year, month - 1, day);
};

const getTimeLeft = (target: Date) => {
  const now = new Date();
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
};

const FlipClock = ({ targetDate }: FlipClockProps) => {
  const target = parseDMY(targetDate);
  const [time, setTime] = useState(getTimeLeft(target));

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft(target)), 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const isPast = target.getTime() <= Date.now();

  if (isPast) {
    return (
      <p className="font-handwritten text-xl text-cinnabar">
        🎉 Ngày trọng đại đã đến!
      </p>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <FlipUnit value={time.days} label="Ngày" />
      <span className="font-display text-2xl text-cinnabar font-bold mt-[-20px]">:</span>
      <FlipUnit value={time.hours} label="Giờ" />
      <span className="font-display text-2xl text-cinnabar font-bold mt-[-20px]">:</span>
      <FlipUnit value={time.minutes} label="Phút" />
      <span className="font-display text-2xl text-cinnabar font-bold mt-[-20px]">:</span>
      <FlipUnit value={time.seconds} label="Giây" />
    </div>
  );
};

export default FlipClock;
