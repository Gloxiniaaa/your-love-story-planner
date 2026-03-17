import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Category, formatVND } from "./types";

const COLORS = [
  "hsl(5, 75%, 45%)",
  "hsl(35, 85%, 60%)",
  "hsl(15, 65%, 55%)",
  "hsl(45, 75%, 50%)",
  "hsl(0, 60%, 40%)",
  "hsl(25, 80%, 55%)",
  "hsl(350, 65%, 50%)",
  "hsl(40, 70%, 45%)",
  "hsl(10, 50%, 35%)",
  "hsl(30, 90%, 65%)",
];

interface Props {
  categories: Category[];
}

const ExpensePieChart = ({ categories }: Props) => {
  const data = categories
    .map((c) => ({
      name: `${c.emoji} ${c.name}`,
      value: c.expenses.reduce((s, e) => s + e.estimateCost, 0),
    }))
    .filter((d) => d.value > 0);

  if (!data.length) return null;

  return (
    <div className="bg-paper rounded-2xl shadow-card p-6 mb-6">
      <h3 className="font-display text-lg font-bold text-foreground mb-4 text-center">Phân bổ ngân sách</h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatVND(value)}
              contentStyle={{
                background: "hsl(40, 40%, 97%)",
                border: "1px solid hsl(5, 75%, 45%, 0.2)",
                borderRadius: "12px",
                fontSize: "12px",
                fontFamily: "Public Sans",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-xs font-body">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="truncate text-muted-foreground">{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpensePieChart;
