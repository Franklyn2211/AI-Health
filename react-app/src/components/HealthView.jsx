import { useState } from 'react';

const riskMonitors = [
  {
    id: 'bp',
    label: 'Blood Pressure',
    value: '132/84',
    trend: 'rising',
    status: 'warning',
    icon: '🫀',
    detail: 'Trend increasing over 2 weeks',
    history: [120, 124, 126, 130, 132],
  },
  {
    id: 'sleep',
    label: 'Sleep Quality',
    value: '68%',
    trend: 'declining',
    status: 'warning',
    icon: '😴',
    detail: 'Decreased for 2 consecutive weeks',
    history: [85, 82, 78, 72, 68],
  },
  {
    id: 'activity',
    label: 'Activity Level',
    value: '3,200 steps',
    trend: 'low',
    status: 'alert',
    icon: '🚶',
    detail: 'Below minimum recommended level',
    history: [6800, 5200, 4100, 3600, 3200],
  },
  {
    id: 'nutrition',
    label: 'Nutrition Balance',
    value: '72/100',
    trend: 'stable',
    status: 'normal',
    icon: '🥗',
    detail: 'Good variety, slightly low on iron',
    history: [68, 70, 71, 73, 72],
  },
];

const aiAlerts = [
  {
    level: 'high',
    title: 'Blood pressure trend is increasing',
    desc: 'Your average systolic BP has risen by 12 mmHg over the past 2 weeks. This may require medical attention.',
    action: 'Consult a doctor',
    actionTab: 'doctor',
  },
  {
    level: 'medium',
    title: 'Sleep quality has decreased for 2 weeks',
    desc: 'Your sleep score dropped from 85% to 68%. Consider adjusting your bedtime routine.',
    action: 'View sleep tips',
    actionTab: null,
  },
  {
    level: 'high',
    title: 'Your activity level is too low',
    desc: 'You averaged only 3,200 steps/day this week — well below the 6,000 minimum. Increase daily movement.',
    action: 'See activity plan',
    actionTab: null,
  },
];

const interventions = [
  { icon: '🧂', title: 'Reduce sodium intake', desc: 'Switch to low-sodium seasonings. Target under 2,300mg/day.', type: 'lifestyle' },
  { icon: '🚶', title: 'Add 15-min post-meal walks', desc: 'Walking after meals lowers blood pressure and blood sugar.', type: 'lifestyle' },
  { icon: '🧘', title: 'Practice deep breathing 2x daily', desc: '5-minute breathing exercises can reduce systolic BP by 5-10 mmHg.', type: 'lifestyle' },
  { icon: '⚠️', title: 'Schedule blood pressure check', desc: 'Your trend warrants a professional measurement and review.', type: 'prevention' },
];

export default function HealthView({ onTabChange }) {
  const [expandedAlert, setExpandedAlert] = useState(null);

  const statusColors = {
    normal: { bg: '#f0faf4', text: '#16a34a', badge: '#dcfce7', label: '🟢 Normal' },
    warning: { bg: '#fffbeb', text: '#ca8a04', badge: '#fef9c3', label: '🟡 Watch' },
    alert: { bg: '#fef2f2', text: '#dc2626', badge: '#fee2e2', label: '🔴 High Risk' },
  };

  const highRiskCount = riskMonitors.filter(r => r.status === 'alert').length;
  const warningCount = riskMonitors.filter(r => r.status === 'warning').length;

  return (
    <div
      id="health"
      className="screen-scroll h-full overflow-y-auto px-5 pt-5 pb-24"
    >
      <header className="flex justify-between items-center gap-4 mb-5">
        <div>
          <p className="m-0 mb-1 uppercase text-[11px] leading-tight text-[#61716c] font-[850]">
            Prevention & detection
          </p>
          <h1 className="text-2xl leading-tight font-[800]">Health Monitor</h1>
        </div>
        <button
          onClick={() => onTabChange('home')}
          className="min-w-[44px] min-h-[44px] px-4 rounded-full bg-[#eaf0ec] text-[#25453e] text-[13px] font-[800] border-0 transition-all duration-300 active:scale-95"
        >
          Home
        </button>
      </header>

      {/* Overall Status */}
      <section className={`rounded-3xl p-5 mb-5 shadow-lg shadow-black/5 ${
        highRiskCount > 0 ? 'bg-gradient-to-br from-[#fef2f2] to-[#fff1f2]' : 'bg-gradient-to-br from-[#f0faf4] to-[#ecfdf5]'
      }`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{highRiskCount > 0 ? '⚠️' : '✅'}</span>
          <div>
            <h2 className={`text-base font-[800] ${highRiskCount > 0 ? 'text-[#b91c1c]' : 'text-[#166534]'}`}>
              {highRiskCount > 0 ? `${highRiskCount} Risk${highRiskCount > 1 ? 's' : ''} Detected` : 'All Clear'}
            </h2>
            <p className="text-[12px] text-[#61716c] mt-0.5">
              {highRiskCount > 0 ? `${warningCount} warnings · AI is monitoring` : 'No immediate concerns detected'}
            </p>
          </div>
        </div>
        {highRiskCount > 0 && (
          <button
            className="mt-3 w-full min-h-[44px] rounded-2xl bg-[#dc2626] text-white font-[800] text-[13px] border-0 shadow-lg shadow-[#dc2626]/20 transition-all active:scale-95"
            onClick={() => onTabChange('doctor')}
          >
            👨‍⚕️ Consult Doctor Now
          </button>
        )}
      </section>

      {/* Risk Monitoring Cards */}
      <section className="mb-5">
        <div className="flex justify-between items-baseline mb-3">
          <h2 className="text-lg font-[800]">Risk Monitoring</h2>
          <span className="text-[12px] text-[#7a8a84] font-[800]">Live tracking</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {riskMonitors.map((monitor) => {
            const colors = statusColors[monitor.status];
            return (
              <article
                key={monitor.id}
                className="rounded-2xl p-4 shadow-lg shadow-black/5 transition-all hover:scale-[1.02]"
                style={{ background: colors.bg }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{monitor.icon}</span>
                  <span
                    className="text-[10px] font-[800] px-2 py-0.5 rounded-full"
                    style={{ background: colors.badge, color: colors.text }}
                  >
                    {colors.label}
                  </span>
                </div>
                <span className="text-[11px] text-[#61716c] font-[800] block">{monitor.label}</span>
                <strong className="text-[18px] font-[800] block mt-1" style={{ color: colors.text }}>
                  {monitor.value}
                </strong>
                {/* Mini sparkline */}
                <div className="flex items-end gap-[3px] mt-2 h-4">
                  {monitor.history.map((v, i) => {
                    const max = Math.max(...monitor.history);
                    const min = Math.min(...monitor.history);
                    const range = max - min || 1;
                    const height = ((v - min) / range) * 100;
                    return (
                      <div
                        key={i}
                        className="flex-1 rounded-sm transition-all"
                        style={{
                          height: `${Math.max(height, 15)}%`,
                          background: i === monitor.history.length - 1 ? colors.text : `${colors.text}30`,
                        }}
                      />
                    );
                  })}
                </div>
                <p className="text-[11px] mt-1 font-[600]" style={{ color: colors.text }}>
                  {monitor.trend === 'rising' ? '↗ Rising' : monitor.trend === 'declining' ? '↘ Declining' : monitor.trend === 'low' ? '↓ Low' : '→ Stable'}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* AI Alerts */}
      <section className="mb-5">
        <div className="flex justify-between items-baseline mb-3">
          <h2 className="text-lg font-[800]">🚨 AI Alerts</h2>
          <span className="text-[12px] text-[#7a8a84] font-[800]">{aiAlerts.length} active</span>
        </div>
        <div className="grid gap-3">
          {aiAlerts.map((alert, i) => {
            const isHigh = alert.level === 'high';
            return (
              <article
                key={i}
                className={`rounded-2xl p-4 shadow-lg shadow-black/5 border-l-4 transition-all hover:scale-[1.01] cursor-pointer ${
                  isHigh ? 'bg-[#fef2f2] border-l-[#dc2626]' : 'bg-[#fffbeb] border-l-[#f59e0b]'
                }`}
                onClick={() => setExpandedAlert(expandedAlert === i ? null : i)}
              >
                <div className="flex items-start gap-2">
                  <span className="text-sm mt-0.5">{isHigh ? '🔴' : '🟡'}</span>
                  <div className="flex-1">
                    <h3 className={`text-[14px] font-[700] ${isHigh ? 'text-[#b91c1c]' : 'text-[#92400e]'}`}>
                      {alert.title}
                    </h3>
                    {expandedAlert === i && (
                      <div className="mt-2">
                        <p className={`text-[13px] leading-relaxed ${isHigh ? 'text-[#991b1b]' : 'text-[#78350f]'}`}>
                          {alert.desc}
                        </p>
                        {alert.actionTab && (
                          <button
                            className={`mt-3 min-h-[36px] px-4 rounded-xl text-[12px] font-[800] border-0 transition-all active:scale-95 ${
                              isHigh ? 'bg-[#dc2626] text-white shadow-md shadow-[#dc2626]/20' : 'bg-[#f59e0b] text-white shadow-md shadow-[#f59e0b]/20'
                            }`}
                            onClick={(e) => { e.stopPropagation(); onTabChange(alert.actionTab); }}
                          >
                            {alert.action}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Lifestyle Interventions */}
      <section className="mb-5">
        <div className="flex justify-between items-baseline mb-3">
          <h2 className="text-lg font-[800]">💡 Interventions</h2>
          <span className="text-[12px] text-[#7a8a84] font-[800]">AI recommended</span>
        </div>
        <div className="grid gap-2">
          {interventions.map((item, i) => (
            <article key={i} className="rounded-2xl bg-white p-4 shadow-lg shadow-black/5 flex items-start gap-3 transition-all hover:scale-[1.01]">
              <span className="text-xl mt-0.5">{item.icon}</span>
              <div>
                <h3 className="text-[14px] font-[700]">{item.title}</h3>
                <p className="text-[12px] text-[#5f6f69] mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
