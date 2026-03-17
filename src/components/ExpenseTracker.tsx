import { motion } from "framer-motion";
import { useState } from "react";
import { Plus } from "lucide-react";

interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
}

const categories = [
  { id: "jewelry", label: "Trang sức", emoji: "💍", color: "bg-cinnabar/10 text-cinnabar" },
  { id: "catering", label: "Tiệc", emoji: "🍽️", color: "bg-gold/10 text-gold" },
  { id: "decor", label: "Trang trí", emoji: "🎊", color: "bg-cinnabar/10 text-cinnabar" },
  { id: "photography", label: "Chụp ảnh", emoji: "📸", color: "bg-gold/10 text-gold" },
  { id: "venue", label: "Địa điểm", emoji: "🏛️", color: "bg-cinnabar/10 text-cinnabar" },
  { id: "other", label: "Khác", emoji: "📋", color: "bg-muted text-foreground" },
];

const initialExpenses: Expense[] = [
  { id: "1", name: "Nhẫn cưới", amount: 25000000, category: "jewelry" },
  { id: "2", name: "Tiệc 50 bàn", amount: 150000000, category: "catering" },
  { id: "3", name: "Hoa tươi", amount: 15000000, category: "decor" },
  { id: "4", name: "Studio chụp ảnh", amount: 20000000, category: "photography" },
];

const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("other");

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const budget = 300000000;
  const pct = Math.min((total / budget) * 100, 100);

  const addExpense = () => {
    if (!name.trim() || !amount) return;
    setExpenses((prev) => [
      ...prev,
      { id: Date.now().toString(), name: name.trim(), amount: Number(amount), category },
    ]);
    setName("");
    setAmount("");
    setShowForm(false);
  };

  const byCat = categories.map((c) => ({
    ...c,
    total: expenses.filter((e) => e.category === c.id).reduce((s, e) => s + e.amount, 0),
  }));

  return (
    <section className="min-h-screen py-20 px-4 paper-texture">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-handwritten text-xl text-cinnabar mb-2">Quản lý ngân sách</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">Chi Phí Đám Cưới</h2>
        </motion.div>

        {/* Jar visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-paper rounded-2xl shadow-card p-8 mb-8 text-center"
        >
          <div className="relative w-32 h-44 mx-auto mb-4">
            {/* Jar body */}
            <div className="absolute bottom-0 w-full h-40 border-2 border-cinnabar/30 rounded-b-3xl rounded-t-lg overflow-hidden bg-paper">
              <motion.div
                className="absolute bottom-0 w-full bg-gradient-to-t from-cinnabar/30 to-cinnabar/10"
                initial={{ height: 0 }}
                whileInView={{ height: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            {/* Jar lid */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-cinnabar/20 rounded-t-lg border-2 border-cinnabar/30 border-b-0" />
          </div>
          <p className="font-display text-3xl font-bold text-foreground">{formatVND(total)}</p>
          <p className="font-body text-sm text-muted-foreground">/ {formatVND(budget)} ngân sách</p>
          <div className="w-full h-2 bg-muted rounded-full mt-4 overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Category breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {byCat
            .filter((c) => c.total > 0)
            .map((c) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`${c.color} rounded-xl p-4 text-center`}
              >
                <span className="text-2xl">{c.emoji}</span>
                <p className="font-body text-xs mt-1">{c.label}</p>
                <p className="font-display text-sm font-semibold mt-1">{formatVND(c.total)}</p>
              </motion.div>
            ))}
        </div>

        {/* Expense list */}
        <div className="bg-paper rounded-2xl shadow-card overflow-hidden mb-4">
          {expenses.map((e, i) => {
            const cat = categories.find((c) => c.id === e.category);
            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 px-5 py-3 border-b border-border/50 last:border-0"
              >
                <span className="text-lg">{cat?.emoji}</span>
                <div className="flex-1">
                  <p className="font-body text-sm text-foreground">{e.name}</p>
                  <p className="font-body text-xs text-muted-foreground">{cat?.label}</p>
                </div>
                <p className="font-body text-sm font-semibold text-foreground">{formatVND(e.amount)}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Add expense */}
        {showForm ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-paper rounded-2xl shadow-card p-5 space-y-3"
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tên chi phí..."
              className="w-full bg-muted/50 rounded-xl px-4 py-2 text-sm font-body outline-none focus:ring-2 focus:ring-primary/20"
            />
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
              placeholder="Số tiền (VNĐ)..."
              className="w-full bg-muted/50 rounded-xl px-4 py-2 text-sm font-body outline-none focus:ring-2 focus:ring-primary/20"
            />
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-body transition-all ${
                    category === c.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={addExpense}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl font-body text-sm font-semibold"
              >
                Thêm
              </motion.button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl font-body text-sm text-muted-foreground bg-muted"
              >
                Huỷ
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setShowForm(true)}
            className="w-full bg-paper rounded-2xl shadow-card p-4 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body"
          >
            <Plus size={18} />
            <span>Thêm chi phí mới</span>
          </motion.button>
        )}
      </div>
    </section>
  );
};

export default ExpenseTracker;
