import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, X, Users } from "lucide-react";

interface Guest {
  id: string;
  name: string;
  table: string;
  confirmed: boolean;
}

const GuestList = () => {
  const [groomGuests, setGroomGuests] = useState<Guest[]>([
    { id: "1", name: "Ông Nội", table: "Mâm 1", confirmed: true },
    { id: "2", name: "Bà Nội", table: "Mâm 1", confirmed: true },
    { id: "3", name: "Chú Ba", table: "Mâm 2", confirmed: false },
  ]);
  const [brideGuests, setBrideGuests] = useState<Guest[]>([
    { id: "1", name: "Ông Ngoại", table: "Mâm 1", confirmed: true },
    { id: "2", name: "Bà Ngoại", table: "Mâm 1", confirmed: true },
    { id: "3", name: "Dì Hai", table: "Mâm 2", confirmed: true },
  ]);
  const [newGroom, setNewGroom] = useState("");
  const [newBride, setNewBride] = useState("");

  const addGuest = (side: "groom" | "bride") => {
    const name = side === "groom" ? newGroom : newBride;
    if (!name.trim()) return;
    const guest: Guest = {
      id: Date.now().toString(),
      name: name.trim(),
      table: "Chưa xếp",
      confirmed: false,
    };
    if (side === "groom") {
      setGroomGuests((prev) => [...prev, guest]);
      setNewGroom("");
    } else {
      setBrideGuests((prev) => [...prev, guest]);
      setNewBride("");
    }
  };

  const removeGuest = (side: "groom" | "bride", id: string) => {
    if (side === "groom") setGroomGuests((prev) => prev.filter((g) => g.id !== id));
    else setBrideGuests((prev) => prev.filter((g) => g.id !== id));
  };

  const toggleConfirm = (side: "groom" | "bride", id: string) => {
    const setter = side === "groom" ? setGroomGuests : setBrideGuests;
    setter((prev) => prev.map((g) => (g.id === id ? { ...g, confirmed: !g.confirmed } : g)));
  };

  const GuestCard = ({
    title,
    guests,
    tint,
    newName,
    setNewName,
    side,
  }: {
    title: string;
    guests: Guest[];
    tint: string;
    newName: string;
    setNewName: (v: string) => void;
    side: "groom" | "bride";
  }) => {
    const confirmed = guests.filter((g) => g.confirmed).length;
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex-1 min-w-[280px]"
      >
        <div className="bg-paper rounded-2xl shadow-card overflow-hidden">
          <div className={`px-6 py-4 ${tint}`}>
            <h3 className="font-display text-xl font-semibold text-primary-foreground">{title}</h3>
            <p className="font-body text-sm text-primary-foreground/80">
              {confirmed}/{guests.length} đã xác nhận
            </p>
          </div>
          <div className="p-4 space-y-2">
            {guests.map((guest, i) => (
              <motion.div
                key={guest.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
              >
                <button
                  onClick={() => toggleConfirm(side, guest.id)}
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
                  <p className="font-body text-xs text-muted-foreground">{guest.table}</p>
                </div>
                <button
                  onClick={() => removeGuest(side, guest.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
            <div className="flex gap-2 mt-3">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addGuest(side)}
                placeholder="Thêm khách mời..."
                className="flex-1 bg-muted/50 rounded-xl px-4 py-2 text-sm font-body outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addGuest(side)}
                className="bg-primary text-primary-foreground p-2 rounded-xl"
              >
                <Plus size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const totalGuests = groomGuests.length + brideGuests.length;
  const totalConfirmed = groomGuests.filter((g) => g.confirmed).length + brideGuests.filter((g) => g.confirmed).length;

  return (
    <section className="min-h-screen py-20 px-4 paper-texture">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-handwritten text-xl text-cinnabar mb-2">Ai sẽ đến vui cùng?</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">Danh Sách Khách Mời</h2>
          <div className="flex items-center justify-center gap-2 text-muted-foreground font-body">
            <Users size={18} />
            <span>{totalConfirmed}/{totalGuests} đã xác nhận</span>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6">
          <GuestCard
            title="Nhà Trai 🤵"
            guests={groomGuests}
            tint="bg-cinnabar"
            newName={newGroom}
            setNewName={setNewGroom}
            side="groom"
          />
          <GuestCard
            title="Nhà Gái 👰"
            guests={brideGuests}
            tint="bg-gold"
            newName={newBride}
            setNewName={setNewBride}
            side="bride"
          />
        </div>

        {/* Total counter */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 bg-paper rounded-2xl shadow-card p-6 text-center"
        >
          <p className="font-body text-sm text-muted-foreground mb-1">Tổng khách mời</p>
          <div className="flex items-center justify-center gap-8">
            <div>
              <p className="font-display text-2xl font-bold text-cinnabar">{groomGuests.length}</p>
              <p className="font-body text-xs text-muted-foreground">Nhà Trai</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <p className="font-display text-3xl font-bold text-foreground">{totalGuests}</p>
              <p className="font-body text-xs text-muted-foreground">Tổng cộng</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <p className="font-display text-2xl font-bold text-gold">{brideGuests.length}</p>
              <p className="font-body text-xs text-muted-foreground">Nhà Gái</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GuestList;
