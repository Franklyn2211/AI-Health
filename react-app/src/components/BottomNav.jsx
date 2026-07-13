import { Bot, CalendarDays, ClipboardList, Stethoscope, User } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', label: 'Hari Ini', Icon: CalendarDays },
  { id: 'plan', label: 'Plan', Icon: ClipboardList },
  { id: 'ai', label: 'AI', isCenter: true },
  { id: 'clinic', label: 'Perawatan', Icon: Stethoscope },
  { id: 'profile', label: 'Profil', Icon: User },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav
      className="absolute left-0 right-0 bottom-0 h-[74px] grid grid-cols-5 gap-[2px] px-[10px] pt-[9px] pb-[12px] bg-[rgba(248,250,247,0.96)] border-t border-[#e2e8e4] backdrop-blur-[18px] z-10"
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map(({ id, label, Icon, isCenter }) => {
        const isActive = activeTab === id;

        if (isCenter) {
          return (
            <button
              key={id}
              id={`nav-${id}`}
              onClick={() => onTabChange(id)}
              className="relative -mt-[28px] overflow-visible border-0 bg-transparent text-slate-700 flex flex-col items-center justify-center gap-[4px] text-[11px] font-[850] transition-all duration-300 ease-in-out active:scale-95"
              aria-label="Asisten AI"
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="w-14 h-14 rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/25 flex items-center justify-center">
                <Bot size={26} strokeWidth={2.5} />
              </div>
              {label}
            </button>
          );
        }

        return (
          <button
            key={id}
            id={`nav-${id}`}
            onClick={() => onTabChange(id)}
            className={[
              'border-0 rounded-2xl flex flex-col items-center justify-center gap-[4px]',
              'text-[11px] font-[850] transition-all duration-300 ease-in-out active:scale-95 hover:scale-[1.05]',
              isActive
                ? 'text-[#1f6e64] bg-[#e6f2ec]'
                : 'text-[#71807b] bg-transparent',
            ].join(' ')}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
