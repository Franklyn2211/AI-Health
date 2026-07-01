import { useState } from 'react';
import { Camera, Utensils, Droplet, Activity } from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';

// A reusable small check button with toggle state
function SmallCheck({ label }) {
  const [done, setDone] = useState(false);
  return (
    <button
      aria-label={label}
      onClick={() => setDone(d => !d)}
      className={[
        'w-[34px] h-[34px] min-w-[34px] min-h-[34px] rounded-full border-0 flex items-center justify-center transition-colors duration-200',
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
      className="min-h-[86px] border border-[#e2e8e4] bg-white rounded-[8px] py-[9px] px-[5px] grid justify-items-center gap-[8px] text-[#253532] text-[11px] font-[800] hover:bg-[#f5faf7] transition-colors"
    >
      <Icon size={26} color={color} strokeWidth={2} />
      <span>{label}</span>
    </button>
  );
}

export default function HomeView({ onTabChange }) {
  return (
    <div
      id="home"
      className="screen-scroll h-full overflow-y-auto px-[18px] pt-[16px] pb-[92px]"
    >
      {/* App Header */}
      <header className="flex justify-between items-center gap-[16px] mb-[18px]">
        <div>
          <p className="m-0 mb-[5px] uppercase text-[11px] leading-[1.15] text-[#61716c] font-[850] tracking-[0]">
            INaAI companion
          </p>
          <h1 className="text-[24px] leading-[1.05] font-[800]">Good morning, Jason</h1>
        </div>
        <button
          aria-label="Open profile"
          className="w-[46px] h-[46px] min-w-[44px] min-h-[44px] rounded-full bg-[#1f6e64] text-white font-[850] border-0 text-[14px]"
        >
          JS
        </button>
      </header>

      {/* Daily Signal Card */}
      <section
        className="rounded-[8px] p-[18px] flex items-center gap-[16px] justify-between min-h-[150px] text-white"
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
        <div className="signal-ring" aria-label="Readiness 74 percent">
          <span className="text-white font-[900] text-[24px]">74</span>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-4 gap-[8px] my-[14px]" aria-label="Quick actions">
        <QuickAction Icon={Camera}   color="#236a61" label="Scan food"    onClick={() => onTabChange('scan')} />
        <QuickAction Icon={Utensils} color="#d9893f" label="Meal plan"   onClick={() => onTabChange('plan')} />
        <QuickAction Icon={Droplet}  color="#b84e5d" label="Anemia check" onClick={() => onTabChange('health')} />
        <QuickAction Icon={Activity} color="#586bb5" label="Mood check"  onClick={() => onTabChange('mind')} />
      </section>

      {/* Companion Plan */}
      <section className="mt-[16px]">
        <div className="flex justify-between items-baseline mb-[10px]">
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
            className="grid items-center bg-white border border-[#e4eae6] rounded-[8px] p-[12px] mb-[8px]"
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

      {/* Community Strip */}
      <section className="mt-[14px] rounded-[8px] p-[18px] flex items-center gap-[16px] justify-between bg-[#fff2d7]">
        <div>
          <p className="m-0 mb-[5px] uppercase text-[11px] leading-[1.15] text-[#61716c] font-[850] tracking-[0]">
            Community challenge
          </p>
          <h2 className="text-[18px] leading-[1.16] font-[800]">#7 in Iron Week</h2>
        </div>
        <div className="w-[54px] h-[54px] grid place-items-center rounded-full bg-[#e39b45] text-white font-[900]">
          +18
        </div>
      </section>
    </div>
  );
}
