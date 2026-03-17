import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, Pencil, Trash2, Check, ChevronDown } from "lucide-react";
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
      <div className="max-w-3xl mx-auto">
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
          className="w-full bg-paper rounded-2xl shadow-card p-3 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm mb-4"
        >
          <Plus size={16} />
          <span>Thêm danh mục mới</span>
        </motion.button>

        {/* Categories accordion */}
        <ScrollArea className="h-[500px]">
          <Accordion type="multiple" className="space-y-3">
            {categories.map((cat) => {
              const catEstimate = cat.expenses.reduce((s, e) => s + e.estimateCost, 0);
              const catActual = cat.expenses.reduce((s, e) => s + e.actualCost, 0);

              return (
                <AccordionItem
                  key={cat.id}
                  value={cat.id}
                  className="bg-paper rounded-2xl shadow-card border-0 overflow-hidden"
                >
                  <AccordionTrigger className="px-5 py-4 hover:no-underline">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xl">{cat.emoji}</span>
                      <div className="text-left min-w-0 flex-1">
                        <p className="font-display text-sm font-bold text-foreground truncate">{cat.name}</p>
                        <p className="font-body text-xs text-muted-foreground">
                          {cat.expenses.length} mục • DK: {formatVND(catEstimate)} • TT: {formatVND(catActual)}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-4">
                    {/* Category actions */}
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => setExpDlg({ catId: cat.id, expense: null })}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-body font-semibold hover:bg-primary/20 transition-colors"
                      >
                        <Plus size={14} /> Thêm chi phí
                      </button>
                      <button
                        onClick={() => setCatDlg({ category: cat })}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-body hover:bg-muted/80 transition-colors"
                      >
                        <Pencil size={12} /> Sửa
                      </button>
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-body hover:bg-destructive/20 transition-colors"
                      >
                        <Trash2 size={12} /> Xoá
                      </button>
                    </div>

                    {/* Expense list */}
                    {cat.expenses.length === 0 ? (
                      <p className="font-body text-xs text-muted-foreground text-center py-4">Chưa có chi phí nào</p>
                    ) : (
                      <div className="space-y-2">
                        {cat.expenses.map((exp) => (
                          <div
                            key={exp.id}
                            className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                              exp.paid ? "bg-primary/5" : "bg-muted/30"
                            }`}
                          >
                            <button
                              onClick={() => togglePaid(cat.id, exp.id)}
                              className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                                exp.paid
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "border-muted-foreground/30"
                              }`}
                            >
                              {exp.paid && <Check size={12} />}
                            </button>
                            <div className="flex-1 min-w-0">
                              <p className={`font-body text-sm ${exp.paid ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                {exp.name}
                              </p>
                              <div className="flex gap-3 mt-1">
                                <span className="font-body text-xs text-muted-foreground">
                                  DK: {formatVND(exp.estimateCost)}
                                </span>
                                <span className="font-body text-xs text-cinnabar">
                                  TT: {formatVND(exp.actualCost)}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <button
                                onClick={() => setExpDlg({ catId: cat.id, expense: exp })}
                                className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                onClick={() => deleteExpense(cat.id, exp.id)}
                                className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </ScrollArea>
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
