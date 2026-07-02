import { useState } from 'react';
import { CheckCircle2, TrendingUp, Droplets, Footprints, Moon, Dumbbell, Smile, Utensils, Scale } from 'lucide-react';

const trackingItems = [
  { id: 'weight', icon: Scale, label: 'Weight', value: '72.3 kg', target: 'Target: 68 kg', color: '#1f6e64', done: false },
  { id: 'meals', icon: Utensils, label: 'Meals', value: '2/3 logged', target: '1,280 of 1,800 kcal', color: '#e39b45', done: false },
  { id: 'workout', icon: Dumbbell, label: 'Workout', value: 'Upper Body', target: '45 min planned', color: '#6366f1', done: false },
  { id: 'water', icon: Droplets, label: 'Water', value: '1.4L', target: 'Target: 2.2L', color: '#0ea5e9', done: false },
  { id: 'sleep', icon: Moon, label: 'Sleep', value: '7.2 hrs', target: 'Quality: 82%', color: '#8b5cf6', done: false },
  { id: 'mood', icon: Smile, label: 'Mood', value: 'Good 😊', target: 'Stress: Low', color: '#f59e0b', done: false },
  { id: 'steps', icon: Footprints, label: 'Steps', value: '6,284', target: 'Target: 8,000', color: '#10b981', done: false },
];

const coachingMessages = [
  { type: 'success', text: 'Great job! 🎉 You completed 85% of your weekly target.', time: 'Just now' },
  { type: 'tip', text: "You're 600 steps away from your daily goal. A 10-min walk after dinner would do it! 🚶", time: '2h ago' },
  { type: 'insight', text: "Your sleep quality improved 12% this week. Keep the 22:00 wind-down routine going! 😴", time: 'Today' },
];

export default function HomeView({ onTabChange, selectedGoal }) {
  const [tracking, setTracking] = useState(trackingItems);
  const [weeklyProgress] = useState(72);

  const toggleDone = (id) => {
    setTracking(prev =>
      prev.map(item =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const completedCount = tracking.filter(t => t.done).length;
  const todayPercent = Math.round((completedCount / tracking.length) * 100);

  const goalLabels = {
    'lose-weight': '🔥 Lose Weight',
    'build-muscle': '💪 Build Muscle',
    'heart-health': '❤️ Heart Health',
    'eat-healthier': '🥗 Eat Healthier',
    'sleep-better': '😴 Sleep Better',
    'reduce-stress': '🧘 Reduce Stress',
    'blood-sugar': '🩸 Blood Sugar',
    'blood-pressure': '🫀 Blood Pressure',
  };

  return (
    <div
      id="home"
      className="screen-scroll h-full overflow-y-auto px-5 pt-5 pb-24"
    >
      {/* Header */}
      <header className="flex justify-between items-center gap-4 mb-5">
        <div>
          <p className="m-0 mb-1 uppercase text-[11px] leading-tight text-[#61716c] font-[850]">
            TARA AI companion
          </p>
          <h1 className="text-2xl leading-tight font-[800]">Good morning! 👋</h1>
        </div>
        <button
          aria-label="Open profile"
          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#1f6e64] text-white font-[850] border-0 text-sm shadow-lg shadow-[#1f6e64]/30 transition-all active:scale-95"
        >
          TA
        </button>
      </header>

      {/* AI Coaching Card */}
      <section
        className="rounded-3xl p-5 text-white shadow-lg shadow-black/10 mb-5"
        style={{ background: 'linear-gradient(135deg, #173b35 0%, #2c7a70 58%, #e8b95f 100%)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="w-8 h-8 rounded-lg bg-white/20 grid place-items-center text-sm">🤖</span>
          <div>
            <p className="text-[11px] font-[850] text-white/70 uppercase">AI Coaching</p>
            <p className="text-[12px] font-[700] text-white/90">{goalLabels[selectedGoal] || '🎯 Your Goal'}</p>
          </div>
        </div>
        <p className="text-[15px] font-[700] leading-snug mb-2">{coachingMessages[0].text}</p>
        <p className="text-[12px] text-white/60">{coachingMessages[0].time}</p>
      </section>

      {/* Weekly Progress Ring */}
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
          <h2 className="text-[16px] font-[800]">Weekly Progress</h2>
          <p className="text-[13px] text-[#5f6f69] mt-1">
            {completedCount}/{tracking.length} tasks done today · {weeklyProgress}% of weekly target
          </p>
        </div>
      </section>

      {/* Daily Check-in */}
      <section className="mb-5">
        <div className="flex justify-between items-baseline mb-3">
          <h2 className="text-lg font-[800]">Daily Check-in</h2>
          <span className="text-[12px] text-[#7a8a84] font-[800]">{todayPercent}% done</span>
        </div>
        <div className="grid gap-2">
          {tracking.map((item) => {
            const IconComponent = item.icon;
            return (
              <article
                key={item.id}
                className={`rounded-2xl p-3.5 shadow-lg shadow-black/5 flex items-center gap-3 transition-all duration-300 hover:scale-[1.01] cursor-pointer ${
                  item.done ? 'bg-[#f0faf4] border-l-4' : 'bg-white border-l-4'
                }`}
                style={{ borderLeftColor: item.done ? '#22c55e' : item.color }}
                onClick={() => toggleDone(item.id)}
              >
                <div
                  className="w-9 h-9 rounded-xl grid place-items-center flex-shrink-0"
                  style={{ background: `${item.color}15` }}
                >
                  <IconComponent size={18} color={item.color} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <strong className="text-[14px] font-[700]">{item.label}</strong>
                    <span className="text-[13px] text-[#17231f] font-[600]">{item.value}</span>
                  </div>
                  <p className="text-[12px] text-[#61716c] mt-0.5">{item.target}</p>
                </div>
                <div className={`w-7 h-7 rounded-full grid place-items-center transition-all ${
                  item.done ? 'bg-[#22c55e]' : 'bg-[#e6f2ec]'
                }`}>
                  <CheckCircle2 size={16} strokeWidth={2.5} className={item.done ? 'text-white' : 'text-[#1f6e64] opacity-40'} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* AI Daily Insights */}
      <section className="mb-5">
        <div className="flex justify-between items-baseline mb-3">
          <h2 className="text-lg font-[800]">AI Insights</h2>
          <span className="text-[12px] text-[#7a8a84] font-[800]">Today</span>
        </div>
        <div className="grid gap-2">
          {coachingMessages.slice(1).map((msg, i) => (
            <article
              key={i}
              className="rounded-2xl bg-white p-4 shadow-lg shadow-black/5 transition-all hover:scale-[1.01]"
            >
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">
                  {msg.type === 'tip' ? '💡' : msg.type === 'insight' ? '📊' : '🎯'}
                </span>
                <div className="flex-1">
                  <p className="text-[13px] text-[#2d3d38] leading-relaxed font-[600]">{msg.text}</p>
                  <span className="text-[11px] text-[#9ca3af] mt-1 block">{msg.time}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-3 gap-2 mb-5">
        <button
          className="min-h-[72px] bg-white rounded-2xl p-3 grid justify-items-center gap-1 text-[#253532] text-[11px] font-[800] shadow-lg shadow-black/5 border-0 transition-all active:scale-95"
          onClick={() => onTabChange('health')}
        >
          <span className="text-xl">🛡️</span>
          Prevention
        </button>
        <button
          className="min-h-[72px] bg-white rounded-2xl p-3 grid justify-items-center gap-1 text-[#253532] text-[11px] font-[800] shadow-lg shadow-black/5 border-0 transition-all active:scale-95"
          onClick={() => onTabChange('chat')}
        >
          <span className="text-xl">💬</span>
          AI Chat
        </button>
        <button
          className="min-h-[72px] bg-white rounded-2xl p-3 grid justify-items-center gap-1 text-[#253532] text-[11px] font-[800] shadow-lg shadow-black/5 border-0 transition-all active:scale-95"
          onClick={() => onTabChange('doctor')}
        >
          <span className="text-xl">👨‍⚕️</span>
          Doctor
        </button>
      </section>
    </div>
  );
}
