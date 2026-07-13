import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CalendarCheck,
  Check,
  ChevronRight,
  ClipboardList,
  Droplets,
  FlaskConical,
  Info,
  Moon,
  Sparkles,
  Utensils,
  Zap,
} from 'lucide-react';
import { useHealth } from '../context/healthContextCore';
import { buildAdaptiveTargets } from '../lib/adaptiveTargets';

const EXPERIMENTS = [
  {
    id: 'earlier-bedtime',
    title: 'Tidur 20 menit lebih awal',
    description: 'Coba selama lima hari dan amati energi pagimu.',
    days: 5,
    Icon: Moon,
    tone: 'bg-sky-50 text-sky-700',
  },
  {
    id: 'after-lunch-walk',
    title: 'Jalan 10 menit setelah makan',
    description: 'Uji apakah gerak singkat membantu energi sore.',
    days: 5,
    Icon: Zap,
    tone: 'bg-emerald-50 text-emerald-700',
  },
  {
    id: 'breakfast',
    title: 'Sarapan secara konsisten',
    description: 'Catat perubahan rasa lapar dan energi selama lima hari.',
    days: 5,
    Icon: Utensils,
    tone: 'bg-orange-50 text-orange-700',
  },
];

const formatDateKey = (date) => date.toISOString().slice(0, 10);

function buildWeek() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    return {
      key: formatDateKey(date),
      day: date.toLocaleDateString('id-ID', { weekday: 'short' }).slice(0, 2),
      date: date.getDate(),
    };
  });
}

function average(values) {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function buildWeeklyReview({ adaptivePlan, weekRecords, recordedDays, mealDays, completedActions, symptomCount }) {
  const proteinDays = weekRecords.filter((record) => (
    (record.macros?.protein || 0) >= adaptivePlan.nutrition.proteinTarget * 0.7
  )).length;
  const lowRecoveryDays = weekRecords.filter((record) => (
    record.checkIn?.sleep === 1 || record.checkIn?.mood === 1 || record.checkIn?.energy === 1
  )).length;
  const reviewedDays = weekRecords.filter((record) => record.dailyReview).length;

  const wins = [];
  if (mealDays >= 4) wins.push('Makanan mulai cukup konsisten untuk dibaca AI.');
  if (proteinDays >= 3) wins.push('Protein sudah muncul di beberapa hari penting.');
  if (completedActions >= 5) wins.push('Checklist harian mulai membentuk ritme.');
  if (!wins.length) wins.push('Data awal sudah cukup untuk memulai plan yang lebih personal.');

  const blockers = [];
  if (proteinDays < 3) blockers.push('Protein masih sering rendah dibanding target.');
  if (lowRecoveryDays >= 2) blockers.push('Recovery rendah muncul beberapa kali minggu ini.');
  if (mealDays < 4) blockers.push('Catatan makanan masih kurang, jadi rekomendasi nutrisi belum tajam.');
  if (symptomCount > 0) blockers.push('Ada gejala tercatat yang sebaiknya dibawa ke chat ahli bila berulang.');
  if (!blockers.length) blockers.push('Belum ada blocker besar, fokusnya menjaga konsistensi.');

  let nextChange = 'Minggu depan AI menjaga plan ringkas dan fokus ke satu kebiasaan utama.';
  if (adaptivePlan.direction === 'gain' && proteinDays < 4) {
    nextChange = `Minggu depan AI memprioritaskan protein ${adaptivePlan.nutrition.proteinTarget}g dan surplus sehat.`;
  } else if (adaptivePlan.direction === 'lose' && mealDays >= 4) {
    nextChange = 'Minggu depan AI menjaga defisit ringan tanpa menambah target olahraga berlebihan.';
  } else if (lowRecoveryDays >= 2) {
    nextChange = 'Minggu depan AI lebih sering memakai recovery mode agar target tidak terlalu berat.';
  }

  return {
    confidence: recordedDays >= 5 ? 'Review cukup kuat' : recordedDays >= 3 ? 'Review awal' : 'Butuh data lagi',
    wins,
    blockers,
    nextChange,
    reviewedDays,
  };
}

function TrendRow({ label, Icon, color, field, week, records }) {
  return (
    <div className="border-t border-slate-100 py-3 first:border-t-0 first:pt-0 last:pb-0">
      <div className="mb-2 flex items-center gap-2">
        <Icon size={14} className={color} />
        <p className="text-[11px] font-extrabold text-slate-700">{label}</p>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {week.map((day) => {
          const value = records[day.key]?.checkIn?.[field];
          return (
            <div key={day.key} className="flex h-12 items-end rounded-lg bg-slate-50 p-1">
              {value ? (
                <div
                  className={`w-full rounded-md ${field === 'mood' ? 'bg-violet-400' : field === 'sleep' ? 'bg-sky-400' : 'bg-amber-400'}`}
                  style={{ height: `${value * 30}%` }}
                  title={`${label}: ${value}/3`}
                />
              ) : (
                <div className="mb-1 h-px w-full border-t border-dashed border-slate-300" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function WeeklyInsightsView({ onBack }) {
  const {
    dailyRecords,
    todayRecord,
    userProfile,
    healthExperiment,
    startHealthExperiment,
    toggleExperimentToday,
  } = useHealth();
  const [experimentPickerOpen, setExperimentPickerOpen] = useState(false);
  const week = useMemo(() => buildWeek(), []);
  const weekRecords = week.map((day) => dailyRecords[day.key] || {});
  const checkInRecords = weekRecords.filter((record) => record.checkIn);
  const recordedDays = checkInRecords.length;
  const sleepAverage = average(checkInRecords.map((record) => record.checkIn.sleep));
  const energyAverage = average(checkInRecords.map((record) => record.checkIn.energy));
  const mealDays = weekRecords.filter((record) => (record.meals || []).length > 0).length;
  const waterTotal = weekRecords.reduce((sum, record) => sum + (record.water || 0), 0);
  const completedActions = weekRecords.reduce((sum, record) => sum + (record.completedActions || []).length, 0);
  const symptomCount = weekRecords.reduce(
    (sum, record) => sum + (record.logs || []).filter((log) => log.type === 'symptom').length,
    0,
  );
  const adaptivePlan = useMemo(() => (
    buildAdaptiveTargets(userProfile, todayRecord, dailyRecords)
  ), [dailyRecords, todayRecord, userProfile]);
  const weeklyReview = useMemo(() => (
    buildWeeklyReview({ adaptivePlan, weekRecords, recordedDays, mealDays, completedActions, symptomCount })
  ), [adaptivePlan, completedActions, mealDays, recordedDays, symptomCount, weekRecords]);

  const observation = useMemo(() => {
    if (recordedDays < 3) {
      return {
        title: 'Data masih terbatas',
        text: `Ada ${recordedDays} check-in dalam tujuh hari terakhir. Catat setidaknya tiga hari sebelum membandingkan tidur, energi, dan mood.`,
        confidence: 'Belum cukup untuk menyimpulkan pola',
      };
    }

    if (sleepAverage >= 2.3 && energyAverage >= 2.3) {
      return {
        title: 'Tidur dan energi bergerak ke arah yang sama',
        text: 'Pada catatan minggu ini, kualitas tidur dan energi sama-sama relatif baik. Ini adalah observasi awal, bukan bukti bahwa satu menyebabkan yang lain.',
        confidence: `Berdasarkan ${recordedDays} hari yang tercatat`,
      };
    }

    if (sleepAverage < 2 && energyAverage < 2) {
      return {
        title: 'Tidur dan energi sama-sama lebih rendah',
        text: 'Catatan awal menunjukkan tidur dan energi berada di sisi rendah. Eksperimen tidur lebih awal dapat membantu menguji apakah keduanya berubah bersama.',
        confidence: `Berdasarkan ${recordedDays} hari yang tercatat`,
      };
    }

    return {
      title: 'Belum ada pola yang konsisten',
      text: 'Nilai tidur, energi, dan mood belum bergerak dalam arah yang cukup jelas. Teruskan check-in tanpa mengubah terlalu banyak hal sekaligus.',
      confidence: `Berdasarkan ${recordedDays} hari yang tercatat`,
    };
  }, [energyAverage, recordedDays, sleepAverage]);

  const experimentTodayDone = healthExperiment?.completedDays?.includes(formatDateKey(new Date()));

  return (
    <div className="screen-scroll h-full overflow-y-auto bg-[#f7f8f5] px-5 pb-8 pt-4">
      <header className="mb-5 flex items-center gap-3">
        <button type="button" onClick={onBack} aria-label="Kembali" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700">
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-[10px] font-extrabold uppercase text-teal-700">Tujuh hari terakhir</p>
          <h1 className="text-xl font-extrabold text-slate-900">Insight mingguan</h1>
        </div>
      </header>

      <section className="mb-5 rounded-2xl bg-slate-900 p-4 text-white">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10"><Sparkles size={18} className="text-amber-300" /></span>
          <div>
            <p className="text-[10px] font-extrabold uppercase text-teal-300">{observation.confidence}</p>
            <h2 className="mt-1 text-base font-extrabold">{observation.title}</h2>
            <p className="mt-2 text-xs font-medium leading-relaxed text-slate-300">{observation.text}</p>
          </div>
        </div>
      </section>

      <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <Sparkles size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-extrabold uppercase text-teal-700">{weeklyReview.confidence}</p>
            <h2 className="mt-1 text-base font-extrabold text-slate-900">Weekly AI review</h2>
            <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">{weeklyReview.nextChange}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-emerald-50 p-3">
            <p className="text-[10px] font-extrabold uppercase text-emerald-700">Yang membaik</p>
            <p className="mt-2 text-[11px] font-bold leading-relaxed text-emerald-900">{weeklyReview.wins[0]}</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-3">
            <p className="text-[10px] font-extrabold uppercase text-amber-700">Blocker</p>
            <p className="mt-2 text-[11px] font-bold leading-relaxed text-amber-900">{weeklyReview.blockers[0]}</p>
          </div>
        </div>
        <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2">
          <p className="text-[10px] font-bold leading-relaxed text-slate-500">
            {weeklyReview.reviewedDays} daily review tersimpan minggu ini. Semakin sering review, semakin tajam adjustment besoknya.
          </p>
        </div>
      </section>

      <section className="mb-5">
        <div className="mb-3 grid grid-cols-7 gap-1.5 text-center">
          {week.map((day) => (
            <div key={day.key}>
              <p className="text-[9px] font-bold uppercase text-slate-400">{day.day}</p>
              <p className="mt-1 text-[10px] font-extrabold text-slate-700">{day.date}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <TrendRow label="Mood" Icon={Brain} color="text-violet-600" field="mood" week={week} records={dailyRecords} />
          <TrendRow label="Tidur" Icon={Moon} color="text-sky-600" field="sleep" week={week} records={dailyRecords} />
          <TrendRow label="Energi" Icon={Zap} color="text-amber-600" field="energy" week={week} records={dailyRecords} />
        </div>
        <div className="mt-2 flex items-center gap-2 px-1 text-[9px] font-medium text-slate-400">
          <Info size={11} /> Garis putus-putus berarti tidak ada catatan.
        </div>
      </section>

      <section className="mb-5">
        <h2 className="mb-3 text-[11px] font-extrabold uppercase text-slate-500">Konsistensi minggu ini</h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Check-in', value: `${recordedDays}/7 hari`, Icon: CalendarCheck, tone: 'text-teal-700 bg-teal-50' },
            { label: 'Makanan', value: `${mealDays}/7 hari`, Icon: Utensils, tone: 'text-orange-700 bg-orange-50' },
            { label: 'Air', value: `${waterTotal} gelas`, Icon: Droplets, tone: 'text-sky-700 bg-sky-50' },
            { label: 'Langkah selesai', value: completedActions, Icon: Check, tone: 'text-emerald-700 bg-emerald-50' },
          ].map(({ label, value, Icon, tone }) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-3">
              <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${tone}`}><Icon size={15} /></span>
              <p className="mt-3 text-base font-extrabold text-slate-900">{value}</p>
              <p className="text-[10px] font-bold text-slate-400">{label}</p>
            </div>
          ))}
        </div>
        {symptomCount > 0 && (
          <p className="mt-2 rounded-xl bg-rose-50 px-3 py-2 text-[10px] font-semibold text-rose-800">
            {symptomCount} gejala tercatat minggu ini. Pertimbangkan membawanya ke konsultasi jika berulang atau memburuk.
          </p>
        )}
      </section>

      <section className="mb-5">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase text-slate-500">Eksperimen kesehatan</p>
            <h2 className="mt-0.5 text-base font-extrabold text-slate-900">Ubah satu hal, lalu amati</h2>
          </div>
          {!healthExperiment && (
            <button type="button" onClick={() => setExperimentPickerOpen((open) => !open)} className="border-0 bg-transparent text-[11px] font-extrabold text-teal-700">Pilih</button>
          )}
        </div>

        {healthExperiment ? (
          <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700"><FlaskConical size={18} /></span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-teal-950">{healthExperiment.title}</p>
                <p className="mt-1 text-xs font-medium text-teal-800">{healthExperiment.description}</p>
                <p className="mt-2 text-[10px] font-extrabold text-teal-700">{healthExperiment.completedDays.length}/{healthExperiment.days} hari selesai</p>
              </div>
            </div>
            <button type="button" onClick={toggleExperimentToday} className={`mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-xs font-extrabold ${experimentTodayDone ? 'border-teal-700 bg-teal-700 text-white' : 'border-teal-200 bg-white text-teal-800'}`}>
              {experimentTodayDone ? <><Check size={15} /> Selesai hari ini</> : 'Tandai selesai hari ini'}
            </button>
          </div>
        ) : experimentPickerOpen ? (
          <div className="space-y-2">
            {EXPERIMENTS.map((experiment) => {
              const Icon = experiment.Icon;
              return (
                <button key={experiment.id} type="button" onClick={() => { startHealthExperiment(experiment); setExperimentPickerOpen(false); }} className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${experiment.tone}`}><Icon size={18} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-extrabold text-slate-900">{experiment.title}</span>
                    <span className="mt-0.5 block text-[10px] font-medium text-slate-500">{experiment.description}</span>
                  </span>
                  <ChevronRight size={16} className="text-slate-300" />
                </button>
              );
            })}
          </div>
        ) : (
          <button type="button" onClick={() => setExperimentPickerOpen(true)} className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-left">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><FlaskConical size={18} /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-extrabold text-slate-900">Mulai eksperimen lima hari</span>
              <span className="mt-0.5 block text-xs font-medium text-slate-500">Uji satu perubahan tanpa mengejar kesempurnaan.</span>
            </span>
            <ArrowRight size={16} className="text-slate-400" />
          </button>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><ClipboardList size={18} /></span>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">Ringkasan untuk tenaga profesional</h2>
            <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
              Fokus: {userProfile.focus || 'kesehatan umum'} · {recordedDays} check-in · {mealDays} hari mencatat makanan · {symptomCount} gejala.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
