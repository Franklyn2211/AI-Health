import {
  ArrowRight,
  Brain,
  CalendarCheck,
  ClipboardList,
  ShieldCheck,
  UserRound,
} from 'lucide-react';

const JOURNEY_STEPS = [
  {
    id: 'understand',
    label: 'Profil',
    title: 'Kenali diri',
    detail: 'Goals, waktu, kondisi',
    Icon: UserRound,
    tab: 'profile',
  },
  {
    id: 'plan',
    label: 'Rencana',
    title: 'Hari ini',
    detail: 'Satu langkah utama',
    Icon: CalendarCheck,
    tab: 'home',
  },
  {
    id: 'act',
    label: 'Aksi',
    title: 'Catat',
    detail: 'Meal, mood, sleep',
    Icon: ClipboardList,
    tab: 'home',
  },
  {
    id: 'learn',
    label: 'Pola',
    title: 'Memory',
    detail: 'Pola personal',
    Icon: Brain,
    subView: 'health-memory',
  },
  {
    id: 'trust',
    label: 'Ahli',
    title: 'Chat ahli',
    detail: 'Konsultasi berbasis chat',
    Icon: ShieldCheck,
    tab: 'clinic',
  },
];

const activeCopy = {
  understand: 'Profil membuat AI tahu tujuan, batasan, dan konteks pengguna sebelum memberi saran.',
  plan: 'Hari ini menerjemahkan data menjadi satu next best action yang realistis.',
  act: 'Catatan kecil membuat rencana makin personal tanpa input yang berat.',
  learn: 'Health Memory menghubungkan pola tidur, mood, makanan, aktivitas, dan gejala.',
  trust: 'Saran penting diberi konteks profesional dan bisa dilampirkan ke chat konsultasi.',
};

const nextStepById = {
  understand: 'plan',
  plan: 'act',
  act: 'learn',
  learn: 'trust',
  trust: 'plan',
};

export default function AppJourneyFlow({
  activeStep = 'plan',
  onTabChange,
  onSubViewChange,
  compact = false,
}) {
  const active = JOURNEY_STEPS.find((step) => step.id === activeStep) || JOURNEY_STEPS[1];
  const activeIndex = JOURNEY_STEPS.findIndex((step) => step.id === active.id);
  const next = JOURNEY_STEPS.find((step) => step.id === nextStepById[active.id]) || JOURNEY_STEPS[1];
  const ActiveIcon = active.Icon;

  const openStep = (step) => {
    if (step.subView && onSubViewChange) {
      onSubViewChange(step.subView);
      return;
    }
    if (step.tab && onTabChange) onTabChange(step.tab);
  };

  return (
    <section className={compact ? 'mb-3' : 'mb-5'}>
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <ActiveIcon size={17} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-extrabold uppercase text-slate-400">Alur VIN</p>
            <p className="truncate text-sm font-extrabold text-slate-900">{active.label}: {active.title}</p>
          </div>
          <button type="button" onClick={() => openStep(next)} className="flex h-9 items-center gap-1 rounded-xl border-0 bg-slate-900 px-3 text-[10px] font-extrabold text-white">
            {next.label} <ArrowRight size={12} />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-5 gap-1">
          {JOURNEY_STEPS.map((step, index) => (
            <button
              key={step.id}
              type="button"
              aria-label={step.title}
              onClick={() => openStep(step)}
              className={`h-1.5 rounded-full border-0 ${index <= activeIndex ? 'bg-teal-700' : 'bg-slate-200'}`}
            />
          ))}
        </div>

        {!compact && <p className="mt-3 text-[11px] font-medium leading-relaxed text-slate-500">{activeCopy[active.id]}</p>}
      </div>
    </section>
  );
}
