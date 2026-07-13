import { useState } from 'react';
import {
  Activity,
  Brain,
  Camera,
  Check,
  ChevronRight,
  CirclePlus,
  Droplets,
  Dumbbell,
  HeartPulse,
  Moon,
  Stethoscope,
  Utensils,
} from 'lucide-react';
import { useHealth } from '../context/healthContextCore';
import QuickLogComposer from './QuickLogComposer';

const TRACKERS = [
  {
    id: 'food',
    title: 'Makanan',
    description: 'Pindai atau rencanakan makanan',
    Icon: Utensils,
    tone: 'bg-orange-50 text-orange-700 border-orange-100',
    subView: 'food-scanner',
  },
  {
    id: 'activity',
    title: 'Aktivitas',
    description: 'Latihan dan gerak harian',
    Icon: Dumbbell,
    tone: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    subView: 'fitness-routine',
  },
  {
    id: 'mood',
    title: 'Mood',
    description: 'Emosi, stres, dan refleksi',
    Icon: Brain,
    tone: 'bg-violet-50 text-violet-700 border-violet-100',
    subView: 'mood-tracker',
  },
  {
    id: 'sleep',
    title: 'Tidur',
    description: 'Kualitas dan rutinitas tidur',
    Icon: Moon,
    tone: 'bg-sky-50 text-sky-700 border-sky-100',
    subView: 'sleep-tracker',
  },
];

const LOG_LABELS = {
  symptom: 'Gejala',
};

export default function LifestyleView({ onTabChange, onSubViewChange }) {
  const {
    todayRecord,
    loggedMeals,
    incrementWater,
    addDailyLog,
    dailyRecords,
    reuseYesterdayEntries,
    updateDailyRecord,
  } = useHealth();
  const [symptomOpen, setSymptomOpen] = useState(false);
  const [symptom, setSymptom] = useState('');

  const water = todayRecord.water || 0;
  const logs = todayRecord.logs || [];
  const checkIn = todayRecord.checkIn;
  const [reuseMessage, setReuseMessage] = useState('');
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);
  const hasYesterday = Boolean(dailyRecords[yesterdayKey]);

  const saveSymptom = () => {
    const value = symptom.trim();
    if (!value) return;
    addDailyLog('symptom', { label: value });
    setSymptom('');
    setSymptomOpen(false);
  };

  const reuseYesterday = () => {
    const reused = reuseYesterdayEntries();
    setReuseMessage(reused ? 'Rutinitas kemarin sudah digunakan sebagai titik awal.' : 'Belum ada catatan kemarin.');
  };

  return (
    <div className="screen-scroll h-full overflow-y-auto bg-[#f7f8f5] px-5 pb-28 pt-5">
      <header className="mb-4">
        <p className="mb-1 text-[10px] font-extrabold uppercase text-teal-700">Catat</p>
        <h1 className="text-[25px] font-extrabold leading-tight text-slate-900">Catat cepat</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">Tulis satu kalimat, atau pilih shortcut. Tidak perlu lengkap.</p>
      </header>

      <QuickLogComposer />

      <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-3">
        <div className="grid grid-cols-3 divide-x divide-slate-100">
          <div className="px-2">
            <div className="flex items-center gap-1.5 text-sky-700">
              <Droplets size={15} />
              <p className="text-base font-extrabold">{water}</p>
            </div>
            <p className="mt-0.5 text-[10px] font-bold text-slate-400">Gelas air</p>
          </div>
          <div className="px-3">
            <div className="flex items-center gap-1.5 text-orange-700">
              <Utensils size={15} />
              <p className="text-base font-extrabold">{loggedMeals.length}</p>
            </div>
            <p className="mt-0.5 text-[10px] font-bold text-slate-400">Makanan</p>
          </div>
          <div className="px-3">
            <div className="flex items-center gap-1.5 text-violet-700">
              <HeartPulse size={15} />
              <p className="text-base font-extrabold">{checkIn ? `${checkIn.mood}/3` : '-'}</p>
            </div>
            <p className="mt-0.5 text-[10px] font-bold text-slate-400">Mood</p>
          </div>
        </div>
      </section>

      {hasYesterday && (
        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-3.5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Check size={17} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold text-slate-900">Mirip seperti kemarin?</p>
              <p className="mt-0.5 text-[10px] font-medium text-slate-500">Gunakan ulang makanan dan tidur, lalu ubah yang berbeda.</p>
            </div>
            <button type="button" onClick={reuseYesterday} className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-[10px] font-extrabold text-teal-700">Gunakan</button>
          </div>
          {reuseMessage && <p className="mt-2 rounded-lg bg-teal-50 px-2.5 py-2 text-[10px] font-semibold text-teal-800">{reuseMessage}</p>}
        </section>
      )}

      <section className="mb-5">
        <div className="grid grid-cols-3 gap-2">
          <button type="button" onClick={incrementWater} className="flex h-[62px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-sky-100 bg-sky-50 text-[11px] font-extrabold text-sky-700 active:scale-[0.98]">
            <CirclePlus size={20} />
            Air
          </button>
          <button type="button" onClick={() => onSubViewChange('food-scanner')} className="flex h-[62px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-orange-100 bg-orange-50 text-[11px] font-extrabold text-orange-700 active:scale-[0.98]">
            <Camera size={20} />
            Makan
          </button>
          <button type="button" onClick={() => setSymptomOpen((open) => !open)} className="flex h-[62px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-rose-100 bg-rose-50 text-[11px] font-extrabold text-rose-700 active:scale-[0.98]">
            <Activity size={20} />
            Gejala
          </button>
        </div>

        {symptomOpen && (
          <div className="mt-3 rounded-2xl border border-rose-100 bg-white p-3">
            <label className="text-[11px] font-extrabold uppercase text-slate-500" htmlFor="symptom-input">Apa yang kamu rasakan?</label>
            <div className="mt-2 flex gap-2">
              <input id="symptom-input" value={symptom} onChange={(event) => setSymptom(event.target.value)} placeholder="Contoh: sakit kepala ringan" className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-rose-400" />
              <button type="button" onClick={saveSymptom} className="h-11 rounded-xl border-0 bg-rose-600 px-4 text-xs font-extrabold text-white">Simpan</button>
            </div>
          </div>
        )}
      </section>

      <section className="mb-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[11px] font-extrabold uppercase text-slate-500">Detail kalau perlu</h2>
          <p className="text-[10px] font-bold text-slate-400">Opsional</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {TRACKERS.map(({ id, title, description, Icon, tone, subView }) => (
            <button key={id} type="button" onClick={() => onSubViewChange(subView)} className={`flex min-h-[76px] items-center gap-3 rounded-2xl border p-3 text-left transition-all active:scale-[0.98] ${tone}`}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/70">
                <Icon size={18} />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-extrabold text-slate-900">{title}</span>
                <span className="mt-0.5 line-clamp-2 block text-[10px] font-medium leading-relaxed text-slate-500">{description}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {logs.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 text-[11px] font-extrabold uppercase text-slate-500">Riwayat hari ini</h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {logs.map((log, index) => (
              <div key={log.id} className={`flex items-center gap-3 p-3.5 ${index > 0 ? 'border-t border-slate-100' : ''}`}>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Activity size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-extrabold text-slate-900">{LOG_LABELS[log.type] || 'Catatan'}</p>
                  <p className="truncate text-[11px] font-medium text-slate-500">{log.label}</p>
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  {new Date(log.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">Ringkasan hari ini</h2>
            <p className="mt-1 text-[11px] font-medium leading-relaxed text-slate-500">
              {water} gelas air · {loggedMeals.length} makanan · Mood {checkIn?.mood ? `${checkIn.mood}/3` : 'belum dicatat'} · Tidur {checkIn?.sleep ? `${checkIn.sleep}/3` : 'belum dicatat'}
            </p>
          </div>
          <button type="button" onClick={() => updateDailyRecord({ summaryConfirmed: true })} className={`shrink-0 rounded-xl px-3 py-2 text-[10px] font-extrabold ${todayRecord.summaryConfirmed ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
            {todayRecord.summaryConfirmed ? 'Sesuai' : 'Benar'}
          </button>
        </div>
      </section>

      <button type="button" onClick={() => onTabChange('clinic')} className="flex w-full items-center gap-3 rounded-2xl bg-slate-900 p-4 text-left text-white">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10"><Stethoscope size={19} /></span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-extrabold">Butuh bantuan profesional?</span>
          <span className="mt-0.5 block text-xs font-medium text-slate-300">Bagikan ringkasan catatanmu dengan tim perawatan.</span>
        </span>
        <ChevronRight size={17} className="text-slate-400" />
      </button>
    </div>
  );
}
