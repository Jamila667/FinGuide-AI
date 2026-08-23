import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addCreditSimulation, deleteCreditSimulation } from "@/app/dashboard/actions";

export default async function CreditSimulatorPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id: string; email: string } | undefined;

  if (!user || !user.id) return null;

  const simulations = await prisma.creditSimulation.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-light tracking-tight text-slate-900">Kredit Simulyatori</h1>
        <p className="text-slate-500 mt-2">Kredit bo'yicha to'lovlar va foizlarni oldindan hisoblang.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h2 className="text-xl font-semibold mb-6 text-slate-900">Yangi hisob-kitob</h2>
            <form action={addCreditSimulation} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kredit miqdori (UZS)</label>
                <input
                  type="number"
                  name="principal"
                  required
                  min="1"
                  className="block w-full rounded-lg border-slate-200 border p-2.5 text-slate-900 focus:ring-slate-900 focus:border-slate-900"
                  placeholder="50000000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Yillik foiz stavkasi (%)</label>
                <input
                  type="number"
                  step="0.01"
                  name="annualRate"
                  required
                  min="0.01"
                  className="block w-full rounded-lg border-slate-200 border p-2.5 text-slate-900 focus:ring-slate-900 focus:border-slate-900"
                  placeholder="24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Muddat (oy)</label>
                <input
                  type="number"
                  name="termMonths"
                  required
                  min="1"
                  className="block w-full rounded-lg border-slate-200 border p-2.5 text-slate-900 focus:ring-slate-900 focus:border-slate-900"
                  placeholder="36"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-slate-900 text-white font-medium p-2.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Hisoblash
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {simulations.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
              Hozircha kreditlar hisoblanmagan.
            </div>
          ) : (
            simulations.map((sim: { id: string, principal: number, annualRate: number, termMonths: number, monthlyPayment: number, totalInterest: number, totalRepayment: number }) => (
              <div key={sim.id} className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {sim.principal.toLocaleString()} UZS
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                      {sim.annualRate}% yillik, {sim.termMonths} oy muddatga
                    </p>
                  </div>
                  <form action={deleteCreditSimulation.bind(null, sim.id)}>
                    <button type="submit" className="text-sm text-red-500 hover:text-red-700">O'chirish</button>
                  </form>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-500">Oylik to'lov</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {Math.round(sim.monthlyPayment).toLocaleString()} UZS
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-500">Sof ustama (Foiz)</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {Math.round(sim.totalInterest).toLocaleString()} UZS
                    </p>
                  </div>
                </div>
                
                <div className="bg-slate-900 text-white p-4 rounded-lg flex justify-between items-center">
                  <p className="text-sm text-slate-300">Jami qaytariladigan summa</p>
                  <p className="font-bold text-lg">{Math.round(sim.totalRepayment).toLocaleString()} UZS</p>
                </div>

                <p className="text-xs text-slate-400 mt-4 text-center">
                  Eslatma: Ushbu hisob-kitoblar faqat tahminiy. Haqiqiy to'lov miqdori bank komissiyalari va sug'urta tufayli farq qilishi mumkin.
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
