import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, Pencil, Check, ChevronDown } from "lucide-react";
import DeleteButton from "./DeleteButton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Category, Expense, formatVND } from "./expenses/types";
import { seedCategories } from "./expenses/seedData";
import ExpenseDialog from "./expenses/ExpenseDialog";
import CategoryDialog from "./expenses/CategoryDialog";
import ExpensePieChart from "./expenses/ExpensePieChart";

const ExpenseTracker = () => {
  const [categories, setCategories] = useState<Category[]>(seedCategories);

  // Dialogs
  const [expDlg, setExpDlg] = useState<{ catId: string; expense?: Expense | null } | null>(null);
  const [catDlg, setCatDlg] = useState<{ category?: Category | null } | null>(null);
  const [openCards, setOpenCards] = useState<string[]>([]);

  // Totals
  const allExpenses = categories.flatMap((c) => c.expenses);
  const totalEstimate = allExpenses.reduce((s, e) => s + e.estimateCost, 0);
  const totalActual = allExpenses.reduce((s, e) => s + e.actualCost, 0);
  const totalPaid = allExpenses.filter((e) => e.paid).reduce((s, e) => s + e.actualCost, 0);
  const pct = totalEstimate > 0 ? Math.min((totalActual / totalEstimate) * 100, 100) : 0;

  // Category CRUD
  const addCategory = (data: { name: string; emoji: string }) => {
    setCategories((prev) => [
      { id: Date.now().toString(), name: data.name, emoji: data.emoji, expenses: [] },
      ...prev,
    ]);
  };

  const editCategory = (id: string, data: { name: string; emoji: string }) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Expense CRUD
  const addExpense = (catId: string, data: Omit<Expense, "id">) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId
          ? { ...c, expenses: [{ id: Date.now().toString(), ...data }, ...c.expenses] }
          : c
      )
    );
  };

  const editExpense = (catId: string, expId: string, data: Omit<Expense, "id">) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId
          ? { ...c, expenses: c.expenses.map((e) => (e.id === expId ? { ...e, ...data } : e)) }
          : c
      )
    );
  };

  const deleteExpense = (catId: string, expId: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId ? { ...c, expenses: c.expenses.filter((e) => e.id !== expId) } : c
      )
    );
  };

  const togglePaid = (catId: string, expId: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId
          ? { ...c, expenses: c.expenses.map((e) => (e.id === expId ? { ...e, paid: !e.paid } : e)) }
          : c
      )
    );
  };

  return (
    <section className="min-h-screen py-20 px-4 paper-texture">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="font-handwritten text-xl text-cinnabar mb-2">Quản lý ngân sách</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">Chi Phí Đám Cưới</h2>
        </motion.div>

        {/* Summary cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="bg-paper rounded-2xl shadow-card p-4 text-center">
            <p className="font-body text-xs text-muted-foreground">Dự kiến</p>
            <p className="font-display text-lg font-bold text-foreground">{formatVND(totalEstimate)}</p>
          </div>
          <div className="bg-paper rounded-2xl shadow-card p-4 text-center">
            <p className="font-body text-xs text-muted-foreground">Thực tế</p>
            <p className="font-display text-lg font-bold text-cinnabar">{formatVND(totalActual)}</p>
          </div>
          <div className="bg-paper rounded-2xl shadow-card p-4 text-center">
            <p className="font-body text-xs text-muted-foreground">Đã trả</p>
            <p className="font-display text-lg font-bold text-gold">{formatVND(totalPaid)}</p>
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className="bg-paper rounded-2xl shadow-card p-4 mb-6">
          <div className="flex justify-between font-body text-xs text-muted-foreground mb-2">
            <span>Thực tế / Dự kiến</span>
            <span>{pct.toFixed(0)}%</span>
          </div>
          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* Pie chart */}
        <ExpensePieChart categories={categories} />

        {/* Add category button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setCatDlg({ category: null })}
          className="w-full bg-paper rounded-2xl shadow-card p-3 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm mb-6"
        >
          <Plus size={16} />
          <span>Thêm danh mục mới</span>
        </motion.button>

        {/* Categories as cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => {
            const catEstimate = cat.expenses.reduce((s, e) => s + e.estimateCost, 0);
            const catActual = cat.expenses.reduce((s, e) => s + e.actualCost, 0);
            const isOpen = openCards.includes(cat.id);

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: i % 3 === 0 ? -1.5 : i % 3 === 1 ? 1 : -0.5 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (i % 6) * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
                whileHover={{ rotate: 0, scale: 1.02, y: -3 }}
                className="relative bg-paper rounded-2xl shadow-card overflow-hidden"
              >
                {/* Tape */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-5 bg-gold-light/70 rounded-sm rotate-[-1deg]" />

                {/* Card header — always visible */}
                <div className="p-5 pt-6">
                  <span className="text-3xl mb-2 block">{cat.emoji}</span>
                  <h3 className="font-display text-base font-bold text-foreground mb-1 truncate">{cat.name}</h3>
                  <p className="font-body text-xs text-muted-foreground mb-1">
                    {cat.expenses.length} mục
                  </p>
                  <div className="flex gap-3 font-body text-xs">
                    <span className="text-muted-foreground">DK: {formatVND(catEstimate)}</span>
                    <span className="text-cinnabar">TT: {formatVND(catActual)}</span>
                  </div>

                  {/* Toggle & actions */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() =>
                        setOpenCards((prev) =>
                          prev.includes(cat.id) ? prev.filter((id) => id !== cat.id) : [...prev, cat.id]
                        )
                      }
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-body font-semibold hover:bg-primary/20 transition-colors"
                    >
                      <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                      {isOpen ? "Thu gọn" : "Chi tiết"}
                    </button>
                    <button
                      onClick={() => setCatDlg({ category: cat })}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Expandable expense list */}
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-border px-5 pb-4 pt-3"
                  >
                    <button
                      onClick={() => setExpDlg({ catId: cat.id, expense: null })}
                      className="w-full flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-body font-semibold hover:bg-primary/20 transition-colors mb-3"
                    >
                      <Plus size={14} /> Thêm chi phí
                    </button>

                    {cat.expenses.length === 0 ? (
                      <p className="font-body text-xs text-muted-foreground text-center py-3">Chưa có chi phí nào</p>
                    ) : (
                      <ScrollArea className="max-h-[260px]">
                        <div className="space-y-2">
                          {cat.expenses.map((exp) => (
                            <div
                              key={exp.id}
                              className={`flex items-start gap-2 p-2.5 rounded-xl transition-colors ${
                                exp.paid ? "bg-primary/5" : "bg-muted/30"
                              }`}
                            >
                              <button
                                onClick={() => togglePaid(cat.id, exp.id)}
                                className={`mt-0.5 w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                                  exp.paid
                                    ? "bg-primary border-primary text-primary-foreground"
                                    : "border-muted-foreground/30"
                                }`}
                              >
                                {exp.paid && <Check size={10} />}
                              </button>
                              <div className="flex-1 min-w-0">
                                <p className={`font-body text-xs ${exp.paid ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                  {exp.name}
                                </p>
                                <div className="flex gap-2 mt-0.5">
                                  <span className="font-body text-[10px] text-muted-foreground">
                                    DK: {formatVND(exp.estimateCost)}
                                  </span>
                                  <span className="font-body text-[10px] text-cinnabar">
                                    TT: {formatVND(exp.actualCost)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-0.5 shrink-0">
                                <button
                                  onClick={() => setExpDlg({ catId: cat.id, expense: exp })}
                                  className="p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                                >
                                  <Pencil size={11} />
                                </button>
                                <button
                                  onClick={() => deleteExpense(cat.id, exp.id)}
                                  className="p-1 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Dialogs */}
      <ExpenseDialog
        open={!!expDlg}
        onClose={() => setExpDlg(null)}
        expense={expDlg?.expense}
        onSave={(data) => {
          if (!expDlg) return;
          if (expDlg.expense) {
            editExpense(expDlg.catId, expDlg.expense.id, data);
          } else {
            addExpense(expDlg.catId, data);
          }
        }}
      />
      <CategoryDialog
        open={!!catDlg}
        onClose={() => setCatDlg(null)}
        initial={catDlg?.category ? { name: catDlg.category.name, emoji: catDlg.category.emoji } : null}
        onSave={(data) => {
          if (catDlg?.category) {
            editCategory(catDlg.category.id, data);
          } else {
            addCategory(data);
          }
        }}
      />
    </section>
  );
};

export default ExpenseTracker;
