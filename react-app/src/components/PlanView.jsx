import { useMemo, useState } from 'react';
import {
  Activity,
  Brain,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Droplets,
  Dumbbell,
  Flame,
  Moon,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Target,
  Utensils,
} from 'lucide-react';
import { useHealth } from '../context/healthContextCore';
import ReviewBadge from './ReviewBadge';
import { analyzeCareEscalation } from '../lib/careRules';
import { buildAdaptiveTargets, getChecklistAutoComplete, getChecklistTargetId } from '../lib/adaptiveTargets';
import { getReviewedMethod } from '../lib/reviewedMethods';

const GOAL_COPY = {
  'body-goals': {
    label: 'Target tubuh',
    headline: 'makan, gerak, dan energi',
    tone: 'bg-orange-50 text-orange-700',
    Icon: Dumbbell,
    actions: [
      { id: 'meal', title: 'Makan seimbang', detail: 'Protein utama, sayur, karbo secukupnya', subView: 'meal-planner', Icon: Utensils, tone: 'bg-orange-50 text-orange-700' },
      { id: 'movement', title: 'Latihan singkat', detail: '10-15 menit sesuai energi', subView: 'fitness-routine', Icon: Dumbbell, tone: 'bg-emerald-50 text-emerald-700' },
    ],
  },
  'mental-health': {
    label: 'Kesehatan mental',
    headline: 'stres, mood, dan tidur',
    tone: 'bg-violet-50 text-violet-700',
    Icon: Brain,
    actions: [
      { id: 'reset', title: 'Jeda mental', detail: 'Napas 2 menit atau tulis satu pemicu', subView: 'mood-tracker', Icon: Brain, tone: 'bg-violet-50 text-violet-700' },
      { id: 'wind-down', title: 'Wind-down malam', detail: 'Turunkan layar dan buat rutinitas tidur', subView: 'sleep-tracker', Icon: Moon, tone: 'bg-sky-50 text-sky-700' },
    ],
  },
  'immune-booster': {
    label: 'Rutinitas sehat',
    headline: 'pencegahan dan konsistensi',
    tone: 'bg-teal-50 text-teal-700',
    Icon: ShieldCheck,
    actions: [
      { id: 'walk', title: 'Jalan ringan', detail: '10 menit untuk menjaga ritme', subView: 'fitness-routine', Icon: CalendarDays, tone: 'bg-amber-50 text-amber-700' },
      { id: 'check-care', title: 'Tinjau perawatan', detail: 'Lihat apakah perlu chat ahli', tab: 'clinic', Icon: Stethoscope, tone: 'bg-teal-50 text-teal-700' },
    ],
  },
};

const PLAN_MODES = {
  minimum: { label: 'Minimum', detail: '1 langkah kecil', minutes: '3-5 mnt' },
  short: { label: 'Ringkas', detail: '2 langkah utama', minutes: '10-15 mnt' },
  full: { label: 'Lengkap', detail: '3 langkah lengkap', minutes: '20-30 mnt' },
};

const TARGET_ICONS = {
  activity: Activity,
  brain: Brain,
  droplets: Droplets,
  dumbbell: Dumbbell,
  flame: Flame,
  moon: Moon,
  sparkles: Sparkles,
  target: Target,
  utensils: Utensils,
};

function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildWeekDays() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return {
      key: getDateKey(date),
      day: date.toLocaleDateString('id-ID', { weekday: 'short' }),
      date: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      isToday: index === 0,
    };
  });
}

function getTarget(adaptivePlan, targetId) {
  return adaptivePlan.targets.find((item) => item.id === targetId);
}

function getActionConnection(action, adaptivePlan, todayRecord) {
  const targetId = getChecklistTargetId(action.id);
  const target = targetId ? getTarget(adaptivePlan, targetId) : null;
  const progress = target ? Math.min(Math.round((target.value / Math.max(target.target, 1)) * 100), 100) : 0;

  if (['surplus-meal', 'protein-target', 'protein-first', 'calorie-gap', 'steady-meal', 'balanced-target'].includes(action.id)) {
    const mealCount = todayRecord.meals?.length || 0;
    return {
      sourceLabel: action.id === 'calorie-gap' ? 'Food scanner' : 'Meal planner',
      statusLabel: target ? `${target.value}/${target.target} ${target.unit}` : `${mealCount} makanan tercatat`,
      helperLabel: mealCount ? `${mealCount} makanan sudah masuk diary` : 'Belum ada makanan di diary',
      alternativeLabel: action.id === 'calorie-gap' ? 'Kalau makan di luar, foto atau catat satu kalimat saja.' : 'Tidak ada ayam? Ganti telur, tempe, tahu, ikan, atau susu.',
      ctaLabel: action.id === 'calorie-gap' ? 'Scan / diary' : 'Buka meal plan',
      connectedFeatures: ['Target AI', 'Food diary', action.id === 'calorie-gap' ? 'Food scanner' : 'Meal planner'],
      progress,
      targetId,
    };
  }

  if (['strength-stimulus', 'easy-burn', 'movement-dose'].includes(action.id)) {
    return {
      sourceLabel: 'Fitness planner',
      statusLabel: target ? `${target.value}/${target.target} ${target.unit}` : 'Belum ada gerak tercatat',
      helperLabel: todayRecord.checkIn?.energy === 1 ? 'Energi rendah, intensitas dibuat ringan' : 'Disambungkan ke target pembakaran harian',
      alternativeLabel: todayRecord.checkIn?.energy === 1 ? 'Kalau terlalu capek, cukup 5 menit mobility.' : 'Tidak sempat latihan? Jalan 10 menit setelah makan.',
      ctaLabel: 'Buka latihan',
      connectedFeatures: ['Target gerak', 'Progress bulanan', 'Fitness planner'],
      progress,
      targetId,
    };
  }

  if (['mood-reset'].includes(action.id)) {
    return {
      sourceLabel: 'Mood check',
      statusLabel: todayRecord.checkIn?.mood ? `Mood ${todayRecord.checkIn.mood}/3` : 'Mood belum dicatat',
      helperLabel: 'Mood dipakai untuk menurunkan atau menaikkan beban plan',
      alternativeLabel: 'Kalau journaling terasa berat, cukup pilih satu kata untuk mood.',
      ctaLabel: 'Catat mood',
      connectedFeatures: ['Mood tracker', 'Daily review', 'Adjustment besok'],
      progress: todayRecord.checkIn?.mood ? Math.round((todayRecord.checkIn.mood / 3) * 100) : 0,
      targetId: null,
    };
  }

  if (['sleep-protect', 'recovery-check'].includes(action.id)) {
    return {
      sourceLabel: 'Recovery',
      statusLabel: target ? `${target.value}/${target.target} ${target.unit}` : 'Tidur belum dicatat',
      helperLabel: 'Tidur mempengaruhi mode plan dan target besok',
      alternativeLabel: 'Kalau belum bisa tidur cepat, mulai dari kurangi layar 10 menit.',
      ctaLabel: 'Catat tidur',
      connectedFeatures: ['Sleep tracker', 'Recovery', 'Adjustment besok'],
      progress,
      targetId,
    };
  }

  if (action.id === 'hydration-target') {
    return {
      sourceLabel: 'Hydration',
      statusLabel: target ? `${target.value}/${target.target} ${target.unit}` : `${todayRecord.water || 0} gelas`,
      helperLabel: 'Air masuk ke target harian dan membantu energi tetap stabil',
      alternativeLabel: 'Kalau lupa, cukup tambah satu gelas sekarang.',
      ctaLabel: 'Tambah air',
      connectedFeatures: ['Target air', 'Catat cepat', 'Progress'],
      progress,
      targetId,
    };
  }

  if (action.id === 'daily-review') {
    const reviewed = Boolean(todayRecord.summaryConfirmed || todayRecord.dailyReview);
    return {
      sourceLabel: 'Review',
      statusLabel: reviewed ? 'Sudah review' : 'Belum review',
      helperLabel: 'Review malam membuat plan besok lebih tepat tanpa menambah beban',
      alternativeLabel: 'Cukup pilih satu alasan kalau target hari ini belum pas.',
      ctaLabel: 'Review nanti',
      connectedFeatures: ['Daily review', 'Adjustment besok', 'Health memory'],
      progress: reviewed ? 100 : 0,
      targetId: null,
    };
  }

  return {
    sourceLabel: 'Plan',
    statusLabel: 'Siap dilakukan',
    helperLabel: 'Aksi ini dipilih dari goal dan kondisi hari ini',
    alternativeLabel: 'Kalau tidak sempat, pilih versi minimum di check-in.',
    ctaLabel: 'Buka',
    connectedFeatures: ['Checklist', 'Progress'],
    progress: 0,
    targetId: null,
  };
}

function buildConnectedActions({ adaptivePlan, selectedGoals, todayRecord, healthExperiment, planMode }) {
  const generated = adaptivePlan.checklist.map((action) => ({
    ...action,
    ...getActionConnection(action, adaptivePlan, todayRecord),
    Icon: TARGET_ICONS[action.icon] || CalendarDays,
    completeType: 'daily-action',
  }));

  const fallback = selectedGoals.flatMap((goal) => GOAL_COPY[goal]?.actions || []).slice(0, 2).map((action) => ({
    ...action,
    sourceLabel: 'Goal setup',
    statusLabel: 'Siap dilakukan',
    helperLabel: 'Aksi ini berasal dari goal yang dipilih saat onboarding',
    alternativeLabel: 'Kalau terlalu berat, gunakan mode minimum hari ini.',
    ctaLabel: 'Buka',
    connectedFeatures: ['Onboarding', 'Plan'],
    progress: 0,
    completeType: 'daily-action',
  }));

  const actions = generated.length ? generated : fallback;

  if (!healthExperiment?.active || planMode === 'minimum') return actions;

  return [
    ...actions,
    {
      id: `smart-habit-${healthExperiment.id}`,
      title: `Smart habit: ${healthExperiment.title}`,
      detail: healthExperiment.description || 'Satu kebiasaan kecil yang sedang diuji beberapa hari.',
      icon: 'sparkles',
      tone: 'bg-teal-50 text-teal-700',
      methodId: 'ai-coordination',
      sourceLabel: 'Smart habit',
      statusLabel: `${healthExperiment.completedDays?.length || 0}/${healthExperiment.days || 5} hari`,
      helperLabel: healthExperiment.reviewedBy ? `Ditinjau oleh ${healthExperiment.reviewedBy}` : 'Terhubung ke progress habit aktif',
      alternativeLabel: 'Kalau lupa, cukup tandai besok dan lanjut tanpa reset.',
      ctaLabel: 'Tandai habit',
      connectedFeatures: ['Smart habit', 'Progress bulanan', 'Review ahli'],
      progress: Math.min(Math.round(((healthExperiment.completedDays?.length || 0) / Math.max(healthExperiment.days || 5, 1)) * 100), 100),
      Icon: TARGET_ICONS.sparkles,
      completeType: 'experiment',
    },
  ];
}

function getStrategyCopy(adaptivePlan) {
  if (adaptivePlan.direction === 'lose') {
    return {
      nutrition: 'Jaga defisit dengan protein dulu',
      movement: 'Jalan ringan setelah makan',
      recovery: 'Recovery supaya lapar tidak naik karena kurang tidur',
      review: 'Cek pola kalori, craving, dan energi',
    };
  }

  if (adaptivePlan.direction === 'gain') {
    return {
      nutrition: 'Tambah surplus sehat dari makanan lokal',
      movement: 'Latihan kekuatan agar berat naik lebih berkualitas',
      recovery: 'Recovery supaya nafsu makan dan latihan stabil',
      review: 'Cek protein, kalori, dan konsistensi makan',
    };
  }

  if (adaptivePlan.direction === 'strength') {
    return {
      nutrition: 'Protein cukup untuk dukung latihan',
      movement: 'Latihan fondasi dengan progres kecil',
      recovery: 'Tidur cukup agar performa tidak turun',
      review: 'Cek progres latihan dan energi',
    };
  }

  return {
    nutrition: 'Makan stabil sesuai target hari ini',
    movement: 'Gerak ringan untuk menjaga ritme',
    recovery: 'Jaga tidur, mood, dan energi',
    review: 'Cek pola yang paling sering menghambat',
  };
}

function buildWeeklyStrategy({ weekDays, adaptivePlan, planMode, healthExperiment }) {
  const copy = getStrategyCopy(adaptivePlan);
  const items = [
    {
      title: 'Setel hari ini',
      detail: `${PLAN_MODES[planMode]?.detail || 'Langkah utama'} dipilih dari target dan check-in terbaru.`,
      tone: 'bg-slate-900 text-white',
    },
    {
      title: copy.nutrition,
      detail: `Kejar ${adaptivePlan.nutrition.proteinTarget}g protein dan target ${adaptivePlan.nutrition.calorieTarget} kcal.`,
      tone: 'bg-orange-50 text-orange-800',
    },
    {
      title: copy.movement,
      detail: adaptivePlan.direction === 'lose' ? 'Bantu defisit tanpa olahraga berat.' : 'Buat stimulus kecil yang mudah diulang.',
      tone: 'bg-emerald-50 text-emerald-800',
    },
    {
      title: copy.recovery,
      detail: 'Jika energi rendah, AI akan menurunkan plan ke mode minimum.',
      tone: 'bg-sky-50 text-sky-800',
    },
    {
      title: healthExperiment ? `Lanjut ${healthExperiment.title}` : 'Mulai smart habit',
      detail: healthExperiment ? 'Satu kebiasaan kecil aktif untuk diuji beberapa hari.' : 'App akan memilih habit kecil setelah data cukup.',
      tone: 'bg-teal-50 text-teal-800',
    },
    {
      title: copy.review,
      detail: 'Daily review membuat target besok berubah lebih akurat.',
      tone: 'bg-violet-50 text-violet-800',
    },
    {
      title: 'Refresh rencana',
      detail: 'AI merapikan target minggu depan dari progress, diary, dan blocker.',
      tone: 'bg-slate-100 text-slate-700',
    },
  ];

  return weekDays.map((day, index) => ({
    ...day,
    ...items[index],
    label: index === 0 ? 'Hari ini' : index === 1 ? 'Besok' : day.day,
  }));
}

export default function PlanView({ onTabChange, onSubViewChange }) {
  const {
    userProfile,
    todayRecord,
    dailyRecords,
    healthExperiment,
    incrementWater,
    toggleDailyAction,
    toggleExperimentToday,
  } = useHealth();
  const [whyOpen, setWhyOpen] = useState(false);

  const planMode = todayRecord.planMode || 'short';
  const completedActions = todayRecord.completedActions || [];
  const selectedGoals = useMemo(() => (
    userProfile.goals?.length ? userProfile.goals : ['immune-booster']
  ), [userProfile.goals]);
  const adaptivePlan = useMemo(() => (
    buildAdaptiveTargets(userProfile, todayRecord, dailyRecords)
  ), [dailyRecords, todayRecord, userProfile]);

  const actions = useMemo(() => {
    return buildConnectedActions({
      adaptivePlan,
      selectedGoals,
      todayRecord,
      healthExperiment,
      planMode,
    });
  }, [adaptivePlan, healthExperiment, planMode, selectedGoals, todayRecord]);

  const isActionDone = (action) => {
    if (action.completeType === 'experiment') {
      return (healthExperiment?.completedDays || []).includes(getDateKey());
    }
    return completedActions.includes(action.id) || getChecklistAutoComplete(action, adaptivePlan, todayRecord);
  };

  const weekDays = buildWeekDays();
  const weeklyStrategy = buildWeeklyStrategy({ weekDays, adaptivePlan, planMode, healthExperiment });
  const checkIn = todayRecord.checkIn;
  const lowReadiness = checkIn?.energy === 1 || checkIn?.sleep === 1 || checkIn?.mood === 1;
  const escalation = analyzeCareEscalation(dailyRecords);
  const planReason = lowReadiness
    ? adaptivePlan.adjustment
    : adaptivePlan.summary;

  const openAction = (action) => {
    if (action.completeType === 'experiment') return;
    if (action.id === 'hydration-target') {
      incrementWater();
      return;
    }
    if (action.subView) onSubViewChange(action.subView);
    if (action.tab) onTabChange(action.tab);
  };

  const toggleAction = (action) => {
    if (action.completeType === 'experiment') {
      toggleExperimentToday();
      return;
    }
    toggleDailyAction(action.id);
  };

  return (
    <div className="screen-scroll h-full overflow-y-auto bg-[#f7f8f5] px-5 pb-28 pt-5">
      <header className="mb-5">
        <p className="mb-1 text-[10px] font-extrabold uppercase text-teal-700">Rencana</p>
        <h1 className="text-[25px] font-extrabold leading-tight text-slate-900">Rencana adaptif</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">Target, checklist, dan strategi mingguan yang berubah mengikuti progresmu.</p>
      </header>

      <section className="mb-5">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase text-slate-500">Checklist hari ini</p>
            <h2 className="text-base font-extrabold text-slate-900">{PLAN_MODES[planMode]?.detail}</h2>
          </div>
          <button type="button" onClick={() => setWhyOpen(true)} className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-[10px] font-extrabold text-slate-700">
            Kenapa?
          </button>
        </div>

        <div className="space-y-2">
          {actions.map((action) => {
            const autoDone = action.completeType !== 'experiment' && getChecklistAutoComplete(action, adaptivePlan, todayRecord);
            const done = isActionDone(action);
            const Icon = action.Icon;
            const reviewedMethod = getReviewedMethod(action.methodId || action.id);
            return (
              <article key={action.id} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (!autoDone) toggleAction(action);
                    }}
                    aria-label={autoDone ? `${action.title} otomatis selesai karena target terpenuhi` : done ? `Batalkan ${action.title}` : `Selesaikan ${action.title}`}
                    className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${done ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-300 bg-white text-transparent'} ${autoDone ? 'cursor-default' : ''}`}
                  >
                    <Check size={15} strokeWidth={3} />
                  </button>
                  <button type="button" onClick={() => openAction(action)} className="flex min-w-0 flex-1 items-start gap-3 border-0 bg-transparent p-0 text-left">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${action.tone}`}>
                      <Icon size={19} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="mb-1 flex items-center gap-1.5">
                        <span className="truncate rounded-md bg-slate-100 px-2 py-1 text-[9px] font-extrabold uppercase text-slate-500">{action.sourceLabel}</span>
                        <span className="shrink-0 rounded-md bg-teal-50 px-2 py-1 text-[9px] font-extrabold text-teal-700">{action.statusLabel}</span>
                        {autoDone && (
                          <span className="shrink-0 rounded-md bg-emerald-100 px-2 py-1 text-[9px] font-extrabold text-emerald-800">Auto</span>
                        )}
                      </span>
                      <span className={`block text-sm font-extrabold ${done ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{action.title}</span>
                      <span className="mt-1 block text-xs font-medium leading-relaxed text-slate-500">{action.helperLabel}</span>
                      <span className="mt-1 block text-[10px] font-bold leading-relaxed text-teal-700">
                        Alternatif: {action.alternativeLabel}
                      </span>
                      {action.progress > 0 && (
                        <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <span className="block h-full rounded-full bg-teal-700" style={{ width: `${action.progress}%` }} />
                        </span>
                      )}
                      <span className="mt-2 flex items-center justify-between gap-2">
                        <ReviewBadge method={reviewedMethod} compact />
                        <span className="shrink-0 text-[10px] font-extrabold text-slate-500">{action.ctaLabel}</span>
                      </span>
                    </span>
                    <ChevronRight size={17} className="mt-3 shrink-0 text-slate-300" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase text-teal-700">Target ringkas</p>
            <h2 className="mt-1 text-base font-extrabold text-slate-900">Angka yang memandu checklist</h2>
          </div>
          <span className="shrink-0 rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-extrabold text-slate-700">
            {adaptivePlan.confidence}
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {adaptivePlan.targets.map((target) => {
            const Icon = TARGET_ICONS[target.icon] || Target;
            const progress = Math.min(Math.round((target.value / Math.max(target.target, 1)) * 100), 100);
            return (
              <article key={target.id} className="min-w-[112px] rounded-xl bg-slate-50 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${target.tone}`}>
                    <Icon size={14} />
                  </span>
                  <span className="text-[9px] font-extrabold text-slate-400">{progress}%</span>
                </div>
                <p className="text-[9px] font-extrabold uppercase text-slate-400">{target.label}</p>
                <p className="mt-1 text-xs font-extrabold text-slate-900">
                  {target.value}<span className="text-[10px] font-bold text-slate-400">/{target.target}</span>
                </p>
              </article>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] font-bold leading-relaxed text-teal-800">{adaptivePlan.adjustment}</p>
      </section>

      {escalation.level !== 'self-care' && (
        <section className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-700">
              <Stethoscope size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-extrabold uppercase text-amber-700">Care escalation</p>
              <h2 className="mt-1 text-sm font-extrabold text-amber-950">{escalation.title}</h2>
              <p className="mt-1 text-xs font-medium leading-relaxed text-amber-900">{escalation.detail}</p>
              <p className="mt-2 rounded-xl bg-white/70 px-3 py-2 text-[11px] font-bold leading-relaxed text-amber-950">
                Chat yang disarankan: {escalation.recommendedExpert}
              </p>
              <button type="button" onClick={() => onTabChange('clinic')} className="mt-3 h-10 w-full rounded-xl border-0 bg-slate-900 text-xs font-extrabold text-white">
                Siapkan chat ahli
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase text-teal-700">Strategi minggu ini</p>
            <h2 className="mt-1 text-base font-extrabold text-slate-900">7 hari ke depan</h2>
          </div>
          <span className="rounded-lg bg-teal-50 px-2 py-1 text-[10px] font-extrabold text-teal-700">{PLAN_MODES[planMode]?.minutes}</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {weeklyStrategy.map((day) => {
            const record = dailyRecords?.[day.key];
            const active = day.isToday;
            const done = Boolean(record?.summaryConfirmed || record?.completedActions?.length);
            return (
              <button key={day.key} type="button" className={`min-w-[148px] rounded-2xl border-0 p-3 text-left ${active ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
                <div className={`mb-3 flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl ${active ? 'bg-white/10 text-white' : day.tone}`}>
                  <span className="text-[9px] font-extrabold uppercase">{day.label}</span>
                  <span className="text-[10px] font-bold">{day.date}</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-extrabold leading-tight ${active ? 'text-white' : 'text-slate-900'}`}>{day.title}</p>
                  {done && <span className="shrink-0 rounded-lg bg-teal-100 px-1.5 py-1 text-[8px] font-extrabold text-teal-800">OK</span>}
                </div>
                <p className={`mt-1 line-clamp-2 text-[11px] font-medium leading-relaxed ${active ? 'text-slate-300' : 'text-slate-500'}`}>{day.detail}</p>
              </button>
            );
          })}
        </div>
      </section>

      {whyOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/45 p-3 backdrop-blur-sm">
          <section className="w-full rounded-3xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Clock3 size={20} />
              </span>
              <div>
                <p className="text-[10px] font-extrabold uppercase text-teal-700">Alasan rencana</p>
                <h2 className="mt-1 text-lg font-extrabold text-slate-900">Kenapa dibuat begini?</h2>
              </div>
            </div>
            <div className="space-y-2">
              {[planReason, `Mode ${PLAN_MODES[planMode]?.label} menjaga target tetap realistis.`, 'Metode harian diberi reviewer sesuai domain: gizi, psikologi, fitness, atau dokter umum.', healthExperiment?.reviewedBy ? `Program aktif ditinjau oleh ${healthExperiment.reviewedBy}.` : 'Belum ada program ahli aktif, jadi rencana dimulai dari kebiasaan dasar.'].map((reason) => (
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
