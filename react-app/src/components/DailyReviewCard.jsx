import { useMemo, useState } from 'react';
import { ArrowRight, Check, Clock3, RotateCcw, Sparkles } from 'lucide-react';
import { useHealth } from '../context/healthContextCore';
import { buildAdaptiveTargets, getChecklistAutoComplete } from '../lib/adaptiveTargets';

const REASONS = [
  { id: 'busy', label: 'Sibuk', adjustment: 'Besok AI membuat plan lebih pendek dan fokus ke satu langkah utama.' },
  { id: 'tired', label: 'Capek', adjustment: 'Besok masuk mode recovery ringan agar tubuh tidak dipaksa.' },
  { id: 'forgot', label: 'Lupa', adjustment: 'Besok checklist dibuat lebih jelas dan dimulai dari pagi.' },
  { id: 'food', label: 'Makanan tidak cocok', adjustment: 'Besok Meal Planner prioritaskan opsi lokal yang lebih mudah dicari.' },
  { id: 'mood', label: 'Mood berat', adjustment: 'Besok AI menurunkan target dan memulai dari reset mood singkat.' },
];

function getDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function getTomorrowKey() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getDateKey(tomorrow);
}

function getProgress(target) {
  return Math.min(Math.round((target.value / Math.max(target.target, 1)) * 100), 100);
}

function getTomorrowMode(reasonId, completion, missedCount) {
  if (['tired', 'mood'].includes(reasonId)) return 'minimum';
  if (completion < 40 || missedCount >= 3) return 'minimum';
  if (reasonId === 'busy' || reasonId === 'forgot') return 'short';
  return 'short';
}

function buildImpactCopy({ reason, missedTargets, incompleteActions, tomorrowMode }) {
  const priority = missedTargets[0]?.label || incompleteActions[0]?.title || 'langkah utama';
  const modeLabel = tomorrowMode === 'minimum' ? 'Minimum' : 'Ringkas';

  return {
    title: `Besok mulai dari ${priority}`,
    detail: `${reason.adjustment} Mode besok: ${modeLabel}. Tidak ada target ganda atau hukuman.`,
  };
}

export default function DailyReviewCard() {
  const {
    userProfile,
    todayRecord,
    dailyRecords,
    updateDailyRecord,
  } = useHealth();
  const [selectedReason, setSelectedReason] = useState(todayRecord.dailyReview?.reasonId || '');
  const [saved, setSaved] = useState(Boolean(todayRecord.dailyReview));

  const adaptivePlan = useMemo(() => (
    buildAdaptiveTargets(userProfile, todayRecord, dailyRecords)
  ), [dailyRecords, todayRecord, userProfile]);

  const completedActions = todayRecord.completedActions || [];
  const incompleteActions = adaptivePlan.checklist.filter((action) => (
    !completedActions.includes(action.id) && !getChecklistAutoComplete(action, adaptivePlan, todayRecord)
  ));
  const missedTargets = adaptivePlan.targets.filter((target) => getProgress(target) < 75);
  const completion = Math.round((adaptivePlan.checklist.length - incompleteActions.length) / Math.max(adaptivePlan.checklist.length, 1) * 100);
  const selectedReasonMeta = REASONS.find((reason) => reason.id === selectedReason);
  const hasAnythingToReview = missedTargets.length > 0 || incompleteActions.length > 0;
  const savedReview = todayRecord.dailyReview;

  const saveReview = () => {
    const reason = selectedReasonMeta || REASONS[0];
    const tomorrowMode = getTomorrowMode(reason.id, completion, missedTargets.length + incompleteActions.length);
    const impact = buildImpactCopy({
      reason,
      missedTargets,
      incompleteActions,
      tomorrowMode,
    });

    updateDailyRecord({
      dailyReview: {
        reasonId: reason.id,
        reasonLabel: reason.label,
        missedTargets: missedTargets.map((target) => target.label),
        incompleteActions: incompleteActions.map((action) => action.title),
        completion,
        impact,
        createdAt: new Date().toISOString(),
      },
    });

    updateDailyRecord((current) => ({
      ...current,
      planMode: tomorrowMode,
      tomorrowAdjustment: {
        reasonId: reason.id,
        reasonLabel: reason.label,
        sourceDate: getDateKey(),
        title: impact.title,
        detail: impact.detail,
        carryOver: [
          ...missedTargets.slice(0, 2).map((target) => target.label),
          ...incompleteActions.slice(0, 1).map((action) => action.title),
        ],
        createdAt: new Date().toISOString(),
      },
      planGeneratedAt: new Date().toISOString(),
    }), getTomorrowKey());

    setSaved(true);
  };

  if (!hasAnythingToReview && !savedReview) {
    return (
      <section className="mb-4 rounded-2xl border border-teal-100 bg-teal-50 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700">
            <Check size={19} strokeWidth={3} />
          </span>
          <div>
          <p className="text-[10px] font-extrabold uppercase text-teal-700">Review malam 1 tap</p>
          <h2 className="mt-1 text-sm font-extrabold text-teal-950">Target utama aman</h2>
            <p className="mt-1 text-xs font-bold leading-relaxed text-teal-800">
              Besok tetap normal. AI tidak perlu membawa target tambahan.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          <RotateCcw size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-extrabold uppercase text-teal-700">Review malam 1 tap</p>
          <h2 className="mt-1 text-base font-extrabold text-slate-900">
            {savedReview ? savedReview.impact?.title : 'Apa yang perlu disesuaikan besok?'}
          </h2>
          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
            {savedReview
              ? savedReview.impact?.detail
              : 'Pilih alasan paling dekat. AI mengubah plan besok tanpa menggandakan beban.'}
          </p>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <p className="text-[9px] font-extrabold uppercase text-slate-400">Target kurang</p>
          <p className="mt-1 text-sm font-extrabold text-slate-900">{missedTargets.length}</p>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <p className="text-[9px] font-extrabold uppercase text-slate-400">Task belum</p>
          <p className="mt-1 text-sm font-extrabold text-slate-900">{incompleteActions.length}</p>
        </div>
      </div>

      {!saved && (
        <>
          <p className="mb-2 text-[11px] font-extrabold uppercase text-slate-500">Kenapa hari ini belum pas?</p>
          <div className="mb-3 flex flex-wrap gap-2">
            {REASONS.map((reason) => (
              <button
                key={reason.id}
                type="button"
                onClick={() => setSelectedReason(reason.id)}
                className={`rounded-xl border px-3 py-2 text-[11px] font-extrabold ${selectedReason === reason.id ? 'border-teal-600 bg-teal-50 text-teal-800' : 'border-slate-200 bg-slate-50 text-slate-600'}`}
              >
                {reason.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={saveReview}
            disabled={!selectedReason}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border-0 bg-slate-900 text-xs font-extrabold text-white disabled:opacity-40"
          >
            Atur besok <ArrowRight size={15} />
          </button>
        </>
      )}

      {saved && (
        <div className="rounded-xl bg-teal-50 px-3 py-2">
          <div className="flex items-start gap-2">
            <Sparkles size={15} className="mt-0.5 shrink-0 text-teal-700" />
            <p className="text-[11px] font-bold leading-relaxed text-teal-900">
              Adjustment besok sudah disimpan. Alasan: {savedReview?.reasonLabel || selectedReasonMeta?.label || 'disesuaikan'}.
            </p>
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-slate-400">
        <Clock3 size={12} />
        Review ini memengaruhi plan besok, bukan menghukum hari ini.
      </div>
    </section>
  );
}
