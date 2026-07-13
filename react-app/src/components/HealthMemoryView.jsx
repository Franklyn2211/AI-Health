import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardList,
  Dumbbell,
  Moon,
  Sparkles,
  Stethoscope,
  Utensils,
} from 'lucide-react';
import { useHealth } from '../context/healthContextCore';
import AppJourneyFlow from './AppJourneyFlow';

const formatDateKey = (date) => date.toISOString().slice(0, 10);

const DEMO_BLUEPRINTS = [
  {
    mood: 2,
    energy: 2,
    sleep: 2,
    meals: ['Nasi ayam rumahan'],
    logs: ['Sedikit tegang setelah kerja'],
    actions: ['meal'],
    note: 'Hari cukup stabil, makan tercatat, aktivitas ringan.',
  },
  {
    mood: 1,
    energy: 1,
    sleep: 1,
    meals: [],
    logs: ['Sakit kepala ringan'],
    actions: [],
    note: 'Tidur pendek dan makan terlewat, mood ikut turun.',
  },
  {
    mood: 2,
    energy: 2,
    sleep: 2,
    meals: ['Bubur ayam', 'Sup sayur'],
    logs: [],
    actions: ['meal', 'walk'],
    note: 'Makan lebih rapi, energi kembali ke tengah.',
  },
  {
    mood: 3,
    energy: 3,
    sleep: 3,
    meals: ['Oat pisang', 'Ayam panggang'],
    logs: [],
    actions: ['meal', 'movement'],
    note: 'Tidur dan sarapan bagus, aktivitas selesai.',
  },
  {
    mood: 2,
    energy: 1,
    sleep: 1,
    meals: ['Roti telur'],
    logs: ['Stres meeting'],
    actions: ['reset'],
    note: 'Stres tinggi, jeda mental membantu menjaga ritme.',
  },
  {
    mood: 2,
    energy: 2,
    sleep: 2,
    meals: ['Nasi ikan', 'Buah'],
    logs: [],
    actions: ['meal', 'walk'],
    note: 'Gerak ringan setelah makan membuat sore lebih stabil.',
  },
  {
    mood: 2,
    energy: 1,
    sleep: 1,
    meals: ['Kopi', 'Sandwich'],
    logs: ['Lelah pagi'],
    actions: [],
    note: 'Energi rendah, cocok memakai rencana minimum.',
  },
];

const FOCUS_LABELS = {
  'gain-weight': 'naik berat badan sehat',
  'lose-weight': 'mengelola berat badan',
  'build-strength': 'lebih kuat dan bugar',
  'eat-better': 'pola makan lebih baik',
  'more-energy': 'lebih berenergi',
  stress: 'mengurangi stres',
  sleep: 'memperbaiki tidur',
  mood: 'menjaga suasana hati',
  burnout: 'mencegah burnout',
  'healthy-routine': 'rutinitas sehat',
  'preventive-care': 'perawatan preventif',
  'manage-condition': 'mengelola kondisi',
};

function buildLastSevenDays() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    return {
      key: formatDateKey(date),
      shortDay: date.toLocaleDateString('id-ID', { weekday: 'short' }).slice(0, 3),
      date: date.getDate(),
    };
  });
}

function buildDemoDays() {
  return buildLastSevenDays().map((day, index) => {
    const blueprint = DEMO_BLUEPRINTS[index];
    return {
      ...day,
      checkIn: {
        mood: blueprint.mood,
        energy: blueprint.energy,
        sleep: blueprint.sleep,
      },
      meals: blueprint.meals.map((name) => ({ name })),
      logs: blueprint.logs.map((label, logIndex) => ({
        id: `${day.key}-demo-${logIndex}`,
        type: label.toLowerCase().includes('sakit') ? 'symptom' : 'quick-log',
        label,
      })),
      completedActions: blueprint.actions,
      note: blueprint.note,
      isDemo: true,
    };
  });
}

function buildRealDays(records) {
  return buildLastSevenDays().map((day) => {
    const record = records[day.key] || {};
    const checkIn = record.checkIn || null;
    const meals = record.meals || [];
    const logs = record.logs || [];
    const completedActions = record.completedActions || [];
    const note = checkIn
      ? `Energi ${checkIn.energy}/3, mood ${checkIn.mood}/3, tidur ${checkIn.sleep}/3.`
      : 'Belum ada check-in pada hari ini.';

    return {
      ...day,
      checkIn,
      meals,
      logs,
      completedActions,
      sleepDetails: record.sleepDetails,
      note,
      isDemo: false,
    };
  });
}

function scoreLabel(value, type) {
  if (!value) return 'Belum ada';
  if (value === 1) return type === 'sleep' ? 'Kurang' : type === 'mood' ? 'Berat' : 'Rendah';
  if (value === 3) return type === 'sleep' ? 'Nyenyak' : 'Baik';
  return 'Cukup';
}

function buildAnalysis(days, userProfile) {
  const daysWithCheckIn = days.filter((day) => day.checkIn);
  const lowSleepDays = daysWithCheckIn.filter((day) => day.checkIn.sleep <= 1).length;
  const lowEnergyDays = daysWithCheckIn.filter((day) => day.checkIn.energy <= 1).length;
  const lowMoodDays = daysWithCheckIn.filter((day) => day.checkIn.mood <= 1).length;
  const mealDays = days.filter((day) => day.meals.length > 0).length;
  const movementDays = days.filter((day) => day.completedActions.some((action) => ['movement', 'walk'].includes(action))).length;
  const symptomLogs = days.flatMap((day) => day.logs).filter((log) => log.type === 'symptom');
  const today = days[days.length - 1];
  const focus = FOCUS_LABELS[userProfile.focus] || userProfile.focus || 'kesehatan harian';

  const patterns = [
    {
      id: 'sleep-energy',
      title: 'Tidur memengaruhi kesiapan',
      text: lowSleepDays >= 2
        ? `${lowSleepDays} dari 7 hari punya sinyal tidur rendah. Pada hari seperti ini, rencana minimum lebih realistis.`
        : 'Tidur tidak terlihat sangat bermasalah minggu ini. Pertahankan rutinitas malam yang ringan.',
      Icon: Moon,
      tone: 'bg-sky-50 text-sky-700',
    },
    {
      id: 'food-mood',
      title: 'Makan tercatat = hari lebih terbaca',
      text: mealDays >= 4
        ? `${mealDays} hari memiliki catatan makan, cukup untuk mulai melihat hubungan dengan energi.`
        : `Baru ${mealDays} hari punya catatan makan. Tambah log sederhana agar AI bisa melihat pola lapar dan energi.`,
      Icon: Utensils,
      tone: 'bg-orange-50 text-orange-700',
    },
    {
      id: 'movement',
      title: 'Gerak kecil menjaga momentum',
      text: movementDays >= 2
        ? `${movementDays} hari memiliki aktivitas ringan. Ini cukup bagus untuk companion phone-only.`
        : 'Belum banyak aktivitas tercatat. Rekomendasi terbaik: jalan 5-10 menit setelah makan.',
      Icon: Dumbbell,
      tone: 'bg-emerald-50 text-emerald-700',
    },
  ];

  let summary = {
    label: 'Hari stabil',
    title: 'Pertahankan ritme sederhana',
    text: `Untuk fokus ${focus}, hari ini terlihat cukup aman untuk rencana ringkas: makan seimbang, gerak ringan, dan check-in malam.`,
    planMode: 'short',
    action: 'Gunakan rencana ringkas',
  };

  if (today.checkIn?.sleep <= 1 || today.checkIn?.energy <= 1) {
    summary = {
      label: 'Hari pemulihan',
      title: 'Turunkan beban, jaga konsistensi',
      text: `Sinyal hari ini menunjukkan energi atau tidur rendah. Untuk fokus ${focus}, aplikasi sebaiknya tidak memaksa workout berat. Ambil satu makanan seimbang dan rutinitas tidur lebih awal.`,
      planMode: 'minimum',
      action: 'Pakai mode minimum',
    };
  } else if (today.checkIn?.mood <= 1 || lowMoodDays >= 2) {
    summary = {
      label: 'Hari mental load',
      title: 'Prioritaskan regulasi stres',
      text: 'Mood tampak lebih berat dari biasanya. Rekomendasi terbaik adalah jeda napas 2 menit, makanan sederhana, dan kurangi target fisik.',
      planMode: 'minimum',
      action: 'Ringankan rencana',
    };
  } else if (today.checkIn?.energy >= 3 && today.checkIn?.sleep >= 3) {
    summary = {
      label: 'Hari siap aktif',
      title: 'Energi cukup untuk progres',
      text: 'Tidur dan energi terlihat baik. Ini waktu yang cocok untuk latihan penuh atau eksperimen kesehatan kecil.',
      planMode: 'full',
      action: 'Naikkan ke lengkap',
    };
  }

  const handoff = [
    `${daysWithCheckIn.length}/7 hari check-in`,
    `${lowSleepDays} hari tidur rendah`,
    `${lowEnergyDays} hari energi rendah`,
    `${mealDays} hari makanan tercatat`,
    `${symptomLogs.length} gejala tercatat`,
  ].join(' - ');

  return {
    summary,
    patterns,
    today,
    stats: {
      daysWithCheckIn: daysWithCheckIn.length,
      lowSleepDays,
      lowEnergyDays,
      mealDays,
      movementDays,
      symptoms: symptomLogs.length,
    },
    handoff,
  };
}

export default function HealthMemoryView({ onBack, onTabChange }) {
  const { dailyRecords, userProfile, updateDailyRecord } = useHealth();
  const [applied, setApplied] = useState(false);

  const realDays = useMemo(() => buildRealDays(dailyRecords), [dailyRecords]);
  const realRecordCount = realDays.filter((day) => day.checkIn || day.meals.length || day.logs.length).length;
  const usingDemoData = realRecordCount < 3;
  const days = useMemo(() => (usingDemoData ? buildDemoDays() : realDays), [realDays, usingDemoData]);
  const analysis = useMemo(() => buildAnalysis(days, userProfile), [days, userProfile]);

  const applySuggestion = () => {
    updateDailyRecord({
      planMode: analysis.summary.planMode,
      memorySuggestion: analysis.summary.title,
      memoryReviewedAt: new Date().toISOString(),
    });
    setApplied(true);
  };

  return (
    <div className="screen-scroll h-full overflow-y-auto bg-[#f7f8f5] px-5 pb-8 pt-4">
      <header className="mb-5 flex items-center gap-3">
        <button type="button" onClick={onBack} aria-label="Kembali" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700">
          <ArrowLeft size={18} />
        </button>
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase text-teal-700">Health memory</p>
          <h1 className="text-xl font-extrabold leading-tight text-slate-900">AI rangkuman harian</h1>
        </div>
      </header>

      <AppJourneyFlow activeStep="learn" onTabChange={onTabChange} compact />

      <section className="mb-5 overflow-hidden rounded-2xl bg-[#173f38] text-white shadow-[0_14px_32px_rgba(23,63,56,0.16)]">
        <div className="border-b border-white/10 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-extrabold uppercase text-teal-100">{analysis.summary.label}</p>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-extrabold text-teal-100">
              {usingDemoData ? 'Demo data' : `${analysis.stats.daysWithCheckIn}/7 hari`}
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <Sparkles size={21} className="text-amber-300" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold leading-tight">{analysis.summary.title}</h2>
              <p className="mt-2 text-xs font-medium leading-relaxed text-teal-50">{analysis.summary.text}</p>
            </div>
          </div>
          <button type="button" onClick={applySuggestion} className={`mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border-0 text-xs font-extrabold ${applied ? 'bg-teal-500 text-white' : 'bg-white text-[#173f38]'}`}>
            {applied ? <><Check size={15} /> Rencana diperbarui</> : analysis.summary.action}
          </button>
        </div>
      </section>

      {usingDemoData && (
        <section className="mb-5 rounded-2xl border border-amber-100 bg-amber-50 p-3.5">
          <p className="text-xs font-extrabold text-amber-900">Mode presentasi aktif</p>
          <p className="mt-1 text-[11px] font-medium leading-relaxed text-amber-800">
            Karena riwayat asli masih sedikit, layar ini memakai contoh data lokal agar konsep memory terlihat hidup saat demo.
          </p>
        </section>
      )}

      <section className="mb-5">
        <h2 className="mb-3 text-[11px] font-extrabold uppercase text-slate-500">Pola yang dipelajari</h2>
        <div className="space-y-2">
          {analysis.patterns.map(({ id, title, text, Icon, tone }) => (
            <article key={id} className="rounded-2xl border border-slate-200 bg-white p-3.5">
              <div className="flex gap-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                  <Icon size={18} />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
                  <p className="mt-1 text-[11px] font-medium leading-relaxed text-slate-500">{text}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-5">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase text-slate-500">Timeline memory</p>
            <h2 className="mt-0.5 text-base font-extrabold text-slate-900">7 hari terakhir</h2>
          </div>
          <CalendarDays size={18} className="text-slate-400" />
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {days.map((day, index) => (
            <article key={day.key} className={`flex gap-3 p-3.5 ${index > 0 ? 'border-t border-slate-100' : ''}`}>
              <div className="w-10 shrink-0 text-center">
                <p className="text-[9px] font-extrabold uppercase text-slate-400">{day.shortDay}</p>
                <p className="mt-0.5 text-base font-extrabold text-slate-900">{day.date}</p>
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  <span className="rounded-lg bg-violet-50 px-2 py-1 text-[9px] font-extrabold text-violet-700">Mood {scoreLabel(day.checkIn?.mood, 'mood')}</span>
                  <span className="rounded-lg bg-sky-50 px-2 py-1 text-[9px] font-extrabold text-sky-700">Tidur {scoreLabel(day.checkIn?.sleep, 'sleep')}</span>
                  <span className="rounded-lg bg-amber-50 px-2 py-1 text-[9px] font-extrabold text-amber-700">Energi {scoreLabel(day.checkIn?.energy, 'energy')}</span>
                </div>
                <p className="text-xs font-bold leading-relaxed text-slate-700">{day.note}</p>
                <p className="mt-1 text-[10px] font-medium text-slate-400">
                  {day.meals.length} makanan - {day.completedActions.length} aksi selesai - {day.logs.length} catatan
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <ClipboardList size={18} />
          </span>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">Ringkasan untuk profesional</h2>
            <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">{analysis.handoff}</p>
            <p className="mt-2 text-[10px] font-medium leading-relaxed text-slate-400">
              Ini bukan diagnosis. Ini membantu dokter, PT, atau psikolog melihat konteks kebiasaan sebelum sesi.
            </p>
          </div>
        </div>
      </section>

      <button type="button" className="flex w-full items-center gap-3 rounded-2xl bg-slate-900 p-4 text-left text-white">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
          <Stethoscope size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-extrabold">Konsep yang susah ditiru</span>
          <span className="mt-0.5 block text-xs font-medium leading-relaxed text-slate-300">
            Nilainya tumbuh dari memory personal, bukan dari daftar fitur generik.
          </span>
        </span>
        <ChevronRight size={17} className="text-slate-400" />
      </button>
    </div>
  );
}
