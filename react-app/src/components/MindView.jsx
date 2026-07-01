import { Moon, Dumbbell, Droplets, Bell } from 'lucide-react';

const HABIT_ITEMS = [
  {
    Icon: Moon,
    iconBg: '#1f3a57',
    iconColor: '#f6d875',
    label: 'Sleep',
    desc: '6h 12m · needs wind-down',
  },
  {
    Icon: Dumbbell,
    iconBg: '#d9893f',
    iconColor: 'white',
    label: 'Fitness',
    desc: '18 min walk planned',
  },
  {
    Icon: Droplets,
    iconBg: '#2c7a70',
    iconColor: '#bfece3',
    label: 'Hydration',
    desc: '2 glasses behind',
  },
  {
    Icon: Bell,
    iconBg: '#b84e5d',
    iconColor: 'white',
    label: 'Reminder',
    desc: 'Smart nudges on',
  },
];

export default function MindView({ onTabChange }) {
  return (
    <div
      id="mind"
      className="screen-scroll h-full overflow-y-auto px-[18px] pt-[16px] pb-[92px]"
    >
      {/* Header */}
      <header className="flex justify-between items-center gap-[16px] mb-[14px]">
        <div>
          <p className="m-0 mb-[5px] uppercase text-[11px] leading-[1.15] text-[#61716c] font-[850] tracking-[0]">
            Mood, sleep &amp; fitness
          </p>
          <h1 className="text-[24px] leading-[1.05] font-[800]">Your daily companion</h1>
        </div>
        <button
          onClick={() => onTabChange('home')}
          className="min-w-[44px] min-h-[44px] px-[14px] rounded-[22px] bg-[#eaf0ec] text-[#25453e] text-[13px] font-[800] border-0"
        >
          Home
        </button>
      </header>

      {/* Mood Card */}
      <section className="rounded-[8px] p-[18px] flex items-start gap-[16px] bg-[#e8ebfa]">
        {/* Voice orb — uses custom CSS class */}
        <div className="voice-orb" aria-hidden="true" />
        <div>
          <p className="m-0 mb-[5px] uppercase text-[11px] leading-[1.15] text-[#61716c] font-[850] tracking-[0]">
            Teman curhat
          </p>
          <h2 className="text-[18px] leading-[1.16] font-[800] mb-[6px]">Stress looks moderate</h2>
          <p className="text-[#5f6f69] text-[13px] leading-[1.38]">
            Your voice note mentions workload, and sleep quality dipped. Want a 2-minute reset?
          </p>
        </div>
      </section>

      {/* Habit Grid */}
      <section className="grid grid-cols-2 gap-[9px] my-[14px]">
        {HABIT_ITEMS.map(({ Icon, iconBg, iconColor, label, desc }) => (
          <article
            key={label}
            className="bg-white border border-[#e2e8e4] rounded-[8px] p-[13px] min-h-[124px]"
          >
            {/* Mini icon box */}
            <div
              className="w-[34px] h-[34px] rounded-[10px] mb-[10px] flex items-center justify-center"
              style={{ background: iconBg }}
            >
              <Icon size={18} color={iconColor} strokeWidth={2} />
            </div>
            <h3 className="text-[15px] leading-[1.2] font-[700]">{label}</h3>
            <p className="text-[#5f6f69] text-[13px] leading-[1.38] mt-[2px]">{desc}</p>
          </article>
        ))}
      </section>

      {/* Adaptive Fitness */}
      <section className="mt-[16px]">
        <div className="flex justify-between items-baseline mb-[10px]">
          <h2 className="text-[18px] leading-[1.16] font-[800]">Adaptive fitness</h2>
          <span className="text-[#7a8a84] text-[12px] font-[800]">Low strain</span>
        </div>
        <article className="bg-white border border-[#e2e8e4] rounded-[8px] p-[14px]">
          <h3 className="text-[15px] leading-[1.2] font-[700]">Today: gentle strength</h3>
          <p className="text-[#5f6f69] text-[13px] leading-[1.38] mt-[4px]">
            8 squats, 6 wall pushups, 12-minute walk. Adjusted for lower sleep.
          </p>
          <button className="min-h-[40px] border-0 rounded-[8px] bg-[#1f6e64] text-white font-[900] mt-[12px] px-[14px] hover:bg-[#196059] transition-colors">
            Start session
          </button>
        </article>
      </section>
    </div>
  );
}
