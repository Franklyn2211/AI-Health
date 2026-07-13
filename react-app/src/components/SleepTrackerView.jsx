import { useMemo, useState } from 'react';
import {
  AlarmClock,
  ArrowLeft,
  Check,
  Info,
  Moon,
  RotateCcw,
  Smartphone,
  Sparkles,
  Sun,
} from 'lucide-react';
import { useHealth } from '../context/healthContextCore';

const QUALITY_OPTIONS = [
  { value: 1, label: 'Kurang' },
  { value: 2, label: 'Cukup' },
  { value: 3, label: 'Baik' },
];

const ROUTINE_ITEMS = [
  'Kurangi layar sebelum tidur',
  'Hindari kafein sore atau malam',
  'Redupkan lampu kamar',
  'Siapkan waktu bangun yang konsisten',
];

function calculateDuration(bedtime, wakeTime) {
  if (!bedtime || !wakeTime) return null;
  const [bedHour, bedMinute] = bedtime.split(':').map(Number);
  const [wakeHour, wakeMinute] = wakeTime.split(':').map(Number);
  let minutes = (wakeHour * 60 + wakeMinute) - (bedHour * 60 + bedMinute);
  if (minutes <= 0) minutes += 24 * 60;
  return minutes;
}

function getDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function getTomorrowKey() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getDateKey(tomorrow);
}

function buildSleepImpact({ duration, quality, awakenings, rested }) {
  const shortSleep = duration < 390;
  const interrupted = awakenings >= 3;
  const lowRecovery = quality === 1 || rested === 1 || shortSleep || interrupted;

  if (lowRecovery) {
    return {
      status: 'Recovery rendah',
      planMode: 'minimum',
      tone: 'amber',
      detail: 'AI menurunkan plan karena tidur kurang, sering terbangun, atau energi pagi rendah.',
      tomorrow: 'Besok dimulai dari minimum mode: makan stabil, gerak ringan, dan wind-down lebih awal.',
    };
  }

  if (duration >= 450 && quality >= 2 && rested >= 2) {
    return {
      status: 'Recovery cukup',
      planMode: 'short',
      tone: 'teal',
      detail: 'Tidur cukup untuk menjalankan plan ringkas tanpa menambah tekanan.',
      tomorrow: 'Besok tetap normal. AI menjaga target tetap realistis sesuai goal utama.',
    };
  }

  return {
    status: 'Recovery sedang',
    planMode: 'short',
    tone: 'sky',
    detail: 'Tidur tidak buruk, tapi belum cukup kuat untuk target yang terlalu berat.',
    tomorrow: 'Besok AI menjaga plan ringkas dan memprioritaskan recovery.',
  };
}

export default function SleepTrackerView({ onBack }) {
  const { todayRecord, updateDailyRecord } = useHealth();
  const existing = todayRecord.sleepDetails;
  const [bedtime, setBedtime] = useState(existing?.bedtime || '22:30');
  const [wakeTime, setWakeTime] = useState(existing?.wakeTime || '06:30');
  const [quality, setQuality] = useState(existing?.quality || 2);
  const [awakenings, setAwakenings] = useState(existing?.awakenings ?? 0);
  const [rested, setRested] = useState(existing?.rested || 2);
  const [routine, setRoutine] = useState(existing?.routine || []);
  const [saved, setSaved] = useState(Boolean(existing));
  const [impact, setImpact] = useState(existing?.planImpact || null);

  const duration = useMemo(() => calculateDuration(bedtime, wakeTime), [bedtime, wakeTime]);
  const durationLabel = duration
    ? `${Math.floor(duration / 60)} jam ${duration % 60} menit`
    : 'Belum lengkap';

  const toggleRoutine = (item) => {
    setRoutine((current) => (
      current.includes(item)
        ? current.filter((entry) => entry !== item)
        : [...current, item]
    ));
  };

  const saveSleep = () => {
    if (!duration) return;
    const planImpact = buildSleepImpact({ duration, quality, awakenings, rested });
    updateDailyRecord((current) => ({
      checkIn: {
        energy: current.checkIn?.energy || rested,
        mood: current.checkIn?.mood || 2,
        sleep: quality,
      },
      planMode: planImpact.planMode === 'minimum' ? 'minimum' : current.planMode,
      autoAdjustNote: planImpact.planMode === 'minimum'
        ? 'Tidur/recovery rendah, jadi AI menurunkan target hari ini.'
        : current.autoAdjustNote,
      sleepDetails: {
        bedtime,
        wakeTime,
        durationMinutes: duration,
        quality,
        awakenings,
        rested,
        routine,
        planImpact,
        source: 'self-reported',
        recordedAt: new Date().toISOString(),
      },
    }));
    updateDailyRecord((current) => ({
      ...current,
      planMode: planImpact.planMode,
      tomorrowAdjustment: {
        reasonId: 'sleep',
        reasonLabel: planImpact.status,
        sourceDate: getDateKey(),
        title: planImpact.status,
        detail: planImpact.tomorrow,
        carryOver: ['Recovery tidur'],
        createdAt: new Date().toISOString(),
      },
      planGeneratedAt: new Date().toISOString(),
    }), getTomorrowKey());
    setImpact(planImpact);
    setSaved(true);
  };

  const activeImpact = impact || existing?.planImpact;

  return (
    <div className="screen-scroll h-full overflow-y-auto bg-[#f7f8f5] px-5 pb-8 pt-4">
      <header className="mb-5 flex items-center gap-3">
        <button type="button" onClick={onBack} aria-label="Kembali" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700">
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-[10px] font-extrabold uppercase text-sky-700">Catatan semalam</p>
          <h1 className="text-xl font-extrabold text-slate-900">Tidur tanpa wearable</h1>
        </div>
      </header>

      <section className="mb-4 flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-3.5">
        <Smartphone size={18} className="mt-0.5 shrink-0 text-sky-700" />
        <p className="text-[11px] font-medium leading-relaxed text-sky-900">
          Data ini berdasarkan laporanmu, bukan pengukuran medis. Ponsel tidak dapat menentukan fase tidur secara akurat.
        </p>
      </section>

      {saved ? (
        <>
          <section className="mb-4 rounded-2xl bg-slate-900 p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase text-sky-300">Tidur tercatat</p>
                <h2 className="mt-1 text-2xl font-extrabold">{durationLabel}</h2>
                <p className="mt-1 text-xs font-medium text-slate-300">{bedtime} sampai {wakeTime} · Kualitas {quality}/3</p>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10"><Moon size={22} className="text-sky-300" /></span>
            </div>
          </section>
          {activeImpact && (
            <section className="mb-4 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                  {activeImpact.planMode === 'minimum' ? <RotateCcw size={18} /> : <Sparkles size={18} />}
                </span>
                <div>
                  <p className="text-[10px] font-extrabold uppercase text-sky-700">Impact ke plan</p>
                  <h2 className="mt-1 text-sm font-extrabold text-slate-900">{activeImpact.status}</h2>
                  <p className="mt-1 text-xs font-bold leading-relaxed text-slate-600">{activeImpact.detail}</p>
                  <p className="mt-2 rounded-xl bg-sky-50 px-3 py-2 text-[11px] font-bold leading-relaxed text-sky-900">{activeImpact.tomorrow}</p>
                </div>
              </div>
            </section>
          )}
          <button type="button" onClick={() => setSaved(false)} className="mb-4 h-11 w-full rounded-xl border border-slate-200 bg-white text-xs font-extrabold text-slate-700">
            Ubah catatan tidur
          </button>
        </>
      ) : (
        <>
          <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-extrabold text-slate-900">Waktu tidur</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <label>
                <span className="mb-2 flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-slate-500"><Moon size={12} /> Mulai tidur</span>
                <input type="time" value={bedtime} onChange={(event) => setBedtime(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-sky-500" />
              </label>
              <label>
                <span className="mb-2 flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-slate-500"><Sun size={12} /> Bangun</span>
                <input type="time" value={wakeTime} onChange={(event) => setWakeTime(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-sky-500" />
              </label>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2.5">
              <AlarmClock size={16} className="text-sky-700" />
              <p className="text-xs font-extrabold text-sky-900">Perkiraan durasi: {durationLabel}</p>
            </div>
          </section>

          <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-extrabold text-slate-900">Bagaimana kualitasnya?</h2>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {QUALITY_OPTIONS.map((option) => (
                <button key={option.value} type="button" onClick={() => setQuality(option.value)} className={`h-11 rounded-xl border text-xs font-extrabold ${quality === option.value ? 'border-sky-600 bg-sky-50 text-sky-800' : 'border-slate-200 bg-white text-slate-600'}`}>
                  {option.label}
                </button>
              ))}
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-extrabold uppercase text-slate-500">Terbangun malam hari</p>
                <span className="text-sm font-extrabold text-slate-900">{awakenings} kali</span>
              </div>
              <input type="range" min="0" max="5" value={awakenings} onChange={(event) => setAwakenings(Number(event.target.value))} className="mt-2 w-full accent-sky-600" />
            </div>

            <div className="mt-5">
              <p className="text-[11px] font-extrabold uppercase text-slate-500">Energi saat bangun</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {QUALITY_OPTIONS.map((option) => (
                  <button key={option.value} type="button" onClick={() => setRested(option.value)} className={`h-10 rounded-xl border text-xs font-bold ${rested === option.value ? 'border-teal-600 bg-teal-50 text-teal-800' : 'border-slate-200 bg-white text-slate-600'}`}>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-extrabold text-slate-900">Rutinitas tadi malam</h2>
            <div className="mt-3 space-y-2">
              {ROUTINE_ITEMS.map((item) => (
                <button key={item} type="button" onClick={() => toggleRoutine(item)} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left">
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${routine.includes(item) ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300 text-transparent'}`}><Check size={12} strokeWidth={3} /></span>
                  <span className="text-[11px] font-bold text-slate-700">{item}</span>
                </button>
              ))}
            </div>
          </section>

          <button type="button" onClick={saveSleep} className="h-12 w-full rounded-xl border-0 bg-sky-700 text-sm font-extrabold text-white">
            Simpan catatan tidur
          </button>
        </>
      )}

      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><Info size={18} /></span>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">Apa yang akan dipelajari?</h2>
            <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">Setelah beberapa hari, Weekly Insights dapat membandingkan durasi, kualitas, energi pagi, dan rutinitasmu tanpa mengklaim fase tidur yang tidak diukur.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
