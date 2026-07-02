import { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { getBPJSDataByNIK } from '../lib/bpjsData';
import { CheckCircle2, Flame, Dumbbell, Moon, Apple, Droplets, Brain } from 'lucide-react';

const GOAL_OPTIONS = [
  { id: 'lose-weight',         label: 'Turunkan Berat Badan', sub: 'Defisit kalori & cardio terstruktur', Icon: Flame },
  { id: 'build-muscle',        label: 'Gain Muscle',           sub: 'Latihan kekuatan & protein tinggi',   Icon: Dumbbell },
  { id: 'sleep-quality',       label: 'Better Sleep',          sub: 'Optimasi pola & kualitas tidur',      Icon: Moon },
  { id: 'nutrition',           label: 'Healthy Eating',        sub: 'Nutrisi seimbang setiap hari',        Icon: Apple },
  { id: 'diabetes-management', label: 'Diabetes Control',      sub: 'Monitor gula darah & diet IG rendah', Icon: Droplets },
  { id: 'reduce-stress',       label: 'Reduce Stress',         sub: 'Meditasi, mindfulness & relaksasi',   Icon: Brain },
];

export default function ProfileView({ onTabChange }) {
  const { userProfile, updateProfile, updateGoals, AVAILABLE_GOALS } = useHealth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    nik: userProfile.nik,
    goals: userProfile.goals,
  });

  const bpjsData = getBPJSDataByNIK(userProfile.nik);

  const handleGoalToggle = (goalId) => {
    setEditData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(id => id !== goalId)
        : [...prev.goals, goalId],
    }));
  };

  const handleSave = () => {
    updateGoals(editData.goals);
    setIsEditing(false);
  };

  const getGoalLabel = (goalId) => {
    const goal = AVAILABLE_GOALS.find(g => g.id === goalId);
    return goal ? goal.label : goalId;
  };

  return (
    <div className="screen-scroll h-full overflow-y-auto px-5 pt-5 pb-24">
      <header className="flex justify-between items-center gap-4 mb-6">
        <div>
          <p className="m-0 mb-1 uppercase text-[11px] leading-tight text-[#61716c] font-[850]">
            Akun Saya
          </p>
          <h1 className="text-2xl leading-tight font-[800]">Profil</h1>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-xl font-[800] text-[12px] border-0 transition-all ${
            isEditing
              ? 'bg-red-500 text-white'
              : 'bg-[#1f6e64] text-white'
          }`}
        >
          {isEditing ? '✕ Batal' : '✎ Edit'}
        </button>
      </header>

      {!isEditing ? (
        <div className="space-y-5">
          {/* BPJS Card */}
          {bpjsData && (
            <div className="mb-6 relative overflow-hidden rounded-2xl shadow-lg border border-teal-600" style={{ background: 'linear-gradient(135deg, #1f6e64 0%, #154c45 100%)' }}>
              {/* Card Header */}
              <div className="px-5 py-4 border-b border-white/20 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <span className="text-teal-700 font-[900] text-[14px]">BPJS</span>
                  </div>
                  <p className="text-white font-[800] tracking-wide text-[14px]">Kesehatan</p>
                </div>
                <span className="text-[10px] font-[800] text-emerald-800 bg-emerald-300 px-2.5 py-1 rounded-full uppercase tracking-wider">Aktif</span>
              </div>
              
              {/* Card Body */}
              <div className="px-5 py-5 text-white">
                <p className="text-[10px] text-teal-200 uppercase tracking-widest mb-0.5">Nama Lengkap</p>
                <p className="text-[18px] font-[800] mb-4">{bpjsData.fullName}</p>
                
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-4">
                  <div>
                    <p className="text-[10px] text-teal-200 uppercase tracking-widest mb-0.5">NIK</p>
                    <p className="text-[13px] font-[700] font-mono tracking-wider">{bpjsData.nik}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-teal-200 uppercase tracking-widest mb-0.5">No. Kartu</p>
                    <p className="text-[13px] font-[700] font-mono tracking-wider">{bpjsData.bpjsNumber}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-teal-200 uppercase tracking-widest mb-0.5">Tgl Lahir</p>
                    <p className="text-[13px] font-[700]">{new Date(bpjsData.birthDate).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-teal-200 uppercase tracking-widest mb-0.5">Gol. Darah</p>
                    <p className="text-[13px] font-[700]">{bpjsData.bloodType}</p>
                  </div>
                </div>

                <p className="text-[10px] text-teal-200 uppercase tracking-widest mb-0.5">Alamat</p>
                <p className="text-[12px] font-[600] leading-snug opacity-90">{bpjsData.address}</p>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3 bg-black/20 flex justify-between items-center text-white">
                <div>
                  <p className="text-[9px] text-teal-200 uppercase tracking-widest">Faskes Tk. 1 / Kelas</p>
                  <p className="text-[12px] font-[700]">{bpjsData.bpjsClass}</p>
                </div>
                {bpjsData.medicalHistory && bpjsData.medicalHistory.length > 0 && (
                  <div className="flex gap-1">
                    {bpjsData.medicalHistory.map((h, i) => (
                      <span key={i} className="text-[9px] font-[800] px-2 py-0.5 rounded-full bg-red-500/20 text-red-200 border border-red-500/30">
                        {h}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Goals Section */}
          <div className="p-5 rounded-2xl bg-white shadow-md shadow-black/5 border border-[#e6f2ec]">
            <h3 className="text-[13px] font-[850] text-[#253532] uppercase mb-3">Target Kesehatan Aktif</h3>
            <div className="flex flex-wrap gap-2">
              {userProfile.goals.length > 0 ? (
                userProfile.goals.map(goalId => {
                  const gLabel = AVAILABLE_GOALS.find(g => g.id === goalId)?.label || goalId;
                  return (
                    <span
                      key={goalId}
                      className="px-3 py-2 rounded-full bg-[#f0f9f7] border border-[#1f6e64] text-[12px] font-[800] text-[#1f6e64]"
                    >
                      {gLabel.replace('undefined ', '')}
                    </span>
                  );
                })
              ) : (
                <p className="text-[13px] text-[#5f6f69]">Belum ada target dipilih</p>
              )}
            </div>
          </div>

          {/* Settings Links */}
          <div className="space-y-2">
            <button className="w-full p-4 rounded-2xl bg-white shadow-sm shadow-black/5 border border-[#e6f2ec] text-left flex justify-between items-center hover:bg-[#f8faf7] transition-all active:scale-95">
              <span className="text-[13px] font-[800] text-[#253532]">🔔 Notifikasi</span>
              <span className="text-[#1f6e64]">→</span>
            </button>
            <button className="w-full p-4 rounded-2xl bg-white shadow-sm shadow-black/5 border border-[#e6f2ec] text-left flex justify-between items-center hover:bg-[#f8faf7] transition-all active:scale-95">
              <span className="text-[13px] font-[800] text-[#253532]">🔒 Privasi & Keamanan</span>
              <span className="text-[#1f6e64]">→</span>
            </button>
            <button className="w-full p-4 rounded-2xl bg-white shadow-sm shadow-black/5 border border-[#e6f2ec] text-left flex justify-between items-center hover:bg-[#f8faf7] transition-all active:scale-95">
              <span className="text-[13px] font-[800] text-[#253532]">❓ Bantuan & Support</span>
              <span className="text-[#1f6e64]">→</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Edit Goals */}
          <div className="p-5 rounded-2xl bg-white shadow-md shadow-black/5 border border-[#e6f2ec]">
            <h3 className="text-[13px] font-[850] text-[#253532] uppercase mb-4">Target Kesehatan</h3>

            <div className="space-y-2">
              {GOAL_OPTIONS.map(({ id, label, sub, Icon }) => {
                const active = editData.goals.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => handleGoalToggle(id)}
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

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full min-h-[48px] rounded-xl bg-[#1f6e64] text-white font-[800] border-0 transition-all active:scale-95"
          >
            Simpan Perubahan
          </button>
        </div>
      )}
    </div>
  );
}
