import { motion } from "framer-motion";
import { useState } from "react";
import BalloonSvg from "./BalloonSvg";

interface Milestone {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  completed: boolean;
  emoji: string;
}

const initialMilestones: Milestone[] = [
  { id: "1", title: "Lễ Dạm Ngõ", subtitle: "Lễ chạm ngõ — gặp gỡ hai gia đình", date: "01/06/2025", completed: true, emoji: "🏠" },
  { id: "2", title: "Lễ Ăn Hỏi", subtitle: "Lễ đính hôn — trao tráp và sính lễ", date: "01/09/2025", completed: true, emoji: "🎁" },
  { id: "3", title: "Lễ Cưới Nhà Trai", subtitle: "Đám cưới bên nhà trai", date: "14/12/2025", completed: false, emoji: "🎊" },
  { id: "4", title: "Lễ Cưới Nhà Gái", subtitle: "Đám cưới bên nhà gái", date: "15/12/2025", completed: false, emoji: "💒" },
  { id: "5", title: "Lễ Vu Quy", subtitle: "Rước dâu về nhà chồng", date: "15/12/2025", completed: false, emoji: "🎀" },
  { id: "6", title: "Tuần Trăng Mật", subtitle: "Khoảng thời gian cho riêng hai người", date: "20/12/2025", completed: false, emoji: "✈️" },
];

const MilestoneTimeline = () => {
  const [milestones, setMilestones] = useState(initialMilestones);

  const toggleMilestone = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  const completedCount = milestones.filter((m) => m.completed).length;

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

        <div className="relative border-l-2 border-dashed border-cinnabar/30 ml-6 pl-8 space-y-12">
          {milestones.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative cursor-pointer group"
              onClick={() => toggleMilestone(m.id)}
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
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{m.emoji}</span>
                      <h3 className="font-display text-xl font-semibold text-foreground">{m.title}</h3>
                    </div>
                    <p className="font-body text-sm text-muted-foreground mt-1">{m.subtitle}</p>
                  </div>
                  <span className="font-body text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg shrink-0">
                    {m.date}
                  </span>
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
        </div>
      </div>
    </section>
  );
};

export default MilestoneTimeline;
