import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AddIncomeForm from "@/components/AddIncomeForm";
import AddExpenseForm from "@/components/AddExpenseForm";
import IncomeList from "@/components/IncomeList";
import ExpenseList from "@/components/ExpenseList";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) redirect("/login");

  // Fetch data
  const incomes = await prisma.income.findMany({ 
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  });
  
  const expenses = await prisma.expense.findMany({ 
    where: { userId: user.id },
    orderBy: { date: 'desc' }
  });

  // Calculate totals
  const totalIncome = incomes.reduce((sum: number, inc: { amount: number }) => sum + inc.amount, 0);
  const totalExpense = expenses.reduce((sum: number, exp: { amount: number }) => sum + exp.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-slate-200 bg-white">
          <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Jami daromad</h3>
          <p className="text-2xl font-semibold text-slate-900">{totalIncome.toLocaleString()} UZS</p>
        </div>
        <div className="p-6 rounded-xl border border-slate-200 bg-white">
          <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Jami xarajat</h3>
          <p className="text-2xl font-semibold text-slate-900">{totalExpense.toLocaleString()} UZS</p>
        </div>
        <div className="p-6 rounded-xl border border-slate-200 bg-white">
          <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Sof qoldiq</h3>
          <p className={`text-2xl font-semibold ${balance >= 0 ? 'text-slate-900' : 'text-red-500'}`}>
            {balance.toLocaleString()} UZS
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <AddIncomeForm />
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <IncomeList incomes={incomes} />
          </div>
        </div>
        <div className="space-y-8">
          <AddExpenseForm />
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <ExpenseList expenses={expenses} />
          </div>
        </div>
      </div>
    </div>
  );
}
