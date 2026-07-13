import { Trash2, Utensils } from 'lucide-react';
import { useHealth } from '../context/healthContextCore';

const formatTime = (value) => {
  if (!value) return 'Hari ini';
  try {
    return new Date(value).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'Hari ini';
  }
};

function sumMeals(meals) {
  return meals.reduce((total, meal) => ({
    calories: total.calories + (meal.cal || meal.calories || 0),
    protein: total.protein + (meal.prot || meal.protein || 0),
    carbs: total.carbs + (meal.carbs || 0),
    fat: total.fat + (meal.fat || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
}

export default function FoodDiaryCard({ onAddMeal, compact = false }) {
  const { todayRecord, loggedMeals, removeLoggedMeal } = useHealth();
  const meals = loggedMeals?.length ? loggedMeals : (todayRecord.meals || []);
  const totals = sumMeals(meals);

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-extrabold uppercase text-teal-700">Diary makanan</p>
          <h2 className="mt-1 text-base font-extrabold text-slate-900">
            {meals.length ? `${meals.length} makanan tercatat` : 'Belum ada makanan'}
          </h2>
        </div>
        {onAddMeal && (
          <button type="button" onClick={onAddMeal} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-extrabold text-slate-700">
            Tambah
          </button>
        )}
      </div>

      <div className="mb-3 grid grid-cols-3 gap-2">
        {[
          ['Kalori', Math.round(totals.calories), 'kcal'],
          ['Protein', Math.round(totals.protein), 'g'],
          ['Karbo', Math.round(totals.carbs), 'g'],
        ].map(([label, value, unit]) => (
          <div key={label} className="rounded-xl bg-slate-50 px-3 py-2">
            <p className="text-[9px] font-extrabold uppercase text-slate-400">{label}</p>
            <p className="mt-1 text-sm font-extrabold text-slate-900">{value}<span className="text-[9px] font-bold text-slate-400"> {unit}</span></p>
          </div>
        ))}
      </div>

      {meals.length ? (
        <div className="space-y-2">
          {meals.slice(0, compact ? 3 : 8).map((meal, index) => (
            <div key={meal.id || `${meal.name}-${index}`} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                <Utensils size={17} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-extrabold text-slate-900">{meal.name || 'Makanan tercatat'}</p>
                <p className="mt-0.5 text-[10px] font-bold text-slate-500">
                  {meal.cal || meal.calories || 0} kcal · P:{meal.prot || meal.protein || 0}g · {formatTime(meal.addedAt)}
                </p>
              </div>
              {removeLoggedMeal && (
                <button type="button" onClick={() => removeLoggedMeal(meal.id || index)} aria-label={`Hapus ${meal.name || 'makanan'}`} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-slate-50 p-4 text-center">
          <p className="text-xs font-bold leading-relaxed text-slate-500">
            Makanan dari Meal Planner, Food Scanner, atau catatan cepat akan muncul di sini.
          </p>
        </div>
      )}
    </section>
  );
}
