import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AnalyticsCharts from "./AnalyticsCharts";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id: string; email: string } | undefined;
  if (!user?.id) redirect("/login");



  const [incomes, expenses] = await Promise.all([
    prisma.income.findMany({
      where: { userId: user.id },
      orderBy: { month: "asc" },
    }),
    prisma.expense.findMany({
      where: { userId: user.id },
      orderBy: { date: "asc" },
    }),
  ]);

  // ── 1. Monthly income vs expense ─────────────────────────────────────────
  const monthlyMap: Record<string, { month: string; income: number; expense: number }> = {};

  for (const inc of incomes) {
    if (!monthlyMap[inc.month]) {
      monthlyMap[inc.month] = { month: inc.month, income: 0, expense: 0 };
    }
    monthlyMap[inc.month].income += inc.amount;
  }
  for (const exp of expenses) {
    const month = new Date(exp.date).toISOString().slice(0, 7); // "YYYY-MM"
    if (!monthlyMap[month]) {
      monthlyMap[month] = { month, income: 0, expense: 0 };
    }
    monthlyMap[month].expense += exp.amount;
  }
  const monthlyData = Object.values(monthlyMap).sort((a, b) =>
    a.month.localeCompare(b.month)
  );

  // ── 2. Expense by category ────────────────────────────────────────────────
  const categoryMap: Record<string, number> = {};
  for (const exp of expenses) {
    categoryMap[exp.category] = (categoryMap[exp.category] ?? 0) + exp.amount;
  }
  const categoryData = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value);

  // ── 3. Summary stats ──────────────────────────────────────────────────────
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const savingsRate =
    totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  // Top spending category
  const topCategory =
    categoryData.length > 0 ? categoryData[0] : null;

  const stats = {
    totalIncome: Math.round(totalIncome),
    totalExpense: Math.round(totalExpense),
    balance: Math.round(totalIncome - totalExpense),
    savingsRate,
    topCategory: topCategory?.name ?? "—",
    topCategoryAmount: topCategory?.value ?? 0,
    totalTransactions: expenses.length,
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-light tracking-tight text-slate-900">Moliyaviy Tahlil</h1>
        <p className="text-slate-500 mt-2">Daromad, xarajat va tejamkorlik ko'rsatkichlaringiz.</p>
      </div>

      <AnalyticsCharts
        monthlyData={monthlyData}
        categoryData={categoryData}
        stats={stats}
      />
    </div>
  );
}
