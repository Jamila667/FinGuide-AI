import { deleteIncome } from "@/app/dashboard/actions";
import { Income } from "@prisma/client";

export default function IncomeList({ incomes }: { incomes: Income[] }) {
  if (incomes.length === 0) {
    return <p className="text-slate-500">Hozircha daromadlar kiritilmagan.</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Daromadlar tarixi</h3>
      {incomes.map((inc) => (
        <div key={inc.id} className="flex justify-between items-center p-4 bg-slate-50 rounded border">
          <div>
            <p className="font-semibold text-green-700">+{inc.amount.toLocaleString()} {inc.currency}</p>
            <p className="text-sm font-medium">Oy: {inc.month}</p>
            {inc.description && <p className="text-xs text-slate-500">{inc.description}</p>}
          </div>
          <form action={deleteIncome.bind(null, inc.id)}>
            <button type="submit" className="text-red-500 hover:text-red-700 text-sm">O'chirish</button>
          </form>
        </div>
      ))}
    </div>
  );
}
