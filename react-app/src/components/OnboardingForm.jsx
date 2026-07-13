import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Brain,
  Check,
  ChevronRight,
  Clock3,
  Dumbbell,
  HeartPulse,
  Leaf,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
  Utensils,
} from 'lucide-react';
import { useHealth } from '../context/healthContextCore';

const GOALS = [
  {
    id: 'body-goals',
    label: 'Tubuh lebih sehat',
    description: 'Atur berat badan, makan, dan kebugaran.',
    Icon: Dumbbell,
    color: 'orange',
  },
  {
    id: 'mental-health',
    label: 'Pikiran lebih tenang',
    description: 'Kelola stres, suasana hati, dan tidur.',
    Icon: Brain,
    color: 'violet',
  },
  {
    id: 'immune-booster',
    label: 'Kesehatan umum',
    description: 'Bangun rutinitas sehat dan pencegahan.',
    Icon: HeartPulse,
    color: 'teal',
  },
];

const GOAL_FOCUS = {
  'body-goals': [
    { id: 'gain-weight', label: 'Naik berat badan sehat' },
    { id: 'lose-weight', label: 'Mengelola berat badan' },
    { id: 'build-strength', label: 'Lebih kuat dan bugar' },
    { id: 'eat-better', label: 'Pola makan lebih baik' },
    { id: 'more-energy', label: 'Lebih berenergi' },
  ],
  'mental-health': [
    { id: 'stress', label: 'Mengurangi stres' },
    { id: 'sleep', label: 'Memperbaiki tidur' },
    { id: 'mood', label: 'Menjaga suasana hati' },
    { id: 'burnout', label: 'Mencegah burnout' },
  ],
  'immune-booster': [
    { id: 'healthy-routine', label: 'Rutinitas sehat' },
    { id: 'preventive-care', label: 'Perawatan preventif' },
    { id: 'manage-condition', label: 'Mengelola kondisi' },
    { id: 'more-energy', label: 'Lebih berenergi' },
  ],
};

const CONDITIONS = ['Diabetes', 'Hipertensi', 'Kolesterol tinggi', 'GERD', 'Cedera atau nyeri', 'Tidak ada'];
const DIETS = ['Halal (default)', 'Tidak ada pantangan', 'Vegetarian', 'Vegan', 'Rendah karbohidrat', 'Bebas laktosa'];
const EQUIPMENT = ['Tanpa alat', 'Dumbbell di rumah', 'Gym'];
const STRESSORS = ['Pekerjaan', 'Kuliah', 'Hubungan', 'Keuangan', 'Kesehatan', 'Sulit tidur'];

const CARE_RECOMMENDATIONS = {
  'body-goals': {
    title: 'Ahli gizi dan pelatih',
    description: 'Membantu menyusun pola makan dan latihan yang realistis.',
    Icon: Utensils,
    tone: 'bg-orange-50 text-orange-700',
  },
  'mental-health': {
    title: 'Psikolog',
    description: 'Mendampingi pengelolaan stres, emosi, dan pola tidur.',
    Icon: Brain,
    tone: 'bg-violet-50 text-violet-700',
  },
  'immune-booster': {
    title: 'Dokter umum',
    description: 'Membantu perawatan preventif dan meninjau kondisi kesehatan.',
    Icon: Stethoscope,
    tone: 'bg-teal-50 text-teal-700',
  },
};

const PLAN_MODES = {
  minimum: {
    label: 'Minimum',
    description: '1 langkah kecil per hari',
    adjustment: 'AI akan menjaga target tetap ringan sampai energi atau tidur membaik.',
  },
  short: {
    label: 'Ringkas',
    description: '2 langkah utama per hari',
    adjustment: 'AI akan menaikkan atau menurunkan intensitas setelah check-in harian.',
  },
  full: {
    label: 'Lengkap',
    description: '3 langkah lengkap per hari',
    adjustment: 'AI akan menjaga variasi makan, gerak, tidur, dan mood tetap seimbang.',
  },
};

const colorClasses = {
  orange: {
    active: 'border-orange-500 bg-orange-50',
    icon: 'bg-orange-100 text-orange-700',
    check: 'bg-orange-500',
  },
  violet: {
    active: 'border-violet-500 bg-violet-50',
    icon: 'bg-violet-100 text-violet-700',
    check: 'bg-violet-500',
  },
  teal: {
    active: 'border-teal-600 bg-teal-50',
    icon: 'bg-teal-100 text-teal-700',
    check: 'bg-teal-600',
  },
};

function ChoiceButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'min-h-11 rounded-xl border px-3 py-2.5 text-left text-xs font-bold transition-all active:scale-[0.98]',
        active
          ? 'border-teal-600 bg-teal-50 text-teal-800'
          : 'border-slate-200 bg-white text-slate-600',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-extrabold uppercase text-slate-500">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-[10px] font-medium text-slate-400">{hint}</span>}
    </label>
  );
}

export default function OnboardingForm({ onComplete }) {
  const { completeOnboarding } = useHealth();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    goals: [],
    primaryGoal: '',
    focus: '',
    age: '',
    height: '',
    currentWeight: '',
    targetWeight: '',
    activityLevel: '',
    stressors: [],
    sleepQuality: '',
    conditions: [],
    diet: 'Halal (default)',
    equipment: '',
    availableTime: '15',
  });

  const primaryGoal = data.primaryGoal || data.goals[0];
  const isBodyGoal = primaryGoal === 'body-goals';
  const isMentalGoal = primaryGoal === 'mental-health';
  const care = CARE_RECOMMENDATIONS[primaryGoal] || CARE_RECOMMENDATIONS['immune-booster'];
  const selectedFocusLabel = (GOAL_FOCUS[primaryGoal] || [])
    .find((option) => option.id === data.focus)?.label || 'Rutinitas sehat';
  const initialPlanMode = useMemo(() => {
    const minutes = Number.parseInt(data.availableTime, 10) || 15;
    if (minutes <= 5 || (isMentalGoal && data.sleepQuality === 'Kurang')) return 'minimum';
    if (minutes >= 30 && data.conditions.includes('Tidak ada')) return 'full';
    return 'short';
  }, [data.availableTime, data.conditions, data.sleepQuality, isMentalGoal]);
  const initialPlan = PLAN_MODES[initialPlanMode];

  const update = (key, value) => setData((current) => ({ ...current, [key]: value }));

  const toggleGoal = (goalId) => {
    setData((current) => {
      const selected = current.goals.includes(goalId)
        ? current.goals.filter((id) => id !== goalId)
        : [...current.goals, goalId];
      const nextPrimary = selected.includes(current.primaryGoal) ? current.primaryGoal : selected[0] || '';
      return { ...current, goals: selected, primaryGoal: nextPrimary, focus: nextPrimary === current.primaryGoal ? current.focus : '' };
    });
  };

  const toggleList = (key, value, exclusiveValue) => {
    setData((current) => {
      if (value === exclusiveValue) return { ...current, [key]: [value] };
      const withoutExclusive = current[key].filter((item) => item !== exclusiveValue);
      return {
        ...current,
        [key]: withoutExclusive.includes(value)
          ? withoutExclusive.filter((item) => item !== value)
          : [...withoutExclusive, value],
      };
    });
  };

  const canContinue = useMemo(() => {
    if (step === 1) return Boolean(data.fullName.trim() && (data.email.trim() || data.phone.trim()) && data.password.length >= 6);
    if (step === 2) return Boolean(data.goals.length && data.primaryGoal);
    if (step === 3) {
      if (!data.focus || !data.age) return false;
      if (isBodyGoal) return Boolean(data.activityLevel && data.currentWeight && data.height);
      if (isMentalGoal) return Boolean(data.sleepQuality);
      return true;
    }
    if (step === 4) return Boolean(data.conditions.length && data.availableTime);
    return true;
  }, [data, isBodyGoal, isMentalGoal, step]);

  const finish = () => {
    completeOnboarding(
      data.fullName,
      data.email,
      data.phone,
      data.goals,
      {
        primaryGoal,
        focus: data.focus,
        age: data.age,
        height: data.height,
        currentWeight: data.currentWeight,
        targetWeight: data.targetWeight,
        activityLevel: data.activityLevel,
        stressors: data.stressors,
        sleepQuality: data.sleepQuality,
        healthConditions: data.conditions,
        diet: data.diet,
        equipment: data.equipment,
        availableTime: data.availableTime,
        initialPlanMode,
        onboardingFocusLabel: selectedFocusLabel,
      },
    );
    onComplete?.('plan');
  };

  const renderStep = () => {
    if (step === 0) {
      return (
        <div className="flex h-full flex-col justify-center">
          <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-sm">
            <ShieldCheck size={31} />
          </div>
          <p className="mb-2 text-xs font-extrabold uppercase text-teal-700">AI-Health</p>
          <h1 className="max-w-[330px] text-[30px] font-extrabold leading-[1.1] text-slate-900">
            Kesehatan yang cocok dengan hidupmu.
          </h1>
          <p className="mt-4 max-w-[320px] text-[15px] font-medium leading-relaxed text-slate-500">
            Dapatkan rencana harian untuk makan, bergerak, tidur, dan menjaga pikiran hanya dengan ponselmu.
          </p>
          <div className="mt-8 space-y-3">
            {[
              ['Rencana yang menyesuaikan kondisi harian', Sparkles],
              ['Langkah praktis sesuai waktu yang tersedia', Clock3],
              ['Dukungan ahli ketika kamu membutuhkannya', Stethoscope],
            ].map(([label, Icon]) => (
              <div key={label} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-teal-700"><Icon size={17} /></span>
                {label}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div>
          <p className="mb-2 text-xs font-extrabold text-teal-700">Langkah 1 dari 4</p>
          <h1 className="text-2xl font-extrabold text-slate-900">Mari berkenalan</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">Informasi ini digunakan untuk menyimpan rencana dan progresmu.</p>
          <div className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
            <Field label="Nama">
              <div className="relative">
                <UserRound className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input value={data.fullName} onChange={(event) => update('fullName', event.target.value)} placeholder="Nama lengkap" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-3 text-sm outline-none focus:border-teal-600" />
              </div>
            </Field>
            <Field label="Email atau nomor telepon" hint="Kamu hanya perlu mengisi salah satu.">
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-slate-400" size={17} />
                  <input type="email" value={data.email} onChange={(event) => update('email', event.target.value)} placeholder="Email" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-2 text-xs outline-none focus:border-teal-600" />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-slate-400" size={17} />
                  <input type="tel" value={data.phone} onChange={(event) => update('phone', event.target.value)} placeholder="Nomor telepon" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-2 text-xs outline-none focus:border-teal-600" />
                </div>
              </div>
            </Field>
            <Field label="Kata sandi" hint="Minimal 6 karakter.">
              <input type="password" value={data.password} onChange={(event) => update('password', event.target.value)} placeholder="Buat kata sandi" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-600" />
            </Field>
          </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div>
          <p className="mb-2 text-xs font-extrabold text-teal-700">Langkah 2 dari 4</p>
          <h1 className="text-2xl font-extrabold text-slate-900">Apa yang ingin kamu perbaiki?</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">Pilih semua yang relevan, lalu tentukan fokus utamamu.</p>
          <div className="mt-6 space-y-3">
            {GOALS.map((goal) => {
              const selected = data.goals.includes(goal.id);
              const primary = data.primaryGoal === goal.id;
              const colors = colorClasses[goal.color];
              const Icon = goal.Icon;
              return (
                <div key={goal.id} className={`rounded-2xl border bg-white transition-all ${selected ? colors.active : 'border-slate-200'}`}>
                  <button type="button" onClick={() => toggleGoal(goal.id)} className="flex w-full items-center gap-3 border-0 bg-transparent p-4 text-left">
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colors.icon}`}><Icon size={21} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-extrabold text-slate-900">{goal.label}</span>
                      <span className="mt-0.5 block text-xs font-medium leading-relaxed text-slate-500">{goal.description}</span>
                    </span>
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full ${selected ? `${colors.check} text-white` : 'border border-slate-300 text-transparent'}`}><Check size={14} strokeWidth={3} /></span>
                  </button>
                  {selected && (
                    <button type="button" onClick={() => update('primaryGoal', goal.id)} className={`mx-4 mb-3 h-9 w-[calc(100%-2rem)] rounded-xl border-0 text-xs font-extrabold ${primary ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {primary ? 'Fokus utama' : 'Jadikan fokus utama'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (step === 3) {
      return (
        <div>
          <p className="mb-2 text-xs font-extrabold text-teal-700">Langkah 3 dari 4</p>
          <h1 className="text-2xl font-extrabold text-slate-900">Bantu kami memahami kebutuhanmu</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">Pertanyaan ini disesuaikan dengan fokus utamamu.</p>
          <div className="mt-6 space-y-5 rounded-2xl border border-slate-200 bg-white p-4">
            <Field label="Hasil yang paling penting">
              <div className="grid grid-cols-2 gap-2">
                {(GOAL_FOCUS[primaryGoal] || GOAL_FOCUS['immune-booster']).map((option) => (
                  <ChoiceButton key={option.id} active={data.focus === option.id} onClick={() => update('focus', option.id)}>{option.label}</ChoiceButton>
                ))}
              </div>
            </Field>
            <Field label="Usia">
              <input type="number" value={data.age} onChange={(event) => update('age', event.target.value)} placeholder="Contoh: 28" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-600" />
            </Field>

            {isBodyGoal && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  <Field label="Tinggi">
                    <input type="number" value={data.height} onChange={(event) => update('height', event.target.value)} placeholder="cm" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-2 text-sm outline-none focus:border-teal-600" />
                  </Field>
                  <Field label="Berat">
                    <input type="number" value={data.currentWeight} onChange={(event) => update('currentWeight', event.target.value)} placeholder="kg" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-2 text-sm outline-none focus:border-teal-600" />
                  </Field>
                  <Field label="Target">
                    <input type="number" value={data.targetWeight} onChange={(event) => update('targetWeight', event.target.value)} placeholder="Opsional" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-2 text-xs outline-none focus:border-teal-600" />
                  </Field>
                </div>
                <Field label="Aktivitas saat ini">
                  <div className="grid grid-cols-3 gap-2">
                    {['Rendah', 'Sedang', 'Aktif'].map((option) => <ChoiceButton key={option} active={data.activityLevel === option} onClick={() => update('activityLevel', option)}>{option}</ChoiceButton>)}
                  </div>
                </Field>
              </>
            )}

            {isMentalGoal && (
              <>
                <Field label="Kualitas tidur belakangan ini">
                  <div className="grid grid-cols-3 gap-2">
                    {['Kurang', 'Cukup', 'Baik'].map((option) => <ChoiceButton key={option} active={data.sleepQuality === option} onClick={() => update('sleepQuality', option)}>{option}</ChoiceButton>)}
                  </div>
                </Field>
                <Field label="Hal yang sering memengaruhi kamu">
                  <div className="flex flex-wrap gap-2">
                    {STRESSORS.map((option) => <ChoiceButton key={option} active={data.stressors.includes(option)} onClick={() => toggleList('stressors', option)}>{option}</ChoiceButton>)}
                  </div>
                </Field>
              </>
            )}
          </div>
        </div>
      );
    }

    if (step === 4) {
      return (
        <div>
          <p className="mb-2 text-xs font-extrabold text-teal-700">Langkah 4 dari 4</p>
          <h1 className="text-2xl font-extrabold text-slate-900">Buat rencana yang realistis</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">Kamu dapat mengubah semua pilihan ini nanti.</p>
          <div className="mt-6 space-y-5 rounded-2xl border border-slate-200 bg-white p-4">
            <Field label="Waktu yang tersedia setiap hari">
              <div className="grid grid-cols-4 gap-2">
                {['5', '15', '30', '45+'].map((option) => <ChoiceButton key={option} active={data.availableTime === option} onClick={() => update('availableTime', option)}>{option} mnt</ChoiceButton>)}
              </div>
            </Field>
            <Field label="Kondisi atau keterbatasan">
              <div className="flex flex-wrap gap-2">
                {CONDITIONS.map((option) => <ChoiceButton key={option} active={data.conditions.includes(option)} onClick={() => toggleList('conditions', option, 'Tidak ada')}>{option}</ChoiceButton>)}
              </div>
            </Field>
            {data.goals.includes('body-goals') && (
              <>
                <Field label="Preferensi makanan">
                  <div className="grid grid-cols-2 gap-2">
                    {DIETS.map((option) => <ChoiceButton key={option} active={data.diet === option} onClick={() => update('diet', option)}>{option}</ChoiceButton>)}
                  </div>
                </Field>
                <Field label="Peralatan olahraga">
                  <div className="grid grid-cols-3 gap-2">
                    {EQUIPMENT.map((option) => <ChoiceButton key={option} active={data.equipment === option} onClick={() => update('equipment', option)}>{option}</ChoiceButton>)}
                  </div>
                </Field>
              </>
            )}
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-700 text-white">
          <Sparkles size={27} />
        </div>
        <p className="mb-2 text-xs font-extrabold uppercase text-teal-700">First 7-day plan</p>
        <h1 className="text-[27px] font-extrabold leading-tight text-slate-900">
          Rencana 7 harimu sudah siap.
        </h1>
        <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">
          Kami mulai dari rencana yang realistis, lalu AI menyesuaikan setelah kamu check-in.
        </p>

        <div className="mt-6 space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-[10px] font-extrabold uppercase text-slate-400">Today's focus</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-teal-700"><Leaf size={19} /></span>
              <div>
                <p className="text-sm font-extrabold text-slate-900">{selectedFocusLabel}</p>
                <p className="text-xs font-medium text-slate-500">{GOALS.find((goal) => goal.id === primaryGoal)?.label}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-[10px] font-extrabold uppercase text-slate-400">Plan intensity</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><Clock3 size={19} /></span>
              <div>
                <p className="text-sm font-extrabold text-slate-900">{initialPlan.label}</p>
                <p className="text-xs font-medium text-slate-500">{initialPlan.description} - {data.availableTime} menit tersedia</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-[10px] font-extrabold uppercase text-slate-400">Relevant care support</p>
            <div className="mt-2 flex items-center gap-3">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${care.tone}`}><care.Icon size={19} /></span>
              <div>
                <p className="text-sm font-extrabold text-slate-900">{care.title}</p>
                <p className="mt-0.5 text-xs font-medium leading-relaxed text-slate-500">{care.description}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 p-4 text-white">
            <p className="text-[10px] font-extrabold uppercase text-teal-300">When AI adjusts it</p>
            <p className="mt-2 text-sm font-bold leading-relaxed text-slate-100">
              {initialPlan.adjustment}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col bg-[#f7f8f5]">
      {step > 0 && step < 5 && (
        <div className="shrink-0 px-5 pt-5">
          <div className="h-1 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${(step / 4) * 100}%` }} />
          </div>
        </div>
      )}

      <div className="screen-scroll flex-1 overflow-y-auto px-5 pb-6 pt-6">
        {renderStep()}
      </div>

      <footer className="shrink-0 border-t border-slate-200 bg-white px-5 pb-6 pt-3">
        {step === 0 && (
          <button type="button" onClick={() => setStep(1)} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border-0 bg-teal-700 text-sm font-extrabold text-white">
            Mulai sekarang <ChevronRight size={17} />
          </button>
        )}
        {step > 0 && step < 5 && (
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep((current) => current - 1)} aria-label="Kembali" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700">
              <ArrowLeft size={18} />
            </button>
            <button type="button" disabled={!canContinue} onClick={() => setStep((current) => current + 1)} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border-0 bg-teal-700 text-sm font-extrabold text-white disabled:bg-slate-200 disabled:text-slate-400">
              Lanjutkan <ChevronRight size={17} />
            </button>
          </div>
        )}
        {step === 5 && (
          <button type="button" onClick={finish} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border-0 bg-teal-700 text-sm font-extrabold text-white">
            Open my Plan <ChevronRight size={17} />
          </button>
        )}
      </footer>
    </div>
  );
}
