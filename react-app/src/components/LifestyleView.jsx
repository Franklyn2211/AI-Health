import { useHealth } from '../context/HealthContext';
import {
  Utensils, Dumbbell, Moon, Brain, Droplet, BookOpen,
  ChevronRight, Stethoscope, Lightbulb, Target,
} from 'lucide-react';

const FEATURES = [
  {
    id: 'meal-planner',
    subView: 'meal-planner',
    Icon: Utensils,
    title: 'Meal Planner',
    desc: 'Jadwal makan harian yang dipersonalisasi dengan hitungan kalori dan makronutrisi.',
    iconBg: '#fff5e6',
    iconColor: '#cc8800',
    border: 'border-amber-100',
  },
  {
    id: 'fitness-routine',
    subView: 'fitness-routine',
    Icon: Dumbbell,
    title: 'Fitness Planner',
    desc: 'Workout of the Day interaktif dengan gerakan yang adaptif terhadap tujuan Anda.',
    iconBg: '#e0e7ff',
    iconColor: '#4f46e5',
    border: 'border-indigo-100',
  },
  {
    id: 'sleep-tracker',
    subView: 'sleep-tracker',
    Icon: Moon,
    title: 'Sleep Tracker',
    desc: 'Analisis kualitas tidur, Smart Alarm, dan soundscape untuk tidur lebih nyenyak.',
    iconBg: '#f3e8ff',
    iconColor: '#7c3aed',
    border: 'border-violet-100',
  },
  {
    id: 'meditation',
    subView: 'mood-tracker',
    Icon: Brain,
    title: 'Mood & Meditasi',
    desc: 'Lacak emosi harian, latihan pernapasan, dan dukungan AI kesehatan mental.',
    iconBg: '#e0f2fe',
    iconColor: '#0369a1',
    border: 'border-sky-100',
  },
  {
    id: 'blood-sugar-tracking',
    subView: 'food-scanner',
    Icon: Droplet,
    title: 'Pemindai Makanan',
    desc: 'Pindai makanan untuk cek nutrisi instan — cocok untuk kontrol gula darah.',
    iconBg: '#fee2e2',
    iconColor: '#dc2626',
    border: 'border-red-100',
  },
  {
    id: 'nutrition-guide',
    subView: 'meal-planner',
    Icon: BookOpen,
    title: 'Panduan Nutrisi',
    desc: 'Rencana makan berbasis tujuan Anda dengan rekomendasi gizi seimbang.',
    iconBg: '#dbeafe',
    iconColor: '#0284c7',
    border: 'border-blue-100',
  },
];

const DAILY_TIPS = [
  {
    Icon: Lightbulb,
    title: 'Hidrasi Optimal',
    body: 'Minum air putih 8 gelas hari ini untuk metabolisme dan konsentrasi yang optimal.',
  },
  {
    Icon: Target,
    title: 'Langkah Challenge',
    body: 'Capai 8.000 langkah hari ini — setara 40 menit berjalan kaki santai.',
  },
];

export default function LifestyleView({ onTabChange, onSubViewChange }) {
  const { isFeatureActive } = useHealth();

  const activeFeatures = FEATURES.filter(f => isFeatureActive(f.id));

  return (
    <div className="screen-scroll h-full overflow-y-auto px-5 pt-5 pb-24">
      {/* Header */}
      <header className="mb-6">
        <p className="text-[10px] font-[850] text-[#61716c] uppercase tracking-widest mb-1">
          Gaya Hidup Sehat
        </p>
        <h1 className="text-[22px] font-[800] text-[#253532] leading-tight">Pusat Kesehatan</h1>
        <p className="text-[13px] text-[#5f6f69] mt-1">Fitur yang dipersonalisasi untuk target Anda</p>
      </header>

      {/* Feature Cards */}
      {activeFeatures.length > 0 ? (
        <div className="space-y-3 mb-8">
          {activeFeatures.map(({ id, subView, Icon, title, desc, iconBg, iconColor, border }) => (
            <button
              key={id}
              onClick={() => onSubViewChange(subView)}
              className={`w-full text-left p-4 rounded-3xl bg-white border ${border} shadow-sm transition-all active:scale-[0.98] hover:shadow-md`}
            >
              <div className="flex items-center gap-4">
                {/* Icon Box */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: iconBg }}
                >
                  <Icon size={20} style={{ color: iconColor }} strokeWidth={2} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-[800] text-[#253532] mb-0.5">{title}</h3>
                  <p className="text-[12px] text-[#5f6f69] leading-snug">{desc}</p>
                </div>

                <ChevronRight size={18} className="text-[#c4cdc8] shrink-0" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-14">
          <div className="w-16 h-16 rounded-2xl bg-[#f0f9f7] border border-[#d4e8e4] flex items-center justify-center mx-auto mb-4">
            <Stethoscope size={24} className="text-[#1f6e64]" />
          </div>
          <p className="text-[14px] font-[700] text-[#253532] mb-1">Belum ada fitur aktif</p>
          <p className="text-[12px] text-[#5f6f69] mb-5">Tambahkan target kesehatan untuk mengaktifkan fitur yang relevan.</p>
          <button
            onClick={() => onTabChange('profile')}
            className="px-5 py-2.5 rounded-2xl bg-[#1f6e64] text-white text-[13px] font-[800] border-0 transition-all active:scale-95"
          >
            Edit Target Kesehatan
          </button>
        </div>
      )}

      {/* Tips Section */}
      <section className="pt-6 border-t border-[#e6f2ec]">
        <h2 className="text-[12px] font-[850] text-[#253532] uppercase tracking-widest mb-4">Tips Hari Ini</h2>
        <div className="space-y-3">
          {DAILY_TIPS.map(({ Icon, title, body }) => (
            <div key={title} className="flex items-start gap-3 p-4 rounded-2xl bg-[#f0f9f7] border border-[#d4e8e4]">
              <div className="w-8 h-8 rounded-xl bg-[#1f6e64]/10 flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={15} className="text-[#1f6e64]" />
              </div>
              <div>
                <p className="text-[12px] font-[800] text-[#1f6e64] mb-0.5">{title}</p>
                <p className="text-[12px] text-[#253532] leading-snug">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
