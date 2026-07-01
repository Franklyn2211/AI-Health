import { useState } from 'react';

// A single controlled ingredient row with a range slider
function IngredientRow({ name, min, max, defaultValue }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div
      className="grid items-center bg-white border border-[#e2e8e4] rounded-[8px] p-[11px] mb-[8px] text-[13px]"
      style={{ gridTemplateColumns: '96px 1fr 44px', gap: '10px' }}
    >
      <span className="min-w-0 truncate">{name}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => setValue(Number(e.target.value))}
      />
      <strong className="min-w-0 text-right">{value}g</strong>
    </div>
  );
}

export default function ScanView({ onTabChange }) {
  return (
    <div
      id="scan"
      className="screen-scroll h-full overflow-y-auto px-[18px] pt-[16px] pb-[92px]"
    >
      {/* Header */}
      <header className="flex justify-between items-center gap-[16px] mb-[14px]">
        <div>
          <p className="m-0 mb-[5px] uppercase text-[11px] leading-[1.15] text-[#61716c] font-[850] tracking-[0]">
            Food nutrition scanner
          </p>
          <h1 className="text-[24px] leading-[1.05] font-[800]">Scan-to-plan AI</h1>
        </div>
        <button
          onClick={() => onTabChange('home')}
          className="min-w-[44px] min-h-[44px] px-[14px] rounded-[22px] bg-[#eaf0ec] text-[#25453e] text-[13px] font-[800] border-0"
        >
          Done
        </button>
      </header>

      {/* Scanner card with food image and overlay labels */}
      <section className="relative rounded-[8px] overflow-hidden bg-[#dde7df] min-h-[280px]">
        {/* Placeholder food illustration using colored blocks as a demo */}
        <div className="w-full h-[280px] flex items-center justify-center bg-[linear-gradient(135deg,#c8d8c4_0%,#b0c4b0_100%)]">
          <div className="relative w-[200px] h-[200px]">
            {/* Bowl shape */}
            <div className="absolute inset-0 rounded-full bg-[#e8dcc8] border-4 border-[#c4b090] overflow-hidden flex items-end justify-center pb-4">
              {/* Rice */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[120px] h-[60px] rounded-[50%] bg-[#f5f0e0]" />
              {/* Chicken */}
              <div className="absolute top-10 right-8 w-[60px] h-[50px] rounded-[12px] bg-[#c97840] rotate-12" />
              {/* Greens */}
              <div className="absolute top-8 left-6 w-[50px] h-[40px] rounded-full bg-[#5a9e5a]" />
            </div>
          </div>
        </div>
        {/* Scan labels */}
        <div className="absolute right-[30px] top-[84px] px-[10px] py-[8px] rounded-[8px] bg-[#a84f35] text-white font-[900] text-[12px] shadow-[0_10px_24px_rgba(0,0,0,0.22)]">
          Chicken 120g
        </div>
        <div className="absolute left-[30px] top-[122px] px-[10px] py-[8px] rounded-[8px] bg-[#b88b28] text-white font-[900] text-[12px] shadow-[0_10px_24px_rgba(0,0,0,0.22)]">
          Rice 180g
        </div>
        <div className="absolute right-[52px] bottom-[72px] px-[10px] py-[8px] rounded-[8px] bg-[#347c4d] text-white font-[900] text-[12px] shadow-[0_10px_24px_rgba(0,0,0,0.22)]">
          Greens 90g
        </div>
      </section>

      {/* Nutrition Summary */}
      <section className="grid grid-cols-4 gap-[8px] my-[12px]">
        {[
          { value: '612', unit: 'kcal' },
          { value: '42g', unit: 'protein' },
          { value: '67g', unit: 'carbs' },
          { value: '18g', unit: 'fat' },
        ].map(({ value, unit }) => (
          <div
            key={unit}
            className="bg-white border border-[#e2e8e4] rounded-[8px] py-[11px] px-[6px] text-center"
          >
            <strong className="block text-[#1f6e64] text-[17px] font-[800]">{value}</strong>
            <span className="text-[#6b7a75] text-[11px] font-[800]">{unit}</span>
          </div>
        ))}
      </section>

      {/* Detected items */}
      <section className="mt-[16px]">
        <div className="flex justify-between items-baseline mb-[10px]">
          <h2 className="text-[18px] leading-[1.16] font-[800]">Detected items</h2>
          <span className="text-[#7a8a84] text-[12px] font-[800]">Confirm weights</span>
        </div>
        <IngredientRow name="Chicken breast"  min={60}  max={240} defaultValue={120} />
        <IngredientRow name="Cooked rice"     min={80}  max={320} defaultValue={180} />
        <IngredientRow name="Broccoli & greens" min={40} max={200} defaultValue={90} />
      </section>

      {/* CTA */}
      <button
        onClick={() => onTabChange('plan')}
        className="w-full min-h-[50px] border-0 rounded-[8px] bg-[#1f6e64] text-white font-[900] mt-[14px] hover:bg-[#196059] transition-colors"
      >
        Create meal plan from scan
      </button>
    </div>
  );
}
