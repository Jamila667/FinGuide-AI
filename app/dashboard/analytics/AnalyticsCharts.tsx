"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type MonthlyData = { month: string; income: number; expense: number };
type CategoryData = { name: string; value: number };
type Stats = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savingsRate: number;
  topCategory: string;
  topCategoryAmount: number;
  totalTransactions: number;
};

const PIE_COLORS = [
  "#0f172a", "#334155", "#475569", "#64748b", "#94a3b8", "#cbd5e1",
];

const formatAmount = (v: number) =>
  v >= 1_000_000
    ? `${(v / 1_000_000).toFixed(1)}M`
    : v >= 1_000
    ? `${(v / 1_000).toFixed(0)}K`
    : `${v}`;

// Custom tooltip for bar chart
const BarTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; fill: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg text-sm">
      <p className="font-semibold text-slate-700 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.fill }} />
          <span className="text-slate-500">{p.name === "income" ? "Daromad" : "Xarajat"}:</span>
          <span className="font-medium text-slate-900">{p.value.toLocaleString()} UZS</span>
        </div>
      ))}
    </div>
  );
};

// Custom tooltip for pie chart
const PieTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg text-sm">
      <p className="font-semibold text-slate-700">{payload[0].name}</p>
      <p className="text-slate-500 mt-1">{payload[0].value.toLocaleString()} UZS</p>
    </div>
  );
};

export default function AnalyticsCharts({
  monthlyData,
  categoryData,
  stats,
}: {
  monthlyData: MonthlyData[];
  categoryData: CategoryData[];
  stats: Stats;
}) {
  const isEmpty = monthlyData.length === 0 && categoryData.length === 0;

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center text-slate-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-14 h-14 mb-4 text-slate-300">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
        <p className="font-medium text-slate-600">Ma'lumot hali kiritilmagan</p>
        <p className="text-sm mt-1">Daromad va xarajatlar kiritilgandan so'ng grafik ko'rinadi.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Summary stat cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Jami daromad" value={`${stats.totalIncome.toLocaleString()} UZS`} />
        <StatCard label="Jami xarajat" value={`${stats.totalExpense.toLocaleString()} UZS`} />
        <StatCard
          label="Sof qoldiq"
          value={`${stats.balance.toLocaleString()} UZS`}
          highlight={stats.balance >= 0 ? "green" : "red"}
        />
        <StatCard
          label="Tejamkorlik darajasi"
          value={`${stats.savingsRate}%`}
          highlight={stats.savingsRate >= 20 ? "green" : stats.savingsRate >= 0 ? "neutral" : "red"}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Eng ko'p xarajat" value={stats.topCategory} sub={`${stats.topCategoryAmount.toLocaleString()} UZS`} />
        <StatCard label="Jami tranzaksiyalar" value={`${stats.totalTransactions} ta`} />
        <StatCard
          label="Oylik o'rtacha xarajat"
          value={
            monthlyData.length > 0
              ? `${Math.round(stats.totalExpense / monthlyData.length).toLocaleString()} UZS`
              : "—"
          }
        />
      </div>

      {/* ── Monthly Bar Chart ── */}
      {monthlyData.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Oylik daromad vs xarajat</h2>
          <p className="text-sm text-slate-500 mb-6">Har oylik moliyaviy ko'rsatkichlar</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatAmount}
                width={48}
              />
              <Tooltip content={<BarTooltip />} cursor={{ fill: "#f8fafc" }} />
              <Legend
                formatter={(v) => (v === "income" ? "Daromad" : "Xarajat")}
                iconType="circle"
                iconSize={8}
              />
              <Bar dataKey="income" fill="#0f172a" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="expense" fill="#cbd5e1" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Category Pie Chart + table ── */}
      {categoryData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Kategoriyalar bo'yicha</h2>
            <p className="text-sm text-slate-500 mb-6">Xarajatlarning ulushi</p>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-slate-600">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Batafsil</h2>
            <p className="text-sm text-slate-500 mb-6">Kategoriyalar ro'yxati</p>
            <div className="space-y-3">
              {(() => {
                const total = categoryData.reduce((s, c) => s + c.value, 0);
                return categoryData.map((cat, idx) => {
                  const pct = total > 0 ? Math.round((cat.value / total) * 100) : 0;
                return (
                  <div key={cat.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700">{cat.name}</span>
                      <span className="text-slate-500">{cat.value.toLocaleString()} UZS <span className="text-slate-400">({pct}%)</span></span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{ width: `${pct}%`, background: PIE_COLORS[idx % PIE_COLORS.length] }}
                      />
                    </div>
                  </div>
                );
                });
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: "green" | "red" | "neutral";
}) {
  const valueColor =
    highlight === "green"
      ? "text-emerald-600"
      : highlight === "red"
      ? "text-red-500"
      : "text-slate-900";

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-xl font-semibold ${valueColor} break-words`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}
