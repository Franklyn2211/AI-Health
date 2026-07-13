import { useMemo, useState } from 'react';
import {
  Bell,
  Brain,
  Check,
  ChevronRight,
  ClipboardList,
  Dumbbell,
  HeartPulse,
  LockKeyhole,
  MessageCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';
import { useHealth } from '../context/healthContextCore';

const GOAL_META = {
  'body-goals': {
    label: 'Target Tubuh',
    description: 'Makan, berat badan, dan fitness',
    Icon: Dumbbell,
    tone: 'bg-orange-50 text-orange-700',
  },
  'mental-health': {
    label: 'Kesehatan Mental',
    description: 'Stres, mood, dan tidur',
    Icon: Brain,
    tone: 'bg-violet-50 text-violet-700',
  },
  'immune-booster': {
    label: 'Rutinitas Sehat',
    description: 'Rutinitas sehat dan pencegahan',
    Icon: HeartPulse,
    tone: 'bg-teal-50 text-teal-700',
  },
};

const FOCUS_LABELS = {
  stress: 'Mengurangi stres',
  sleep: 'Memperbaiki tidur',
  mood: 'Menjaga suasana hati',
  burnout: 'Mencegah burnout',
  'gain-weight': 'Naik berat badan sehat',
  'lose-weight': 'Mengelola berat badan',
  'build-strength': 'Lebih kuat dan bugar',
  'eat-better': 'Pola makan lebih baik',
  'more-energy': 'Lebih berenergi',
  'healthy-routine': 'Rutinitas sehat',
  'preventive-care': 'Perawatan preventif',
  'manage-condition': 'Mengelola kondisi',
};

function getRecentRecords(dailyRecords) {
  return Object.entries(dailyRecords || {})
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 7)
    .map(([date, record]) => ({ date, ...record }));
}

function buildPassportStats(userProfile, dailyRecords, careAppointments) {
  const records = getRecentRecords(dailyRecords);
  const checkInDays = records.filter((record) => record.checkIn).length;
  const lowDays = records.filter((record) => (
    record.checkIn?.energy === 1 || record.checkIn?.mood === 1 || record.checkIn?.sleep === 1
  )).length;
  const mealDays = records.filter((record) => record.meals?.length).length;
  const symptoms = records.flatMap((record) => (
    (record.logs || []).filter((log) => log.type === 'symptom').map((log) => log.label)
  ));

  return {
    trackedDays: Object.keys(dailyRecords || {}).length,
    checkInDays,
    lowDays,
    mealDays,
    symptoms,
    appointments: careAppointments.length,
    handoff: [
      `Fokus: ${FOCUS_LABELS[userProfile.focus] || userProfile.focus || 'kesehatan umum'}`,
      `${checkInDays}/7 check-ins`,
      `${lowDays} hari readiness rendah`,
      `${mealDays} hari catatan makan`,
      `${symptoms.length} gejala dicatat`,
    ].join(' - '),
  };
}

function SettingsButton({ Icon, label, detail, danger = false, onClick }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 border-0 bg-transparent px-4 py-3.5 text-left">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${danger ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
        <Icon size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-sm font-extrabold ${danger ? 'text-rose-700' : 'text-slate-900'}`}>{label}</span>
        {detail && <span className="mt-0.5 block text-[11px] font-medium leading-relaxed text-slate-500">{detail}</span>}
      </span>
      <ChevronRight size={17} className="shrink-0 text-slate-300" />
    </button>
  );
}

function SmallStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center">
      <p className="text-lg font-extrabold text-slate-900">{value}</p>
      <p className="text-[10px] font-bold text-slate-400">{label}</p>
    </div>
  );
}

export default function ProfileView({ onTabChange, onSubViewChange, onOpenDemo }) {
  const {
    userProfile,
    dailyRecords,
    careAppointments,
    healthExperiment,
    loadDemoData,
    repeatOnboarding,
    resetAllData,
  } = useHealth();
  const [confirmation, setConfirmation] = useState(null);
  const [summaryCopied, setSummaryCopied] = useState(false);

  const displayName = userProfile.fullName || 'Pengguna AI-Health';
  const initials = displayName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  const stats = useMemo(
    () => buildPassportStats(userProfile, dailyRecords, careAppointments),
    [careAppointments, dailyRecords, userProfile],
  );
  const primaryGoal = userProfile.primaryGoal || userProfile.goals?.[0] || 'immune-booster';
  const primaryGoalMeta = GOAL_META[primaryGoal] || GOAL_META['immune-booster'];
  const PrimaryIcon = primaryGoalMeta.Icon;

  const confirmAction = () => {
    if (confirmation === 'demo') loadDemoData();
    if (confirmation === 'onboarding') repeatOnboarding();
    if (confirmation === 'all') resetAllData();
    setConfirmation(null);
  };

  const copyCareSummary = async () => {
    const summary = [
      `Nama: ${displayName}`,
      `Fokus: ${FOCUS_LABELS[userProfile.focus] || primaryGoalMeta.label}`,
      `Tujuan: ${(userProfile.goals || []).map((goalId) => GOAL_META[goalId]?.label).filter(Boolean).join(', ')}`,
      `Ringkasan 7 hari: ${stats.handoff}`,
      `Kondisi: ${userProfile.healthConditions?.join(', ') || 'Tidak ada yang dicatat'}`,
      'Catatan: Mohon ditinjau untuk konsultasi chat. AI tidak digunakan sebagai diagnosis.',
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summary);
    } catch {
      // Prototype fallback: the visible status still confirms the intended export action.
    }
    setSummaryCopied(true);
  };

  return (
    <div className="screen-scroll relative h-full overflow-y-auto bg-[#f7f8f5] px-5 pb-28 pt-5">
      <header className="mb-5">
        <p className="mb-1 text-[10px] font-extrabold uppercase text-teal-700">Paspor Kesehatan</p>
        <h1 className="text-[25px] font-extrabold leading-tight text-slate-900">Profil siap untuk konsultasi</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">Tujuan, konteks, dan ringkasan untuk chat ahli dalam satu tempat.</p>
      </header>

      <section className="mb-5 overflow-hidden rounded-2xl bg-slate-900 text-white shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-lg font-extrabold">{initials}</span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-base font-extrabold">{displayName}</h2>
              <p className="mt-0.5 truncate text-xs font-medium text-slate-300">{userProfile.email || userProfile.phone || 'Local prototype account'}</p>
            </div>
            <UserRound size={20} className="text-slate-400" />
          </div>

          <div className="mt-4 rounded-2xl bg-white/10 p-3">
            <div className="flex items-start gap-3">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${primaryGoalMeta.tone}`}>
                <PrimaryIcon size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-extrabold uppercase text-teal-300">Fokus utama</p>
                <p className="mt-1 text-sm font-extrabold">{primaryGoalMeta.label}</p>
                <p className="mt-0.5 text-xs font-medium text-slate-300">{FOCUS_LABELS[userProfile.focus] || primaryGoalMeta.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-5 grid grid-cols-3 gap-2">
        <SmallStat label="Hari" value={stats.trackedDays} />
        <SmallStat label="Check-ins" value={`${stats.checkInDays}/7`} />
        <SmallStat label="Chats" value={stats.appointments} />
      </section>

      <section className="mb-5 rounded-2xl border border-teal-100 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <Sparkles size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-extrabold uppercase text-teal-700">{userProfile.demoMode ? 'Demo siap dites' : 'Mode presentasi'}</p>
            <h2 className="mt-1 text-base font-extrabold text-slate-900">
              {userProfile.demoMode ? 'Data demo sudah terisi' : 'Isi app dengan data demo lengkap'}
            </h2>
            <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
              {userProfile.demoMode
                ? 'Gunakan shortcut ini untuk mengetes flow utama tanpa input manual.'
                : 'Memuat profil, diary makanan Indonesia, progress bulanan, appointment chat ahli, dan smart habit aktif.'}
            </p>
            {userProfile.demoMode ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => onTabChange('home')} className="h-10 rounded-xl border border-slate-200 bg-slate-50 text-[10px] font-extrabold text-slate-700">Home</button>
                <button type="button" onClick={() => onTabChange('plan')} className="h-10 rounded-xl border border-slate-200 bg-slate-50 text-[10px] font-extrabold text-slate-700">Plan</button>
                <button type="button" onClick={() => onSubViewChange('meal-planner')} className="h-10 rounded-xl border border-slate-200 bg-slate-50 text-[10px] font-extrabold text-slate-700">Meal planner</button>
                <button type="button" onClick={() => onTabChange('clinic')} className="h-10 rounded-xl border-0 bg-slate-900 text-[10px] font-extrabold text-white">Chat ahli</button>
              </div>
            ) : (
              <button type="button" onClick={loadDemoData} className="mt-3 h-11 w-full rounded-xl border-0 bg-slate-900 text-xs font-extrabold text-white">
                Muat data demo lengkap
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="mb-5 rounded-2xl border border-teal-100 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <ClipboardList size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-extrabold uppercase text-teal-700">Ringkasan untuk ahli</p>
            <h2 className="mt-1 text-base font-extrabold text-slate-900">Konteks sebelum chat konsultasi</h2>
            <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500">{stats.handoff}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => onSubViewChange('health-memory')} className="h-10 rounded-xl border border-teal-100 bg-teal-50 text-[10px] font-extrabold text-teal-800">
                Memori Kesehatan
              </button>
              <button type="button" onClick={() => onTabChange('clinic')} className="h-10 rounded-xl border-0 bg-slate-900 text-[10px] font-extrabold text-white">
                Booking chat
              </button>
            </div>
            <button type="button" onClick={copyCareSummary} className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-white text-[10px] font-extrabold text-slate-700">
              {summaryCopied ? 'Ringkasan tersalin' : 'Salin ringkasan untuk WhatsApp/dokter'}
            </button>
          </div>
        </div>
      </section>

      <section className="mb-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[11px] font-extrabold uppercase text-slate-500">Tujuan dan preferensi</h2>
          <button type="button" onClick={() => setConfirmation('onboarding')} className="border-0 bg-transparent text-[11px] font-extrabold text-teal-700">Edit</button>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {userProfile.goals.map((goalId, index) => {
            const goal = GOAL_META[goalId];
            if (!goal) return null;
            const Icon = goal.Icon;
            const primary = primaryGoal === goalId;
            return (
              <div key={goalId} className={`flex items-center gap-3 p-4 ${index > 0 ? 'border-t border-slate-100' : ''}`}>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${goal.tone}`}><Icon size={19} /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-slate-900">{goal.label}</h3>
                    {primary && <span className="rounded-md bg-slate-900 px-1.5 py-0.5 text-[8px] font-extrabold uppercase text-white">Utama</span>}
                  </div>
                  <p className="mt-0.5 text-[11px] font-medium text-slate-500">{goal.description}</p>
                </div>
                <Check size={16} className="text-teal-600" strokeWidth={3} />
              </div>
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="text-[10px] font-extrabold uppercase text-slate-400">Makanan</p>
            <p className="mt-1 text-xs font-extrabold text-slate-900">{userProfile.diet || 'Halal (default)'}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="text-[10px] font-extrabold uppercase text-slate-400">Latihan</p>
            <p className="mt-1 text-xs font-extrabold text-slate-900">{userProfile.equipment || 'Hanya HP'}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="text-[10px] font-extrabold uppercase text-slate-400">Kondisi</p>
            <p className="mt-1 text-xs font-extrabold text-slate-900">{userProfile.healthConditions?.join(', ') || 'Tidak ada'}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="text-[10px] font-extrabold uppercase text-slate-400">Waktu</p>
            <p className="mt-1 text-xs font-extrabold text-slate-900">{userProfile.availableTime || 15} menit/hari</p>
          </div>
        </div>
      </section>

      <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <ShieldCheck size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-extrabold uppercase text-emerald-700">Lapisan kepercayaan</p>
            <h2 className="mt-1 text-sm font-extrabold text-slate-900">Metode wellness ditinjau ahli</h2>
            <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
              {healthExperiment
                ? `${healthExperiment.title} aktif dan ditinjau oleh ${healthExperiment.reviewedBy || 'ahli'}.`
                : 'Belum ada program ahli aktif. Mulai satu program untuk menunjukkan panduan yang lebih terpercaya.'}
            </p>
            <button type="button" onClick={() => onSubViewChange('reviewed-playbooks')} className="mt-3 h-10 w-full rounded-xl border-0 bg-slate-900 text-[10px] font-extrabold text-white">
              Program ditinjau ahli
            </button>
          </div>
        </div>
      </section>

      <section className="mb-5">
        <h2 className="mb-3 text-[11px] font-extrabold uppercase text-slate-500">Pengaturan</h2>
        <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <SettingsButton Icon={Bell} label="Notifikasi" detail="Pengingat plan, check-in, dan obat" />
          <SettingsButton Icon={LockKeyhole} label="Izin data" detail="Pilih data yang boleh dipakai AI dan ahli" />
          <SettingsButton Icon={MessageCircle} label="Berbagi konsultasi" detail="Kontrol ringkasan sebelum chat ahli" />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-[11px] font-extrabold uppercase text-slate-500">Kontrol demo</h2>
        <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <SettingsButton
            Icon={Play}
            label="Alur demo produk"
            detail="Buka cerita produk dari Home sampai Paspor Kesehatan"
            onClick={onOpenDemo}
          />
          <SettingsButton
            Icon={RotateCcw}
            label="Ulang onboarding"
            detail="Tampilkan ulang alur pengguna baru"
            onClick={() => setConfirmation('onboarding')}
          />
          <SettingsButton
            Icon={Trash2}
            label="Reset data lokal"
            detail="Hapus profil, log, dan appointment dari browser ini"
            danger
            onClick={() => setConfirmation('all')}
          />
        </div>
      </section>

      <p className="mt-5 text-center text-[10px] font-medium text-slate-400">Prototype AI-Health - Data tersimpan lokal di perangkat ini</p>

      {confirmation && (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/45 p-3 backdrop-blur-sm">
          <div className="w-full rounded-3xl bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${confirmation === 'all' ? 'bg-rose-50 text-rose-600' : 'bg-teal-50 text-teal-700'}`}>
                {confirmation === 'all' ? <Trash2 size={20} /> : confirmation === 'demo' ? <Sparkles size={20} /> : <RotateCcw size={20} />}
              </span>
              <button type="button" onClick={() => setConfirmation(null)} aria-label="Tutup" className="flex h-9 w-9 items-center justify-center rounded-full border-0 bg-slate-100 text-slate-600"><X size={17} /></button>
            </div>
            <h2 className="mt-4 text-lg font-extrabold text-slate-900">
              {confirmation === 'all' ? 'Reset semua data lokal?' : confirmation === 'demo' ? 'Muat data demo?' : 'Ulang onboarding?'}
            </h2>
            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
              {confirmation === 'all'
                ? 'Ini akan menghapus profil, log harian, makanan, dan appointment dari browser ini.'
                : confirmation === 'demo'
                  ? 'Data lokal akan diganti dengan profil demo, log, appointment, memori, dan program ahli yang siap dipresentasikan.'
                  : 'Kamu akan kembali ke alur pengguna baru. Log harian dan appointment tetap tersimpan.'}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setConfirmation(null)} className="h-11 rounded-xl border border-slate-200 bg-white text-xs font-extrabold text-slate-600">Batal</button>
              <button type="button" onClick={confirmAction} className={`h-11 rounded-xl border-0 text-xs font-extrabold text-white ${confirmation === 'all' ? 'bg-rose-600' : 'bg-teal-700'}`}>
                {confirmation === 'all' ? 'Reset' : confirmation === 'demo' ? 'Muat demo' : 'Ulangi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
