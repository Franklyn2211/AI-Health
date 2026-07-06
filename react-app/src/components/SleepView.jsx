import { useState } from 'react';
import { Moon, Bell, Play, Pause, Settings2 } from 'lucide-react';

export default function SleepView({ onTabChange }) {
  const [smartWake, setSmartWake] = useState(true);
  const [playingSound, setPlayingSound] = useState(null);

  const sounds = [
    { id: 'rain', name: 'Rainfall', icon: '🌧️' },
    { id: 'waves', name: 'Ocean Waves', icon: '🌊' },
    { id: 'noise', name: 'White Noise', icon: '📻' },
    { id: 'forest', name: 'Forest Night', icon: '🌲' },
  ];

  return (
    <div
      id="sleep"
      className="screen-scroll h-full overflow-y-auto px-[24px] pt-[24px] pb-[100px] bg-gradient-to-b from-slate-900 to-indigo-950 text-white"
    >
      {/* Header */}
      <header className="flex justify-between items-center gap-[16px] mb-[24px]">
        <div>
          <p className="m-0 mb-[6px] uppercase text-[12px] leading-[1.15] text-indigo-200 font-[850] tracking-wide">

          </p>
          <h1 className="text-[28px] leading-[1.05] font-[800]">Sleep Tracker</h1>
        </div>
        <button
          onClick={() => onTabChange('home')}
          className="min-w-[48px] min-h-[48px] px-[16px] rounded-[24px] bg-white/10 backdrop-blur-md border border-white/10 text-white text-[14px] font-[800] transition-all duration-300 ease-in-out active:scale-95"
        >
          Home
        </button>
      </header>

      {/* Tracking Dashboard */}
      <section className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl mb-6">
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative w-40 h-40 rounded-full border-[6px] border-indigo-400/30 flex flex-col items-center justify-center mb-6 shadow-[0_0_40px_rgba(129,140,248,0.2)]">
            <span className="text-[42px] font-black leading-none text-indigo-300">85</span>
            <span className="text-[14px] font-bold text-indigo-200/70 uppercase tracking-widest mt-1">Score</span>
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="6" className="text-indigo-400" strokeDasharray="289" strokeDashoffset="43" strokeLinecap="round" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold mb-1">7h 20m</h2>
          <p className="text-indigo-200 text-sm font-medium">Total Time Asleep</p>

          <div className="grid grid-cols-2 gap-8 w-full mt-8 border-t border-white/10 pt-6">
            <div className="text-center">
              <p className="text-indigo-200 text-sm font-medium mb-1">Deep Sleep</p>
              <p className="text-xl font-bold">2h 15m</p>
            </div>
            <div className="text-center">
              <p className="text-indigo-200 text-sm font-medium mb-1">REM</p>
              <p className="text-xl font-bold">1h 45m</p>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Alarm */}
      <section className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl mb-6 flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <Bell size={20} className="text-indigo-300" />
            </div>
            <h2 className="text-lg font-bold">Smart Alarm</h2>
          </div>
          <button className="text-indigo-300 transition-all duration-300 ease-in-out active:scale-95">
            <Settings2 size={24} />
          </button>
        </div>

        <div className="flex justify-center my-2">
          <div className="text-5xl font-black tracking-tight text-white/90">07:30</div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-5">
          <div>
            <p className="font-bold text-sm">Smart Wake-Up</p>
            <p className="text-indigo-200/70 text-xs mt-0.5">Wakes you in light sleep phase</p>
          </div>
          <button
            onClick={() => setSmartWake(!smartWake)}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${smartWake ? 'bg-indigo-500' : 'bg-white/20'}`}
          >
            <div className={`w-6 h-6 rounded-full bg-white transition-transform duration-300 ${smartWake ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </section>

      {/* Sleep Sounds */}
      <section>
        <h2 className="text-lg font-bold mb-4 px-2">Sleep Sounds</h2>
        <div className="flex gap-4 overflow-x-auto screen-scroll pb-4 px-2 -mx-2">
          {sounds.map(sound => (
            <button
              key={sound.id}
              onClick={() => setPlayingSound(playingSound === sound.id ? null : sound.id)}
              className="flex-none w-32 bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-5 flex flex-col items-center gap-3 transition-all duration-300 ease-in-out active:scale-95"
            >
              <div className="text-3xl mb-1">{sound.icon}</div>
              <p className="text-sm font-bold text-center leading-tight">{sound.name}</p>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mt-2 transition-colors ${playingSound === sound.id ? 'bg-indigo-400 text-slate-900' : 'bg-white/10 text-white'}`}>
                {playingSound === sound.id ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
