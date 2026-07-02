import { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { ArrowLeft, Play, Pause, CheckCircle2, ChevronRight, Timer, Zap, Flame } from 'lucide-react';

/* ── Goal-adaptive workouts ── */
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
  'lose-weight': {
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

export default function FitnessPlannerView({ onBack }) {
  const { userProfile } = useHealth();
  const goals = userProfile.goals || [];

  const getPlan = () => {
    if (goals.includes('pregnancy')) return WORKOUTS['pregnancy'];
    if (goals.includes('build-muscle')) return WORKOUTS['build-muscle'];
    if (goals.includes('lose-weight')) return WORKOUTS['lose-weight'];
    if (goals.includes('heart-health')) return WORKOUTS['heart-health'];
    return WORKOUTS['default'];
  };

  const plan = getPlan();
  const wod = plan.wod;
  const [started, setStarted] = useState(false);
  const [doneMap, setDoneMap] = useState({});
  const doneCount = Object.values(doneMap).filter(Boolean).length;

  return (
    <div className="screen-scroll h-full overflow-y-auto px-5 pt-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-[#f0f9f7] border border-[#d4e8e4] flex items-center justify-center text-[#1f6e64] transition-all active:scale-95">
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-[10px] font-[850] text-[#61716c] uppercase tracking-widest">Nike Training Club</p>
          <h1 className="text-[20px] font-[800] text-[#253532]">Workout Hari Ini</h1>
        </div>
        <span className="ml-auto text-[11px] font-[800] px-2.5 py-1 rounded-xl shrink-0"
          style={{ background: plan.accent + '20', color: plan.accent }}>{plan.label}</span>
      </div>

      {/* WOD Hero Card */}
      <section className="rounded-3xl overflow-hidden mb-5 shadow-lg"
        style={{ background: `linear-gradient(135deg, ${plan.accent}dd 0%, ${plan.accent}88 100%)` }}>
        <div className="p-5">
          <p className="text-[11px] font-[850] text-white/70 uppercase mb-1">Workout of the Day</p>
          <h2 className="text-[22px] font-[900] text-white mb-1">{wod.title}</h2>
          <p className="text-[13px] text-white/80 mb-4">{wod.subtitle}</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { icon: Timer, label: 'Durasi', val: `${wod.duration} Min` },
              { icon: Zap, label: 'Intensitas', val: wod.intensity },
              { icon: Flame, label: 'Kalori', val: `~${wod.calories}` },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="bg-white/20 rounded-2xl p-2.5 text-center">
                <Icon size={16} className="text-white mx-auto mb-1" />
                <p className="text-[14px] font-[900] text-white">{val}</p>
                <p className="text-[9px] text-white/70">{label}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setStarted(!started)}
            className="w-full flex items-center justify-center gap-2 bg-white font-[900] text-[14px] py-3.5 rounded-2xl transition-all active:scale-[0.98]"
            style={{ color: plan.accent }}
          >
            {started ? <><Pause size={18} /> Pause Workout</> : <><Play size={18} fill="currentColor" /> Mulai Workout</>}
          </button>
        </div>

        {/* Progress bar */}
        {started && (
          <div>
            <div className="h-1.5 bg-white/20">
              <div className="h-full bg-white transition-all duration-500"
                style={{ width: `${(doneCount / wod.exercises.length) * 100}%` }} />
            </div>
            <div className="bg-black/20 px-5 py-2 flex justify-between items-center">
              <p className="text-white/80 text-[11px]">{doneCount}/{wod.exercises.length} gerakan selesai</p>
              {doneCount === wod.exercises.length && (
                <span className="text-white text-[11px] font-[800] bg-white/20 px-2 py-0.5 rounded-lg">🎉 Selesai!</span>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Warmup */}
      <div className="flex items-center gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-3.5 mb-3">
        <span className="text-xl">🌅</span>
        <div>
          <p className="text-[11px] font-[850] text-amber-600 uppercase">Pemanasan</p>
          <p className="text-[13px] font-[700] text-amber-800">{wod.warmup}</p>
        </div>
      </div>

      {/* Exercise List */}
      <section className="mb-4">
        <h2 className="text-[13px] font-[850] text-[#253532] uppercase mb-3">Latihan Utama</h2>
        <div className="space-y-2">
          {wod.exercises.map((ex, i) => {
            const done = doneMap[i];
            return (
              <button
                key={i}
                onClick={() => started && setDoneMap(p => ({ ...p, [i]: !p[i] }))}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all active:scale-[0.98] ${
                  done ? 'border-[#1f6e64]/30 bg-[#f0f9f7]' : 'bg-white border-[#e6f2ec]'
                } ${!started ? 'opacity-90' : ''}`}
              >
                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xl`}>
                  {ex.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-[800] ${done ? 'line-through text-[#61716c]' : 'text-[#253532]'}`}>{ex.name}</p>
                  <p className="text-[11px] text-[#1f6e64] font-[700]">{ex.sets}</p>
                  <p className="text-[10px] text-[#5f6f69]">{ex.muscle} · {ex.safe}</p>
                </div>
                {started ? (
                  <CheckCircle2 size={22} className={done ? 'text-[#1f6e64]' : 'text-[#d4dcd9]'} fill={done ? '#e6f9f5' : 'none'} />
                ) : (
                  <ChevronRight size={18} className="text-[#d4dcd9]" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Cooldown */}
      <div className="flex items-center gap-3 rounded-2xl bg-indigo-50 border border-indigo-200 p-3.5 mb-5">
        <span className="text-xl">🧊</span>
        <div>
          <p className="text-[11px] font-[850] text-indigo-600 uppercase">Pendinginan</p>
          <p className="text-[13px] font-[700] text-indigo-800">{wod.cooldown}</p>
        </div>
      </div>

      {/* Trainer Tip */}
      <div className="rounded-2xl p-4 bg-[#f0f9f7] border border-[#d4e8e4]">
        <p className="text-[12px] text-[#1f6e64] leading-relaxed font-[500]">{plan.tips}</p>
      </div>
    </div>
  );
}
