import { useState } from 'react';
import { TrendingUp, Droplets, Moon, Dumbbell, Smile, Utensils, Scale, Footprints, Target, Brain, Shield, HeartPulse, ScanBarcode, ArrowRight, Zap } from 'lucide-react';
import { useHealth } from '../context/HealthContext';

export default function HomeView({ onTabChange, onSubViewChange }) {
  const { userProfile, isFeatureActive, getGoalLabel } = useHealth();
  const [weeklyProgress] = useState(72);

  const mockMetrics = [
    { id: 'weight', icon: Scale, label: 'Berat Badan', value: '72.3 kg', target: 'Target: 68 kg', color: '#1f6e64', active: isFeatureActive('weight-tracking') },
    { id: 'meals', icon: Utensils, label: 'Kalori', value: '1,280 kcal', target: 'Target: 1,800 kcal', color: '#e39b45', active: isFeatureActive('meal-planner') },
    { id: 'workout', icon: Dumbbell, label: 'Workout', value: 'Upper Body', target: '45 menit', color: '#6366f1', active: isFeatureActive('fitness-routine') },
    { id: 'water', icon: Droplets, label: 'Air', value: '1.4L', target: 'Target: 2.2L', color: '#0ea5e9', active: true },
    { id: 'sleep', icon: Moon, label: 'Tidur', value: '7.2 jam', target: 'Kualitas: 82%', color: '#8b5cf6', active: isFeatureActive('sleep-tracker') },
    { id: 'mood', icon: Smile, label: 'Mood', value: 'Baik 😊', target: 'Stres: Rendah', color: '#f59e0b', active: isFeatureActive('mood-tracker') },
    { id: 'steps', icon: Footprints, label: 'Langkah', value: '6,284', target: 'Target: 8,000', color: '#10b981', active: true },
  ].filter(m => m.active);

  const goalsText = userProfile.goals.length > 0
    ? userProfile.goals.map(g => getGoalLabel(g)).join(', ')
    : 'Tentukan target Anda';

  return (
    <div className="screen-scroll h-full overflow-y-auto px-5 pt-5 pb-24">
      <header className="flex justify-between items-center gap-4 mb-5">
        <div>
          <p className="m-0 mb-1 uppercase text-[11px] leading-tight text-[#61716c] font-[850]">
            TARA AI
          </p>
          <h1 className="text-xl leading-tight font-[800]">Pagi, {userProfile.fullName ? userProfile.fullName.split(' ')[0] : 'Anda'} 👋</h1>
        </div>
        <button
          onClick={() => onTabChange('profile')}
          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#1f6e64] text-white font-[850] border-0 text-sm shadow-lg shadow-[#1f6e64]/30 transition-all active:scale-95"
        >
          {userProfile.fullName ? userProfile.fullName.substring(0, 2).toUpperCase() : 'TA'}
        </button>
      </header>

      {/* AI Briefing */}
      <div className="bg-[#e6f2ec] border border-[#1f6e64]/20 rounded-2xl p-4 mb-5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[#1f6e64] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <Zap size={16} />
        </div>
        <div>
          <p className="text-[12px] font-[800] text-[#1f6e64] mb-0.5">Wawasan Hari Ini</p>
          <p className="text-[13px] text-[#253532] leading-snug">
            {userProfile.goals.includes('diabetes-management')
              ? 'Gula darah Anda stabil minggu ini. Mari pertahankan dengan sarapan rendah IG.'
              : userProfile.goals.includes('pregnancy')
              ? 'Memasuki minggu ke-12, pastikan asupan Asam Folat harian terpenuhi hari ini.'
              : 'Anda tidur kurang dari 7 jam semalam. Rekomendasi: Lakukan peregangan ringan sebelum sarapan.'}
          </p>
        </div>
      </div>

      {/* Up Next / Urgent Actions */}
      <section className="mb-6">
        <h2 className="text-[13px] font-[850] text-[#253532] uppercase mb-3">Tugas Prioritas</h2>
        <button
          onClick={() => onSubViewChange('food-scanner')}
          className="w-full flex items-center justify-between p-4 rounded-3xl bg-white shadow-sm border border-[#e6f2ec] transition-all active:scale-[0.98] hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#fff5e6] text-[#cc8800] flex items-center justify-center shrink-0">
              <ScanBarcode size={24} />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-[850] text-[#cc8800] uppercase">Tindakan</p>
              <p className="text-[14px] font-[800] text-[#253532]">Scan Makanan Anda</p>
              <p className="text-[12px] text-[#61716c]">Catat asupan nutrisi siang ini</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#f8faf7] flex items-center justify-center text-[#61716c]">
            <ArrowRight size={18} />
          </div>
        </button>
      </section>

      {/* Focus Card */}
      <section className="rounded-3xl p-5 text-white shadow-lg shadow-[#1f6e64]/20 mb-5" style={{ background: 'linear-gradient(135deg, #1f6e64 0%, #2c7a70 100%)' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Target size={16} className="text-white" />
          </div>
          <div>
            <p className="text-[11px] font-[850] text-white/70 uppercase tracking-wider">Fokus Anda</p>
            <p className="text-[12px] font-[700] text-white/90">{goalsText}</p>
          </div>
        </div>
        <p className="text-[14px] font-[700] leading-snug">Tingkatkan kesehatan Anda dengan rencana personal AI kami! 🚀</p>
      </section>

      {/* Quick Actions */}
      <section className="mb-5">
        <h2 className="text-[13px] font-[850] text-[#253532] uppercase mb-3">Menu Cepat</h2>
        <div className="grid grid-cols-2 gap-2">
          {isFeatureActive('meal-planner') && (
            <button
              onClick={() => onSubViewChange('meal-planner')}
              className="p-4 rounded-2xl bg-[#fff5e6] border border-[#ffe6b3] flex flex-col items-start gap-2 transition-all active:scale-[0.98] hover:shadow-sm">
              <Utensils size={24} className="text-[#cc8800]" />
              <p className="text-[12px] font-[800] text-[#cc8800]">Meal Plan</p>
            </button>
          )}
          {isFeatureActive('fitness-routine') && (
            <button
              onClick={() => onSubViewChange('fitness-routine')}
              className="p-4 rounded-2xl bg-[#e0e7ff] border border-[#c7d2fe] flex flex-col items-start gap-2 transition-all active:scale-[0.98] hover:shadow-sm">
              <Dumbbell size={24} className="text-[#4f46e5]" />
              <p className="text-[12px] font-[800] text-[#4f46e5]">Workout</p>
            </button>
          )}
          {isFeatureActive('sleep-tracker') && (
            <button
              onClick={() => onSubViewChange('sleep-tracker')}
              className="p-4 rounded-2xl bg-[#f3e8ff] border border-[#e9d5ff] flex flex-col items-start gap-2 transition-all active:scale-[0.98] hover:shadow-sm">
              <Moon size={24} className="text-[#7c3aed]" />
              <p className="text-[12px] font-[800] text-[#7c3aed]">Sleep Track</p>
            </button>
          )}
          {isFeatureActive('meditation') && (
            <button
              onClick={() => onSubViewChange('mood-tracker')}
              className="p-4 rounded-2xl bg-[#e0f2fe] border border-[#bae6fd] flex flex-col items-start gap-2 transition-all active:scale-[0.98] hover:shadow-sm">
              <Brain size={24} className="text-[#0369a1]" />
              <p className="text-[12px] font-[800] text-[#0369a1]">Meditasi</p>
            </button>
          )}

          {isFeatureActive('blood-pressure-tracking') && (
            <button
              onClick={() => onSubViewChange('bp-tracker')}
              className="p-4 rounded-2xl bg-[#fee2e2] border border-[#fecaca] flex flex-col items-start gap-2 transition-all active:scale-[0.98] hover:shadow-sm">
              <HeartPulse size={24} className="text-[#dc2626]" />
              <p className="text-[12px] font-[800] text-[#dc2626]">BP Check</p>
            </button>
          )}
        </div>
      </section>

      {/* Weekly Progress */}
      <section className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-lg shadow-black/5 mb-5">
        <div className="relative w-[72px] h-[72px] flex-shrink-0">
          <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
            <circle cx="36" cy="36" r="30" fill="none" stroke="#e6f2ec" strokeWidth="6" />
            <circle
              cx="36" cy="36" r="30"
              fill="none"
              stroke="#1f6e64"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${weeklyProgress * 1.885} ${188.5 - weeklyProgress * 1.885}`}
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center text-[16px] font-[900] text-[#1f6e64]">
            {weeklyProgress}%
          </span>
        </div>
        <div>
          <p className="text-[11px] font-[850] text-[#61716c] uppercase">Progres Mingguan</p>
          <p className="text-[14px] font-[800] text-[#253532] mb-1">Bagus! 🎉</p>
          <p className="text-[12px] text-[#5f6f69]">72 dari 100 target terpenuhi</p>
        </div>
      </section>

      {/* Metrics Grid */}
      <section>
        <h2 className="text-[13px] font-[850] text-[#253532] uppercase mb-3">Metrik Harian</h2>
        <div className="grid grid-cols-2 gap-2">
          {mockMetrics.map(metric => {
            const Icon = metric.icon;
            return (
              <div key={metric.id} className="rounded-2xl bg-white p-3 shadow-sm shadow-black/5">
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={18} color={metric.color} strokeWidth={2} />
                  <p className="text-[11px] font-[700] text-[#5f6f69]">{metric.label}</p>
                </div>
                <p className="text-[14px] font-[800] text-[#253532] mb-1">{metric.value}</p>
                <p className="text-[11px] text-[#71807b]">{metric.target}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
