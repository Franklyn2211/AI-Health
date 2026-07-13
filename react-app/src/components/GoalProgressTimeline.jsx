import { useState } from 'react';
import { Activity, ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Target, TrendingUp, Utensils } from 'lucide-react';
import { useHealth } from '../context/healthContextCore';
import { buildAdaptiveTargets } from '../lib/adaptiveTargets';

function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toNumber(value, fallback = 0) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getWeightProgress(userProfile) {
  const current = toNumber(userProfile.currentWeight);
  const target = toNumber(userProfile.targetWeight);
  if (!current || !target || current === target) return null;
  const direction = target > current ? 'Naik' : 'Turun';
  const remaining = Math.abs(target - current);
  return {
    label: `${direction} ${remaining.toFixed(1)} kg lagi`,
    detail: `${current} kg menuju ${target} kg`,
  };
}

function buildMonthEntries(dailyRecords, adaptivePlan) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = firstDay.getDay();

  const entries = Array.from({ length: daysInMonth }, (_, index) => {
    const date = new Date(year, month, index + 1);
    const key = getDateKey(date);
    const record = dailyRecords[key] || {};
    const hasAnyData = Boolean(
      record.checkIn
      || record.meals?.length
      || record.consumedCalories
      || record.summaryConfirmed
      || record.dailyReview
      || record.completedActions?.length
    );
    const mealDone = Boolean(record.meals?.length || record.consumedCalories);
    const proteinDone = (record.macros?.protein || 0) >= adaptivePlan.nutrition.proteinTarget * 0.7;
    const recoveryDone = record.checkIn?.sleep >= 2 && record.checkIn?.mood >= 2 && record.checkIn?.energy >= 2;
    const movementDone = (record.completedActions || []).some((action) => (
      ['movement', 'walk', 'easy-burn', 'strength-stimulus'].includes(action)
    ));
    const reviewDone = Boolean(record.summaryConfirmed || record.dailyReview);
    const score = hasAnyData
      ? Math.min(
          (mealDone ? 25 : 0)
          + (proteinDone ? 25 : 0)
          + (recoveryDone ? 25 : 0)
          + (movementDone ? 15 : 0)
          + (reviewDone ? 10 : 0),
          100,
        )
      : null;

    return {
      key,
      day: index + 1,
      isToday: key === getDateKey(),
      hasAnyData,
      score,
      mealDone,
      proteinDone,
      recoveryDone,
      movementDone,
      reviewDone,
    };
  });

  return {
    entries,
    calendarCells: [...Array.from({ length: leadingBlanks }, () => null), ...entries],
  };
}

function getScoreTone(score, hasAnyData) {
  if (!hasAnyData) return 'bg-slate-100 text-slate-300';
  if (score >= 80) return 'bg-teal-600 text-white';
  if (score >= 55) return 'bg-teal-100 text-teal-800';
  if (score >= 30) return 'bg-amber-100 text-amber-800';
  return 'bg-rose-100 text-rose-800';
}

function getStreak(entries) {
  let best = 0;
  let current = 0;
  entries.forEach((entry) => {
    if (entry.score >= 55) {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
  });
  return best;
}

function buildWeekSlides(entries) {
  const slides = [];
  for (let index = 0; index < entries.length; index += 7) {
    slides.push(entries.slice(index, index + 7));
  }
  return slides;
}

function getWeekRangeLabel(weekEntries) {
  const first = weekEntries[0];
  const last = weekEntries[weekEntries.length - 1];
  if (!first || !last) return 'Minggu ini';
  return `${first.day}-${last.day}`;
}

function getWeekStats(weekEntries) {
  const tracked = weekEntries.filter((entry) => entry.hasAnyData).length;
  const average = tracked
    ? Math.round(weekEntries.reduce((sum, entry) => sum + (entry.score || 0), 0) / tracked)
    : 0;
  return {
    average,
    tracked,
    protein: weekEntries.filter((entry) => entry.proteinDone).length,
    recovery: weekEntries.filter((entry) => entry.recoveryDone).length,
    movement: weekEntries.filter((entry) => entry.movementDone).length,
  };
}

function buildWeekLine(weekEntries) {
  const width = 180;
  const height = 48;
  return weekEntries.map((entry, index) => {
    const x = (index / Math.max(weekEntries.length - 1, 1)) * width;
    const y = height - 4 - ((entry.score || 0) / 100) * 38;
    return { x, y, entry };
  });
}

function WeekProgressCarousel({ entries, monthLabel }) {
  const weekSlides = buildWeekSlides(entries);
  const initialWeek = Math.max(weekSlides.findIndex((week) => week.some((entry) => entry.isToday)), 0);
  const [activeWeekIndex, setActiveWeekIndex] = useState(initialWeek);
  const [selectedKey, setSelectedKey] = useState(() => (
    entries.find((entry) => entry.isToday)?.key || [...entries].reverse().find((entry) => entry.hasAnyData)?.key || entries[0]?.key
  ));
  const safeWeekIndex = Math.min(Math.max(activeWeekIndex, 0), Math.max(weekSlides.length - 1, 0));
  const weekEntries = weekSlides[safeWeekIndex] || [];
  const points = buildWeekLine(weekEntries);
  const line = points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ');
  const stats = getWeekStats(weekEntries);
  const selectedEntry = weekEntries.find((entry) => entry.key === selectedKey)
    || weekEntries.find((entry) => entry.isToday)
    || [...weekEntries].reverse().find((entry) => entry.hasAnyData)
    || weekEntries[0];
  const isCurrentWeek = weekEntries.some((entry) => entry.isToday);

  const selectWeek = (nextIndex) => {
    const boundedIndex = Math.min(Math.max(nextIndex, 0), Math.max(weekSlides.length - 1, 0));
    const nextWeek = weekSlides[boundedIndex] || [];
    const nextSelected = nextWeek.find((entry) => entry.isToday)
      || [...nextWeek].reverse().find((entry) => entry.hasAnyData)
      || nextWeek[0];
    setActiveWeekIndex(boundedIndex);
    setSelectedKey(nextSelected?.key);
  };

  const selectedSignals = selectedEntry ? [
    ['Makan', selectedEntry.mealDone],
    ['Protein', selectedEntry.proteinDone],
    ['Recovery', selectedEntry.recoveryDone],
    ['Gerak', selectedEntry.movementDone],
    ['Review', selectedEntry.reviewDone],
  ] : [];

  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-extrabold uppercase text-teal-700">{isCurrentWeek ? 'Minggu berjalan' : `Minggu ${safeWeekIndex + 1}`}</p>
          <h3 className="mt-0.5 text-sm font-extrabold text-slate-900">{getWeekRangeLabel(weekEntries)} {monthLabel.split(' ')[0]}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => selectWeek(safeWeekIndex - 1)}
            disabled={safeWeekIndex === 0}
            aria-label="Minggu sebelumnya"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-35"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="rounded-lg bg-white px-2 py-2 text-[10px] font-extrabold text-slate-700">{stats.average}%</span>
          <button
            type="button"
            onClick={() => selectWeek(safeWeekIndex + 1)}
            disabled={safeWeekIndex >= weekSlides.length - 1}
            aria-label="Minggu berikutnya"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-35"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <svg viewBox="0 0 180 48" className="h-12 w-full" role="img" aria-label={`Grafik progress ${getWeekRangeLabel(weekEntries)}`}>
        <polyline points={line} fill="none" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point) => (
          <circle
            key={point.entry.key}
            cx={point.x}
            cy={point.y}
            r={point.entry.key === selectedEntry?.key ? 4 : point.entry.hasAnyData ? 2.7 : 1.5}
            fill={point.entry.key === selectedEntry?.key ? '#111827' : point.entry.hasAnyData ? '#0f766e' : '#cbd5e1'}
          />
        ))}
      </svg>

      <div className="mt-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="grid min-w-full grid-cols-7 gap-1">
          {weekEntries.map((entry) => {
            const selected = entry.key === selectedEntry?.key;
            return (
              <button
                key={entry.key}
                type="button"
                onClick={() => setSelectedKey(entry.key)}
                className="border-0 bg-transparent p-0 text-center"
                aria-label={`Lihat detail tanggal ${entry.day}`}
              >
                <span className={[
                  'mx-auto flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-extrabold transition-all',
                  getScoreTone(entry.score, entry.hasAnyData),
                  entry.isToday ? 'ring-2 ring-slate-900 ring-offset-1' : '',
                  selected ? 'scale-105 shadow-sm shadow-slate-900/20' : '',
                ].join(' ')}>
                  {entry.day}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedEntry && (
        <div className="mt-3 rounded-2xl bg-white p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-extrabold uppercase text-slate-400">Detail tanggal {selectedEntry.day}</p>
              <p className="text-xs font-bold text-slate-900">{selectedEntry.hasAnyData ? 'Data harian tercatat' : 'Belum ada data hari ini'}</p>
            </div>
            <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-extrabold text-slate-700">{selectedEntry.score || 0}%</span>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {selectedSignals.map(([label, active]) => (
              <span key={label} className={`rounded-lg px-1.5 py-1.5 text-center text-[8px] font-extrabold ${active ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-400'}`}>
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {[
          ['Data', `${stats.tracked}/7`],
          ['Protein', stats.protein],
          ['Recovery', stats.recovery],
          ['Gerak', stats.movement],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-white px-2 py-1.5 text-center">
            <p className="text-[9px] font-extrabold uppercase text-slate-400">{label}</p>
            <p className="mt-0.5 text-xs font-extrabold text-slate-900">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function buildChartPoints(entries) {
  const width = 260;
  const height = 86;
  const xStep = width / Math.max(entries.length - 1, 1);
  return entries.map((entry, index) => {
    const value = entry.score ?? 0;
    const x = index * xStep;
    const y = height - (value / 100) * (height - 8) - 4;
    return { x, y, value, hasAnyData: entry.hasAnyData };
  });
}

function MonthlyChart({ entries }) {
  const points = buildChartPoints(entries);
  const line = points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ');
  const area = `0,90 ${line} 260,90`;

  return (
    <div className="rounded-2xl bg-slate-950 p-3 text-white">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-extrabold uppercase text-teal-300">Graph progress</p>
          <p className="text-xs font-bold text-slate-300">Skor harian bulan ini</p>
        </div>
        <TrendingUp size={18} className="text-teal-300" />
      </div>
      <svg viewBox="0 0 260 92" className="h-[92px] w-full" role="img" aria-label="Grafik progress harian bulan ini">
        <defs>
          <linearGradient id="monthlyProgressArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.04" />
          </linearGradient>
        </defs>
        <path d={`M ${area}`} fill="url(#monthlyProgressArea)" />
        <polyline points={line} fill="none" stroke="#2dd4bf" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point, index) => (
          <circle
            key={`${point.x}-${index}`}
            cx={point.x}
            cy={point.y}
            r={point.hasAnyData ? 2.5 : 1.4}
            fill={point.hasAnyData ? '#ccfbf1' : '#475569'}
          />
        ))}
      </svg>
    </div>
  );
}

export default function GoalProgressTimeline({ onOpenPlan, compact = false }) {
  const { userProfile, todayRecord, dailyRecords } = useHealth();
  const adaptivePlan = buildAdaptiveTargets(userProfile, todayRecord, dailyRecords);
  const weight = getWeightProgress(userProfile);
  const { entries, calendarCells } = buildMonthEntries(dailyRecords, adaptivePlan);
  const trackedDays = entries.filter((entry) => entry.hasAnyData).length;
  const averageScore = trackedDays
    ? Math.round(entries.reduce((sum, entry) => sum + (entry.score || 0), 0) / trackedDays)
    : 0;
  const proteinDays = entries.filter((entry) => entry.proteinDone).length;
  const recoveryDays = entries.filter((entry) => entry.recoveryDone).length;
  const movementDays = entries.filter((entry) => entry.movementDone).length;
  const bestStreak = getStreak(entries);

  const monthLabel = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date());
  const highlights = [
    { label: 'Rata-rata', value: `${averageScore}%`, Icon: Target, tone: 'bg-teal-50 text-teal-700' },
    { label: 'Protein', value: `${proteinDays} hari`, Icon: Utensils, tone: 'bg-orange-50 text-orange-700' },
    { label: 'Recovery', value: `${recoveryDays} hari`, Icon: CalendarDays, tone: 'bg-sky-50 text-sky-700' },
    { label: 'Gerak', value: `${movementDays} hari`, Icon: Activity, tone: 'bg-emerald-50 text-emerald-700' },
  ];

  if (compact) {
    return (
      <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase text-teal-700">Progress bulan ini</p>
            <h2 className="mt-0.5 text-base font-extrabold text-slate-900">{averageScore}% rata-rata</h2>
            <p className="mt-1 text-xs font-medium text-slate-500">{trackedDays}/{entries.length} hari tercatat, streak terbaik {bestStreak} hari.</p>
          </div>
          {onOpenPlan && (
            <button type="button" onClick={onOpenPlan} className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-extrabold text-slate-700">
              Detail <ArrowRight size={12} />
            </button>
          )}
        </div>
        <WeekProgressCarousel entries={entries} monthLabel={monthLabel} />
        <div className="mt-2 flex items-center justify-between text-[9px] font-bold text-slate-400">
          <span>Geser per 7 hari</span>
          <span>Setiap slide punya graph & detail</span>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-extrabold uppercase text-teal-700">Goal progress</p>
          <h2 className="mt-0.5 text-base font-extrabold text-slate-900">Progress {monthLabel}</h2>
          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
            {weight?.detail || adaptivePlan.summary}
          </p>
        </div>
        {onOpenPlan && (
          <button type="button" onClick={onOpenPlan} className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-extrabold text-slate-700">
            Plan <ArrowRight size={12} />
          </button>
        )}
      </div>

      <MonthlyChart entries={entries} />

      <div className="mt-3 grid grid-cols-4 gap-2">
        {highlights.map(({ label, value, Icon, tone }) => (
          <div key={label} className="rounded-xl bg-slate-50 px-2 py-2">
            <span className={`mb-1 flex h-7 w-7 items-center justify-center rounded-lg ${tone}`}>
              <Icon size={14} />
            </span>
            <p className="text-[9px] font-extrabold uppercase text-slate-400">{label}</p>
            <p className="mt-0.5 text-xs font-extrabold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-2xl bg-slate-50 p-3">
        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[8px] font-extrabold uppercase text-slate-400">
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day, index) => (
            <span key={`${day}-${index}`}>{day}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {calendarCells.map((entry, index) => (
            entry ? (
              <div key={entry.key} className="relative">
                <span className={[
                  'flex aspect-square items-center justify-center rounded-xl text-[10px] font-extrabold',
                  getScoreTone(entry.score, entry.hasAnyData),
                  entry.isToday ? 'ring-2 ring-slate-900 ring-offset-2' : '',
                ].join(' ')}>
                  {entry.day}
                </span>
              </div>
            ) : (
              <span key={`blank-${index}`} className="block aspect-square" />
            )
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-teal-50 px-3 py-2">
        <div>
          <p className="text-[10px] font-extrabold uppercase text-teal-700">Streak terbaik</p>
          <p className="text-xs font-bold text-teal-900">{bestStreak} hari konsisten bulan ini</p>
        </div>
        <p className="shrink-0 rounded-lg bg-white px-2.5 py-1 text-[10px] font-extrabold text-teal-800">
          {trackedDays}/{entries.length} hari tercatat
        </p>
      </div>
    </section>
  );
}
