import { deleteExpense } from "@/app/dashboard/actions";
import { Expense } from "@prisma/client";

export default function ExpenseList({ expenses }: { expenses: Expense[] }) {
  if (expenses.length === 0) {
    return <p className="text-slate-500">Hozircha xarajatlar kiritilmagan.</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Xarajatlar tarixi</h3>
      {expenses.map((exp) => (
        <div key={exp.id} className="flex justify-between items-center p-4 bg-slate-50 rounded border">
          <div>
            <p className="font-semibold text-red-600">-{exp.amount.toLocaleString()} {exp.currency}</p>
            <p className="text-sm font-medium">{exp.category}</p>
            {exp.description && <p className="text-xs text-slate-500">{exp.description}</p>}
            <p className="text-xs text-slate-400">{new Date(exp.date).toLocaleDateString()}</p>
          </div>
          <form action={deleteExpense.bind(null, exp.id)}>
            <button type="submit" className="text-red-500 hover:text-red-700 text-sm">O'chirish</button>
          </form>
        </div>
      ))}
    </div>
  );
}
