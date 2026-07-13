import { useState } from 'react';
import {
  ArrowLeft,
  Brain,
  Check,
  ChevronRight,
  Dumbbell,
  Moon,
  ShieldCheck,
  Stethoscope,
  Utensils,
} from 'lucide-react';
import { useHealth } from '../context/healthContextCore';
import AppJourneyFlow from './AppJourneyFlow';
import ReviewBadge from './ReviewBadge';

const PLAYBOOKS = [
  {
    id: 'sleep-reset-reviewed',
    title: 'Reset Tidur 7 Hari',
    category: 'Tidur dan kesehatan mental',
    reviewedBy: 'Maya Putri, M.Psi., Psikolog',
    reviewerRole: 'Psikolog',
    duration: 7,
    bestFor: 'Tidur kurang, energi pagi rendah, stres malam',
    promise: 'Membangun rutinitas tidur yang ringan tanpa memaksa perubahan besar.',
    steps: ['Tetapkan jam wind-down', 'Kurangi layar 20 menit', 'Catat energi pagi', 'Gunakan mode minimum bila tidur rendah'],
    safety: 'Jika insomnia berat, panik malam, atau mood sangat rendah berlangsung terus, konsultasikan dengan psikolog atau dokter.',
    Icon: Moon,
    tone: 'bg-sky-50 text-sky-700 border-sky-100',
  },
  {
    id: 'beginner-strength-reviewed',
    title: 'Fondasi Latihan Pemula',
    category: 'Fitness',
    reviewedBy: 'Bima Arya, CPT',
    reviewerRole: 'Personal Trainer',
    duration: 14,
    bestFor: 'Pemula, tanpa alat, ingin lebih kuat',
    promise: 'Latihan progresif pendek yang menyesuaikan energi harian.',
    steps: ['Mulai 8-15 menit', 'Prioritaskan teknik', 'Naikkan repetisi perlahan', 'Ganti mobilitas saat tidur buruk'],
    safety: 'Hentikan latihan bila ada nyeri tajam, pusing, sesak, atau gejala yang terasa tidak biasa.',
    Icon: Dumbbell,
    tone: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  {
    id: 'meal-rhythm-reviewed',
    title: 'Ritme Makan Seimbang',
    category: 'Gizi',
    reviewedBy: 'Nadia Putri, S.Gz., RD',
    reviewerRole: 'Ahli Gizi',
    duration: 7,
    bestFor: 'Makan tidak teratur, energi naik turun, ingin pola makan lokal',
    promise: 'Membantu user membuat pola makan sederhana dengan makanan sehari-hari.',
    steps: ['Tambahkan protein utama', 'Pilih karbo secukupnya', 'Masukkan sayur atau buah', 'Catat makan dengan satu kalimat'],
    safety: 'Untuk diabetes, gangguan makan, alergi berat, atau kondisi medis khusus, gunakan rencana dari ahli gizi atau dokter.',
    Icon: Utensils,
    tone: 'bg-orange-50 text-orange-700 border-orange-100',
  },
  {
    id: 'stress-recovery-reviewed',
    title: 'Rutinitas Pulih dari Stres',
    category: 'Kesehatan mental',
    reviewedBy: 'Maya Putri, M.Psi., Psikolog',
    reviewerRole: 'Psikolog',
    duration: 5,
    bestFor: 'Burnout ringan, tegang kerja, mood berat',
    promise: 'Rutinitas singkat untuk menurunkan beban mental dan menjaga aktivitas dasar.',
    steps: ['Jeda napas 2 menit', 'Tulis satu pemicu', 'Pilih satu kebutuhan kecil', 'Turunkan plan ke minimum bila perlu'],
    safety: 'Jika muncul keinginan menyakiti diri, rasa tidak aman, atau panik berat, cari bantuan manusia segera.',
    Icon: Brain,
    tone: 'bg-violet-50 text-violet-700 border-violet-100',
  },
  {
    id: 'preventive-check-reviewed',
    title: 'Cek Kesehatan Preventif',
    category: 'Kesehatan umum',
    reviewedBy: 'dr. Andi Pratama',
    reviewerRole: 'Dokter Umum',
    duration: 7,
    bestFor: 'Ingin hidup lebih sehat, punya gejala berulang, perlu persiapan konsultasi',
    promise: 'Membantu user mengumpulkan sinyal penting sebelum bicara dengan tenaga medis.',
    steps: ['Catat gejala bila muncul', 'Pantau tidur dan energi', 'Siapkan 3 pertanyaan konsultasi', 'Bawa ringkasan Health Memory'],
    safety: 'Untuk nyeri dada, sesak napas, pingsan, kelemahan mendadak, atau gejala berat, cari bantuan darurat.',
    Icon: Stethoscope,
    tone: 'bg-teal-50 text-teal-700 border-teal-100',
  },
];

export default function ReviewedPlaybooksView({ onBack, onTabChange }) {
  const { healthExperiment, startHealthExperiment } = useHealth();
  const [selected, setSelected] = useState(PLAYBOOKS[0]);
  const SelectedIcon = selected.Icon;

  const startPlaybook = (playbook) => {
    startHealthExperiment({
      id: playbook.id,
      title: playbook.title,
      description: playbook.promise,
      days: playbook.duration,
      reviewedBy: playbook.reviewedBy,
      reviewerRole: playbook.reviewerRole,
      safety: playbook.safety,
      source: 'reviewed-playbook',
    });
  };

  const activeId = healthExperiment?.id;

  return (
    <div className="screen-scroll h-full overflow-y-auto bg-[#f7f8f5] px-5 pb-8 pt-4">
      <header className="mb-5 flex items-center gap-3">
        <button type="button" onClick={onBack} aria-label="Kembali" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700">
          <ArrowLeft size={18} />
        </button>
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase text-teal-700">Ditinjau ahli</p>
          <h1 className="text-xl font-extrabold leading-tight text-slate-900">Program berbasis ahli</h1>
        </div>
      </header>

      <AppJourneyFlow activeStep="trust" onTabChange={onTabChange} compact />

      <section className="mb-5 rounded-2xl bg-slate-900 p-4 text-white">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-teal-300">
            <ShieldCheck size={19} />
          </span>
          <div>
            <p className="text-[10px] font-extrabold uppercase text-teal-300">Lapisan kepercayaan</p>
            <h2 className="mt-1 text-base font-extrabold">Metode yang terlihat legitimate</h2>
            <p className="mt-2 text-xs font-medium leading-relaxed text-slate-300">
              Setiap playbook diberi reviewer, tujuan, langkah harian, dan safety note. Ini wellness guidance, bukan diagnosis atau pengganti konsultasi.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-5">
        <h2 className="mb-3 text-[11px] font-extrabold uppercase text-slate-500">Pilih program</h2>
        <div className="space-y-2">
          {PLAYBOOKS.map((playbook) => {
            const Icon = playbook.Icon;
            const active = selected.id === playbook.id;
            const running = activeId === playbook.id;
            return (
              <button
                key={playbook.id}
                type="button"
                onClick={() => setSelected(playbook)}
                className={`w-full rounded-2xl border bg-white p-3.5 text-left transition-all active:scale-[0.99] ${active ? 'border-teal-700' : 'border-slate-200'}`}
              >
                <div className="flex gap-3">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${playbook.tone}`}>
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">{playbook.title}</span>
                      {running && <span className="rounded-md bg-teal-700 px-1.5 py-0.5 text-[8px] font-extrabold uppercase text-white">Aktif</span>}
                    </span>
                    <span className="mt-0.5 block text-[10px] font-bold text-teal-700">Ditinjau {playbook.reviewerRole}</span>
                    <span className="mt-1 block text-[11px] font-medium leading-relaxed text-slate-500">{playbook.bestFor}</span>
                  </span>
                  <ChevronRight size={16} className="mt-3 shrink-0 text-slate-300" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${selected.tone}`}>
            <SelectedIcon size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-extrabold uppercase text-teal-700">{selected.category}</p>
            <h2 className="mt-1 text-lg font-extrabold leading-tight text-slate-900">{selected.title}</h2>
            <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500">{selected.promise}</p>
          </div>
        </div>

        <div className="mt-4">
          <ReviewBadge method={selected} />
        </div>

        <div className="mt-4">
          <p className="mb-2 text-[10px] font-extrabold uppercase text-slate-500">Metode harian</p>
          <div className="space-y-2">
            {selected.steps.map((step, index) => (
              <div key={step} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-extrabold text-slate-600">{index + 1}</span>
                <p className="text-[11px] font-bold text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5">
          <p className="text-[10px] font-extrabold uppercase text-amber-700">Safety note</p>
          <p className="mt-1 text-[11px] font-medium leading-relaxed text-amber-900">{selected.safety}</p>
        </div>

        <button type="button" onClick={() => startPlaybook(selected)} className={`mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border-0 text-xs font-extrabold ${activeId === selected.id ? 'bg-teal-700 text-white' : 'bg-slate-900 text-white'}`}>
          {activeId === selected.id ? <><Check size={15} /> Program aktif</> : `Mulai ${selected.duration} hari`}
        </button>
      </section>
    </div>
  );
}
