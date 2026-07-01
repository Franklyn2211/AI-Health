import { useState } from 'react';
import { Camera, Utensils, Droplet, Activity, Moon } from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';

// A reusable small check button with toggle state
function SmallCheck({ label }) {
  const [done, setDone] = useState(false);
  return (
    <button
      aria-label={label}
      onClick={() => setDone(d => !d)}
      className={[
        'w-[34px] h-[34px] min-w-[34px] min-h-[34px] rounded-full border-0 flex items-center justify-center transition-all duration-300 ease-in-out active:scale-95',
        done ? 'bg-[#cbeade]' : 'bg-[#eff5f1]',
      ].join(' ')}
    >
      <CheckCircle2
        size={18}
        strokeWidth={2.5}
        className={done ? 'text-[#1f6e64]' : 'text-[#2c7a70] opacity-60'}
      />
    </button>
  );
}

// Quick action button with icon + label
function QuickAction({ Icon, color, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="min-h-[86px] bg-white rounded-2xl py-3 px-2 grid justify-items-center gap-2 text-[#253532] text-[11px] font-[800] hover:bg-[#f5faf7] shadow-lg shadow-black/5 border-0 transition-all duration-300 ease-in-out active:scale-95"
    >
      <Icon size={26} color={color} strokeWidth={2} />
      <span>{label}</span>
    </button>
  );
}

// Daily Metric Card
function DailyMetric({ iconType, label, value, subtext, barColorClass, percent }) {
  return (
    <article className="min-w-0 rounded-2xl py-3 px-3 bg-white shadow-lg shadow-black/5 border-0 transition-all duration-300 ease-in-out hover:scale-[1.02]">
      <div className={`metric-icon ${iconType}`} aria-hidden="true" />
      <span className="block min-h-[26px] text-[#687872] text-[11px] leading-[1.15] font-[850]">{label}</span>
      <strong className="block mt-[4px] text-[#17231f] text-[19px] leading-[1]">{value}</strong>
      <p className="mt-[4px] text-[11px] leading-[1.2]">{subtext}</p>
      <div className={`metric-bar ${barColorClass}`}>
        <span style={{ width: `${percent}%` }} />
      </div>
    </article>
  );
}

export default function HomeView({ onTabChange }) {
  return (
    <div
      id="home"
      className="screen-scroll h-full overflow-y-auto px-[24px] pt-[24px] pb-[100px]"
    >
      {/* App Header */}
      <header className="flex justify-between items-center gap-[16px] mb-[24px]">
        <div>
          <p className="m-0 mb-[5px] uppercase text-[11px] leading-[1.15] text-[#61716c] font-[850] tracking-[0]">
            INaAI companion
          </p>
          <h1 className="text-[24px] leading-[1.05] font-[800]">Good morning, Jason</h1>
        </div>
        <button
          aria-label="Open profile"
          className="w-[46px] h-[46px] min-w-[44px] min-h-[44px] rounded-full bg-[#1f6e64] text-white font-[850] border-0 text-[14px] shadow-lg shadow-[#1f6e64]/30 transition-all duration-300 ease-in-out active:scale-95"
        >
          JS
        </button>
      </header>

      {/* Daily Signal Card */}
      <section
        className="rounded-3xl p-6 flex items-center gap-[16px] justify-between min-h-[150px] text-white shadow-lg shadow-black/10 transition-all duration-300 ease-in-out hover:scale-[1.02]"
        style={{
          background: 'linear-gradient(135deg, #173b35 0%, #2c7a70 58%, #e8b95f 100%)',
        }}
      >
        <div>
          <p className="m-0 mb-[5px] uppercase text-[11px] leading-[1.15] font-[850] tracking-[0] text-white/80">
            Today signal
          </p>
          <h2 className="text-[18px] leading-[1.16] font-[800] mb-[8px] max-w-[210px]">
            Your energy may dip after lunch
          </h2>
          <p className="text-[13px] leading-[1.38] text-white/80">
            Sleep was shorter, hydration is behind, and yesterday's meal had lower iron.
          </p>
        </div>
        {/* Readiness ring */}
        <div className="signal-ring shadow-lg shadow-black/20" aria-label="Readiness 74 percent">
          <span className="text-white font-[900] text-[24px]">74</span>
        </div>
      </section>

      {/* Daily Metrics */}
      <section className="grid grid-cols-3 gap-3 mt-6" aria-label="Daily activity and calorie metrics">
        <DailyMetric iconType="intake" label="Calories intake" value="1,542" subtext="of 2,100 kcal" barColorClass="" percent={73} />
        <DailyMetric iconType="burned" label="Calories burned" value="486" subtext="active kcal" barColorClass="orange" percent={46} />
        <DailyMetric iconType="steps" label="Steps tracker" value="6,284" subtext="of 8,000 steps" barColorClass="blue" percent={78} />
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-5 gap-2 my-6" aria-label="Quick actions">
        <QuickAction Icon={Camera}   color="#236a61" label="Scan"    onClick={() => onTabChange('scan')} />
        <QuickAction Icon={Utensils} color="#d9893f" label="Plan"   onClick={() => onTabChange('plan')} />
        <QuickAction Icon={Droplet}  color="#b84e5d" label="Anemia" onClick={() => onTabChange('health')} />
        <QuickAction Icon={Activity} color="#586bb5" label="Mood"  onClick={() => onTabChange('mind')} />
        <QuickAction Icon={Moon} color="#4f46e5" label="Sleep" onClick={() => onTabChange('sleep')} />
      </section>

      {/* Companion Plan */}
      <section className="mt-6">
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="text-[18px] leading-[1.16] font-[800]">Companion plan</h2>
          <span className="text-[#7a8a84] text-[12px] font-[800]">Auto adjusted</span>
        </div>

        {[
          { time: '08:00', title: 'Protein breakfast',  desc: "Egg toast + banana. Keeps today's calories balanced.",        label: 'Mark breakfast done' },
          { time: '13:00', title: 'Budget lunch bowl',  desc: 'Chicken, rice, greens. Add citrus for iron absorption.',      label: 'Mark lunch done' },
          { time: '21:30', title: 'Sleep wind-down',    desc: 'Dim screen, breathing check-in, reminder off by 22:00.',      label: 'Mark wind-down done' },
        ].map(({ time, title, desc, label }) => (
          <article
            key={time}
            className="grid items-center bg-white rounded-2xl p-4 mb-3 shadow-lg shadow-black/5 border-0 transition-all duration-300 ease-in-out hover:scale-[1.01]"
            style={{ gridTemplateColumns: '54px 1fr 36px', gap: '10px' }}
          >
            <div className="text-[#246e63] text-[12px] font-[900]">{time}</div>
            <div>
              <h3 className="text-[15px] leading-[1.2] font-[700]">{title}</h3>
              <p className="text-[#5f6f69] text-[13px] leading-[1.38]">{desc}</p>
            </div>
            <SmallCheck label={label} />
          </article>
        ))}
      </section>

    </div>
  );
}
