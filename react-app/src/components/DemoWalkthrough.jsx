import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  X,
} from 'lucide-react';
import { DEMO_STEPS } from '../lib/demoSteps';

export default function DemoWalkthrough({
  isOpen,
  stepIndex,
  onClose,
  onStepChange,
  onLoadDemo,
  demoMode,
}) {
  const step = DEMO_STEPS[stepIndex] || DEMO_STEPS[0];
  const StepIcon = step.Icon;
  const atStart = stepIndex === 0;
  const atEnd = stepIndex === DEMO_STEPS.length - 1;

  if (!isOpen) return null;

  return (
    <div data-testid="demo-walkthrough-panel" className="absolute inset-0 z-40 flex items-end bg-slate-950/40 p-3 backdrop-blur-sm">
      <section className="w-full rounded-[28px] bg-white p-4 shadow-2xl">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${step.color}`}>
              <StepIcon size={23} />
            </span>
            <div>
              <p className="text-[10px] font-extrabold uppercase text-teal-700">
                Alur demo produk
              </p>
              <h2 className="mt-1 text-lg font-extrabold leading-tight text-slate-900">
                {step.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            data-testid="demo-walkthrough-close"
            onClick={onClose}
            aria-label="Close demo walkthrough"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500"
          >
            <X size={17} />
          </button>
        </div>

        <div className="mb-3 grid grid-cols-6 gap-1.5">
          {DEMO_STEPS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              data-testid={`demo-walkthrough-step-${index}`}
              onClick={() => onStepChange(index)}
              aria-label={`Go to ${item.title}`}
              className={[
                'h-2 rounded-full border-0 transition-all',
                index <= stepIndex ? 'bg-teal-600' : 'bg-slate-200',
              ].join(' ')}
            />
          ))}
        </div>

        <div className="rounded-2xl bg-slate-50 p-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-extrabold text-slate-500">
              Langkah {stepIndex + 1} dari {DEMO_STEPS.length}
            </span>
            <span className="text-[10px] font-extrabold uppercase text-slate-400">
              {step.eyebrow}
            </span>
          </div>
          <p className="text-sm font-bold leading-relaxed text-slate-800">{step.summary}</p>
          <div className="mt-3 flex gap-2 rounded-xl bg-white px-3 py-2.5">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-teal-700" />
            <p className="text-[11px] font-semibold leading-relaxed text-slate-600">{step.proof}</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-[auto_1fr_auto] gap-2">
          <button
            type="button"
            data-testid="demo-walkthrough-prev"
            onClick={() => onStepChange(Math.max(stepIndex - 1, 0))}
            disabled={atStart}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-35"
            aria-label="Previous demo step"
          >
            <ArrowLeft size={18} />
          </button>

          <button
            type="button"
            data-testid="demo-walkthrough-load"
            onClick={onLoadDemo}
            className={[
              'h-11 rounded-xl border-0 px-3 text-xs font-extrabold',
              demoMode ? 'bg-teal-50 text-teal-700' : 'bg-slate-900 text-white',
            ].join(' ')}
          >
            {demoMode ? 'Data demo siap' : 'Muat data demo'}
          </button>

          <button
            type="button"
            data-testid="demo-walkthrough-next"
            onClick={() => onStepChange(atEnd ? 0 : stepIndex + 1)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-900 text-white"
            aria-label={atEnd ? 'Restart demo walkthrough' : 'Next demo step'}
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
