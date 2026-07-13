import { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Frown,
  Laugh,
  Meh,
  ShieldAlert,
  Smile,
  Sparkles,
} from 'lucide-react';
import { useHealth } from '../context/healthContextCore';

const MOODS = [
  { id: 'great', label: 'Sangat baik', value: 3, Icon: Laugh, tone: 'border-emerald-400 bg-emerald-50 text-emerald-700' },
  { id: 'good', label: 'Baik', value: 3, Icon: Smile, tone: 'border-teal-400 bg-teal-50 text-teal-700' },
  { id: 'neutral', label: 'Biasa', value: 2, Icon: Meh, tone: 'border-amber-400 bg-amber-50 text-amber-700' },
  { id: 'low', label: 'Berat', value: 1, Icon: Frown, tone: 'border-rose-400 bg-rose-50 text-rose-700' },
];

const TRIGGERS = ['Pekerjaan', 'Kuliah', 'Hubungan', 'Keuangan', 'Kesehatan', 'Tidur', 'Tidak yakin'];
const NEEDS = ['Istirahat', 'Bicara dengan seseorang', 'Bergerak', 'Waktu sendiri', 'Menyusun prioritas'];

const NEED_ACTIONS = {
  Istirahat: {
    title: 'Recovery mode',
    detail: 'Plan hari ini dibuat lebih ringan. Fokus cukup makan stabil dan tidur lebih rapi.',
    tomorrow: 'Besok AI mulai dari satu langkah kecil agar tidak terasa mengejar ketertinggalan.',
  },
  'Bicara dengan seseorang': {
    title: 'Cari support',
    detail: 'AI menyarankan chat ahli atau orang tepercaya jika pola ini berulang.',
    tomorrow: 'Besok plan tetap pendek dan menyisakan ruang untuk support emosional.',
  },
  Bergerak: {
    title: 'Gerak ringan',
    detail: 'Mulai dari jalan 5-10 menit atau stretching, bukan workout berat.',
    tomorrow: 'Besok AI memilih gerak rendah tekanan agar mood tidak makin berat.',
  },
  'Waktu sendiri': {
    title: 'Kurangi input',
    detail: 'Plan diprioritaskan ke hal yang bisa dilakukan sendiri dan tidak banyak keputusan.',
    tomorrow: 'Besok checklist dibuat lebih sederhana agar tidak terasa ramai.',
  },
  'Menyusun prioritas': {
    title: 'Satu prioritas',
    detail: 'AI menjaga hanya satu task utama agar hari ini tetap punya arah.',
    tomorrow: 'Besok dimulai dari task paling penting, bukan semua sekaligus.',
  },
};

function getDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function getTomorrowKey() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getDateKey(tomorrow);
}

export default function MoodTrackerView({ onBack }) {
  const { todayRecord, updateDailyRecord } = useHealth();
  const existing = todayRecord.moodDetails;
  const [mood, setMood] = useState(existing?.moodId || '');
  const [triggers, setTriggers] = useState(existing?.triggers || []);
  const [need, setNeed] = useState(existing?.need || '');
  const [note, setNote] = useState(existing?.note || '');
  const [saved, setSaved] = useState(Boolean(existing));
  const [impact, setImpact] = useState(existing?.planImpact || null);

  const toggleTrigger = (trigger) => {
    setTriggers((current) => (
      current.includes(trigger)
        ? current.filter((item) => item !== trigger)
        : [...current, trigger]
    ));
  };

  const saveMood = () => {
    const selected = MOODS.find((item) => item.id === mood);
    if (!selected) return;
    const action = NEED_ACTIONS[need] || {
      title: selected.value === 1 ? 'Plan lebih ringan' : 'Mood tercatat',
      detail: selected.value === 1
        ? 'AI menurunkan tekanan hari ini dan fokus ke recovery.'
        : 'Mood dipakai sebagai konteks untuk plan dan insight mingguan.',
      tomorrow: selected.value === 1
        ? 'Besok AI memulai dari minimum mode.'
        : 'Besok tetap normal, tapi AI menyimpan konteks mood hari ini.',
    };
    const shouldLighten = selected.value === 1 || need === 'Istirahat' || triggers.includes('Tidur');
    const planImpact = {
      ...action,
      planMode: shouldLighten ? 'minimum' : 'short',
      createdAt: new Date().toISOString(),
    };
    updateDailyRecord((current) => ({
      checkIn: {
        energy: current.checkIn?.energy || 2,
        sleep: current.checkIn?.sleep || 2,
        mood: selected.value,
      },
      planMode: shouldLighten ? 'minimum' : current.planMode,
      autoAdjustNote: shouldLighten
        ? 'Mood/recovery hari ini berat, jadi AI menurunkan plan agar tetap realistis.'
        : current.autoAdjustNote,
      moodDetails: {
        moodId: selected.id,
        label: selected.label,
        value: selected.value,
        triggers,
        need,
        note: note.trim(),
        planImpact,
        recordedAt: new Date().toISOString(),
      },
    }));
    updateDailyRecord((current) => ({
      ...current,
      planMode: shouldLighten ? 'minimum' : (current.planMode || 'short'),
      tomorrowAdjustment: {
        reasonId: 'mood',
        reasonLabel: need || selected.label,
        sourceDate: getDateKey(),
        title: action.title,
        detail: action.tomorrow,
        carryOver: ['Mood recovery'],
        createdAt: new Date().toISOString(),
      },
      planGeneratedAt: new Date().toISOString(),
    }), getTomorrowKey());
    setImpact(planImpact);
    setSaved(true);
  };

  const selectedMood = MOODS.find((item) => item.id === mood);
  const selectedNeedAction = NEED_ACTIONS[need];

  return (
    <div className="screen-scroll h-full overflow-y-auto bg-[#f7f8f5] px-5 pb-8 pt-4">
      <header className="mb-5 flex items-center gap-3">
        <button type="button" onClick={onBack} aria-label="Kembali" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700">
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-[10px] font-extrabold uppercase text-violet-700">Catatan harian</p>
          <h1 className="text-xl font-extrabold text-slate-900">Mood dan kebutuhan</h1>
        </div>
      </header>

      {saved && (
        <section className="mb-4 flex items-center gap-3 rounded-2xl border border-teal-100 bg-teal-50 p-3.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-teal-700"><Check size={18} strokeWidth={3} /></span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold text-teal-950">Mood hari ini tersimpan</p>
            <p className="text-[11px] font-medium text-teal-700">{selectedMood?.label || existing?.label}</p>
          </div>
          <button type="button" onClick={() => setSaved(false)} className="border-0 bg-transparent text-[11px] font-extrabold text-teal-700">Ubah</button>
        </section>
      )}

      {saved && (impact || existing?.planImpact) && (
        <section className="mb-4 rounded-2xl border border-violet-100 bg-violet-50 p-4">
          <p className="text-[10px] font-extrabold uppercase text-violet-700">Impact ke plan</p>
          <h2 className="mt-1 text-sm font-extrabold text-violet-950">{(impact || existing?.planImpact)?.title}</h2>
          <p className="mt-1 text-xs font-bold leading-relaxed text-violet-800">{(impact || existing?.planImpact)?.detail}</p>
          <p className="mt-2 rounded-xl bg-white/70 px-3 py-2 text-[11px] font-bold leading-relaxed text-violet-900">
            {(impact || existing?.planImpact)?.tomorrow}
          </p>
        </section>
      )}

      {!saved && (
        <>
          <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-extrabold text-slate-900">Bagaimana perasaanmu sekarang?</h2>
            <p className="mt-1 text-xs font-medium text-slate-500">Pilih yang paling mendekati, tidak harus sempurna.</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {MOODS.map(({ id, label, Icon, tone }) => (
                <button key={id} type="button" onClick={() => setMood(id)} className={`flex min-h-[76px] items-center gap-3 rounded-2xl border-2 p-3 text-left ${mood === id ? tone : 'border-slate-100 bg-slate-50 text-slate-600'}`}>
                  <Icon size={22} />
                  <span className="text-xs font-extrabold">{label}</span>
                </button>
              ))}
            </div>
          </section>

          {mood && (
            <>
              <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
                <h2 className="text-sm font-extrabold text-slate-900">Apa yang mungkin memengaruhinya?</h2>
                <p className="mt-1 text-xs font-medium text-slate-500">Pilih satu atau beberapa. “Tidak yakin” juga valid.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {TRIGGERS.map((trigger) => (
                    <button key={trigger} type="button" onClick={() => toggleTrigger(trigger)} className={`rounded-xl border px-3 py-2 text-[11px] font-bold ${triggers.includes(trigger) ? 'border-violet-500 bg-violet-50 text-violet-800' : 'border-slate-200 bg-white text-slate-600'}`}>
                      {trigger}
                    </button>
                  ))}
                </div>
              </section>

              <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
                <h2 className="text-sm font-extrabold text-slate-900">Apa yang kamu butuhkan?</h2>
                <div className="mt-3 space-y-2">
                  {NEEDS.map((option) => (
                    <button key={option} type="button" onClick={() => setNeed(option)} className={`flex h-11 w-full items-center justify-between rounded-xl border px-3 text-left text-xs font-bold ${need === option ? 'border-teal-600 bg-teal-50 text-teal-800' : 'border-slate-200 bg-white text-slate-600'}`}>
                      {option}
                      {need === option && <Check size={15} />}
                    </button>
                  ))}
                </div>
                {selectedNeedAction && (
                  <div className="mt-3 rounded-xl bg-violet-50 px-3 py-2">
                    <p className="text-[11px] font-extrabold text-violet-900">{selectedNeedAction.title}</p>
                    <p className="mt-0.5 text-[10px] font-bold leading-relaxed text-violet-700">{selectedNeedAction.detail}</p>
                  </div>
                )}
              </section>

              <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
                <label htmlFor="mood-note" className="text-sm font-extrabold text-slate-900">Catatan singkat</label>
                <textarea id="mood-note" value={note} onChange={(event) => setNote(event.target.value)} rows={3} placeholder="Apa yang ingin kamu ingat tentang hari ini?" className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs outline-none focus:border-violet-500" />
              </section>

              {selectedMood?.value === 1 && (
                <section className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                  <ShieldAlert size={18} className="mt-0.5 shrink-0 text-amber-700" />
                  <div>
                    <p className="text-xs font-extrabold text-amber-950">Kamu tidak harus menghadapinya sendirian</p>
                    <p className="mt-1 text-[11px] font-medium leading-relaxed text-amber-800">Pertimbangkan menghubungi orang yang dipercaya atau tenaga profesional jika perasaan ini berat, berulang, atau mengganggu aktivitas.</p>
                  </div>
                </section>
              )}

              <button type="button" onClick={saveMood} className="h-12 w-full rounded-xl border-0 bg-violet-700 text-sm font-extrabold text-white">
                Simpan catatan mood
              </button>
            </>
          )}
        </>
      )}

      <section className="mt-5 rounded-2xl bg-slate-900 p-4 text-white">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10"><Sparkles size={18} className="text-violet-300" /></span>
          <div>
            <h2 className="text-sm font-extrabold">Refleksi yang berguna</h2>
            <p className="mt-1 text-xs font-medium leading-relaxed text-slate-300">Catatan pemicu dan kebutuhan akan membantu Weekly Insights melihat konteks, bukan hanya angka mood.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
