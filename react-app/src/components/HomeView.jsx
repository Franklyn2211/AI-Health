import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Brain,
  Camera,
  Check,
  ChevronRight,
  Clock3,
  Dumbbell,
  Droplets,
  Flame,
  Moon,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Sun,
  Target,
  Utensils,
  X,
} from 'lucide-react';
import { useHealth } from '../context/healthContextCore';
import QuickLogComposer from './QuickLogComposer';
import ReviewBadge from './ReviewBadge';
import DailyReviewCard from './DailyReviewCard';
import GoalProgressTimeline from './GoalProgressTimeline';
import { analyzeCareEscalation } from '../lib/careRules';
import { buildAdaptiveTargets, getChecklistAutoComplete } from '../lib/adaptiveTargets';
import { getReviewedMethod } from '../lib/reviewedMethods';

const CHECK_IN_OPTIONS = {
  energy: [
    { value: 1, label: 'Rendah' },
    { value: 2, label: 'Cukup' },
    { value: 3, label: 'Baik' },
  ],
  mood: [
    { value: 1, label: 'Berat' },
    { value: 2, label: 'Biasa' },
    { value: 3, label: 'Baik' },
  ],
  sleep: [
    { value: 1, label: 'Kurang' },
    { value: 2, label: 'Cukup' },
    { value: 3, label: 'Nyenyak' },
  ],
};

const ACTION_GROUPS = {
  body: [
    {
      id: 'meal',
      time: '12:30',
      title: 'Makan seimbang',
      detail: 'Pilih protein utama, sayur, dan karbo secukupnya.',
      reason: 'Ini menjaga energi dan membantu target tubuh tanpa membuat hari terasa berat.',
      Icon: Utensils,
      tone: 'bg-orange-50 text-orange-700',
      subView: 'meal-planner',
    },
    {
      id: 'movement',
      time: '17:30',
      title: 'Latihan singkat',
      detail: '10 menit, tanpa alat.',
      reason: 'Cukup pendek untuk dilakukan hari ini, tapi tetap menjaga ritme latihan.',
      Icon: Dumbbell,
      tone: 'bg-emerald-50 text-emerald-700',
      subView: 'fitness-routine',
    },
  ],
  mental: [
    {
      id: 'reset',
      time: '14:00',
      title: 'Jeda mental',
      detail: 'Napas 2 menit atau tulis satu pemicu.',
      reason: 'Langkah pendek ini menurunkan beban mental tanpa meminta banyak input.',
      Icon: Brain,
      tone: 'bg-violet-50 text-violet-700',
      subView: 'mood-tracker',
    },
    {
      id: 'wind-down',
      time: '21:30',
      title: 'Wind-down malam',
      detail: 'Kurangi layar dan buat rutinitas tidur ringan.',
      reason: 'Tidur yang lebih stabil membantu mood dan energi besok.',
      Icon: Moon,
      tone: 'bg-sky-50 text-sky-700',
      subView: 'sleep-tracker',
    },
  ],
  general: [
    {
      id: 'walk',
      time: '16:00',
      title: 'Jalan ringan',
      detail: '10 menit setelah aktivitas utama.',
      reason: 'Gerak kecil membantu tubuh tetap aktif tanpa perlu persiapan.',
      Icon: Sun,
      tone: 'bg-amber-50 text-amber-700',
      subView: 'fitness-routine',
    },
    {
      id: 'check-care',
      time: 'Minggu ini',
      title: 'Tinjau perawatan',
      detail: 'Lihat apakah kamu perlu chat ahli.',
      reason: 'AI bisa membantu rutinitas, tapi pola berulang lebih baik ditinjau profesional.',
      Icon: Stethoscope,
      tone: 'bg-teal-50 text-teal-700',
      tab: 'clinic',
    },
  ],
};

const TARGET_ICONS = {
  activity: Activity,
  brain: Brain,
  droplets: Droplets,
  dumbbell: Dumbbell,
  flame: Flame,
  moon: Moon,
  target: Target,
  utensils: Utensils,
};

function CheckInGroup({ label, value, options, onChange }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-extrabold uppercase text-slate-500">{label}</p>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={[
              'h-10 rounded-xl border text-xs font-bold transition-all active:scale-[0.98]',
              value === option.value
                ? 'border-teal-600 bg-teal-600 text-white'
                : 'border-slate-200 bg-white text-slate-600',
            ].join(' ')}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StatusChip({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 px-2.5 py-2">
      <p className="text-[9px] font-extrabold uppercase text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-extrabold leading-none text-slate-900">{value}<span className="text-[10px] font-bold text-slate-400">/3</span></p>
    </div>
  );
}

function getTargetProgress(target) {
  return Math.min(Math.round((target.value / Math.max(target.target, 1)) * 100), 100);
}

function buildDailyBrief({ adaptivePlan, todayRecord, nextAction }) {
  const targets = adaptivePlan.targets;
  const targetScore = targets.length
    ? Math.round(targets.reduce((sum, target) => sum + Math.min(getTargetProgress(target), 100), 0) / targets.length)
    : 0;
  const readiness = todayRecord.checkIn
    ? Math.round(((todayRecord.checkIn.energy + todayRecord.checkIn.mood + todayRecord.checkIn.sleep) / 9) * 100)
    : 55;
  const score = Math.round((targetScore * 0.65) + (readiness * 0.35));
  const lowReadiness = todayRecord.checkIn?.energy === 1 || todayRecord.checkIn?.sleep === 1 || todayRecord.checkIn?.mood === 1;
  const mealsLogged = todayRecord.meals?.length || 0;
  const proteinTarget = adaptivePlan.targets.find((target) => target.id === 'protein');
  const calorieTarget = adaptivePlan.targets.find((target) => target.id === 'calories');

  let headline = 'Mulai dari langkah paling penting';
  if (adaptivePlan.direction === 'gain') headline = 'Kejar surplus sehat tanpa ribet';
  if (adaptivePlan.direction === 'lose') headline = 'Jaga defisit ringan dan tetap kenyang';
  if (['stress', 'mood', 'burnout', 'sleep'].includes(adaptivePlan.focusLabel)) headline = 'Turunkan beban hari ini';

  const reasons = [
    lowReadiness ? 'Mode dibuat lebih ringan karena readiness rendah.' : adaptivePlan.summary,
    mealsLogged ? `${mealsLogged} makanan sudah masuk diary dan memengaruhi target.` : 'Diary makanan masih kosong, jadi saran makan jadi prioritas.',
    nextAction ? `Aksi utama sekarang: ${nextAction.title}.` : 'Checklist utama sudah selesai, lanjut review singkat.',
  ];

  const focusTargets = [calorieTarget, proteinTarget, adaptivePlan.targets.find((target) => target.id === 'burn')]
    .filter(Boolean);

  return {
    score,
    headline,
    reasons,
    focusTargets,
  };
}

export default function HomeView({ onTabChange, onSubViewChange }) {
  const {
    userProfile,
    dailyRecords,
    todayRecord,
    setDailyCheckIn,
    toggleDailyAction,
    updateDailyRecord,
    addDailyLog,
    incrementWater,
  } = useHealth();
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const [quickLogOpen, setQuickLogOpen] = useState(false);
  const [checkIn, setCheckIn] = useState(todayRecord.checkIn || { energy: 2, mood: 2, sleep: 2 });
  const [mealDone, setMealDone] = useState(todayRecord.mealStatus === 'done' || Boolean(todayRecord.meals?.length));
  const [selectedPlanMode, setSelectedPlanMode] = useState(todayRecord.planMode || 'short');

  const checkInSaved = Boolean(todayRecord.checkIn);
  const completedActions = todayRecord.completedActions || [];
  const planMode = todayRecord.planMode || 'short';
  const firstName = userProfile.fullName && userProfile.fullName !== 'User'
    ? userProfile.fullName.split(' ')[0]
    : 'Jason';
  const adaptivePlan = useMemo(() => (
    buildAdaptiveTargets(userProfile, todayRecord, dailyRecords)
  ), [dailyRecords, todayRecord, userProfile]);

  const actions = useMemo(() => {
    const adaptiveActions = adaptivePlan.checklist.map((action) => ({
      ...action,
      time: action.id.includes('protein') || action.id.includes('meal') ? 'Makan ini' : 'Hari ini',
      reason: action.detail,
      Icon: TARGET_ICONS[action.icon] || Sparkles,
    }));
    if (adaptiveActions.length) return adaptiveActions;

    const selected = [];
    if (userProfile.goals.includes('body-goals')) selected.push(...ACTION_GROUPS.body);
    if (userProfile.goals.includes('mental-health')) selected.push(...ACTION_GROUPS.mental);
    if (userProfile.goals.includes('immune-booster')) selected.push(...ACTION_GROUPS.general);
    if (selected.length === 0) selected.push(ACTION_GROUPS.general[0], ACTION_GROUPS.body[0]);

    let adjusted = selected.slice(0, 3);
    if (checkInSaved && (checkIn.energy === 1 || checkIn.sleep === 1)) {
      adjusted = adjusted.map((action) => (
        action.id === 'movement'
          ? {
              ...action,
              title: 'Gerak ringan',
              detail: 'Mobilitas lembut selama 8 menit.',
              reason: 'Rencana dibuat lebih ringan karena energi atau tidurmu rendah.',
            }
          : action
      ));
    }

    if (planMode === 'minimum') {
      const easiest = adjusted.find((action) => ['reset', 'walk', 'meal'].includes(action.id)) || adjusted[0];
      return easiest ? [{ ...easiest, time: 'Kapan saja', detail: easiest.id === 'meal' ? 'Pilih satu makanan sederhana dan seimbang.' : 'Cukup 3 menit untuk menjaga ritme.' }] : [];
    }

    if (planMode === 'short') return adjusted.slice(0, 2);
    return adjusted;
  }, [adaptivePlan.checklist, checkIn, checkInSaved, planMode, userProfile.goals]);

  const isActionDone = (action) => (
    completedActions.includes(action.id) || getChecklistAutoComplete(action, adaptivePlan, todayRecord)
  );
  const nextAction = actions.find((action) => !isActionDone(action));
  const completedCount = actions.filter((action) => isActionDone(action)).length;
  const NextActionIcon = nextAction?.Icon;
  const nextActionReview = nextAction ? getReviewedMethod(nextAction.methodId || nextAction.id) : null;
  const dailyBrief = buildDailyBrief({ adaptivePlan, todayRecord, nextAction });

  const escalation = analyzeCareEscalation(dailyRecords);
  const supportStyle = {
    urgent: {
      Icon: ShieldAlert,
      tone: 'border-rose-200 bg-rose-50 text-rose-800',
      button: 'bg-rose-700 text-white',
    },
    review: {
      Icon: Stethoscope,
      tone: 'border-amber-200 bg-amber-50 text-amber-900',
      button: 'bg-slate-900 text-white',
    },
    'self-care': {
      Icon: ShieldCheck,
      tone: 'border-teal-100 bg-white text-slate-900',
      button: 'bg-slate-900 text-white',
    },
  }[escalation.level];
  const support = { ...escalation, ...supportStyle };
  const SupportIcon = support.Icon;

  const saveCheckIn = () => {
    setDailyCheckIn(checkIn);
    updateDailyRecord({
      mealStatus: mealDone ? 'done' : 'not-yet',
      planMode: selectedPlanMode,
      skippedToday: false,
      lowEffortSignal: '10-second-check-in',
    });
    addDailyLog('quick-log', {
      label: `10 detik: energi ${checkIn.energy}/3, mood ${checkIn.mood}/3, tidur ${checkIn.sleep}/3, makan ${mealDone ? 'sudah' : 'belum'}`,
    });
    setCheckInOpen(false);
  };

  const openQuickSubView = (subView) => {
    setQuickLogOpen(false);
    onSubViewChange(subView);
  };

  const openAction = (action) => {
    if (!action) return;
    if (action.id === 'hydration-target') {
      incrementWater();
      return;
    }
    if (action.subView) onSubViewChange(action.subView);
    if (action.tab) onTabChange(action.tab);
  };

  const openSupport = () => {
    onTabChange(support.target);
  };

  return (
    <div className="screen-scroll h-full overflow-y-auto bg-[#f4f6f3] px-5 pb-28 pt-5">
      <header className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] font-extrabold uppercase text-teal-700">Hari ini</p>
          <h1 className="text-[25px] font-extrabold leading-tight text-slate-900">Halo, {firstName}</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">Cukup mulai dari langkah paling penting.</p>
        </div>
        <button
          type="button"
          onClick={() => onTabChange('profile')}
          aria-label="Buka profil"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-0 bg-slate-900 text-sm font-extrabold text-white"
        >
          {firstName.substring(0, 2).toUpperCase()}
        </button>
      </header>

      {todayRecord.tomorrowAdjustment && (
        <section className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-700">
              <RotateCcw size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-extrabold uppercase text-amber-700">Adjustment dari kemarin</p>
              <h2 className="mt-1 text-sm font-extrabold text-amber-950">{todayRecord.tomorrowAdjustment.title}</h2>
              <p className="mt-1 text-xs font-bold leading-relaxed text-amber-900">{todayRecord.tomorrowAdjustment.detail}</p>
            </div>
          </div>
        </section>
      )}

      <section className="mb-4 overflow-hidden rounded-2xl bg-slate-900 text-white shadow-sm">
        <div className="p-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase text-teal-300">AI daily brief</p>
              <h2 className="mt-1 text-lg font-extrabold leading-tight">{dailyBrief.headline}</h2>
              <p className="mt-1 text-xs font-medium leading-relaxed text-slate-300">{adaptivePlan.focusLabel}</p>
            </div>
            <div className="shrink-0 rounded-2xl bg-white px-3 py-2 text-center text-slate-950">
              <p className="text-[9px] font-extrabold uppercase text-slate-500">Score</p>
              <p className="text-xl font-extrabold leading-none">{dailyBrief.score}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            {dailyBrief.reasons.slice(0, 2).map((reason) => (
              <div key={reason} className="flex gap-2 rounded-xl bg-white/10 px-3 py-2">
                <Sparkles size={13} className="mt-0.5 shrink-0 text-teal-300" />
                <p className="text-[11px] font-bold leading-relaxed text-slate-200">{reason}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-px border-t border-white/10 bg-white/10">
          {dailyBrief.focusTargets.map((target) => {
            const Icon = TARGET_ICONS[target.icon] || Target;
            const progress = getTargetProgress(target);
            return (
              <button key={target.id} type="button" onClick={() => onTabChange('plan')} className="bg-slate-900 px-3 py-3 text-left text-white">
                <div className="mb-1 flex items-center justify-between">
                  <Icon size={14} className="text-teal-300" />
                  <span className="text-[9px] font-extrabold text-slate-400">{progress}%</span>
                </div>
                <p className="text-[9px] font-extrabold uppercase text-slate-400">{target.label}</p>
                <p className="mt-0.5 text-xs font-extrabold">{target.value}<span className="text-[9px] text-slate-400">/{target.target}</span></p>
              </button>
            );
          })}
        </div>
      </section>

      <section className={`mb-4 overflow-hidden rounded-2xl shadow-sm ${checkInSaved ? 'border border-teal-100 bg-white' : 'bg-teal-700 text-white'}`}>
        <button
          type="button"
          onClick={() => setCheckInOpen((open) => !open)}
          className={`flex w-full items-center gap-3 border-0 bg-transparent p-4 text-left ${checkInSaved ? 'text-slate-900' : 'text-white'}`}
        >
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${checkInSaved ? 'bg-teal-50 text-teal-700' : 'bg-white/15'}`}>
            {checkInSaved ? <Check size={20} strokeWidth={3} /> : <Sparkles size={20} />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-extrabold">{checkInSaved ? 'Input kecil sudah masuk' : 'Pilih: input cepat atau mode mager'}</span>
            <span className={`mt-0.5 block text-xs font-medium ${checkInSaved ? 'text-slate-500' : 'text-teal-50'}`}>
              {checkInSaved ? `${selectedPlanMode === 'minimum' ? 'Mode mager' : 'Mode normal'} aktif.` : '3 tap saja, atau pilih plan ringan.'}
            </span>
          </span>
          <ChevronRight size={18} className={checkInOpen ? 'rotate-90 transition-transform' : 'transition-transform'} />
        </button>

        {checkInSaved && !checkInOpen && (
          <div className="border-t border-slate-100 px-4 pb-4 pt-3">
            <div className="grid grid-cols-3 gap-2">
              <StatusChip label="Energi" value={todayRecord.checkIn.energy} />
              <StatusChip label="Mood" value={todayRecord.checkIn.mood} />
              <StatusChip label="Tidur" value={todayRecord.checkIn.sleep} />
            </div>
            <div className="mt-2 flex gap-2">
              <span className="rounded-lg bg-orange-50 px-2.5 py-1.5 text-[10px] font-extrabold text-orange-700">
                Makan {mealDone ? 'sudah' : 'belum'}
              </span>
              <span className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[10px] font-extrabold text-slate-600">
                {selectedPlanMode === 'minimum' ? 'Mode mager' : 'Mode normal'}
              </span>
            </div>
          </div>
        )}

        {checkInOpen && (
          <div className="space-y-4 border-t border-slate-100 bg-white p-4 text-slate-900">
            <CheckInGroup label="Energi" value={checkIn.energy} options={CHECK_IN_OPTIONS.energy} onChange={(value) => setCheckIn({ ...checkIn, energy: value })} />
            <CheckInGroup label="Suasana hati" value={checkIn.mood} options={CHECK_IN_OPTIONS.mood} onChange={(value) => setCheckIn({ ...checkIn, mood: value })} />
            <CheckInGroup label="Tidur" value={checkIn.sleep} options={CHECK_IN_OPTIONS.sleep} onChange={(value) => setCheckIn({ ...checkIn, sleep: value })} />
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setMealDone(false)} className={`h-10 rounded-xl border text-xs font-bold ${!mealDone ? 'border-orange-500 bg-orange-50 text-orange-800' : 'border-slate-200 bg-white text-slate-600'}`}>
                Belum makan
              </button>
              <button type="button" onClick={() => setMealDone(true)} className={`h-10 rounded-xl border text-xs font-bold ${mealDone ? 'border-orange-500 bg-orange-50 text-orange-800' : 'border-slate-200 bg-white text-slate-600'}`}>
                Sudah makan
              </button>
            </div>
            <div>
              <p className="mb-2 text-[11px] font-extrabold uppercase text-slate-500">Mode plan</p>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setSelectedPlanMode('minimum')} className={`h-10 rounded-xl border text-xs font-bold ${selectedPlanMode === 'minimum' ? 'border-teal-600 bg-teal-50 text-teal-800' : 'border-slate-200 bg-white text-slate-600'}`}>
                  Mager
                </button>
                <button type="button" onClick={() => setSelectedPlanMode('short')} className={`h-10 rounded-xl border text-xs font-bold ${selectedPlanMode !== 'minimum' ? 'border-teal-600 bg-teal-50 text-teal-800' : 'border-slate-200 bg-white text-slate-600'}`}>
                  Normal
                </button>
              </div>
            </div>
            <button type="button" onClick={saveCheckIn} className="h-11 w-full rounded-xl border-0 bg-teal-600 text-sm font-extrabold text-white">
              Sesuaikan hari ini
            </button>
          </div>
        )}
      </section>

      <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase text-slate-500">Langkah utama hari ini</p>
            <h2 className="mt-0.5 text-base font-extrabold text-slate-900">{nextAction ? nextAction.title : 'Rencana utama selesai'}</h2>
          </div>
          <span className="rounded-lg bg-teal-50 px-2 py-1 text-[10px] font-extrabold text-teal-700">{completedCount}/{actions.length}</span>
        </div>

        {nextAction ? (
          <div className="rounded-2xl bg-slate-50 p-3.5">
            <div className="flex items-start gap-3">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${nextAction.tone}`}>
                {NextActionIcon && <NextActionIcon size={21} />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                  <Clock3 size={11} />
                  {nextAction.time}
                </div>
                <p className="text-sm font-extrabold leading-tight text-slate-900">{nextAction.title}</p>
                <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">{nextAction.detail}</p>
                <div className="mt-2">
                  <ReviewBadge method={nextActionReview} compact />
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-[1fr_auto_auto] gap-2">
              <button type="button" onClick={() => openAction(nextAction)} className="flex h-11 items-center justify-center gap-2 rounded-xl border-0 bg-slate-900 text-xs font-extrabold text-white">
                Mulai <ArrowRight size={15} />
              </button>
              <button type="button" onClick={() => setWhyOpen(true)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-[10px] font-extrabold text-slate-700">
                Kenapa?
              </button>
              <button type="button" onClick={() => toggleDailyAction(nextAction.id)} aria-label={`Selesaikan ${nextAction.title}`} className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900">
                <Check size={18} strokeWidth={3} />
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-teal-50 p-3.5">
            <p className="text-sm font-extrabold text-teal-950">Bagus, tugas utama selesai.</p>
            <p className="mt-1 text-xs font-medium leading-relaxed text-teal-800">Lanjut ringan saja, atau buka Plan untuk strategi lengkap.</p>
            <button type="button" onClick={() => onTabChange('plan')} className="mt-3 h-11 w-full rounded-xl border-0 bg-slate-900 text-xs font-extrabold text-white">
              Buka Plan
            </button>
          </div>
        )}
      </section>

      <section className="mb-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[11px] font-extrabold uppercase text-slate-500">Catat cepat</h2>
          <button type="button" onClick={() => setQuickLogOpen(true)} className="flex items-center gap-1 border-0 bg-transparent text-[11px] font-extrabold text-teal-700">
            Semua <ArrowRight size={13} />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <button type="button" onClick={() => onSubViewChange('food-scanner')} className="flex h-[78px] flex-col items-center justify-center gap-2 rounded-2xl border border-orange-100 bg-orange-50 text-xs font-extrabold text-orange-700">
            <Camera size={20} />
            Scan
          </button>
          <button type="button" onClick={() => onSubViewChange('meal-planner')} className="flex h-[78px] flex-col items-center justify-center gap-2 rounded-2xl border border-amber-100 bg-amber-50 text-xs font-extrabold text-amber-700">
            <Utensils size={20} />
            Plan
          </button>
          <button type="button" onClick={() => onSubViewChange('mood-tracker')} className="flex h-[78px] flex-col items-center justify-center gap-2 rounded-2xl border border-violet-100 bg-violet-50 text-xs font-extrabold text-violet-700">
            <Brain size={20} />
            Mood
          </button>
          <button type="button" onClick={() => onSubViewChange('sleep-tracker')} className="flex h-[78px] flex-col items-center justify-center gap-2 rounded-2xl border border-sky-100 bg-sky-50 text-xs font-extrabold text-sky-700">
            <Moon size={20} />
            Tidur
          </button>
        </div>
      </section>

      {quickLogOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-900/35 px-4 pb-4 backdrop-blur-sm">
          <section className="w-full rounded-[28px] bg-[#f7f8f5] p-4 shadow-2xl">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold uppercase text-teal-700">Catat semua</p>
                <h2 className="mt-0.5 text-lg font-extrabold text-slate-900">Apa yang mau dicatat?</h2>
                <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">Pilih shortcut, atau tulis satu kalimat.</p>
              </div>
              <button type="button" onClick={() => setQuickLogOpen(false)} aria-label="Tutup catat semua" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600">
                <X size={17} />
              </button>
            </div>

            <QuickLogComposer />

            <div className="grid grid-cols-3 gap-2">
              <button type="button" onClick={incrementWater} className="flex h-[66px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-sky-100 bg-sky-50 text-[11px] font-extrabold text-sky-700">
                <Droplets size={19} />
                Air
              </button>
              <button type="button" onClick={() => openQuickSubView('food-scanner')} className="flex h-[66px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-orange-100 bg-orange-50 text-[11px] font-extrabold text-orange-700">
                <Camera size={19} />
                Scan makan
              </button>
              <button type="button" onClick={() => openQuickSubView('meal-planner')} className="flex h-[66px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-amber-100 bg-amber-50 text-[11px] font-extrabold text-amber-700">
                <Utensils size={19} />
                Meal plan
              </button>
              <button type="button" onClick={() => openQuickSubView('mood-tracker')} className="flex h-[66px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-violet-100 bg-violet-50 text-[11px] font-extrabold text-violet-700">
                <Brain size={19} />
                Mood
              </button>
              <button type="button" onClick={() => openQuickSubView('sleep-tracker')} className="flex h-[66px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-sky-100 bg-sky-50 text-[11px] font-extrabold text-sky-700">
                <Moon size={19} />
                Tidur
              </button>
              <button type="button" onClick={() => {
                addDailyLog('symptom', { label: 'Gejala ringan dicatat' });
                setQuickLogOpen(false);
              }} className="flex h-[66px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-rose-100 bg-rose-50 text-[11px] font-extrabold text-rose-700">
                <ShieldAlert size={19} />
                Gejala
              </button>
            </div>
          </section>
        </div>
      )}

      <GoalProgressTimeline onOpenPlan={() => onTabChange('plan')} compact />

      <DailyReviewCard />

      <section className={`mb-4 rounded-2xl border p-4 shadow-sm ${support.tone}`}>
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/70">
            <SupportIcon size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-sm font-extrabold">{support.title}</h2>
              <span className="shrink-0 rounded-lg bg-white/70 px-2 py-1 text-[9px] font-extrabold">{support.label}</span>
            </div>
            <p className="mt-1 text-xs font-medium leading-relaxed opacity-80">{support.detail}</p>
            {support.recommendedExpert && (
              <p className="mt-2 rounded-xl bg-white/70 px-3 py-2 text-[11px] font-bold leading-relaxed">
                Rekomendasi: {support.recommendedExpert}
              </p>
            )}
            {support.reasons?.length > 0 && support.level !== 'self-care' && (
              <div className="mt-2 space-y-1">
                {support.reasons.slice(0, 2).map((reason) => (
                  <p key={reason} className="text-[10px] font-semibold leading-relaxed opacity-75">- {reason}</p>
                ))}
              </div>
            )}
            <button type="button" onClick={openSupport} className={`mt-3 h-10 w-full rounded-xl border-0 text-xs font-extrabold ${support.button}`}>
              {support.action}
            </button>
          </div>
        </div>
      </section>

      {whyOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/45 p-3 backdrop-blur-sm">
          <section className="w-full rounded-3xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Sparkles size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-extrabold uppercase text-teal-700">Kenapa ini?</p>
                <h2 className="mt-1 text-lg font-extrabold text-slate-900">{nextAction?.title || 'Rencana hari ini'}</h2>
              </div>
            </div>

            <div className="space-y-2">
              {[
                checkInSaved ? `Kondisi: energi ${todayRecord.checkIn.energy}/3, mood ${todayRecord.checkIn.mood}/3, tidur ${todayRecord.checkIn.sleep}/3.` : 'Belum ada check-in hari ini, jadi AI memilih langkah yang paling umum dan ringan.',
                nextAction?.reason,
                nextActionReview ? `${nextActionReview.label} ditinjau oleh ${nextActionReview.reviewedBy}.` : null,
                planMode === 'minimum' ? 'Mode minimum aktif agar hari ini tetap terasa mungkin.' : 'Mode hari ini mengikuti rencana yang tersimpan di Plan.',
              ].filter(Boolean).map((reason) => (
                <div key={reason} className="flex gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
                  <Check size={14} className="mt-0.5 shrink-0 text-teal-700" strokeWidth={3} />
                  <p className="text-[11px] font-bold leading-relaxed text-slate-600">{reason}</p>
                </div>
              ))}
            </div>

            <button type="button" onClick={() => setWhyOpen(false)} className="mt-4 h-11 w-full rounded-xl border-0 bg-slate-900 text-xs font-extrabold text-white">
              Mengerti
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
