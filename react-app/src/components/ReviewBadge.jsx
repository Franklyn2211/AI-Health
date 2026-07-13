import { ShieldCheck } from 'lucide-react';

export default function ReviewBadge({ method, compact = false, dark = false }) {
  if (!method) return null;

  if (compact) {
    return (
      <span className={[
        'inline-flex max-w-full items-center gap-1 rounded-lg px-2 py-1 text-[9px] font-extrabold',
        dark ? 'bg-white/10 text-teal-200' : 'bg-teal-50 text-teal-700',
      ].join(' ')}
      >
        <ShieldCheck size={11} />
        Ditinjau {method.reviewerRole}
      </span>
    );
  }

  return (
    <div className={[
      'flex items-start gap-2 rounded-xl px-3 py-2.5',
      dark ? 'bg-white/10 text-white' : 'bg-teal-50 text-teal-950',
    ].join(' ')}
    >
      <ShieldCheck size={15} className="mt-0.5 shrink-0 text-teal-500" />
      <div className="min-w-0 flex-1">
        <p className={['text-[9px] font-extrabold uppercase', dark ? 'text-teal-200' : 'text-teal-700'].join(' ')}>
          Metode ditinjau ahli
        </p>
        <p className={['mt-0.5 text-[11px] font-bold leading-relaxed', dark ? 'text-slate-100' : 'text-slate-700'].join(' ')}>
          {method.label} ditinjau oleh {method.reviewedBy}
        </p>
      </div>
    </div>
  );
}
