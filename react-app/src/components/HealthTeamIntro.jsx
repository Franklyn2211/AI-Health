import {
  ArrowRight,
  Bot,
  Brain,
  Dumbbell,
  MessageCircle,
  ShieldCheck,
  Star,
  Stethoscope,
  Utensils,
} from 'lucide-react';

const TEAM = [
  {
    title: 'Koordinator AI',
    detail: 'Menghubungkan check-in, plan, log, dan ringkasan untuk ahli.',
    Icon: Bot,
    tone: 'bg-slate-900 text-white',
  },
  {
    title: 'Dokter',
    detail: 'Meninjau gejala berulang dan sinyal perawatan preventif.',
    Icon: Stethoscope,
    tone: 'bg-teal-50 text-teal-700',
  },
  {
    title: 'Ahli Gizi',
    detail: 'Membantu ritme makan, catatan makanan, dan energi harian.',
    Icon: Utensils,
    tone: 'bg-orange-50 text-orange-700',
  },
  {
    title: 'Psikolog',
    detail: 'Membantu stres, mood, tidur, dan hari dengan kesiapan rendah.',
    Icon: Brain,
    tone: 'bg-violet-50 text-violet-700',
  },
  {
    title: 'Personal Trainer',
    detail: 'Menyesuaikan gerak berdasarkan energi dan pemulihan.',
    Icon: Dumbbell,
    tone: 'bg-emerald-50 text-emerald-700',
  },
];

const SAMPLE_PROFESSIONALS = [
  {
    name: 'dr. Andi Pratama',
    role: 'Dokter Umum',
    specialty: 'Preventive care',
    rating: 4.9,
    reviews: 306,
    available: 'hari ini',
    avatar: 'AP',
    tone: 'bg-teal-50 text-teal-700',
  },
  {
    name: 'dr. Rania Wijaya, Sp.GK',
    role: 'Dokter Spesialis Gizi Klinik',
    specialty: 'GERD, berat badan, nutrisi klinis',
    rating: 4.8,
    reviews: 189,
    available: 'besok',
    avatar: 'RW',
    tone: 'bg-cyan-50 text-cyan-700',
  },
  {
    name: 'Maya Putri, M.Psi.',
    role: 'Psikolog',
    specialty: 'Stress, sleep, burnout',
    rating: 4.9,
    reviews: 214,
    available: 'malam ini',
    avatar: 'MP',
    tone: 'bg-violet-50 text-violet-700',
  },
  {
    name: 'Bima Arya, CPT',
    role: 'Personal Trainer',
    specialty: 'Beginner strength, no equipment',
    rating: 4.8,
    reviews: 132,
    available: 'besok',
    avatar: 'BA',
    tone: 'bg-emerald-50 text-emerald-700',
  },
];

export default function HealthTeamIntro({ onContinue }) {
  return (
    <div className="screen-scroll h-full overflow-y-auto bg-[#f7f8f5] px-5 pb-8 pt-5">
      <header className="mb-5 rounded-[28px] bg-slate-900 p-5 text-white shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-extrabold uppercase text-teal-200">
            Sistem Perawatan VIN AI
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-teal-200">
            <ShieldCheck size={19} />
          </span>
        </div>

        <h1 className="text-[27px] font-extrabold leading-tight">
          Ini tim kesehatan kamu
        </h1>
        <p className="mt-3 text-sm font-medium leading-relaxed text-slate-300">
          App dimulai dari AI untuk dukungan harian, lalu mengarahkan ke ahli yang tepat saat polamu perlu ditinjau manusia.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {['AI dulu', 'Ditinjau ahli', 'Chat konsultasi'].map((item) => (
            <div key={item} className="rounded-2xl bg-white/10 px-2 py-2.5 text-center">
              <p className="text-[10px] font-extrabold leading-tight text-slate-100">{item}</p>
            </div>
          ))}
        </div>
      </header>

      <section className="mb-5">
        <div className="mb-3">
          <p className="text-[10px] font-extrabold uppercase text-teal-700">Contoh ahli</p>
          <h2 className="mt-1 text-lg font-extrabold text-slate-900">Orang di balik care layer</h2>
          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
            Profil demo untuk mock app. Dalam produk asli, setiap profil perlu kredensial yang diverifikasi.
          </p>
        </div>

        <div className="space-y-2">
          {SAMPLE_PROFESSIONALS.map((person) => (
            <article key={person.name} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
              <div className="flex items-start gap-3">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-extrabold ${person.tone}`}>
                  {person.avatar}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-extrabold text-slate-900">{person.name}</h3>
                      <p className="mt-0.5 text-[11px] font-bold text-teal-700">{person.role}</p>
                    </div>
                    <span className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-[10px] font-extrabold text-amber-700">
                      <Star size={11} fill="currentColor" />
                      {person.rating}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] font-medium leading-relaxed text-slate-500">{person.specialty}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-500">
                    <span>{person.reviews} reviews</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span className="flex items-center gap-1 text-teal-700"><MessageCircle size={11} /> Chat {person.available}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-5">
        <div className="mb-3">
          <p className="text-[10px] font-extrabold uppercase text-teal-700">Cara bantuan bekerja</p>
          <h2 className="mt-1 text-lg font-extrabold text-slate-900">Satu tim perawatan terhubung</h2>
        </div>

        <div className="space-y-2">
          {TEAM.map(({ title, detail, Icon, tone }) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
              <div className="flex items-start gap-3">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                  <Icon size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
                  <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">{detail}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-5 rounded-2xl border border-teal-100 bg-white p-4 shadow-sm">
        <p className="text-[10px] font-extrabold uppercase text-teal-700">Janji produk</p>
        <h2 className="mt-1 text-base font-extrabold text-slate-900">Lebih sedikit input, lebih banyak arahan berguna</h2>
        <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500">
          Home akan fokus pada satu langkah utama, check-in cepat, dan jalur jelas menuju chat ahli saat app melihat pola berulang.
        </p>
      </section>

      <button
        type="button"
        onClick={onContinue}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-0 bg-teal-700 text-sm font-extrabold text-white shadow-sm active:scale-[0.99]"
      >
        Masuk ke Home <ArrowRight size={17} />
      </button>
    </div>
  );
}
