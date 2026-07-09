import { useState, useRef, useEffect } from 'react';
import { useHealth } from '../context/HealthContext';
import {
  ArrowLeft, Wind, Heart, Frown, Meh, Smile, Laugh,
  ChevronRight, RotateCcw, Play, Pause, CheckCircle2,
} from 'lucide-react';

/* ── Mood options ── */
const MOODS = [
  { id: 'great', label: 'Luar Biasa', Icon: Laugh, ring: 'border-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: '#10b981' },
  { id: 'good', label: 'Baik', Icon: Smile, ring: 'border-teal-400', bg: 'bg-teal-50', text: 'text-teal-700', dot: '#14b8a6' },
  { id: 'neutral', label: 'Biasa', Icon: Meh, ring: 'border-amber-400', bg: 'bg-amber-50', text: 'text-amber-700', dot: '#f59e0b' },
  { id: 'low', label: 'Kurang', Icon: Frown, ring: 'border-red-400', bg: 'bg-red-50', text: 'text-red-700', dot: '#ef4444' },
];

/* ── Guided breathing phases ── */
const BREATHING_PHASES = [
  { label: 'Tarik Napas', duration: 4, color: '#14b8a6', scale: 'scale-110' },
  { label: 'Tahan', duration: 4, color: '#8b5cf6', scale: 'scale-110' },
  { label: 'Buang Napas', duration: 6, color: '#f59e0b', scale: 'scale-90' },
];

/* ── Micro-exercises ── */
const MICRO_EXERCISES = [
  { id: 'breathing', title: 'Pernapasan 4-4-6', desc: '1 menit · Turunkan kortisol secara instan' },
  { id: 'gratitude', title: 'Catatan Syukur', desc: '2 menit · Tulis 3 hal yang Anda syukuri' },
  { id: 'body-scan', title: 'Body Scan', desc: '3 menit · Pindai ketegangan dari kepala ke kaki' },
  { id: 'grounding', title: 'Grounding 5-4-3-2-1', desc: '2 menit · Teknik mindfulness untuk fokus' },
];

/* ── Contextual AI support reply ── */
function getReply(msg) {
  const l = msg.toLowerCase();
  if (l.includes('stress') || l.includes('cemas') || l.includes('khawatir'))
    return 'Itu wajar. Coba teknik pernapasan 4-4-6 sekarang — hanya butuh 1 menit dan terbukti menenangkan sistem saraf. Mau saya pandu?';
  if (l.includes('sedih') || l.includes('down') || l.includes('lelah'))
    return 'Terima kasih sudah berbagi. Perasaan itu valid. Apakah ada satu hal kecil yang bisa membuat Anda sedikit lebih nyaman saat ini?';
  if (l.includes('senang') || l.includes('baik') || l.includes('bagus'))
    return 'Bagus sekali! Pertahankan energi positif ini. Catat apa yang membuat Anda merasa baik hari ini di jurnal syukur Anda.';
  if (l.includes('tidur') || l.includes('insomnia'))
    return 'Kualitas tidur sangat berpengaruh ke mood. Coba body scan malam ini dan hindari layar 1 jam sebelum tidur.';
  return 'Saya mendengar Anda. Langkah apa yang bisa kita ambil hari ini — sekecil apapun — untuk membuat Anda merasa lebih baik?';
}

/* ── Breathing Orb Component ── */
function BreathingExercise({ onDone }) {
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef(null);

  const phase = BREATHING_PHASES[phaseIdx];

  useEffect(() => {
    if (!running) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setCount(c => {
        if (c + 1 >= phase.duration) {
          setPhaseIdx(p => {
            const next = (p + 1) % BREATHING_PHASES.length;
            if (next === 0) setCycles(cy => cy + 1);
            return next;
          });
          return 0;
        }
        return c + 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, phase.duration]);

  const pct = ((count + 1) / phase.duration) * 100;

  return (
    <div className="flex flex-col items-center py-6">
      {/* Orb */}
      <div className="relative w-36 h-36 mb-6">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="#e6f2ec" strokeWidth="5" />
          <circle cx="50" cy="50" r="44" fill="none" stroke={phase.color} strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${(pct / 100) * 276.5} 276.5`}
            style={{ transition: 'stroke-dasharray 0.9s linear' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-1000 ${running ? phase.scale : 'scale-100'}`}
            style={{ backgroundColor: phase.color + '22', border: `3px solid ${phase.color}44` }}
          >
            <Wind size={28} style={{ color: phase.color }} />
          </div>
        </div>
      </div>

      <p className="text-[18px] font-[800] text-[#253532] mb-1">{running ? phase.label : 'Siap?'}</p>
      {running && <p className="text-[13px] text-[#61716c] mb-1">{count + 1} / {phase.duration} detik</p>}
      <p className="text-[12px] text-[#61716c] mb-5">{cycles} siklus selesai</p>

      <div className="flex gap-3">
        <button
          onClick={() => { setRunning(r => !r); if (!running) { setPhaseIdx(0); setCount(0); } }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1f6e64] text-white text-[13px] font-[800] transition-all active:scale-95"
        >
          {running ? <><Pause size={15} /> Pause</> : <><Play size={15} fill="white" /> Mulai</>}
        </button>
        <button
          onClick={() => { setRunning(false); setPhaseIdx(0); setCount(0); setCycles(0); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-[#d4dcd9] bg-white text-[13px] font-[800] text-[#253532] transition-all active:scale-95"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function MoodTrackerView({ onBack }) {
  const { userProfile } = useHealth();
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [activeExercise, setActiveExercise] = useState(null);
  const [psychMessages, setPsychMessages] = useState([
    { role: 'ai', text: 'Hei! Bagaimana perasaan Anda hari ini? Saya di sini untuk mendengarkan tanpa menghakimi.' },
  ]);
  const [psychInput, setPsychInput] = useState('');
  const threadRef = useRef(null);

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [psychMessages]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    setPsychMessages(p => [...p, { role: 'user', text }]);
    setTimeout(() => setPsychMessages(p => [...p, { role: 'ai', text: getReply(text) }]), 300);
  };

  const handleSubmitMood = () => {
    if (!selectedMood) return;
    setSubmitted(true);
    const moodLabel = MOODS.find(m => m.id === selectedMood)?.label || '';
    setPsychMessages(p => [...p,
    { role: 'user', text: `Saya merasa ${moodLabel} hari ini.${note ? ` ${note}` : ''}` },
    ]);
    setTimeout(() => setPsychMessages(p => [...p,
    { role: 'ai', text: getReply(`Saya merasa ${moodLabel}`) },
    ]), 400);
  };

  return (
    <div className="screen-scroll h-full overflow-y-auto px-5 pt-4 pb-24 bg-[#f8faf7]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-white border border-[#e6f2ec] flex items-center justify-center text-[#1f6e64] shadow-sm transition-all active:scale-95"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-[10px] font-[850] text-[#61716c] uppercase tracking-widest"></p>
          <h1 className="text-[20px] font-[800] text-[#253532]">Kesehatan Mental</h1>
        </div>
      </div>

      {/* ── Mood Check-in ─────────────────────────────────────────── */}
      <section className="rounded-3xl bg-white shadow-sm border border-[#e6f2ec] p-5 mb-4">
        <h2 className="text-[15px] font-[800] text-[#253532] mb-1">Bagaimana perasaan Anda?</h2>
        <p className="text-[12px] text-[#61716c] mb-4">Pantau mood harian untuk mengenali pola emosi Anda</p>

        {!submitted ? (
          <>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {MOODS.map(({ id, label, Icon, ring, bg, text }) => (
                <button
                  key={id}
                  onClick={() => setSelectedMood(id)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 transition-all active:scale-[0.97] ${selectedMood === id ? `${ring} ${bg}` : 'border-[#e6f2ec] bg-white'
                    }`}
                >
                  <Icon size={22} className={selectedMood === id ? text : 'text-[#61716c]'} />
                  <span className={`text-[10px] font-[850] ${selectedMood === id ? text : 'text-[#61716c]'}`}>
                    {label}
                  </span>
                </button>
              ))}
            </div>

            {selectedMood && (
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Apa yang membuat Anda merasa begini? (opsional)"
                rows={2}
                className="w-full px-4 py-3 rounded-2xl border border-[#d4dcd9] bg-[#f8faf7] text-[13px] text-[#253532] outline-none focus:ring-2 focus:ring-[#1f6e64]/30 focus:border-[#1f6e64] resize-none mb-3 transition-all"
              />
            )}

            <button
              onClick={handleSubmitMood}
              disabled={!selectedMood}
              className="w-full h-11 rounded-2xl bg-[#1f6e64] text-white text-[13px] font-[800] border-0 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Catat Mood Saya
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#f0f9f7] border border-[#d4e8e4]">
            <CheckCircle2 size={20} className="text-[#1f6e64] shrink-0" />
            <div>
              <p className="text-[13px] font-[800] text-[#1f6e64]">Mood tercatat!</p>
              <p className="text-[11px] text-[#61716c]">
                {MOODS.find(m => m.id === selectedMood)?.label} — {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
            <button onClick={() => { setSubmitted(false); setSelectedMood(null); setNote(''); }} className="ml-auto text-[#61716c]">
              <RotateCcw size={14} />
            </button>
          </div>
        )}
      </section>

      {/* ── Guided Breathing ──────────────────────────────────────── */}
      <section className="rounded-3xl bg-white shadow-sm border border-[#e6f2ec] p-5 mb-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[15px] font-[800] text-[#253532]">Latihan Pernapasan</h2>
          <span className="text-[11px] bg-teal-50 text-teal-700 font-[800] px-2.5 py-1 rounded-xl border border-teal-100">4-4-6 Teknik</span>
        </div>
        <p className="text-[12px] text-[#61716c] mb-3">Terbukti klinis menurunkan kortisol dalam 60 detik</p>
        <BreathingExercise />
      </section>

      {/* ── Micro-Exercises ───────────────────────────────────────── */}
      <section className="mb-4">
        <h2 className="text-[13px] font-[850] text-[#253532] uppercase mb-3">Latihan Singkat</h2>
        <div className="space-y-2">
          {MICRO_EXERCISES.map(ex => (
            <button
              key={ex.id}
              onClick={() => setActiveExercise(activeExercise === ex.id ? null : ex.id)}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#e6f2ec] shadow-sm text-left transition-all active:scale-[0.98]"
            >
              <div className="w-9 h-9 rounded-xl bg-[#f0f9f7] flex items-center justify-center shrink-0">
                <Heart size={16} className="text-[#1f6e64]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-[800] text-[#253532]">{ex.title}</p>
                <p className="text-[11px] text-[#61716c]">{ex.desc}</p>
              </div>
              <ChevronRight
                size={16}
                className={`text-[#d4dcd9] transition-transform shrink-0 ${activeExercise === ex.id ? 'rotate-90' : ''}`}
              />
            </button>
          ))}
        </div>
      </section>

      {/* ── AI Support Chat ───────────────────────────────────────── */}
      <section className="rounded-3xl bg-white shadow-sm border border-[#e6f2ec] p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-[800] text-[#253532]">Dukungan AI</h2>
          <span className="text-[10px] text-[#61716c] bg-[#f0f9f7] px-2 py-0.5 rounded-lg font-[700] border border-[#e6f2ec]">Bukan pengganti psikolog</span>
        </div>

        {/* Thread */}
        <div ref={threadRef} className="space-y-2 mb-3 overflow-y-auto" style={{ maxHeight: '160px' }}>
          {psychMessages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl text-[12px] leading-[1.45] ${msg.role === 'ai'
                  ? 'bg-[#f0f9f7] text-[#253532] mr-auto'
                  : 'bg-[#1f6e64] text-white ml-auto'
                }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Quick chips */}
        <div className="grid grid-cols-2 gap-1.5 mb-2">
          {['Saya merasa stres', 'Saya sulit tidur', 'Saya merasa senang', 'Saya butuh relaksasi'].map(chip => (
            <button
              key={chip}
              onClick={() => sendMessage(chip)}
              className="text-[11px] font-[700] py-2 px-2 rounded-xl bg-[#f0f9f7] text-[#1f6e64] border border-[#e6f2ec] text-left transition-all active:bg-[#e6f2ec] leading-tight"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          className="flex gap-2"
          onSubmit={e => { e.preventDefault(); sendMessage(psychInput); setPsychInput(''); }}
        >
          <input
            type="text"
            value={psychInput}
            onChange={e => setPsychInput(e.target.value)}
            placeholder="Ceritakan apa yang Anda rasakan..."
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#d4dcd9] bg-[#f8faf7] text-[12px] text-[#253532] outline-none focus:ring-2 focus:ring-[#1f6e64]/30 focus:border-[#1f6e64] transition-all"
          />
          <button
            type="submit"
            className="px-4 rounded-xl bg-[#1f6e64] text-white text-[12px] font-[800] border-0 transition-all active:scale-[0.96]"
          >
            Kirim
          </button>
        </form>
      </section>
    </div>
  );
}
