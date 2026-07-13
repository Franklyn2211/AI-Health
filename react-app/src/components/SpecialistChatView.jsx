import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  ClipboardList,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useHealth } from '../context/healthContextCore';
import { buildSpecialistHandoff } from '../lib/specialistHandoff';

const DEFAULT_APPOINTMENT = {
  professionalName: 'Nadia Putri, S.Gz., RD',
  role: 'Ahli Gizi',
  slot: 'Hari ini, 16:30',
  duration: 40,
  sharedSummary: true,
};

const PLAN_BY_ROLE = {
  Psikolog: [
    'Tulis satu pemicu stres yang paling terasa hari ini.',
    'Lakukan jeda napas 2 menit sebelum tidur.',
    'Turunkan target besok bila tidur malam ini kurang.',
  ],
  'Ahli Gizi': [
    'Tambahkan protein utama di makan siang berikutnya.',
    'Pilih satu camilan yang lebih stabil untuk energi sore.',
    'Foto atau catat makan malam dengan satu kalimat.',
  ],
  'Pelatih Kebugaran': [
    'Mulai dengan mobilitas 5 menit sebelum latihan.',
    'Pilih latihan 10 menit tanpa alat hari ini.',
    'Berhenti bila nyeri tajam, pusing, atau sesak.',
  ],
  'Dokter Umum': [
    'Pantau gejala yang muncul berulang minggu ini.',
    'Catat waktu muncul gejala dan pemicunya.',
    'Cari bantuan langsung bila gejala memburuk.',
  ],
};

function ChatBubble({ author, children, mine = false }) {
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 ${mine ? 'bg-slate-900 text-white' : 'bg-white text-slate-800 shadow-sm'}`}>
        <p className={`mb-1 text-[9px] font-extrabold uppercase ${mine ? 'text-slate-300' : 'text-teal-700'}`}>{author}</p>
        <p className="text-xs font-medium leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

export default function SpecialistChatView({ onBack, onTabChange }) {
  const {
    userProfile,
    todayRecord,
    dailyRecords,
    loggedMeals,
    careAppointments,
    updateDailyRecord,
  } = useHealth();
  const [planSaved, setPlanSaved] = useState(Boolean(todayRecord.specialistPlanAccepted));
  const appointment = careAppointments[0] || DEFAULT_APPOINTMENT;
  const firstName = userProfile.fullName ? userProfile.fullName.split(' ')[0] : 'Jason';
  const symptoms = (todayRecord.logs || []).filter((log) => log.type === 'symptom').map((log) => log.label);
  const plan = useMemo(() => PLAN_BY_ROLE[appointment.role] || PLAN_BY_ROLE['Dokter Umum'], [appointment.role]);
  const handoff = useMemo(() => (
    buildSpecialistHandoff({
      userProfile,
      todayRecord,
      dailyRecords,
      loggedMeals,
      role: appointment.role,
    })
  ), [appointment.role, dailyRecords, loggedMeals, todayRecord, userProfile]);

  const summaryRows = [
    { label: 'Tujuan', value: handoff.focusLabel },
    { label: 'Hari ini', value: handoff.todayCheckIn },
    { label: 'Makanan', value: `${loggedMeals.length} catatan makanan` },
    { label: 'Gejala', value: symptoms.length ? symptoms.join(', ') : 'Tidak ada gejala tercatat' },
  ];

  const savePlan = () => {
    updateDailyRecord({
      specialistPlanAccepted: true,
      specialistPlan: plan,
      specialistPlanSource: {
        professionalName: appointment.professionalName,
        role: appointment.role,
        savedAt: new Date().toISOString(),
      },
    });
    setPlanSaved(true);
  };

  return (
    <div className="flex h-full flex-col bg-[#f4f6f3]">
      <header className="shrink-0 border-b border-slate-200 bg-[#f7f8f5] px-5 pb-4 pt-5">
        <div className="mb-4 flex items-center justify-between">
          <button type="button" onClick={onBack} aria-label="Kembali" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700">
            <ArrowLeft size={18} />
          </button>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-extrabold text-emerald-700">Online chat</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-extrabold text-white">
            {appointment.professionalName.split(' ').map((part) => part[0]).slice(0, 2).join('')}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-extrabold uppercase text-teal-700">Ruang chat konsultasi</p>
            <h1 className="mt-0.5 truncate text-lg font-extrabold text-slate-900">{appointment.professionalName}</h1>
            <p className="mt-0.5 text-xs font-bold text-slate-500">{appointment.role} - {appointment.slot} - {appointment.duration} menit</p>
          </div>
        </div>
      </header>

      <main className="screen-scroll flex-1 space-y-4 overflow-y-auto px-5 py-4">
        <section className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-sky-700" />
            <h2 className="text-sm font-extrabold text-sky-950">AI summary sent</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {summaryRows.map((row) => (
              <div key={row.label} className="rounded-xl bg-white/70 px-3 py-2">
                <p className="text-[9px] font-extrabold uppercase text-sky-600">{row.label}</p>
                <p className="mt-1 text-[11px] font-bold leading-relaxed text-sky-950">{row.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-xl bg-white/70 px-3 py-2">
            <p className="text-[9px] font-extrabold uppercase text-sky-600">Concern utama</p>
            <p className="mt-1 text-[11px] font-bold leading-relaxed text-sky-950">{handoff.keyConcern}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-teal-700" />
            <h2 className="text-sm font-extrabold text-slate-900">Pertanyaan siap pakai</h2>
          </div>
          <div className="space-y-2">
            {handoff.questions.map((question) => (
              <div key={question} className="rounded-xl bg-slate-50 px-3 py-2.5">
                <p className="text-[11px] font-bold leading-relaxed text-slate-600">{question}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <ChatBubble author={firstName} mine>
            Aku ingin saran yang realistis untuk hari ini. Aku sering mulai semangat, tapi susah konsisten.
          </ChatBubble>
          <ChatBubble author={appointment.role}>
            Aku sudah lihat ringkasannya. Kita buat langkah kecil dulu supaya tidak terasa berat dan tetap bisa diikuti.
          </ChatBubble>
          <ChatBubble author={appointment.role}>
            Untuk hari ini, fokusnya bukan sempurna. Fokusnya satu perubahan yang paling mudah dilakukan dan bisa diulang besok.
          </ChatBubble>
        </section>

        <section className="rounded-2xl border border-teal-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <ClipboardList size={17} className="text-teal-700" />
            <h2 className="text-sm font-extrabold text-slate-900">Specialist action plan</h2>
          </div>
          <div className="space-y-2">
            {plan.map((item) => (
              <div key={item} className="flex gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
                <Check size={14} className="mt-0.5 shrink-0 text-teal-700" strokeWidth={3} />
                <p className="text-[11px] font-bold leading-relaxed text-slate-600">{item}</p>
              </div>
            ))}
          </div>
          <button type="button" onClick={savePlan} className={`mt-3 h-11 w-full rounded-xl border-0 text-xs font-extrabold ${planSaved ? 'bg-teal-50 text-teal-800' : 'bg-teal-700 text-white'}`}>
            {planSaved ? 'Sudah masuk ke dashboard' : 'Tambahkan ke rencana hari ini'}
          </button>
        </section>

        <section className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <div className="flex gap-3">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-amber-700" />
            <p className="text-[11px] font-medium leading-relaxed text-amber-900">
              Ini adalah mock konsultasi wellness. Untuk kondisi darurat, gejala berat, atau risiko keselamatan, pengguna harus mencari bantuan langsung.
            </p>
          </div>
        </section>
      </main>

      <footer className="shrink-0 border-t border-slate-200 bg-white px-5 py-3">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
          <div className="flex h-10 min-w-0 flex-1 items-center rounded-xl bg-white px-3 text-xs font-medium text-slate-400">
            Tulis pesan untuk konsultasi...
          </div>
          <button type="button" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-0 bg-slate-900 text-white" aria-label="Kirim pesan">
            <Send size={17} />
          </button>
        </div>
        <button type="button" onClick={() => onTabChange('home')} className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-xl border-0 bg-teal-50 text-xs font-extrabold text-teal-800">
          <MessageCircle size={15} /> Lihat dampaknya di dashboard
        </button>
      </footer>
    </div>
  );
}
