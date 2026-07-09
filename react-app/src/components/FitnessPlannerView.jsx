import { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { ArrowLeft, Play, Pause, CheckCircle2, ChevronRight, Timer, Zap, Flame, Dumbbell } from 'lucide-react';

const WORKOUTS = {
  'pregnancy': {
    label: '🤰 Prenatal Safe',
    accent: '#ec4899',
    wod: {
      title: 'Prenatal Gentle Flow',
      subtitle: 'Aman untuk semua trimester',
      duration: 25,
      intensity: 'Ringan',
      intensityColor: '#10b981',
      calories: 120,
      warmup: 'Jalan Pelan 3 Menit',
      exercises: [
        { name: 'Pelvic Tilt', sets: '3 × 10 reps', muscle: 'Punggung Bawah', emoji: '🧘', safe: '✅ Aman' },
        { name: 'Prenatal Yoga – Cat Cow', sets: '3 × 12 reps', muscle: 'Punggung & Core', emoji: '🐱', safe: '✅ Aman' },
        { name: 'Squat Ringan', sets: '2 × 10 reps', muscle: 'Kaki & Panggul', emoji: '🏋️', safe: '✅ Aman' },
        { name: 'Side-lying Leg Lift', sets: '2 × 12 per sisi', muscle: 'Gluteus', emoji: '🦵', safe: '✅ Aman' },
        { name: 'Kegel Exercise', sets: '3 × 15 reps', muscle: 'Dasar Panggul', emoji: '💫', safe: '✅ Wajib' },
      ],
      cooldown: 'Pernapasan Dalam 5 Menit',
    },
    tips: '⚠️ Hentikan jika merasa pusing, sesak, atau kontraksi. Konsultasi dokter kandungan sebelum memulai.',
  },
  'build-muscle': {
    label: '💪 Hipertrofi',
    accent: '#6366f1',
    wod: {
      title: 'Upper Body Power',
      subtitle: 'Push-Pull Hipertrofi Split',
      duration: 55,
      intensity: 'Berat',
      intensityColor: '#dc2626',
      calories: 420,
      warmup: 'Arm Circles + Band Pull 5 Menit',
      exercises: [
        { name: 'Barbell Bench Press', sets: '4 × 8 reps', muscle: 'Dada · Tricep · Bahu', emoji: '🏋️', safe: 'Progressive Overload' },
        { name: 'Pull-up / Lat Pulldown', sets: '4 × 10 reps', muscle: 'Latissimus Dorsi', emoji: '💪', safe: '2–1–2 Tempo' },
        { name: 'Dumbbell Shoulder Press', sets: '3 × 12 reps', muscle: 'Deltoid Anterior', emoji: '🏋️', safe: 'Full ROM' },
        { name: 'Barbell Row', sets: '3 × 10 reps', muscle: 'Rhomboid · Mid-Trap', emoji: '🔁', safe: 'Brace Core' },
        { name: 'EZ Bar Curl', sets: '3 × 12 reps', muscle: 'Bicep Brachii', emoji: '💪', safe: 'No Swing' },
        { name: 'Tricep Dips / Pushdown', sets: '3 × 15 reps', muscle: 'Tricep', emoji: '🤲', safe: 'Full Extension' },
      ],
      cooldown: 'Foam Roll Thoracic + Stretching 10 Menit',
    },
    tips: '💡 Makan 40g protein 45 menit setelah latihan untuk maximise muscle protein synthesis.',
  },
  'body-goals': {
    label: '🔥 Fat Burn',
    accent: '#f59e0b',
    wod: {
      title: 'HIIT Full Body Burn',
      subtitle: 'High Intensity Interval Training',
      duration: 30,
      intensity: 'Sedang–Tinggi',
      intensityColor: '#f97316',
      calories: 350,
      warmup: 'Jog di Tempat + Jumping Jack 4 Menit',
      exercises: [
        { name: 'Burpee', sets: '40 detik ON / 20 detik OFF × 5', muscle: 'Full Body', emoji: '💥', safe: 'Keep Moving' },
        { name: 'Mountain Climber', sets: '40 detik ON / 20 detik OFF × 4', muscle: 'Core · Bahu', emoji: '🏔️', safe: 'Hips Level' },
        { name: 'Jump Squat', sets: '40 detik ON / 20 detik OFF × 4', muscle: 'Quadricep · Glutes', emoji: '🦵', safe: 'Soft Landing' },
        { name: 'High Knees', sets: '60 detik ON / 30 detik OFF × 3', muscle: 'Hip Flexor · Kardio', emoji: '🏃', safe: 'Core Tight' },
        { name: 'Push-up Explosive', sets: '30 detik ON / 30 detik OFF × 3', muscle: 'Dada · Tricep', emoji: '💪', safe: 'Controlled' },
      ],
      cooldown: 'Stretching Statis + Pernapasan 6 Menit',
    },
    tips: '💡 Untuk fat loss optimal: defisit kalori 300–500 kcal/hari dan tidur cukup 7–8 jam.',
  },
  'heart-health': {
    label: '❤️ Kardio',
    accent: '#ef4444',
    wod: {
      title: 'Zone 2 Cardio & Strength',
      subtitle: 'Latihan Kesehatan Jantung',
      duration: 45,
      intensity: 'Sedang',
      intensityColor: '#f97316',
      calories: 300,
      warmup: 'Jalan Kaki 5 Menit (50% Max HR)',
      exercises: [
        { name: 'Jog Ringan / Brisk Walk', sets: '20 menit @ 60–70% Max HR', muscle: 'Kardiovaskuler', emoji: '🏃', safe: 'Zone 2' },
        { name: 'Step-up Box', sets: '3 × 15 per kaki', muscle: 'Quadricep · Glutes', emoji: '📦', safe: 'Controlled' },
        { name: 'Wall Sit', sets: '3 × 45 detik', muscle: 'Quadricep', emoji: '🧱', safe: 'Back Flat' },
        { name: 'Resistance Band Row', sets: '3 × 12 reps', muscle: 'Punggung Atas', emoji: '🎗️', safe: 'Brace Core' },
        { name: 'Slow Bicycle Crunch', sets: '3 × 20 reps', muscle: 'Core Oblique', emoji: '🚴', safe: 'Slow Tempo' },
      ],
      cooldown: 'Cool-down Walk + Stretching 8 Menit',
    },
    tips: '💡 Target heart rate zone 2: (220 − usia) × 60–70%. Jaga konsistensi 150 menit/minggu.',
  },
  'default': {
    label: '⚖️ General Fitness',
    accent: '#1f6e64',
    wod: {
      title: 'Full Body Strength',
      subtitle: 'Latihan Lengkap & Seimbang',
      duration: 40,
      intensity: 'Sedang',
      intensityColor: '#10b981',
      calories: 280,
      warmup: 'Dynamic Stretching 5 Menit',
      exercises: [
        { name: 'Squat', sets: '3 × 15 reps', muscle: 'Kaki & Glutes', emoji: '🦵', safe: 'Knee Track Toe' },
        { name: 'Push-up', sets: '3 × 12 reps', muscle: 'Dada · Tricep', emoji: '💪', safe: 'Hollow Body' },
        { name: 'Plank', sets: '3 × 45 detik', muscle: 'Core', emoji: '🏋️', safe: 'Hips Level' },
        { name: 'Lunge Jalan', sets: '3 × 12 per kaki', muscle: 'Quadricep · Glutes', emoji: '🚶', safe: 'Long Stride' },
        { name: 'Dumbbell Row', sets: '3 × 12 reps', muscle: 'Punggung · Bicep', emoji: '💪', safe: 'Flat Back' },
      ],
      cooldown: 'Static Stretching 7 Menit',
    },
    tips: '💡 Istirahat antar set: 60–90 detik untuk hipertrofi, 2–3 menit untuk kekuatan.',
  },
};

export default function FitnessPlannerView({ onBack, onTabChange }) {
  const { userProfile } = useHealth();
  const goals = userProfile.goals || [];

  const getPlan = () => {
    if (goals.includes('pregnancy')) return WORKOUTS['pregnancy'];
    if (goals.includes('build-muscle')) return WORKOUTS['build-muscle'];
    if (goals.includes('lose-weight') || goals.includes('body-goals')) return WORKOUTS['body-goals'];
    if (goals.includes('heart-health')) return WORKOUTS['heart-health'];
    return WORKOUTS['default'];
  };

  const plan = getPlan();
  const wod = plan.wod;
  const [started, setStarted] = useState(false);
  const [doneMap, setDoneMap] = useState({});
  const doneCount = Object.values(doneMap).filter(Boolean).length;

  return (
    <div className="screen-scroll h-full overflow-y-auto px-5 pt-4 pb-24 bg-slate-50">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 transition-all active:scale-95 shadow-sm">
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fitness</p>
          <h1 className="text-xl font-extrabold text-slate-900">Workout Hari Ini</h1>
        </div>
        <span className="ml-auto text-xs font-bold px-3 py-1.5 rounded-xl shrink-0 shadow-sm"
          style={{ background: plan.accent + '20', color: plan.accent }}>{plan.label}</span>
      </div>

      {/* WOD Hero Card */}
      <section className="rounded-3xl overflow-hidden mb-6 shadow-sm border border-slate-100"
        style={{ background: `linear-gradient(135deg, ${plan.accent} 0%, ${plan.accent}dd 100%)` }}>
        <div className="p-6">
          <p className="text-xs font-bold text-white/80 uppercase mb-2 tracking-wider">Workout of the Day</p>
          <h2 className="text-2xl font-extrabold text-white mb-1">{wod.title}</h2>
          <p className="text-sm text-white/90 mb-5 font-medium">{wod.subtitle}</p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Timer, label: 'Durasi', val: `${wod.duration} Min` },
              { icon: Zap, label: 'Intensitas', val: wod.intensity },
              { icon: Flame, label: 'Kalori', val: `~${wod.calories}` },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="bg-black/10 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/10">
                <Icon size={20} className="text-white mx-auto mb-2" />
                <p className="text-sm font-bold text-white">{val}</p>
                <p className="text-[10px] font-semibold text-white/70 uppercase mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setStarted(!started)}
            className="w-full flex items-center justify-center gap-2 bg-white font-extrabold text-sm py-4 rounded-2xl transition-all active:scale-[0.98] shadow-sm"
            style={{ color: plan.accent }}
          >
            {started ? <><Pause size={18} /> Pause Workout</> : <><Play size={18} fill="currentColor" /> Mulai Workout</>}
          </button>
        </div>

        {/* Progress bar */}
        {started && (
          <div>
            <div className="h-1.5 bg-black/20">
              <div className="h-full bg-white transition-all duration-500"
                style={{ width: `${(doneCount / wod.exercises.length) * 100}%` }} />
            </div>
            <div className="bg-black/30 backdrop-blur-sm px-6 py-3 flex justify-between items-center">
              <p className="text-white font-bold text-xs">{doneCount}/{wod.exercises.length} gerakan selesai</p>
              {doneCount === wod.exercises.length && (
                <span className="text-white text-xs font-extrabold bg-white/20 px-3 py-1 rounded-xl">🎉 Selesai!</span>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Warmup */}
      <div className="flex items-center gap-4 rounded-3xl bg-amber-50 border border-amber-200 p-4 mb-4 shadow-sm">
        <span className="text-2xl shrink-0">🌅</span>
        <div>
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-0.5">Pemanasan</p>
          <p className="text-sm font-bold text-amber-900">{wod.warmup}</p>
        </div>
      </div>

      {/* Exercise List */}
      <section className="mb-6">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Latihan Utama</h2>
        <div className="space-y-3">
          {wod.exercises.map((ex, i) => {
            const done = doneMap[i];
            return (
              <div key={i} className={`w-full flex flex-col p-4 rounded-3xl border transition-all ${done ? 'border-teal-100 bg-teal-50' : 'bg-white border-slate-100'} ${!started ? 'opacity-90' : 'shadow-sm'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center text-2xl ${done ? 'bg-teal-100/50' : 'bg-slate-50'}`}>
                    {ex.emoji}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className={`text-sm font-bold ${done ? 'line-through text-slate-500' : 'text-slate-900'} truncate`}>{ex.name}</p>
                    <p className={`text-xs font-bold mt-0.5 mb-1 ${done ? 'text-slate-400' : 'text-teal-600'}`}>{ex.sets}</p>
                    <p className="text-[10px] text-slate-500 font-semibold">{ex.muscle} · {ex.safe}</p>
                  </div>
                  <button onClick={() => started && setDoneMap(p => ({ ...p, [i]: !p[i] }))} className="shrink-0 p-2">
                    {started ? (
                      <CheckCircle2 size={24} className={done ? 'text-teal-600' : 'text-slate-200'} fill={done ? '#e6f9f5' : 'none'} />
                    ) : (
                      <ChevronRight size={20} className="text-slate-300" />
                    )}
                  </button>
                </div>

                {/* Video Placeholder (Nike Training Club inspired) */}
                {started && (
                  <div className="mt-4 w-full aspect-video bg-slate-800 rounded-2xl relative flex items-center justify-center overflow-hidden shadow-sm">
                    {/* Simulated video background */}
                    <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-slate-700 to-slate-900" />
                    <button className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center z-10 transition-transform active:scale-95 shadow-lg border border-white/10">
                      <Play size={24} className="text-white ml-1" fill="currentColor" />
                    </button>
                    <div className="absolute bottom-3 left-3 flex gap-2">
                      <span className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-[10px] font-bold border border-white/10 uppercase tracking-wider">Tutorial</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Cooldown */}
      <div className="flex items-center gap-4 rounded-3xl bg-indigo-50 border border-indigo-100 p-4 mb-6 shadow-sm">
        <span className="text-2xl shrink-0">🧊</span>
        <div>
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-0.5">Pendinginan</p>
          <p className="text-sm font-bold text-indigo-900">{wod.cooldown}</p>
        </div>
      </div>

      {/* Trainer Tip */}
      <div className="rounded-3xl p-5 bg-teal-50 border border-teal-100 shadow-sm">
        <p className="text-sm text-teal-800 leading-relaxed font-semibold">{plan.tips}</p>
      </div>

      {/* FAB */}
      <button 
        onClick={() => onTabChange && onTabChange('clinic', { category: 'Personal Trainer' })}
        className="fixed bottom-24 right-5 w-14 h-14 bg-teal-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-teal-600/30 transition-all active:scale-90 z-40"
        title="Cari Personal Trainer"
      >
        <Dumbbell size={24} />
      </button>
    </div>
  );
}
