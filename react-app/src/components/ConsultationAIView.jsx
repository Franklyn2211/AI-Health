import { useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Bot,
  CalendarDays,
  Check,
  ClipboardList,
  FileQuestion,
  HeartPulse,
  Send,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useHealth } from '../context/healthContextCore';
import ReviewBadge from './ReviewBadge';
import { analyzeCareEscalation, URGENT_TERMS } from '../lib/careRules';
import { getReviewedMethod } from '../lib/reviewedMethods';

const MODES = [
  {
    id: 'fix-today',
    label: 'Bantu hari ini',
    description: 'Buat rencana hari ini lebih ringan saat capek, sibuk, atau stres.',
    Icon: CalendarDays,
  },
  {
    id: 'pattern',
    label: 'Jelaskan pola saya',
    description: 'Ringkas pola tidur, mood, makanan, dan energi.',
    Icon: Sparkles,
  },
  {
    id: 'specialist',
    label: 'Siapkan chat ahli',
    description: 'Ubah log menjadi ringkasan singkat untuk konsultasi.',
    Icon: FileQuestion,
  },
];

const FOCUS_LABELS = {
  'gain-weight': 'naik berat badan sehat',
  stress: 'mengurangi stres',
  sleep: 'memperbaiki tidur',
  mood: 'menjaga suasana hati',
  burnout: 'mencegah burnout',
  'lose-weight': 'mengelola berat badan',
  'build-strength': 'meningkatkan kekuatan',
  'eat-better': 'memperbaiki pola makan',
  'more-energy': 'meningkatkan energi',
  'healthy-routine': 'membangun rutinitas sehat',
  'preventive-care': 'perawatan preventif',
  'manage-condition': 'mengelola kondisi kesehatan',
};

const PLAN_LABELS = {
  minimum: 'Minimum',
  short: 'Ringkas',
  full: 'Lengkap',
};

function getRecentRecords(dailyRecords) {
  return Object.entries(dailyRecords || {})
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 7)
    .map(([date, record]) => ({ date, ...record }));
}

function getContextSnapshot(userProfile, todayRecord, loggedMeals, careAppointments, dailyRecords) {
  const checkIn = todayRecord.checkIn;
  const recentRecords = getRecentRecords(dailyRecords);
  const recentLowDays = recentRecords.filter((record) => (
    record.checkIn?.energy === 1 || record.checkIn?.mood === 1 || record.checkIn?.sleep === 1
  )).length;
  const recentSymptoms = recentRecords.flatMap((record) => (
    (record.logs || []).filter((log) => log.type === 'symptom').map((log) => log.label)
  ));
  const recentMeals = recentRecords.reduce((sum, record) => sum + (record.meals?.length || 0), 0);
  const recordedDays = recentRecords.filter((record) => record.checkIn || record.summaryConfirmed || record.meals?.length).length;

  return {
    focus: FOCUS_LABELS[userProfile.focus] || 'kesehatan sehari-hari',
    primaryGoal: userProfile.primaryGoal || userProfile.goals?.[0] || 'immune-booster',
    planMode: todayRecord.planMode || 'short',
    energy: checkIn?.energy,
    mood: checkIn?.mood,
    sleep: checkIn?.sleep,
    meals: loggedMeals.length,
    water: todayRecord.water || 0,
    symptoms: (todayRecord.logs || []).filter((log) => log.type === 'symptom').map((log) => log.label),
    recentSymptoms,
    recentLowDays,
    recentMeals,
    recordedDays,
    completedActions: (todayRecord.completedActions || []).length,
    appointment: careAppointments[0],
    escalation: analyzeCareEscalation(dailyRecords),
  };
}

function getDecisionTrail(context) {
  return [
    {
      label: 'Check-in',
      value: context.energy || context.mood || context.sleep
        ? `Energi ${context.energy || '-'}/3, mood ${context.mood || '-'}/3, tidur ${context.sleep || '-'}/3`
        : 'Belum dicatat hari ini',
    },
    {
      label: 'Plan 7 hari',
      value: `Mode ${PLAN_LABELS[context.planMode] || 'Ringkas'} untuk ${context.focus}`,
    },
    {
      label: 'Log terbaru',
      value: `${context.recordedDays}/7 hari, ${context.recentMeals} makan, ${context.recentSymptoms.length} gejala`,
    },
  ];
}

function buildResponse(mode, input, context) {
  const normalized = input.toLowerCase();
  const urgent = URGENT_TERMS.some((term) => normalized.includes(term));

  if (urgent) {
    return {
      type: 'urgent',
      title: 'Cari bantuan langsung sekarang',
      text: 'Keluhan yang kamu sebutkan perlu ditangani manusia secara langsung. Hubungi layanan darurat setempat, pergi ke IGD terdekat, atau hubungi orang yang kamu percaya sekarang.',
      basis: ['Pesanmu mengandung tanda yang tidak aman untuk ditangani AI saja'],
      action: 'Buka Perawatan',
      actionTarget: 'clinic',
      reviewedMethod: getReviewedMethod('check-care'),
    };
  }

  if (mode === 'fix-today') {
    const lowReadiness = context.energy === 1 || context.sleep === 1 || context.mood === 1;
    if (context.escalation.level === 'review') {
      return {
        title: 'Hari ini boleh ringan, tapi pola perlu ditinjau',
        text: `AI bisa menurunkan rencana hari ini, tapi ${context.escalation.detail.toLowerCase()} Lebih baik siapkan chat dengan ${context.escalation.recommendedExpert}.`,
        basis: [
          ...context.escalation.reasons,
          `Fokus utama: ${context.focus}`,
        ],
        action: 'Siapkan chat ahli',
        actionTarget: 'clinic',
        reviewedMethod: getReviewedMethod('check-care'),
      };
    }
    if (lowReadiness) {
      return {
        title: 'Turunkan target hari ini',
        text: 'Gunakan mode minimum: satu makanan sederhana, satu jeda napas atau jalan ringan, lalu tidur sedikit lebih awal. Tujuannya bukan performa, tapi menjaga ritme.',
        basis: [
          context.energy === 1 ? 'Energi rendah' : null,
          context.mood === 1 ? 'Mood sedang berat' : null,
          context.sleep === 1 ? 'Tidur kurang' : null,
          `Fokus utama: ${context.focus}`,
        ].filter(Boolean),
        action: 'Pakai plan lebih ringan',
        actionTarget: 'apply-minimum',
        reviewedMethod: getReviewedMethod('reset'),
      };
    }
    return {
      title: 'Hari ini cukup stabil',
      text: 'Rencana tidak perlu diubah besar. Pilih langkah paling mudah dulu, lalu cek lagi setelah selesai. Kalau hari berubah mendadak, AI bisa turunkan intensitas kapan saja.',
      basis: [
        context.energy ? `Energi ${context.energy}/3` : 'Energi belum dicatat',
        context.completedActions ? `${context.completedActions} langkah sudah selesai` : 'Belum ada langkah selesai',
        `Mode plan: ${PLAN_LABELS[context.planMode] || 'Ringkas'}`,
      ],
      action: 'Buka Home',
      actionTarget: 'home',
      reviewedMethod: getReviewedMethod('ai-coordination'),
    };
  }

  if (mode === 'pattern') {
    const enoughData = context.recordedDays >= 3;
    const shouldEscalate = context.escalation.level === 'review';
    return {
      title: shouldEscalate ? 'Pola ini perlu chat ahli' : enoughData ? 'Pola awal mulai terlihat' : 'Butuh sedikit data lagi',
      text: shouldEscalate
        ? `${context.escalation.detail} AI bisa membantu merapikan catatan, tapi langkah berikutnya sebaiknya chat dengan ${context.escalation.recommendedExpert}.`
        : enoughData
        ? `Dalam 7 hari terakhir ada ${context.recentLowDays} hari dengan energi, mood, atau tidur rendah. Mulai cek apakah hari rendah muncul setelah tidur kurang, makan tidak tercatat, atau jadwal terlalu padat.`
        : 'Catatanmu belum cukup untuk menyimpulkan pola dengan percaya diri. Lanjutkan check-in singkat beberapa hari lagi agar AI tidak sekadar menebak.',
      basis: [
        `${context.recordedDays}/7 hari punya catatan`,
        `${context.recentMeals} makanan tercatat minggu ini`,
        `${context.recentSymptoms.length} gejala tercatat`,
        ...context.escalation.reasons.filter((reason) => context.escalation.level !== 'self-care' && reason),
      ],
      action: shouldEscalate ? 'Booking chat ahli' : enoughData ? 'Lihat plan 7 hari' : 'Lengkapi catatan',
      actionTarget: shouldEscalate ? 'clinic' : enoughData ? 'plan' : 'home',
      reviewedMethod: getReviewedMethod(shouldEscalate ? 'check-care' : 'ai-coordination'),
    };
  }

  if (mode === 'specialist') {
    const questions = [
      `Apa langkah paling penting untuk ${context.focus}?`,
      context.recentSymptoms.length
        ? `Apakah gejala ${context.recentSymptoms.slice(0, 3).join(', ')} perlu diperiksa lebih lanjut?`
        : 'Tanda apa yang perlu saya pantau sebelum konsultasi berikutnya?',
      'Data harian mana yang paling berguna untuk saya catat?',
    ];

    return {
      title: 'Summary siap untuk chat ahli',
      text: [
        `Fokus: ${context.focus}.`,
        `Check-in hari ini: energi ${context.energy || '-'}/3, mood ${context.mood || '-'}/3, tidur ${context.sleep || '-'}/3.`,
        `7 hari terakhir: ${context.recordedDays} hari tercatat, ${context.recentLowDays} hari rendah, ${context.recentSymptoms.length} gejala.`,
        '',
        'Pertanyaan:',
        ...questions.map((question, index) => `${index + 1}. ${question}`),
      ].join('\n'),
      basis: [
        context.appointment ? `Chat terdekat: ${context.appointment.professionalName}` : 'Belum ada chat ahli terjadwal',
        `Plan mode: ${PLAN_LABELS[context.planMode] || 'Ringkas'}`,
        context.recentSymptoms.length ? 'Ada gejala di log terbaru' : 'Belum ada gejala tercatat',
        context.escalation.recommendedExpert ? `Ahli yang disarankan: ${context.escalation.recommendedExpert}` : null,
      ].filter(Boolean),
      action: context.appointment ? 'Buka ruang chat' : 'Booking chat ahli',
      actionTarget: context.appointment ? 'specialist-chat' : 'clinic',
      reviewedMethod: getReviewedMethod('check-care'),
    };
  }

  return {
    title: 'Pilih cara AI membantu',
    text: 'Gunakan salah satu pilihan utama agar AI memakai konteks dari Home, Plan, dan catatan kesehatanmu.',
    basis: [`Fokus utama: ${context.focus}`],
    reviewedMethod: getReviewedMethod('ai-coordination'),
  };
}

function ModeButton({ mode, active, onClick }) {
  const Icon = mode.Icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all active:scale-[0.99]',
        active ? 'border-teal-700 bg-teal-50' : 'border-slate-200 bg-white',
      ].join(' ')}
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${active ? 'bg-white text-teal-700' : 'bg-slate-50 text-slate-500'}`}>
        <Icon size={19} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-extrabold text-slate-900">{mode.label}</span>
        <span className="mt-0.5 block text-[11px] font-medium leading-relaxed text-slate-500">{mode.description}</span>
      </span>
      {active && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-teal-700" />}
    </button>
  );
}

function AIMessage({ message, onAction }) {
  return (
    <div className={`rounded-2xl border p-4 ${message.type === 'urgent' ? 'border-rose-200 bg-rose-50' : 'border-slate-200 bg-white'}`}>
      <div className="flex items-start gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${message.type === 'urgent' ? 'bg-rose-100 text-rose-700' : 'bg-teal-50 text-teal-700'}`}>
          {message.type === 'urgent' ? <ShieldAlert size={18} /> : <Sparkles size={18} />}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className={`text-sm font-extrabold ${message.type === 'urgent' ? 'text-rose-900' : 'text-slate-900'}`}>{message.title}</h3>
          <p className="mt-1 whitespace-pre-line text-xs font-medium leading-relaxed text-slate-600">{message.text}</p>
        </div>
      </div>

      {message.basis?.length > 0 && (
        <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2.5">
          <p className="text-[9px] font-extrabold uppercase text-slate-400">Alasan AI</p>
          <div className="mt-2 space-y-1.5">
            {message.basis.map((item) => (
              <div key={item} className="flex gap-2">
                <Check size={12} className="mt-0.5 shrink-0 text-teal-700" strokeWidth={3} />
                <p className="text-[10px] font-semibold leading-relaxed text-slate-600">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {message.reviewedMethod && (
        <div className="mt-3">
          <ReviewBadge method={message.reviewedMethod} />
        </div>
      )}

      {message.action && (
        <button type="button" onClick={() => onAction(message.actionTarget)} className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl border-0 bg-slate-900 text-xs font-extrabold text-white">
          {message.action} <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}

export default function ConsultationAIView({ onTabChange, onSubViewChange }) {
  const {
    userProfile,
    todayRecord,
    loggedMeals,
    careAppointments,
    dailyRecords,
    updateDailyRecord,
  } = useHealth();
  const [mode, setMode] = useState('fix-today');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const threadRef = useRef(null);

  const context = useMemo(
    () => getContextSnapshot(userProfile, todayRecord, loggedMeals, careAppointments, dailyRecords),
    [careAppointments, dailyRecords, loggedMeals, todayRecord, userProfile],
  );

  const firstName = userProfile.fullName && userProfile.fullName !== 'User'
    ? userProfile.fullName.split(' ')[0]
    : 'kamu';

  const decisionTrail = getDecisionTrail(context);
  const selectedMode = MODES.find((item) => item.id === mode);

  const addResponse = (response, userText = selectedMode.label) => {
    setMessages((current) => [
      ...current,
      { id: `${Date.now()}-user`, type: 'user', text: userText },
      { id: `${Date.now()}-ai`, type: 'ai', ...response },
    ]);
    requestAnimationFrame(() => {
      if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
    });
  };

  const submitMessage = (event) => {
    event?.preventDefault();
    const question = input.trim();
    const response = buildResponse(mode, question || selectedMode.label, context);
    addResponse(response, question || selectedMode.label);
    setInput('');
  };

  const runMode = () => {
    const response = buildResponse(mode, selectedMode.label, context);
    addResponse(response, selectedMode.label);
  };

  const handleAction = (target) => {
    if (target === 'apply-minimum') {
      updateDailyRecord({
        planMode: 'minimum',
        planGeneratedAt: new Date().toISOString(),
      });
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-applied`,
          type: 'ai',
          title: 'Plan updated',
          text: 'Today is now set to minimum mode. Home will focus on one small next action.',
          basis: ['AI used your readiness and updated the local mock plan'],
          action: 'Buka Home',
          actionTarget: 'home',
        },
      ]);
      return;
    }

    const subViewTargets = ['food-scanner', 'fitness-routine', 'mood-tracker', 'sleep-tracker', 'specialist-chat'];
    if (subViewTargets.includes(target)) {
      onSubViewChange(target);
      return;
    }
    onTabChange(target);
  };

  return (
    <div className="flex h-full flex-col bg-[#f7f8f5] pb-[74px]">
      <header className="shrink-0 border-b border-slate-200 bg-[#f7f8f5] px-5 pb-4 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="mb-1 text-[10px] font-extrabold uppercase text-teal-700">Koordinator AI</p>
            <h1 className="text-[22px] font-extrabold leading-tight text-slate-900">Apa yang perlu disesuaikan?</h1>
            <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
              AI menghubungkan Home, Plan, log, dan chat ahli.
            </p>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Bot size={21} />
          </span>
        </div>
      </header>

      <div ref={threadRef} className="screen-scroll flex-1 overflow-y-auto px-5 py-4">
        <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <HeartPulse size={18} />
            </span>
            <div>
              <p className="text-sm font-extrabold text-slate-900">Halo, {firstName}</p>
              <p className="mt-0.5 text-[11px] font-medium text-slate-500">Ini konteks yang boleh dipakai AI.</p>
            </div>
          </div>

          <div className="space-y-2">
            {decisionTrail.map((item) => (
              <div key={item.label} className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
                <ClipboardList size={14} className="mt-0.5 shrink-0 text-teal-700" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-extrabold uppercase text-slate-400">{item.label}</p>
                  <p className="mt-0.5 text-[11px] font-bold leading-relaxed text-slate-700">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {context.escalation.level !== 'self-care' && (
          <section className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-700">
                <ShieldAlert size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-extrabold uppercase text-amber-700">Aturan eskalasi aktif</p>
                <h2 className="mt-1 text-sm font-extrabold text-amber-950">{context.escalation.title}</h2>
                <p className="mt-1 text-xs font-medium leading-relaxed text-amber-900">{context.escalation.detail}</p>
                <button type="button" onClick={() => onTabChange('clinic')} className="mt-3 h-10 w-full rounded-xl border-0 bg-slate-900 text-xs font-extrabold text-white">
                  Siapkan chat {context.escalation.recommendedExpert}
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="mb-4 space-y-2">
          {MODES.map((item) => (
            <ModeButton
              key={item.id}
              mode={item}
              active={mode === item.id}
              onClick={() => setMode(item.id)}
            />
          ))}
        </section>

        <button type="button" onClick={runMode} className="mb-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border-0 bg-teal-700 text-xs font-extrabold text-white">
          Jalankan bantuan AI <ArrowRight size={14} />
        </button>

        {messages.length > 0 && (
          <section className="space-y-3">
            {messages.map((message) => (
              message.type === 'user'
                ? (
                  <div key={message.id} className="ml-10 rounded-2xl rounded-br-sm bg-teal-700 px-4 py-3 text-xs font-bold leading-relaxed text-white">
                    {message.text}
                  </div>
                )
                : <AIMessage key={message.id} message={message} onAction={handleAction} />
            ))}
          </section>
        )}

        <section className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-3.5">
          <div className="flex items-start gap-2.5">
            <ShieldAlert size={17} className="mt-0.5 shrink-0 text-amber-700" />
            <p className="text-[10px] font-semibold leading-relaxed text-amber-900">
              AI adalah koordinator wellness, bukan alat diagnosis. Untuk gejala berat, memburuk, atau darurat, cari bantuan profesional secara langsung.
            </p>
          </div>
        </section>
      </div>

      <footer className="shrink-0 border-t border-slate-200 bg-white px-5 py-3">
        <form onSubmit={submitMessage} className="relative">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Tanya tentang hari ini, pola, atau chat ahli"
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-3 pr-12 text-xs font-medium text-slate-900 outline-none focus:border-teal-600"
          />
          <button type="submit" disabled={!input.trim()} aria-label="Kirim" className="absolute right-1.5 top-1.5 flex h-9 w-9 items-center justify-center rounded-lg border-0 bg-teal-700 text-white disabled:bg-slate-200">
            <Send size={15} />
          </button>
        </form>
      </footer>
    </div>
  );
}
