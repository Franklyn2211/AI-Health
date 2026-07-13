import { ArrowRight, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { useHealth } from '../context/healthContextCore';
import { buildSmartHabitRecommendation } from '../lib/smartHabit';

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function SmartHabitCard({ onOpenPlan }) {
  const {
    userProfile,
    todayRecord,
    dailyRecords,
    healthExperiment,
    startHealthExperiment,
    toggleExperimentToday,
  } = useHealth();

  const recommendation = buildSmartHabitRecommendation({ userProfile, todayRecord, dailyRecords });
  const activeHabit = healthExperiment?.active ? healthExperiment : null;
  const habit = activeHabit || recommendation;
  const completedDays = activeHabit?.completedDays || [];
  const targetDays = activeHabit?.days || recommendation.days;
  const progress = Math.min(Math.round((completedDays.length / Math.max(targetDays, 1)) * 100), 100);
  const doneToday = completedDays.includes(getTodayKey());
  const category = habit.category || (habit.source === 'reviewed-playbook' ? 'Playbook ahli' : 'Smart habit');
  const reviewer = habit.reviewedBy || recommendation.reviewedBy;
  const reviewerRole = habit.reviewerRole || recommendation.reviewerRole;

  const startHabit = () => {
    startHealthExperiment(recommendation);
  };

  return (
    <section className="mb-4 rounded-2xl border border-teal-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <Sparkles size={18} />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase text-teal-700">{activeHabit ? 'Smart habit aktif' : 'Rekomendasi AI'}</p>
            <h2 className="mt-0.5 text-base font-extrabold leading-tight text-slate-900">{habit.title}</h2>
            <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">{habit.description}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-lg bg-slate-50 px-2 py-1 text-[9px] font-extrabold text-slate-500">{category}</span>
      </div>

      <div className="mb-3 rounded-2xl bg-slate-50 p-3">
        <p className="text-[10px] font-extrabold uppercase text-slate-400">Kenapa ini dipilih</p>
        <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-700">{habit.reason || recommendation.reason}</p>
      </div>

      {activeHabit ? (
        <div>
          <div className="mb-2 flex items-center justify-between text-[10px] font-extrabold text-slate-500">
            <span>Progress {completedDays.length}/{targetDays} hari</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <button
            type="button"
            onClick={toggleExperimentToday}
            className={`mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-xs font-extrabold ${doneToday ? 'border-teal-700 bg-teal-700 text-white' : 'border-teal-200 bg-teal-50 text-teal-800'}`}
          >
            {doneToday ? <><Check size={15} /> Selesai hari ini</> : 'Tandai selesai hari ini'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <button type="button" onClick={startHabit} className="flex h-11 items-center justify-center gap-2 rounded-xl border-0 bg-slate-900 text-xs font-extrabold text-white">
            Mulai {recommendation.days} hari <ArrowRight size={15} />
          </button>
          <button type="button" onClick={onOpenPlan} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-[10px] font-extrabold text-slate-700">
            Plan
          </button>
        </div>
      )}

      <div className="mt-3 flex items-center gap-2 rounded-xl bg-teal-50 px-3 py-2 text-[10px] font-bold text-teal-800">
        <ShieldCheck size={14} className="shrink-0" />
        Ditinjau {reviewerRole}: {reviewer}
      </div>
    </section>
  );
}
