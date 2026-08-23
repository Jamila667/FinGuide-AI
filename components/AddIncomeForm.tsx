import { addIncome } from "@/app/dashboard/actions";

export default function AddIncomeForm() {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200">
      <h2 className="text-xl font-semibold mb-6 text-slate-900">Daromad qo'shish</h2>
      <form action={addIncome} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Miqdor (UZS)</label>
          <input
            type="number"
            name="amount"
            required
            className="block w-full rounded-lg border-slate-200 border p-2.5 text-slate-900 focus:ring-slate-900 focus:border-slate-900"
            placeholder="1000000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Oy</label>
          <input
            type="month"
            name="month"
            required
            className="block w-full rounded-lg border-slate-200 border p-2.5 text-slate-900 focus:ring-slate-900 focus:border-slate-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Izoh (ixtiyoriy)</label>
          <input
            type="text"
            name="description"
            className="block w-full rounded-lg border-slate-200 border p-2.5 text-slate-900 focus:ring-slate-900 focus:border-slate-900"
            placeholder="Oylik maosh, biznes, sovg'a..."
          />
        </div>
        <button
          type="submit"
          className="w-full bg-slate-900 text-white font-medium p-2.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          Qo'shish
        </button>
      </form>
    </div>
  );
}
