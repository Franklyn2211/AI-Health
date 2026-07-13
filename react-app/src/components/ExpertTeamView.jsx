import { useMemo, useState } from 'react';
import {
  Brain,
  Check,
  ChevronRight,
  Dumbbell,
  FileText,
  MessageCircle,
  ShieldCheck,
  Star,
  Stethoscope,
  Utensils,
  X,
} from 'lucide-react';
import { useHealth } from '../context/healthContextCore';
import { buildSpecialistHandoff } from '../lib/specialistHandoff';

const PROFESSIONALS = [
  {
    id: 'maya',
    name: 'Maya Putri, M.Psi., Psikolog',
    role: 'Psikolog',
    specialty: 'Stres, kecemasan, dan burnout',
    experience: '8 tahun',
    rating: 4.9,
    reviews: 214,
    price: 125000,
    duration: 45,
    avatar: 'MP',
    goals: ['mental-health'],
    focus: ['stress', 'mood', 'burnout'],
    approach: 'CBT dan terapi berfokus solusi',
    credential: 'SIPP aktif - HIMPSI',
    about: 'Mendampingi dewasa muda mengelola stres, kecemasan, burnout, dan perubahan hidup dengan pendekatan terstruktur.',
    slots: ['Hari ini, 19:00', 'Besok, 10:00', 'Sabtu, 13:30'],
    tone: 'bg-violet-100 text-violet-700',
    Icon: Brain,
  },
  {
    id: 'nadia',
    name: 'Nadia Putri, S.Gz., RD',
    role: 'Ahli Gizi',
    specialty: 'Nutrisi klinis dan pengelolaan berat',
    experience: '7 tahun',
    rating: 4.8,
    reviews: 178,
    price: 95000,
    duration: 40,
    avatar: 'NP',
    goals: ['body-goals'],
    focus: ['gain-weight', 'lose-weight', 'eat-better', 'more-energy'],
    approach: 'Pola makan lokal yang realistis',
    credential: 'STR aktif - PERSAGI',
    about: 'Menyusun pola makan praktis berdasarkan kebiasaan, anggaran, kondisi kesehatan, dan makanan Indonesia.',
    slots: ['Hari ini, 16:30', 'Besok, 09:00', 'Jumat, 18:00'],
    tone: 'bg-orange-100 text-orange-700',
    Icon: Utensils,
  },
  {
    id: 'rania',
    name: 'dr. Rania Wijaya, Sp.GK',
    role: 'Dokter Spesialis Gizi Klinik',
    specialty: 'GERD, berat badan, dan nutrisi klinis',
    experience: '9 tahun',
    rating: 4.8,
    reviews: 189,
    price: 150000,
    duration: 45,
    avatar: 'RW',
    goals: ['body-goals', 'immune-booster'],
    focus: ['gain-weight', 'lose-weight', 'eat-better', 'manage-condition', 'preventive-care'],
    approach: 'Nutrisi klinis berbasis kondisi kesehatan',
    credential: 'STR dan SIP aktif - PDGKI',
    about: 'Membantu meninjau pola makan, GERD, target berat badan, dan kondisi medis yang membutuhkan arahan nutrisi lebih hati-hati.',
    slots: ['Besok, 13:00', 'Jumat, 10:30', 'Sabtu, 15:00'],
    tone: 'bg-cyan-100 text-cyan-700',
    Icon: Stethoscope,
  },
  {
    id: 'bima',
    name: 'Bima Arya, CPT',
    role: 'Pelatih Kebugaran',
    specialty: 'Latihan pemula dan tanpa alat',
    experience: '6 tahun',
    rating: 4.8,
    reviews: 132,
    price: 80000,
    duration: 35,
    avatar: 'BA',
    goals: ['body-goals'],
    focus: ['gain-weight', 'build-strength', 'more-energy'],
    approach: 'Latihan progresif berbasis kemampuan',
    credential: 'NASM-CPT',
    about: 'Membantu pemula membangun kekuatan dengan latihan aman yang dapat dilakukan di rumah atau ruang terbatas.',
    slots: ['Besok, 07:00', 'Besok, 17:30', 'Sabtu, 09:00'],
    tone: 'bg-emerald-100 text-emerald-700',
    Icon: Dumbbell,
  },
  {
    id: 'andi',
    name: 'dr. Andi Pratama',
    role: 'Dokter Umum',
    specialty: 'Preventif dan kesehatan keluarga',
    experience: '10 tahun',
    rating: 4.9,
    reviews: 306,
    price: 75000,
    duration: 30,
    avatar: 'AP',
    goals: ['immune-booster'],
    focus: ['healthy-routine', 'preventive-care', 'manage-condition'],
    approach: 'Pencegahan dan koordinasi perawatan',
    credential: 'STR dan SIP aktif - IDI',
    about: 'Membantu meninjau gejala, faktor risiko, pemeriksaan preventif, dan menentukan rujukan yang sesuai.',
    slots: ['Hari ini, 14:30', 'Hari ini, 20:00', 'Besok, 11:00'],
    tone: 'bg-teal-100 text-teal-700',
    Icon: Stethoscope,
  },
];

const formatPrice = (price) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
}).format(price);

function getRecommendationReason(professional, userProfile, dailySummary) {
  if (professional.role === 'Dokter Spesialis Gizi Klinik') {
    return 'Cocok jika nutrisi perlu disesuaikan dengan kondisi medis, GERD, berat badan, atau gejala berulang.';
  }
  if (professional.role === 'Ahli Gizi') {
    return dailySummary.mealCount === 0
      ? 'Belum ada makanan dicatat hari ini, jadi ahli gizi paling relevan untuk mulai dari langkah sederhana.'
      : 'Cocok untuk membuat pola makan lebih realistis sesuai target tubuh dan energi.';
  }
  if (professional.role === 'Psikolog') {
    return 'Cocok jika mood, stres, atau tidur mulai mengganggu konsistensi rutinitas.';
  }
  if (professional.role === 'Pelatih Kebugaran') {
    return 'Cocok untuk membuat latihan singkat yang aman, realistis, dan bisa dilakukan tanpa alat.';
  }
  if (userProfile.focus === 'preventive-care' || dailySummary.symptoms.length > 0) {
    return 'Cocok untuk meninjau gejala, risiko, dan langkah preventif yang perlu dipantau.';
  }
  return 'Cocok untuk memastikan langkah AI tetap aman dan masuk akal untuk kondisi kesehatanmu.';
}

function AppointmentCard({ appointment, onOpenChat }) {
  return (
    <section className="mb-4 rounded-2xl bg-slate-900 p-4 text-white">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
          <MessageCircle size={19} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-extrabold uppercase text-teal-300">Chat berikutnya</p>
            <span className="rounded-lg bg-emerald-400/15 px-2 py-1 text-[9px] font-extrabold text-emerald-300">Terkonfirmasi</span>
          </div>
          <h3 className="mt-1 text-sm font-extrabold">{appointment.professionalName}</h3>
          <p className="mt-0.5 text-xs font-medium text-slate-300">{appointment.role} - {appointment.slot}</p>
          <button type="button" onClick={onOpenChat} className="mt-3 h-10 w-full rounded-xl border border-white/10 bg-white text-xs font-extrabold text-slate-950">
            Buka ruang chat
          </button>
        </div>
      </div>
    </section>
  );
}

function ProfessionalCard({ professional, recommended, onClick }) {
  const Icon = professional.Icon;

  return (
    <button type="button" onClick={onClick} className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-left transition-all active:scale-[0.99]">
      <div className="flex gap-3">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-extrabold ${professional.tone}`}>
          {professional.avatar}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {recommended && <Star size={11} className="shrink-0 text-amber-500" fill="currentColor" />}
            <h3 className="truncate text-sm font-extrabold leading-tight text-slate-900">{professional.name}</h3>
          </div>
          <p className="mt-1 text-[11px] font-bold text-teal-700">{professional.role}</p>
          <p className="mt-0.5 text-[11px] font-medium leading-relaxed text-slate-500">{professional.specialty}</p>
          <p className="mt-2 inline-flex rounded-lg bg-emerald-50 px-2 py-1 text-[9px] font-extrabold text-emerald-700">
            Kredensial terverifikasi
          </p>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-semibold text-slate-500">
            <span className="flex items-center gap-1"><Icon size={11} /> {professional.duration} menit chat</span>
            <span className="flex items-center gap-1"><Star size={11} className="text-amber-500" fill="currentColor" /> {professional.rating} ({professional.reviews})</span>
          </div>
        </div>
        <ChevronRight size={17} className="mt-4 shrink-0 text-slate-300" />
      </div>
    </button>
  );
}

export default function ExpertTeamView({ onSubViewChange }) {
  const {
    userProfile,
    todayRecord,
    dailyRecords,
    loggedMeals,
    careAppointments,
    bookAppointment,
  } = useHealth();
  const [selected, setSelected] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [shareSummary, setShareSummary] = useState(true);
  const [bookingComplete, setBookingComplete] = useState(false);

  const primaryGoal = userProfile.primaryGoal || userProfile.goals[0] || 'immune-booster';
  const dailySummary = {
    checkIn: todayRecord.checkIn
      ? `Energi ${todayRecord.checkIn.energy}/3, mood ${todayRecord.checkIn.mood}/3, tidur ${todayRecord.checkIn.sleep}/3`
      : 'Belum ada check-in hari ini',
    mealCount: loggedMeals.length,
    meals: `${loggedMeals.length} makanan dicatat`,
    symptoms: (todayRecord.logs || []).filter((log) => log.type === 'symptom').map((log) => log.label),
  };
  const recommendations = useMemo(() => {
    const matches = PROFESSIONALS.filter((professional) => (
      professional.goals.includes(primaryGoal)
      || professional.focus.includes(userProfile.focus)
    ));
    return matches.length > 0 ? matches : PROFESSIONALS;
  }, [primaryGoal, userProfile.focus]);

  const visibleProfessionals = recommendations.slice(0, 4);
  const featuredProfessional = visibleProfessionals[0];
  const handoff = buildSpecialistHandoff({
    userProfile,
    todayRecord,
    dailyRecords,
    loggedMeals,
    role: featuredProfessional?.role || 'Dokter Umum',
  });
  const featuredReason = getRecommendationReason(featuredProfessional, userProfile, dailySummary);

  const openProfessional = (professional) => {
    setSelected(professional);
    setSelectedSlot('');
    setBookingComplete(false);
  };

  const confirmBooking = () => {
    if (!selected || !selectedSlot) return;
    bookAppointment({
      professionalId: selected.id,
      professionalName: selected.name,
      role: selected.role,
      slot: selectedSlot,
      price: selected.price,
      duration: selected.duration,
      consultationType: 'chat',
      sharedSummary: shareSummary,
    });
    setBookingComplete(true);
  };

  const openChatRoom = () => {
    setSelected(null);
    onSubViewChange('specialist-chat');
  };

  return (
    <div className="screen-scroll relative h-full overflow-y-auto bg-[#f7f8f5] px-5 pb-28 pt-5">
      <header className="mb-4">
        <p className="mb-1 text-[10px] font-extrabold uppercase text-teal-700">Perawatan</p>
        <h1 className="text-[25px] font-extrabold leading-tight text-slate-900">Chat ahli</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">AI memilih ahli yang paling relevan, lalu kamu konsultasi lewat chat.</p>
      </header>

      {careAppointments.length > 0 && (
        <AppointmentCard appointment={careAppointments[0]} onOpenChat={openChatRoom} />
      )}

      <section className="mb-5 rounded-2xl border border-teal-100 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <ShieldCheck size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-extrabold uppercase text-teal-700">AI merekomendasikan</p>
            <h2 className="mt-1 text-lg font-extrabold leading-tight text-slate-900">Chat {featuredProfessional.role}</h2>
            <p className="mt-1 text-xs font-bold leading-relaxed text-slate-600">{featuredReason}</p>

            <div className="mt-3 rounded-2xl bg-slate-50 p-3">
              <div className="flex items-center gap-3">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-extrabold ${featuredProfessional.tone}`}>
                  {featuredProfessional.avatar}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-extrabold text-slate-900">{featuredProfessional.name}</h3>
                  <p className="mt-0.5 text-[11px] font-bold text-teal-700">{featuredProfessional.specialty}</p>
                  <p className="mt-0.5 text-[10px] font-semibold text-slate-500">{featuredProfessional.slots[0]} - {formatPrice(featuredProfessional.price)}</p>
                </div>
              </div>
            </div>

            <button type="button" onClick={() => openProfessional(featuredProfessional)} className="mt-3 h-11 w-full rounded-xl border-0 bg-slate-900 text-xs font-extrabold text-white">
              Booking chat
            </button>
          </div>
        </div>
      </section>

      <section className="mb-5 rounded-2xl border border-sky-100 bg-sky-50 p-3.5">
        <div className="flex items-start gap-3">
          <FileText size={18} className="mt-0.5 shrink-0 text-sky-700" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold text-sky-950">Specialist handoff siap dikirim</p>
            <p className="mt-1 text-[11px] font-bold leading-relaxed text-sky-800">{handoff.shortSummary}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {handoff.stats.slice(0, 3).map((item) => (
                <span key={item} className="rounded-lg bg-white/70 px-2 py-1 text-[9px] font-extrabold text-sky-700">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-5">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase text-slate-500">Pilihan singkat</p>
            <h2 className="mt-0.5 text-base font-extrabold text-slate-900">Ahli yang cocok</h2>
          </div>
          <span className="text-[10px] font-extrabold text-teal-700">Top {visibleProfessionals.length}</span>
        </div>

        <div className="space-y-2">
          {visibleProfessionals.map((professional) => (
            <ProfessionalCard
              key={professional.id}
              professional={professional}
              recommended={professional.id === featuredProfessional.id}
              onClick={() => openProfessional(professional)}
            />
          ))}
        </div>
      </section>

      <button type="button" onClick={() => onSubViewChange('reviewed-playbooks')} className="mb-6 flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          <ShieldCheck size={19} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-extrabold text-slate-900">Program ditinjau ahli</span>
          <span className="mt-1 block text-xs font-medium leading-relaxed text-slate-500">Program wellness dengan reviewer, kredensial, dan catatan keamanan.</span>
        </span>
        <ChevronRight size={17} className="shrink-0 text-slate-300" />
      </button>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/45 p-3 backdrop-blur-sm">
          <div className="screen-scroll max-h-[92%] w-full overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase text-teal-700">{selected.role}</p>
                <h2 className="mt-0.5 text-base font-extrabold text-slate-900">{selected.name}</h2>
              </div>
              <button type="button" onClick={() => setSelected(null)} aria-label="Tutup" className="flex h-9 w-9 items-center justify-center rounded-full border-0 bg-slate-100 text-slate-600">
                <X size={18} />
              </button>
            </div>

            {bookingComplete ? (
              <div className="px-5 py-10 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-700"><Check size={30} strokeWidth={3} /></span>
                <h3 className="mt-5 text-xl font-extrabold text-slate-900">Chat konsultasi tersimpan</h3>
                <p className="mt-2 text-sm font-medium text-slate-500">{selected.name}<br />{selectedSlot}</p>
                <button type="button" onClick={openChatRoom} className="mt-6 h-12 w-full rounded-xl border-0 bg-teal-700 text-sm font-extrabold text-white">Buka ruang chat</button>
              </div>
            ) : (
              <>
                <div className="space-y-5 px-5 py-5">
                  <section className="flex gap-3">
                    <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-extrabold ${selected.tone}`}>{selected.avatar}</span>
                    <div>
                      <p className="text-sm font-extrabold text-slate-900">{selected.specialty}</p>
                      <p className="mt-1 text-xs font-medium text-slate-500">{selected.approach}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <p className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-extrabold text-emerald-700">Terverifikasi</p>
                        <p className="rounded-lg bg-teal-50 px-2 py-1 text-[10px] font-bold text-teal-700">{selected.credential}</p>
                      </div>
                      <p className="mt-2 text-[11px] font-medium leading-relaxed text-slate-500">{selected.about}</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="mb-2 text-[11px] font-extrabold uppercase text-slate-500">Pilih jadwal chat</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {selected.slots.map((slot) => (
                        <button key={slot} type="button" onClick={() => setSelectedSlot(slot)} className={`flex h-11 items-center justify-between rounded-xl border px-3 text-xs font-extrabold ${selectedSlot === slot ? 'border-teal-700 bg-teal-50 text-teal-800' : 'border-slate-200 bg-white text-slate-600'}`}>
                          {slot}
                          {selectedSlot === slot && <Check size={15} />}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
                    <div className="flex items-start gap-3">
                      <FileText size={18} className="mt-0.5 shrink-0 text-sky-700" />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs font-extrabold text-sky-950">Ringkasan konsultasi</h3>
                        <p className="mt-1 text-[11px] font-bold leading-relaxed text-sky-800">{handoff.shortSummary}</p>
                        <div className="mt-2 space-y-1">
                          {handoff.questions.slice(0, 2).map((question) => (
                            <p key={question} className="rounded-lg bg-white/70 px-2 py-1.5 text-[10px] font-bold leading-relaxed text-sky-900">{question}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                    <label className="mt-3 flex items-center gap-2 border-t border-sky-100 pt-3 text-[11px] font-bold text-sky-900">
                      <input type="checkbox" checked={shareSummary} onChange={(event) => setShareSummary(event.target.checked)} className="h-4 w-4 accent-teal-700" />
                      Bagikan ringkasan ini kepada ahli
                    </label>
                  </section>
                </div>

                <footer className="sticky bottom-0 border-t border-slate-100 bg-white p-5">
                  <div className="mb-3 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Biaya chat konsultasi</p>
                      <p className="text-lg font-extrabold text-slate-900">{formatPrice(selected.price)}</p>
                    </div>
                    <p className="text-xs font-bold text-slate-500">{selected.duration} menit chat</p>
                  </div>
                  <button type="button" disabled={!selectedSlot} onClick={confirmBooking} className="h-12 w-full rounded-xl border-0 bg-teal-700 text-sm font-extrabold text-white disabled:bg-slate-200 disabled:text-slate-400">
                    Konfirmasi chat
                  </button>
                </footer>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
