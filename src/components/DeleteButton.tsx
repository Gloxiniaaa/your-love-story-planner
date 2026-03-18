import { useState, useEffect, useRef } from "react";
import { X, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DeleteButtonProps {
  onDelete: () => void;
  size?: number;
  className?: string;
}

const DeleteButton = ({ onDelete, size = 14, className = "" }: DeleteButtonProps) => {
  const [confirming, setConfirming] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (confirming) {
      timeoutRef.current = setTimeout(() => setConfirming(false), 2500);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [confirming]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirming) {
      onDelete();
      setConfirming(false);
    } else {
      setConfirming(true);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-1 rounded-lg transition-all ${
        confirming
          ? "bg-destructive/15 text-destructive scale-110"
          : "hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
      } ${className}`}
      title={confirming ? "Nhấn lần nữa để xóa" : "Xóa"}
    >
      <AnimatePresence mode="wait">
        {confirming ? (
          <motion.div
            key="trash"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Trash2 size={size} />
          </motion.div>
        ) : (
          <motion.div
            key="x"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.15 }}
          >
            <X size={size} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};

export default DeleteButton;
