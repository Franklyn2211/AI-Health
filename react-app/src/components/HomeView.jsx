import { useState } from 'react';
import { Zap, Target, Utensils, Scale, ArrowRight, ScanBarcode, Dumbbell, Moon, Brain, HeartPulse, Footprints, CheckCircle2 } from 'lucide-react';
import { useHealth } from '../context/HealthContext';

export default function HomeView({ onTabChange, onSubViewChange }) {
  const { userProfile, getGoalLabel, consumedCalories, macros, loggedMeals } = useHealth();
  const [currentDate] = useState(new Date());

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const [selectedDayIndex, setSelectedDayIndex] = useState(currentDate.getDay());
  const currentDayIndex = currentDate.getDay();

  const dailyStepsGoal = 8000;
  const currentSteps = 4231;
  const stepsPercent = Math.min((currentSteps / dailyStepsGoal) * 100, 100);

  const mockMetrics = [
    { id: 'calories', icon: Utensils, label: 'Kalori', value: `${consumedCalories}`, target: `Target: 2000 kcal`, color: '#e39b45', active: true },
    { id: 'weight', icon: Scale, label: 'Berat Badan', value: `${userProfile.currentWeight || 72} kg`, target: `Target: ${userProfile.targetWeight || 68} kg`, color: '#1f6e64', active: true }
  ];

  const goalsText = userProfile.goals.length > 0
    ? userProfile.goals.map(g => getGoalLabel(g)).join(', ')
    : 'Tentukan target Anda';

  return (
    <div className="screen-scroll h-full overflow-y-auto px-5 pt-5 pb-24 bg-slate-50">
      <header className="flex justify-between items-center gap-4 mb-6">
        <div>
          <p className="m-0 mb-1 uppercase text-[10px] tracking-wider text-slate-500 font-extrabold">
            AI-Health
          </p>
          <h1 className="text-2xl leading-tight font-extrabold text-slate-900 mb-1">Halo, {userProfile.fullName ? userProfile.fullName.split(' ')[0] : 'Anda'} 👋</h1>
          <p className="text-sm font-medium text-slate-500">
            {userProfile.goals.includes('body-goals') 
              ? 'Konsisten hari ini, bangga esok hari. Terus berjuang! 🔥' 
              : 'Satu langkah kecil hari ini berarti besar untuk kesehatanmu. ✨'}
          </p>
        </div>
        <button
          onClick={() => onTabChange('profile')}
          className="w-12 h-12 min-w-[48px] rounded-full bg-teal-600 text-white font-bold border-0 text-lg shadow-sm transition-all active:scale-95 flex items-center justify-center"
        >
          {userProfile.fullName ? userProfile.fullName.substring(0, 2).toUpperCase() : 'ME'}
        </button>
      </header>

      {/* TOP WIDGET: Calendar & Gauge & Macros */}
      <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 mb-6">
        {/* Weekly Calendar Strip */}
        <div className="flex justify-between items-center mb-6">
          {daysOfWeek.map((day, idx) => (
            <button 
              key={idx} 
              onClick={() => setSelectedDayIndex(idx)}
              className={`w-8 h-12 flex flex-col items-center justify-center rounded-xl transition-all ${idx === selectedDayIndex ? 'bg-teal-600 text-white shadow-sm' : 'bg-transparent text-slate-400 hover:bg-slate-50'}`}
            >
              <span className="text-[10px] font-bold">{day}</span>
              <span className={`text-xs font-extrabold mt-1 ${idx === selectedDayIndex ? 'text-white' : 'text-slate-800'}`}>
                 {currentDate.getDate() - currentDayIndex + idx}
              </span>
            </button>
          ))}
        </div>

        {/* Semi-Circle Gauge Chart */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative w-48 h-24 overflow-hidden">
            <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[16px] border-slate-100 box-border" />
            <div 
              className="absolute top-0 left-0 w-48 h-48 rounded-full border-[16px] border-teal-500 box-border border-b-transparent border-r-transparent transition-all duration-1000"
              style={{ transform: `rotate(${stepsPercent * 1.8 - 135}deg)` }}
            />
            <div className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-end pb-2">
              <span className="text-3xl font-extrabold text-slate-900 leading-none">{currentSteps.toLocaleString()}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">/ {dailyStepsGoal.toLocaleString()} langkah</span>
            </div>
          </div>
        </div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-orange-50 rounded-2xl p-3 text-center">
            <span className="block text-sm font-extrabold text-orange-500 mb-0.5">{macros.protein || 45}g</span>
            <span className="block text-[10px] font-bold text-orange-800/60 uppercase">Protein</span>
          </div>
          <div className="bg-amber-50 rounded-2xl p-3 text-center">
            <span className="block text-sm font-extrabold text-amber-500 mb-0.5">{consumedCalories} kcal</span>
            <span className="block text-[10px] font-bold text-amber-800/60 uppercase">Kalori</span>
          </div>
          <div className="bg-indigo-50 rounded-2xl p-3 text-center">
            <span className="block text-sm font-extrabold text-indigo-500 mb-0.5">{macros.fat || 35}g</span>
            <span className="block text-[10px] font-bold text-indigo-800/60 uppercase">Lemak</span>
          </div>
        </div>
      </section>

      {/* LOGGED TODAY SECTION */}
      {loggedMeals.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-3 px-1">Logged Today</h2>
          <div className="space-y-3">
            {loggedMeals.map((meal, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <Utensils size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-900">{meal.name}</h3>
                  <p className="text-xs font-semibold text-slate-500">{meal.cal} kcal · {meal.prot}g P</p>
                </div>
                <CheckCircle2 size={20} className="text-teal-500 shrink-0" fill="#ccfbf1" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* QUICK MENU */}
      <section className="mb-6">
        <h2 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-3 px-1">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onSubViewChange('food-scanner')}
            className="p-4 rounded-3xl bg-white border border-slate-100 flex flex-col items-start gap-3 transition-all active:scale-[0.98] shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
              <ScanBarcode size={20} />
            </div>
            <p className="text-xs font-bold text-slate-900">Scan Makanan</p>
          </button>

          {userProfile.goals.includes('body-goals') && (
            <button
              onClick={() => onSubViewChange('meal-planner')}
              className="p-4 rounded-3xl bg-white border border-slate-100 flex flex-col items-start gap-3 transition-all active:scale-[0.98] shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
                <Utensils size={20} />
              </div>
              <p className="text-xs font-bold text-slate-900">Meal Planner</p>
            </button>
          )}

          {userProfile.goals.includes('mental-health') && (
            <button
              onClick={() => onSubViewChange('mood-tracker')}
              className="p-4 rounded-3xl bg-white border border-slate-100 flex flex-col items-start gap-3 transition-all active:scale-[0.98] shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                <Brain size={20} />
              </div>
              <p className="text-xs font-bold text-slate-900">Meditasi</p>
            </button>
          )}
        </div>
      </section>

      {/* METRIK HARIAN */}
      <section className="mb-6">
        <h2 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-3 px-1">Metrik Harian</h2>
        <div className="grid grid-cols-2 gap-3">
          {mockMetrics.map(metric => {
            const Icon = metric.icon;
            return (
              <div key={metric.id} className="rounded-3xl bg-white p-4 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                    <Icon size={16} color={metric.color} strokeWidth={2.5} />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{metric.label}</p>
                </div>
                <p className="text-lg font-extrabold text-slate-900 mb-0.5">{metric.value}</p>
                <p className="text-[10px] text-slate-400 font-bold">{metric.target}</p>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
