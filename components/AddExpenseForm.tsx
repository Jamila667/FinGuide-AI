import { addExpense } from "@/app/dashboard/actions";

export default function AddExpenseForm() {
  const categories = ["Oziq-ovqat", "Transport", "Uy-joy", "Kiyim", "Ko'ngilochar", "Boshqa"];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200">
      <h2 className="text-xl font-semibold mb-6 text-slate-900">Xarajat qo'shish</h2>
      <form action={addExpense} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Miqdor (UZS)</label>
          <input
            type="number"
            name="amount"
            required
            className="block w-full rounded-lg border-slate-200 border p-2.5 text-slate-900 focus:ring-slate-900 focus:border-slate-900"
            placeholder="50000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Kategoriya</label>
          <select
            name="category"
            required
            className="block w-full rounded-lg border-slate-200 border p-2.5 text-slate-900 focus:ring-slate-900 focus:border-slate-900"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Izoh (ixtiyoriy)</label>
          <input
            type="text"
            name="description"
            className="block w-full rounded-lg border-slate-200 border p-2.5 text-slate-900 focus:ring-slate-900 focus:border-slate-900"
            placeholder="Nima uchun xarajat qilindi?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Sana</label>
          <input
            type="date"
            name="date"
            required
            className="block w-full rounded-lg border-slate-200 border p-2.5 text-slate-900 focus:ring-slate-900 focus:border-slate-900"
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
