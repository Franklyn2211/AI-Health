import { useState } from 'react';
import { useHealth } from '../context/healthContextCore';
import {
  ArrowLeft, Star, Clock, Search,
  MessageSquare, Calendar, CheckCircle2, X,
} from 'lucide-react';

/* ─── Doctor Database ─────────────────────────────────── */
const DOCTORS = [
  {
    id: 1,
    name: 'Dr. Rina Maharani, Sp.OG',
    specialty: 'Obstetri & Ginekologi',
    specialtyId: 'obgyn',
    hospital: 'RS Pondok Indah',
    experience: '14 tahun',
    rating: 4.9,
    reviews: 312,
    price: 'Rp 150.000',
    available: 'Hari Ini 14:00',
    online: true,
    avatar: 'RM',
    avatarColor: '#ec4899',
    tags: ['pregnancy', 'kehamilan', 'prenatal'],
    bio: 'Spesialis kandungan berpengalaman dengan fokus pada kehamilan berisiko tinggi dan prenatal care modern.',
  },
  {
    id: 2,
    name: 'Dr. Budi Hartono, Sp.PD',
    specialty: 'Penyakit Dalam',
    specialtyId: 'internal',
    hospital: 'RSUP Dr. Hasan Sadikin',
    experience: '18 tahun',
    rating: 4.8,
    reviews: 540,
    price: 'Rp 120.000',
    available: 'Hari Ini 16:30',
    online: true,
    avatar: 'BH',
    avatarColor: '#1f6e64',
    tags: ['diabetes', 'kolesterol', 'hipertensi', 'umum'],
    bio: 'Internist senior dengan keahlian di manajemen diabetes tipe 2, hipertensi, dan penyakit metabolik.',
  },
  {
    id: 3,
    name: 'Dr. Sari Dewi, Sp.GK',
    specialty: 'Gizi Klinik',
    specialtyId: 'nutrition',
    hospital: 'Klinik Sehat Mandiri',
    experience: '10 tahun',
    rating: 4.9,
    reviews: 228,
    price: 'Rp 100.000',
    available: 'Besok 09:00',
    online: false,
    avatar: 'SD',
    avatarColor: '#f59e0b',
    tags: ['nutrisi', 'diet', 'lose-weight', 'diabetes'],
    bio: 'Ahli gizi klinik bersertifikat untuk program penurunan berat badan berbasis sains dan diet diabetes.',
  },
  {
    id: 4,
    name: 'Dr. Kevin Sutanto, Sp.JP',
    specialty: 'Kardiologi',
    specialtyId: 'cardio',
    hospital: 'RS Jantung Harapan Kita',
    experience: '22 tahun',
    rating: 5.0,
    reviews: 189,
    price: 'Rp 200.000',
    available: 'Besok 11:00',
    online: true,
    avatar: 'KS',
    avatarColor: '#ef4444',
    tags: ['jantung', 'heart-health', 'hipertensi', 'kardio'],
    bio: 'Kardiolog intervensi dengan pengalaman lebih dari 2.000 prosedur kateterisasi dan rehabilitasi jantung.',
  },
  {
    id: 5,
    name: 'Dr. Maya Putri, Sp.KJ',
    specialty: 'Kesehatan Jiwa',
    specialtyId: 'psychiatry',
    hospital: 'Klinik Jiwa Harmoni',
    experience: '9 tahun',
    rating: 4.9,
    reviews: 415,
    price: 'Rp 130.000',
    available: 'Hari Ini 19:00',
    online: true,
    avatar: 'MP',
    avatarColor: '#8b5cf6',
    tags: ['stres', 'reduce-stress', 'mental', 'anxietas', 'sleep-quality'],
    bio: 'Psikiater dengan fokus pada gangguan kecemasan, insomnia, dan kesehatan mental di era digital.',
  },
  {
    id: 6,
    name: 'Dr. Andi Prasetyo, Sp.EM',
    specialty: 'Endokrinologi & Metabolik',
    specialtyId: 'endo',
    hospital: 'RSUD Cipto Mangunkusumo',
    experience: '16 tahun',
    rating: 4.7,
    reviews: 302,
    price: 'Rp 175.000',
    available: 'Lusa 10:00',
    online: false,
    avatar: 'AP',
    avatarColor: '#0ea5e9',
    tags: ['diabetes', 'tiroid', 'metabolik', 'diabetes-management'],
    bio: 'Spesialis endokrinologi untuk diabetes mellitus, gangguan tiroid, dan sindrom metabolik.',
  },
];

const SPECIALTIES = [
  { id: 'all', label: 'Semua' },
  { id: 'internal', label: 'Umum' },
  { id: 'obgyn', label: 'Kandungan' },
  { id: 'cardio', label: 'Jantung' },
  { id: 'nutrition', label: 'Gizi' },
  { id: 'psychiatry', label: 'Jiwa' },
  { id: 'endo', label: 'Endokrin' },
];

/* ── Booking Modal ── */
function BookingModal({ doctor, onClose }) {
  const [selected, setSelected] = useState(null);
  const slots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '19:00'];

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm"
      onClick={onClose}>
      <div className="bg-white rounded-t-3xl p-5 pb-8 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-[#d4dcd9] rounded-full mx-auto mb-4" />

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-[13px] font-[900] shrink-0"
            style={{ backgroundColor: doctor.avatarColor }}>
            {doctor.avatar}
          </div>
          <div>
            <p className="text-[14px] font-[800] text-[#253532]">{doctor.name}</p>
            <p className="text-[12px] text-[#61716c]">{doctor.specialty}</p>
          </div>
        </div>

        <p className="text-[12px] font-[850] text-[#253532] uppercase mb-3">Pilih Jam Konsultasi</p>
        <div className="grid grid-cols-4 gap-2 mb-5">
          {slots.map(slot => (
            <button key={slot} onClick={() => setSelected(slot)}
              className={`py-2 rounded-xl text-[12px] font-[800] border transition-all ${selected === slot
                  ? 'bg-[#1f6e64] text-white border-[#1f6e64]'
                  : 'bg-white text-[#253532] border-[#e6f2ec]'
                }`}>
              {slot}
            </button>
          ))}
        </div>

        <button
          disabled={!selected}
          className="w-full h-12 rounded-2xl bg-[#1f6e64] text-white text-[14px] font-[800] border-0 disabled:opacity-40 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={16} /> Konfirmasi Booking {selected && `Pukul ${selected}`}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function DoctorListView({ onBack }) {
  const { userProfile } = useHealth();
  const goals = userProfile.goals || [];

  const [activeSpec, setActiveSpec] = useState('all');
  const [search, setSearch] = useState('');
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  /* ── Sort: goal-matching doctors first ── */
  const sortedDoctors = [...DOCTORS].sort((a, b) => {
    const aMatch = goals.some(g => a.tags.includes(g));
    const bMatch = goals.some(g => b.tags.includes(g));
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });

  const filtered = sortedDoctors.filter(d => {
    const matchSpec = activeSpec === 'all' || d.specialtyId === activeSpec;
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase());
    const matchOnline = !showOnlineOnly || d.online;
    return matchSpec && matchSearch && matchOnline;
  });

  const recommendedIds = new Set(
    DOCTORS.filter(d => goals.some(g => d.tags.includes(g))).map(d => d.id)
  );

  return (
    <div className="screen-scroll h-full overflow-y-auto px-5 pt-4 pb-24 bg-[#f8faf7] relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack}
          className="w-9 h-9 rounded-xl bg-white border border-[#e6f2ec] flex items-center justify-center text-[#1f6e64] shadow-sm transition-all active:scale-95">
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-[10px] font-[850] text-[#61716c] uppercase tracking-widest"></p>
          <h1 className="text-[20px] font-[800] text-[#253532]">Dokter Spesialis</h1>
        </div>
        <button
          onClick={() => setShowOnlineOnly(v => !v)}
          className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-[800] border transition-all ${showOnlineOnly ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-[#61716c] border-[#e6f2ec]'
            }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${showOnlineOnly ? 'bg-white' : 'bg-emerald-400'}`} />
          Online
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#61716c]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari dokter atau spesialisasi..."
          className="w-full pl-9 pr-4 py-3 rounded-2xl border border-[#d4dcd9] bg-white text-[13px] text-[#253532] outline-none focus:ring-2 focus:ring-[#1f6e64]/30 focus:border-[#1f6e64] transition-all"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#61716c]">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Specialty filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 -mx-5 px-5">
        {SPECIALTIES.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSpec(s.id)}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-[12px] font-[800] border transition-all active:scale-[0.97] ${activeSpec === s.id
                ? 'bg-[#1f6e64] text-white border-[#1f6e64]'
                : 'bg-white text-[#61716c] border-[#e6f2ec]'
              }`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Recommended banner */}
      {goals.length > 0 && (
        <div className="flex items-center gap-2 rounded-2xl bg-[#f0f9f7] border border-[#d4e8e4] p-3 mb-4">
          <Star size={14} className="text-[#1f6e64] shrink-0" />
          <p className="text-[12px] text-[#1f6e64] font-[700]">
            Dokter direkomendasikan berdasarkan tujuan kesehatan Anda ditandai dengan bintang.
          </p>
        </div>
      )}

      {/* Doctor Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-[14px] text-[#61716c]">Tidak ada dokter yang sesuai filter.</p>
            <button onClick={() => { setSearch(''); setActiveSpec('all'); setShowOnlineOnly(false); }}
              className="mt-3 text-[#1f6e64] text-[12px] font-[800]">Reset Filter</button>
          </div>
        ) : (
          filtered.map(doctor => {
            const isRecommended = recommendedIds.has(doctor.id);
            return (
              <article key={doctor.id}
                className="rounded-3xl bg-white shadow-sm border border-[#e6f2ec] overflow-hidden transition-all hover:scale-[1.01]">
                {/* Recommended badge */}
                {isRecommended && (
                  <div className="flex items-center gap-1.5 px-4 py-1.5 bg-[#f0f9f7] border-b border-[#d4e8e4]">
                    <Star size={11} className="text-[#1f6e64]" fill="#1f6e64" />
                    <p className="text-[10px] font-[850] text-[#1f6e64] uppercase tracking-widest">Direkomendasikan untukmu</p>
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    {/* Avatar */}
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-[13px] font-[900] shrink-0 shadow-sm"
                      style={{ backgroundColor: doctor.avatarColor + 'dd' }}
                    >
                      {doctor.avatar}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-[14px] font-[800] text-[#253532] leading-tight">{doctor.name}</h3>
                          <p className="text-[12px] text-[#1f6e64] font-[700]">{doctor.specialty}</p>
                          <p className="text-[11px] text-[#61716c] mt-0.5">{doctor.hospital}</p>
                        </div>
                        {doctor.online && (
                          <span className="shrink-0 flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 font-[800] px-2 py-0.5 rounded-lg border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Online
                          </span>
                        )}
                      </div>

                      {/* Stats row */}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-[11px] text-[#61716c]">
                          <Star size={11} className="text-amber-400" fill="#fbbf24" />
                          {doctor.rating} ({doctor.reviews})
                        </span>
                        <span className="text-[#d4dcd9]">·</span>
                        <span className="text-[11px] text-[#61716c]">{doctor.experience}</span>
                        <span className="text-[#d4dcd9]">·</span>
                        <span className="text-[11px] font-[800] text-[#1f6e64]">{doctor.price}/sesi</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-[12px] text-[#61716c] leading-relaxed mb-3">{doctor.bio}</p>

                  {/* Availability */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <Clock size={12} className="text-[#61716c]" />
                    <p className="text-[12px] text-[#61716c]">Slot berikutnya: <span className="font-[800] text-[#253532]">{doctor.available}</span></p>
                  </div>

                  {/* CTA */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setBookingDoctor(doctor)}
                      className="flex items-center justify-center gap-1.5 h-10 rounded-2xl bg-[#1f6e64] text-white text-[12px] font-[800] border-0 transition-all active:scale-[0.98]"
                    >
                      <Calendar size={13} /> Booking
                    </button>
                    <button
                      className="flex items-center justify-center gap-1.5 h-10 rounded-2xl border border-[#1f6e64] text-[#1f6e64] text-[12px] font-[800] bg-white transition-all active:scale-[0.98]"
                    >
                      <MessageSquare size={13} /> Chat
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Booking Modal */}
      {bookingDoctor && (
        <BookingModal doctor={bookingDoctor} onClose={() => setBookingDoctor(null)} />
      )}
    </div>
  );
}
