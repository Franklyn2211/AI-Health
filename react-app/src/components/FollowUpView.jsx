import { useState } from 'react';

export default function FollowUpView({ onTabChange }) {
  const [activeSection, setActiveSection] = useState('overview');

  const diagnosis = {
    condition: 'Stage 1 Hypertension',
    doctor: 'Dr. Sarah Chen',
    date: 'July 2, 2026',
    notes: 'Blood pressure readings consistently above 130/85. Recommend lifestyle changes and monitoring before medication.',
  };

  const prescriptions = [
    { name: 'Amlodipine 5mg', dosage: '1 tablet daily', time: '08:00 AM', icon: '💊' },
    { name: 'Omega-3 Fish Oil', dosage: '1 capsule daily', time: '08:00 AM', icon: '🐟' },
    { name: 'Magnesium 250mg', dosage: '1 tablet before bed', time: '09:30 PM', icon: '💊' },
  ];

  const treatmentPlan = [
    { week: 'Week 1-2', task: 'Start DASH diet + daily walking', status: 'current' },
    { week: 'Week 3-4', task: 'Increase cardio to 30 min/day', status: 'upcoming' },
    { week: 'Month 2', task: 'Follow-up blood pressure check', status: 'upcoming' },
    { week: 'Month 3', task: 'Doctor review & plan adjustment', status: 'upcoming' },
  ];

  const recoveryMetrics = [
    { label: 'Blood Pressure', value: '132/84', trend: 'improving', icon: '🫀', prev: '140/90' },
    { label: 'Resting Heart Rate', value: '72 bpm', trend: 'stable', icon: '❤️', prev: '74 bpm' },
    { label: 'Daily Steps', value: '6,200', trend: 'improving', icon: '🚶', prev: '3,400' },
    { label: 'Sleep Quality', value: '78%', trend: 'improving', icon: '😴', prev: '62%' },
  ];

  const medicationSchedule = [
    { time: '08:00 AM', meds: ['Amlodipine 5mg', 'Omega-3 Fish Oil'], done: true },
    { time: '01:00 PM', meds: ['Walk 15 min after lunch'], done: true },
    { time: '06:00 PM', meds: ['Evening walk 20 min'], done: false },
    { time: '09:30 PM', meds: ['Magnesium 250mg'], done: false },
  ];

  const sections = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'medications', label: 'Medications', icon: '💊' },
    { id: 'recovery', label: 'Recovery', icon: '📈' },
  ];

  return (
    <div
      id="followup"
      className="screen-scroll h-full overflow-y-auto px-5 pt-5 pb-24"
    >
      <header className="flex justify-between items-center gap-4 mb-5">
        <div>
          <p className="m-0 mb-1 uppercase text-[11px] leading-tight text-[#61716c] font-[850]">
            Recovery tracking
          </p>
          <h1 className="text-2xl leading-tight font-[800]">Medical Follow-up</h1>
        </div>
        <button
          onClick={() => onTabChange('doctor')}
          className="min-w-[44px] min-h-[44px] px-4 rounded-full bg-[#eaf0ec] text-[#25453e] text-[13px] font-[800] border-0 transition-all duration-300 active:scale-95"
        >
          Back
        </button>
      </header>

      {/* Section tabs */}
      <div className="flex gap-2 mb-5">
        {sections.map(sec => (
          <button
            key={sec.id}
            className={`flex-1 min-h-[42px] rounded-xl text-[12px] font-[800] border-0 transition-all active:scale-95 ${
              activeSection === sec.id
                ? 'bg-[#1f6e64] text-white shadow-lg shadow-[#1f6e64]/30'
                : 'bg-white text-[#25453e] shadow-md shadow-black/5'
            }`}
            onClick={() => setActiveSection(sec.id)}
          >
            {sec.icon} {sec.label}
          </button>
        ))}
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <>
          {/* Diagnosis card */}
          <section className="rounded-3xl bg-gradient-to-br from-[#fef9f0] to-[#fff5e6] p-5 shadow-lg shadow-black/5 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🩺</span>
              <h2 className="text-base font-[800]">Diagnosis</h2>
            </div>
            <div className="rounded-2xl bg-white/80 p-4">
              <h3 className="text-[15px] font-[700] text-[#b45309] mb-1">{diagnosis.condition}</h3>
              <p className="text-[12px] text-[#61716c] mb-2">{diagnosis.doctor} · {diagnosis.date}</p>
              <p className="text-[13px] text-[#5f6f69] leading-relaxed">{diagnosis.notes}</p>
            </div>
          </section>

          {/* Treatment Timeline */}
          <section className="mb-5">
            <h2 className="text-lg font-[800] mb-3">📅 Treatment Plan</h2>
            <div className="followup-timeline">
              {treatmentPlan.map((item, i) => (
                <div key={i} className={`followup-timeline-item ${item.status}`}>
                  <div className="followup-timeline-dot" />
                  <div className="followup-timeline-content">
                    <span className="text-[11px] font-[800] text-[#1f6e64]">{item.week}</span>
                    <p className="text-[13px] text-[#2d3d38] font-[600]">{item.task}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Prescriptions */}
          <section className="mb-5">
            <h2 className="text-lg font-[800] mb-3">💊 Prescriptions</h2>
            <div className="grid gap-2">
              {prescriptions.map((rx, i) => (
                <article key={i} className="rounded-2xl bg-white p-4 shadow-lg shadow-black/5 flex items-center gap-3">
                  <span className="text-2xl">{rx.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-[700]">{rx.name}</h3>
                    <p className="text-[12px] text-[#61716c]">{rx.dosage} · {rx.time}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Medications Section */}
      {activeSection === 'medications' && (
        <>
          <section className="mb-5">
            <h2 className="text-lg font-[800] mb-1">Today's Schedule</h2>
            <p className="text-[13px] text-[#61716c] mb-4">Tap to mark as completed</p>
            <div className="grid gap-3">
              {medicationSchedule.map((slot, i) => (
                <article
                  key={i}
                  className={`rounded-2xl p-4 shadow-lg shadow-black/5 transition-all hover:scale-[1.01] ${
                    slot.done ? 'bg-[#f0faf4] border-l-4 border-l-[#22c55e]' : 'bg-white border-l-4 border-l-[#e2e8e4]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[13px] font-[800] ${slot.done ? 'text-[#16a34a]' : 'text-[#1f6e64]'}`}>
                      🕐 {slot.time}
                    </span>
                    <span className={`text-[11px] font-[800] px-2 py-0.5 rounded-full ${
                      slot.done ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#fef9c3] text-[#ca8a04]'
                    }`}>
                      {slot.done ? '✓ Done' : 'Pending'}
                    </span>
                  </div>
                  {slot.meds.map((med, j) => (
                    <p key={j} className="text-[13px] text-[#2d3d38] font-[600] mt-1">• {med}</p>
                  ))}
                </article>
              ))}
            </div>
          </section>

          {/* AI Coaching */}
          <section className="rounded-3xl bg-gradient-to-br from-[#173b35] to-[#2c7a70] p-5 shadow-lg text-white mb-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🤖</span>
              <h3 className="text-[14px] font-[800]">AI Recovery Coach</h3>
            </div>
            <p className="text-[13px] leading-relaxed text-white/85">
              Good progress! You've taken 2 of 4 medications today. Remember your evening walk — it helps lower blood pressure naturally. Your consistency is improving! 💪
            </p>
          </section>
        </>
      )}

      {/* Recovery Section */}
      {activeSection === 'recovery' && (
        <>
          <section className="mb-5">
            <h2 className="text-lg font-[800] mb-3">📈 Recovery Progress</h2>
            <div className="grid grid-cols-2 gap-3">
              {recoveryMetrics.map((metric, i) => (
                <article key={i} className="rounded-2xl bg-white p-4 shadow-lg shadow-black/5">
                  <span className="text-xl block mb-1">{metric.icon}</span>
                  <span className="text-[11px] text-[#61716c] font-[800] block">{metric.label}</span>
                  <strong className="text-[18px] font-[800] text-[#17231f] block mt-1">{metric.value}</strong>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`text-[11px] font-[700] ${
                      metric.trend === 'improving' ? 'text-[#16a34a]' : 'text-[#61716c]'
                    }`}>
                      {metric.trend === 'improving' ? '↗ Improving' : '→ Stable'}
                    </span>
                    <span className="text-[11px] text-[#9ca3af]">from {metric.prev}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Lifestyle coaching */}
          <section className="mb-5">
            <h2 className="text-lg font-[800] mb-3">🏃 Lifestyle Coaching</h2>
            <div className="grid gap-3">
              {[
                { tip: 'Reduce sodium to under 2,300mg/day', progress: 72, color: '#22c55e' },
                { tip: 'Walk 30 minutes daily', progress: 85, color: '#1f6e64' },
                { tip: 'Practice deep breathing 2x/day', progress: 50, color: '#e39b45' },
                { tip: 'Maintain 7+ hours sleep', progress: 90, color: '#6366f1' },
              ].map((item, i) => (
                <article key={i} className="rounded-2xl bg-white p-4 shadow-lg shadow-black/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[13px] font-[700] text-[#2d3d38]">{item.tip}</span>
                    <span className="text-[12px] font-[800]" style={{ color: item.color }}>{item.progress}%</span>
                  </div>
                  <div className="h-2 bg-[#f0f4f2] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${item.progress}%`, background: item.color }}
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* AI insights */}
          <section className="rounded-3xl bg-gradient-to-br from-[#173b35] to-[#2c7a70] p-5 shadow-lg text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📊</span>
              <h3 className="text-[14px] font-[800]">Progress Tracking</h3>
            </div>
            <p className="text-[13px] leading-relaxed text-white/85">
              After 2 weeks of monitoring, your blood pressure has decreased by 8/6 mmHg. Your walking consistency has improved by 82%. Continue this trend and your next check-up should show significant improvement. 🎯
            </p>
          </section>
        </>
      )}
    </div>
  );
}
