import { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { getBPJSDataByNIK, getAllValidNIKs } from '../lib/bpjsData';
import {
  ShieldCheck, ChevronRight, ArrowLeft, CheckCircle2,
  Flame, Dumbbell, Moon, Apple, Droplets, Brain,
  Activity, AlertCircle, Info,
} from 'lucide-react';

/* ── Step definitions ─────────────────────────────────────────── */
const GOAL_OPTIONS = [
  { id: 'lose-weight',         label: 'Turunkan Berat Badan', sub: 'Defisit kalori & cardio terstruktur', Icon: Flame },
  { id: 'build-muscle',        label: 'Gain Muscle',           sub: 'Latihan kekuatan & protein tinggi',   Icon: Dumbbell },
  { id: 'sleep-quality',       label: 'Better Sleep',          sub: 'Optimasi pola & kualitas tidur',      Icon: Moon },
  { id: 'nutrition',           label: 'Healthy Eating',        sub: 'Nutrisi seimbang setiap hari',        Icon: Apple },
  { id: 'diabetes-management', label: 'Diabetes Control',      sub: 'Monitor gula darah & diet IG rendah', Icon: Droplets },
  { id: 'reduce-stress',       label: 'Reduce Stress',         sub: 'Meditasi, mindfulness & relaksasi',   Icon: Brain },
];

const CONDITION_OPTIONS = [
  { id: 'diabetes',     label: 'Diabetes' },
  { id: 'hypertension', label: 'Hipertensi' },
  { id: 'cholesterol',  label: 'Kolesterol Tinggi' },
  { id: 'gerd',         label: 'GERD' },
  { id: 'pregnancy',    label: 'Kehamilan' },
  { id: 'none',         label: 'Tidak Ada' },
];

const ALLERGY_OPTIONS = [
  { id: 'peanut',   label: 'Kacang Tanah' },
  { id: 'seafood',  label: 'Seafood' },
  { id: 'milk',     label: 'Susu' },
  { id: 'egg',      label: 'Telur' },
  { id: 'soy',      label: 'Kedelai' },
  { id: 'gluten',   label: 'Gluten' },
  { id: 'none',     label: 'Tidak Ada' },
];

/* ── Total steps (wizard steps 1–3 after NIK) ──────────────────── */
const TOTAL_STEPS = 4; // NIK=1, Goals=2, Conditions=3, Allergies=4

/* ── Shared UI atoms ─────────────────────────────────────────── */
function ProgressBar({ step }) {
  return (
    <div className="flex items-center gap-2 mb-7">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div key={i} className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${
          i < step ? 'bg-teal-600' : i === step - 1 ? 'bg-teal-400' : 'bg-slate-200'
        }`} />
      ))}
    </div>
  );
}

function StepLabel({ step, label }) {
  return (
    <p className="text-[10px] font-[850] text-teal-600 uppercase tracking-widest mb-1">
      Langkah {step} dari {TOTAL_STEPS} — {label}
    </p>
  );
}

function PrimaryBtn({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full h-12 rounded-2xl bg-teal-600 text-white text-[14px] font-[800] border-0 shadow-sm shadow-teal-600/20 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {children}
    </button>
  );
}

function GhostBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="h-12 px-5 rounded-2xl border border-slate-200 bg-white text-[13px] font-[800] text-slate-600 transition-all active:scale-[0.98] flex items-center gap-1.5"
    >
      <ArrowLeft size={15} />
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function OnboardingForm({ onComplete }) {
  const { completeOnboarding } = useHealth();

  /* ── Preserved NIK logic (UNTOUCHED) ── */
  const validNIKs = getAllValidNIKs();
  const [formData, setFormData] = useState({ nik: '' });
  const [nikError, setNikError] = useState('');
  const [bpjsData, setBpjsData] = useState(null);

  const handleNIKChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, nik: value }));
    if (value.length === 16) {
      const data = getBPJSDataByNIK(value);
      if (data) { setBpjsData(data); setNikError(''); }
      else { setBpjsData(null); setNikError(`NIK tidak ditemukan. Coba: ${validNIKs[0]}`); }
    } else {
      setBpjsData(null); setNikError('');
    }
  };
  /* ── End preserved NIK logic ── */

  /* ── Wizard state ── */
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals]       = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedAllergies, setSelectedAllergies]   = useState([]);

  /* ── Goal toggle ── */
  const toggleGoal = (id) =>
    setSelectedGoals(p => p.includes(id) ? p.filter(g => g !== id) : [...p, id]);

  /* ── Exclusive-None toggle ── */
  const makeExclusiveToggle = (setter) => (id) => () => {
    if (id === 'none') { setter(['none']); return; }
    setter(p => {
      const without = p.filter(x => x !== 'none');
      return without.includes(id) ? without.filter(x => x !== id) : [...without, id];
    });
  };

  /* ── Final submit ── */
  const handleSubmit = () => {
    if (!bpjsData || selectedGoals.length === 0) return;
    const goalsForContext = selectedGoals.map(id => {
      const mapping = {
        'lose-weight':         'lose-weight',
        'build-muscle':        'build-muscle',
        'sleep-quality':       'sleep-quality',
        'nutrition':           'nutrition',
        'diabetes-management': 'diabetes-management',
        'reduce-stress':       'reduce-stress',
      };
      return mapping[id] || id;
    });
    completeOnboarding(
      bpjsData.fullName,
      formData.nik,
      goalsForContext,
      { healthConditions: selectedConditions, allergies: selectedAllergies }
    );
    onComplete();
  };

  /* ══════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════ */
  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="flex-1 overflow-y-auto px-5 pt-8 pb-6">
        <ProgressBar step={step} />

        {/* ─── STEP 1: NIK Verification ─────────────────────────── */}
        {step === 1 && (
          <div className="flex flex-col h-full">
            <StepLabel step={1} label="Verifikasi Identitas" />
            <h1 className="text-[24px] font-[900] text-slate-900 leading-tight mb-1">
              Verifikasi NIK BPJS
            </h1>
            <p className="text-[13px] text-slate-500 mb-6 leading-relaxed">
              Masukkan Nomor Induk Kependudukan 16 digit untuk mengakses data kesehatan Anda secara aman.
            </p>

            {/* NIK Input */}
            <div className="mb-4">
              <label className="block text-[11px] font-[850] text-slate-600 uppercase tracking-wider mb-2">
                NIK (16 Digit)
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.nik}
                  onChange={handleNIKChange}
                  placeholder="Contoh: 3201051234567890"
                  maxLength="16"
                  className={`w-full px-4 py-3.5 rounded-2xl border bg-white text-[14px] text-slate-900 font-mono tracking-wider transition-all outline-none focus:ring-2 focus:ring-teal-500/40 ${
                    nikError
                      ? 'border-red-400 focus:border-red-400'
                      : bpjsData
                      ? 'border-teal-500 focus:border-teal-500'
                      : 'border-slate-200 focus:border-teal-500'
                  }`}
                />
                {bpjsData && (
                  <CheckCircle2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-500" />
                )}
                {nikError && (
                  <AlertCircle size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400" />
                )}
              </div>
              {nikError && (
                <p className="text-red-500 text-[12px] mt-1.5 flex items-center gap-1.5">
                  <AlertCircle size={12} /> {nikError}
                </p>
              )}
              <p className="text-slate-400 text-[11px] mt-1.5">{formData.nik.length}/16 digit</p>
            </div>

            {/* BPJS Preview Card — PRESERVED LOGIC, upgraded UI */}
            {bpjsData && (
              <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck size={16} className="text-teal-600 shrink-0" />
                  <p className="text-[12px] font-[850] text-teal-700 uppercase tracking-wider">Data BPJS Ditemukan</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Nama Lengkap',  val: bpjsData.fullName },
                    { label: 'No. BPJS',      val: bpjsData.bpjsNumber },
                    { label: 'Kelas',         val: bpjsData.bpjsClass },
                    { label: 'Status',        val: bpjsData.bpjsStatus, highlight: true },
                  ].map(({ label, val, highlight }) => (
                    <div key={label} className="flex flex-col">
                      <span className="text-[10px] text-slate-500 mb-0.5">{label}</span>
                      <span className={`text-[12px] font-[800] ${highlight ? 'text-teal-600' : 'text-slate-800'}`}>
                        {highlight ? `Aktif` : val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Valid NIKs hint panel */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3.5 mb-6">
              <div className="flex items-start gap-2 mb-2">
                <Info size={13} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[11px] font-[800] text-blue-700">NIK Valid untuk Demo:</p>
              </div>
              <div className="space-y-1 pl-5">
                {validNIKs.map(nik => (
                  <button
                    key={nik}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, nik }));
                      const data = getBPJSDataByNIK(nik);
                      setBpjsData(data);
                      setNikError('');
                    }}
                    className="block text-[11px] text-blue-600 font-mono hover:text-blue-800 hover:underline text-left transition-colors"
                  >
                    {nik}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 2: Health Goals ─────────────────────────────── */}
        {step === 2 && (
          <div>
            <StepLabel step={2} label="Target Kesehatan" />
            <h1 className="text-[22px] font-[900] text-slate-900 leading-tight mb-1">
              Apa tujuan kesehatan utama Anda?
            </h1>
            <p className="text-[13px] text-slate-500 mb-5 leading-relaxed">
              Pilih satu atau lebih tujuan untuk mempersonalisasi pengalaman Anda.
            </p>

            <div className="space-y-2.5 mb-6">
              {GOAL_OPTIONS.map(({ id, label, sub, Icon }) => {
                const active = selectedGoals.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => toggleGoal(id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all active:scale-[0.98] ${
                      active
                        ? 'border-teal-500 bg-teal-50 shadow-sm shadow-teal-500/10'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      active ? 'bg-teal-600' : 'bg-slate-100'
                    }`}>
                      <Icon size={18} className={active ? 'text-white' : 'text-slate-500'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[14px] font-[800] ${active ? 'text-teal-700' : 'text-slate-800'}`}>{label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{sub}</p>
                    </div>
                    <CheckCircle2
                      size={20}
                      className={`shrink-0 transition-all ${active ? 'text-teal-600' : 'text-slate-200'}`}
                      fill={active ? '#e6faf7' : 'none'}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── STEP 3: Health Conditions ────────────────────────── */}
        {step === 3 && (
          <div>
            <StepLabel step={3} label="Kondisi Kesehatan" />
            <h1 className="text-[22px] font-[900] text-slate-900 leading-tight mb-1">
              Apakah Anda memiliki kondisi kesehatan tertentu?
            </h1>
            <p className="text-[13px] text-slate-500 mb-5 leading-relaxed">
              Ini membantu AI menghasilkan rekomendasi yang lebih aman dan tepat untuk Anda.
            </p>

            <div className="flex flex-wrap gap-2.5 mb-6">
              {CONDITION_OPTIONS.map(({ id, label }) => {
                const active = selectedConditions.includes(id);
                return (
                  <button
                    key={id}
                    onClick={makeExclusiveToggle(setSelectedConditions)(id)}
                    className={`px-4 py-2.5 rounded-2xl border text-[13px] font-[800] transition-all active:scale-[0.97] ${
                      active
                        ? id === 'none'
                          ? 'border-slate-500 bg-slate-700 text-white'
                          : 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {selectedConditions.length > 0 && !selectedConditions.includes('none') && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3.5 mb-4">
                <div className="flex items-start gap-2">
                  <Activity size={14} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[12px] text-amber-700 leading-relaxed">
                    AI akan menyesuaikan rekomendasi berdasarkan kondisi Anda. Selalu konsultasikan perubahan besar dengan dokter.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── STEP 4: Allergies ───────────────────────────────── */}
        {step === 4 && (
          <div>
            <StepLabel step={4} label="Alergi Makanan" />
            <h1 className="text-[22px] font-[900] text-slate-900 leading-tight mb-1">
              Apakah Anda memiliki alergi makanan?
            </h1>
            <p className="text-[13px] text-slate-500 mb-5 leading-relaxed">
              Ini membantu kami mempersonalisasi rekomendasi menu makanan Anda.
            </p>

            <div className="flex flex-wrap gap-2.5 mb-6">
              {ALLERGY_OPTIONS.map(({ id, label }) => {
                const active = selectedAllergies.includes(id);
                return (
                  <button
                    key={id}
                    onClick={makeExclusiveToggle(setSelectedAllergies)(id)}
                    className={`px-4 py-2.5 rounded-2xl border text-[13px] font-[800] transition-all active:scale-[0.97] ${
                      active
                        ? id === 'none'
                          ? 'border-slate-500 bg-slate-700 text-white'
                          : 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Summary preview */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-[11px] font-[850] text-slate-500 uppercase tracking-wider mb-3">Ringkasan Profil Anda</p>
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[12px] text-slate-500 shrink-0">Tujuan</span>
                  <span className="text-[12px] font-[700] text-slate-800 text-right">
                    {selectedGoals.map(id => GOAL_OPTIONS.find(g => g.id === id)?.label).join(', ') || '—'}
                  </span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[12px] text-slate-500 shrink-0">Kondisi</span>
                  <span className="text-[12px] font-[700] text-slate-800 text-right">
                    {selectedConditions.length === 0 ? '—' : selectedConditions.map(id => CONDITION_OPTIONS.find(c => c.id === id)?.label).join(', ')}
                  </span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[12px] text-slate-500 shrink-0">Alergi</span>
                  <span className="text-[12px] font-[700] text-slate-800 text-right">
                    {selectedAllergies.length === 0 ? '—' : selectedAllergies.map(id => ALLERGY_OPTIONS.find(a => a.id === id)?.label).join(', ')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Sticky Footer: Navigation Buttons ────────────────── */}
      <div className="shrink-0 px-5 pb-8 pt-3 border-t border-slate-100 bg-slate-50">
        {step === 1 && (
          <PrimaryBtn onClick={() => setStep(2)} disabled={!bpjsData}>
            Lanjutkan <ChevronRight size={16} />
          </PrimaryBtn>
        )}

        {step === 2 && (
          <div className="flex gap-2">
            <GhostBtn onClick={() => setStep(1)}>Kembali</GhostBtn>
            <div className="flex-1">
              <PrimaryBtn onClick={() => setStep(3)} disabled={selectedGoals.length === 0}>
                Lanjutkan <ChevronRight size={16} />
              </PrimaryBtn>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex gap-2">
            <GhostBtn onClick={() => setStep(2)}>Kembali</GhostBtn>
            <div className="flex-1">
              <PrimaryBtn onClick={() => setStep(4)} disabled={selectedConditions.length === 0}>
                Lanjutkan <ChevronRight size={16} />
              </PrimaryBtn>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex gap-2">
            <GhostBtn onClick={() => setStep(3)}>Kembali</GhostBtn>
            <div className="flex-1">
              <PrimaryBtn onClick={handleSubmit} disabled={selectedAllergies.length === 0}>
                Mulai Perjalanan <ChevronRight size={16} />
              </PrimaryBtn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
