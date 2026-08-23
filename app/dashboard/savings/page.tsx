import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addSavingsGoal, deleteSavingsGoal } from "@/app/dashboard/actions";
import { calculateSavingsProgress } from "@/utils/finance";

export default async function SavingsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id: string; email: string } | undefined;

  if (!user || !user.id) return null;

  const goals = await prisma.savingsGoal.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-light tracking-tight text-slate-900">Jamg'arma Maqsadlari</h1>
        <p className="text-slate-500 mt-2">Orzularingizga yetishish rejasini tuzing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h2 className="text-xl font-semibold mb-6 text-slate-900">Yangi maqsad</h2>
            <form action={addSavingsGoal} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Maqsad nomi</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="block w-full rounded-lg border-slate-200 border p-2.5 text-slate-900 focus:ring-slate-900 focus:border-slate-900"
                  placeholder="Masalan: Yangi avtomobil"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Maqsad qilingan summa (UZS)</label>
                <input
                  type="number"
                  name="targetAmount"
                  required
                  min="1"
                  className="block w-full rounded-lg border-slate-200 border p-2.5 text-slate-900 focus:ring-slate-900 focus:border-slate-900"
                  placeholder="150000000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Boshlang'ich summa (UZS)</label>
                <input
                  type="number"
                  name="currentAmount"
                  required
                  min="0"
                  className="block w-full rounded-lg border-slate-200 border p-2.5 text-slate-900 focus:ring-slate-900 focus:border-slate-900"
                  defaultValue="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Oylik ajratma (UZS)</label>
                <input
                  type="number"
                  name="monthlyContribution"
                  required
                  min="1"
                  className="block w-full rounded-lg border-slate-200 border p-2.5 text-slate-900 focus:ring-slate-900 focus:border-slate-900"
                  placeholder="5000000"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-slate-900 text-white font-medium p-2.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Saqlash
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {goals.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
              Hozircha maqsadlar kiritilmagan.
            </div>
          ) : (
            goals.map((goal: { id: string, name: string, targetAmount: number, currentAmount: number, monthlyContribution: number }) => {
              const { progressPercentage, monthsLeft, remaining } = calculateSavingsProgress(
                goal.targetAmount,
                goal.currentAmount,
                goal.monthlyContribution
              );

              return (
                <div key={goal.id} className="bg-white p-6 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{goal.name}</h3>
                      <p className="text-slate-500 text-sm mt-1">
                        Jami: {goal.targetAmount.toLocaleString()} UZS
                      </p>
                    </div>
                    <form action={deleteSavingsGoal.bind(null, goal.id)}>
                      <button type="submit" className="text-sm text-red-500 hover:text-red-700">O'chirish</button>
                    </form>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2 text-slate-600">
                      <span>Yig'ildi: {goal.currentAmount.toLocaleString()} UZS</span>
                      <span>{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3">
                      <div 
                        className="bg-slate-900 h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Oylik to'lov</p>
                      <p className="font-semibold text-slate-900">{goal.monthlyContribution.toLocaleString()} UZS</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Kutilayotgan muddat</p>
                      <p className="font-semibold text-slate-900">
                        {remaining <= 0 ? "Maqsadga yetildi!" : `${monthsLeft} oy`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
