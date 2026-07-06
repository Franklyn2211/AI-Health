import { useState } from 'react';
import { ArrowLeft, Bell, Play, Pause, Settings2, CloudRain, Waves, Radio, Trees, Coffee, Flame, Moon } from 'lucide-react';

const SOUNDSCAPES = [
  { id: 'rain', name: 'Hujan Lebat', Icon: CloudRain, desc: 'Menenangkan pikiran' },
  { id: 'waves', name: 'Ombak Laut', Icon: Waves, desc: 'Relaksasi alami' },
  { id: 'white', name: 'White Noise', Icon: Radio, desc: 'Blok gangguan' },
  { id: 'forest', name: 'Hutan Malam', Icon: Trees, desc: 'Alam sunyi' },
  { id: 'cafe', name: 'Kafe Tenang', Icon: Coffee, desc: 'Fokus & rileks' },
  { id: 'fire', name: 'Api Unggun', Icon: Flame, desc: 'Hangat & nyaman' },
];

const SLEEP_STAGES = [
  { label: 'Tidur Ringan', val: '2h 10m', pct: 30, color: '#14b8a6' },
  { label: 'Deep Sleep', val: '2h 15m', pct: 30, color: '#1f6e64' },
  { label: 'REM', val: '1h 45m', pct: 24, color: '#f59e0b' },
  { label: 'Terjaga', val: '1h 10m', pct: 16, color: '#94a3b8' },
];

export default function SleepTrackerView({ onBack }) {
  const [smartWake, setSmartWake] = useState(true);
  const [playing, setPlaying] = useState(null);
  const score = 85;
  const circumference = 2 * Math.PI * 44;
  const dash = (score / 100) * circumference;

  return (
    <div className="screen-scroll h-full overflow-y-auto pb-24 bg-[#f8faf7]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 mb-6">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-[#e6f2ec] text-[#1f6e64] shadow-sm transition-all active:scale-95"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-[850] text-[#61716c] uppercase tracking-widest"></p>
          <h1 className="text-[17px] font-[800] text-[#253532]">Sleep Tracker</h1>
        </div>
        <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-[#e6f2ec] text-[#1f6e64] shadow-sm transition-all active:scale-95">
          <Settings2 size={17} />
        </button>
      </div>

      {/* Sleep Score Ring */}
      <section className="flex flex-col items-center mb-6 px-5">
        <div className="relative w-44 h-44 mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Track */}
            <circle cx="50" cy="50" r="44" fill="none" stroke="#e6f2ec" strokeWidth="6" />
            {/* Glow ring */}
            <circle cx="50" cy="50" r="44" fill="none" stroke="url(#sleepGrad)" strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * (2 * Math.PI * 44)} ${2 * Math.PI * 44}`} />
            <defs>
              <linearGradient id="sleepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1f6e64" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[46px] font-[900] text-[#253532] leading-none">{score}</span>
            <span className="text-[11px] text-[#61716c] font-[700] uppercase">Skor Tidur</span>
          </div>
        </div>

        <h2 className="text-[24px] font-[800] text-[#253532] mb-0.5">7 jam 20 menit</h2>
        <p className="text-[#61716c] text-[13px]">Total Waktu Tidur · Semalam</p>

        <div className="flex items-center gap-2 mt-3 px-4 py-2 rounded-2xl bg-[#f0f9f7] border border-[#d4e8e4]">
          <Moon size={18} className="text-[#1f6e64]" />
          <p className="text-[12px] text-[#1f6e64] font-[700]">Tidur lebih baik 12% dari rata-rata minggu lalu</p>
        </div>
      </section>

      {/* Stage Breakdown */}
      <section className="mx-5 rounded-3xl p-5 mb-5 bg-white shadow-sm border border-[#e6f2ec]">
        <h2 className="text-[13px] font-[850] text-[#253532] uppercase mb-4">Fase Tidur</h2>

        {/* Bar chart */}
        <div className="flex items-end gap-1.5 h-20 mb-4">
          {SLEEP_STAGES.map(s => (
            <div key={s.label} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-xl transition-all" style={{ height: `${s.pct * 2.4}px`, backgroundColor: s.color + 'dd' }} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {SLEEP_STAGES.map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
              <div className="min-w-0">
                <p className="text-[10px] text-[#61716c] font-[800] uppercase tracking-wider">{s.label}</p>
                <p className="text-[13px] font-[800] text-[#253532]">{s.val}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Smart Alarm */}
      <section className="mx-5 rounded-3xl p-5 mb-5 bg-white shadow-sm border border-[#e6f2ec]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f0f9f7] flex items-center justify-center">
              <Bell size={18} className="text-[#1f6e64]" />
            </div>
            <h2 className="text-[15px] font-[800] text-[#253532]">Smart Alarm</h2>
          </div>
          <button className="text-[#61716c] transition-all active:scale-95">
            <Settings2 size={18} />
          </button>
        </div>
        <p className="text-[46px] font-[900] text-[#253532] text-center mb-2">07:30</p>
        <div className="flex items-center justify-between pt-3 border-t border-[#e6f2ec]">
          <div>
            <p className="text-[13px] font-[800] text-[#253532]">Smart Wake-Up</p>
            <p className="text-[11px] text-[#61716c] mt-0.5">Bangun saat tidur paling ringan</p>
          </div>
          <button
            onClick={() => setSmartWake(w => !w)}
            className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 ${smartWake ? 'bg-[#1f6e64]' : 'bg-[#e6f2ec]'}`}
            role="switch"
            aria-checked={smartWake}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 shadow-sm ${smartWake ? 'translate-x-7' : 'translate-x-0'}`} />
          </button>
        </div>
      </section>

      {/* Sleep Tips */}
      <section className="mx-5 rounded-3xl p-5 mb-5 bg-white shadow-sm border border-[#e6f2ec]">
        <h2 className="text-[13px] font-[850] text-[#253532] uppercase mb-3">Rekomendasi Malam Ini</h2>
        <div className="space-y-3">
          {[
            { time: '21:00', tip: 'Matikan layar & redupkan lampu', done: true },
            { time: '21:30', tip: 'Mulai sesi meditasi 10 menit', done: false },
            { time: '22:00', tip: 'Atur suhu kamar 18–20°C', done: false },
          ].map((t, i) => (
            <div key={i} className={`flex items-center gap-3 ${t.done ? 'opacity-40' : ''}`}>
              <span className="text-[11px] font-[850] text-[#61716c] w-10 shrink-0">{t.time}</span>
              <div className="flex-1 h-px bg-[#e6f2ec]" />
              <p className="text-[12px] font-[700] text-[#253532] text-right">{t.tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Soundscapes */}
      <section className="px-5">
        <h2 className="text-[13px] font-[850] text-[#253532] uppercase mb-4">Soundscapes</h2>
        <div className="grid grid-cols-3 gap-2">
          {SOUNDSCAPES.map(s => {
            const isPlaying = playing === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setPlaying(isPlaying ? null : s.id)}
                className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border transition-all active:scale-[0.98] ${isPlaying
                    ? 'border-[#1f6e64] bg-[#f0f9f7] shadow-sm'
                    : 'border-[#e6f2ec] bg-white'
                  }`}
              >
                <s.Icon size={24} className={isPlaying ? 'text-[#1f6e64]' : 'text-[#61716c]'} strokeWidth={isPlaying ? 2.5 : 2} />
                <p className={`text-[10px] font-[800] text-center leading-tight ${isPlaying ? 'text-[#1f6e64]' : 'text-[#61716c]'}`}>
                  {s.name}
                </p>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isPlaying ? 'bg-[#1f6e64]' : 'bg-[#f8faf7] border border-[#e6f2ec]'}`}>
                  {isPlaying
                    ? <Pause size={12} fill="white" className="text-[#1f6e64]" />
                    : <Play size={12} className="text-[#61716c] ml-0.5" />}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
