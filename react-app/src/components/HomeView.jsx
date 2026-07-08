import { useState } from 'react';
import { Zap, Target, Utensils, Scale, ArrowRight, ScanBarcode, Dumbbell, Moon, Brain, HeartPulse } from 'lucide-react';
import { useHealth } from '../context/HealthContext';

export default function HomeView({ onTabChange, onSubViewChange }) {
  const { userProfile, getGoalLabel, consumedCalories } = useHealth();

  const mockMetrics = [
    { id: 'weight', icon: Scale, label: 'Berat Badan', value: `${userProfile.currentWeight || 72} kg`, target: `Target: ${userProfile.targetWeight || 68} kg`, color: '#1f6e64', active: true },
    { id: 'meals', icon: Utensils, label: 'Kalori', value: `${consumedCalories} kcal`, target: 'Target: 2000 kcal', color: '#e39b45', active: true }
  ].filter(m => m.active);

  const goalsText = userProfile.goals.length > 0
    ? userProfile.goals.map(g => getGoalLabel(g)).join(', ')
    : 'Tentukan target Anda';

  return (
    <div className="screen-scroll h-full overflow-y-auto px-5 pt-5 pb-24 bg-slate-50">
      <header className="flex justify-between items-center gap-4 mb-5">
        <div>
          <p className="m-0 mb-1 uppercase text-xs tracking-wider text-slate-500 font-bold">
            AI-Health
          </p>
          <h1 className="text-2xl leading-tight font-extrabold text-slate-900">Halo, {userProfile.fullName ? userProfile.fullName.split(' ')[0] : 'Anda'} 👋</h1>
        </div>
        <button
          onClick={() => onTabChange('profile')}
          className="w-12 h-12 min-w-[48px] rounded-full bg-teal-600 text-white font-bold border-0 text-lg shadow-sm transition-all active:scale-95 flex items-center justify-center"
        >
          {userProfile.fullName ? userProfile.fullName.substring(0, 2).toUpperCase() : 'ME'}
        </button>
      </header>

      {/* AI Briefing */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-5 mb-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
          <Zap size={20} />
        </div>
        <div>
          <p className="text-xs font-bold text-teal-600 mb-1 uppercase tracking-wider">Insight Hari Ini</p>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            {userProfile.goals.includes('body-goals')
              ? 'Tingkatkan asupan protein hari ini untuk mendukung pembentukan otot Anda.'
              : 'Jaga rutinitas sehat Anda. Jangan lupa minum air yang cukup!'}
          </p>
        </div>
      </div>

      {/* Focus Card */}
      <section className="rounded-3xl p-6 text-white shadow-sm mb-6 bg-teal-600">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
            <Target size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-teal-100 uppercase tracking-wider">Fokus Anda</p>
            <p className="text-sm font-bold text-white">{goalsText}</p>
          </div>
        </div>
        <p className="text-base font-bold leading-snug">Raih target kesehatan Anda dengan rekomendasi AI. 🚀</p>
      </section>

      {/* Metrics Grid */}
      <section className="mb-6">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Metrik Harian</h2>
        <div className="grid grid-cols-2 gap-3">
          {mockMetrics.map(metric => {
            const Icon = metric.icon;
            return (
              <div key={metric.id} className="rounded-3xl bg-white p-4 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                    <Icon size={16} color={metric.color} strokeWidth={2.5} />
                  </div>
                  <p className="text-xs font-bold text-slate-500">{metric.label}</p>
                </div>
                <p className="text-lg font-extrabold text-slate-900 mb-0.5">{metric.value}</p>
                <p className="text-xs text-slate-400 font-medium">{metric.target}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Actions (Conditional for Body Goals) */}
      {userProfile.goals.includes('body-goals') && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Body Goals</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onSubViewChange('meal-planner')}
              className="p-5 rounded-3xl bg-white border border-slate-100 flex flex-col items-start gap-3 transition-all active:scale-[0.98] shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
                <Utensils size={20} />
              </div>
              <p className="text-sm font-bold text-slate-900">Meal Planner</p>
            </button>
            <button
              onClick={() => onSubViewChange('fitness-routine')}
              className="p-5 rounded-3xl bg-white border border-slate-100 flex flex-col items-start gap-3 transition-all active:scale-[0.98] shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                <Dumbbell size={20} />
              </div>
              <p className="text-sm font-bold text-slate-900">Fitness Planner</p>
            </button>
          </div>
        </section>
      )}

      {/* Other Actions */}
      <section>
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Eksplorasi</h2>
        <div className="space-y-3">
          <button
            onClick={() => onSubViewChange('food-scanner')}
            className="w-full flex items-center justify-between p-5 rounded-3xl bg-white shadow-sm border border-slate-100 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <ScanBarcode size={24} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900">Pemindai Makanan</p>
                <p className="text-xs text-slate-500 font-medium">Hitung kalori otomatis via kamera</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
              <ArrowRight size={16} />
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}
