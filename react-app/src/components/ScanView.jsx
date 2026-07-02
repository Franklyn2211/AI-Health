import { useState } from 'react';

function IngredientRow({ name, min, max, defaultValue }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div
      className="grid items-center bg-white rounded-2xl p-4 mb-3 text-[13px] shadow-lg shadow-black/5 border-0 transition-all duration-300 ease-in-out hover:scale-[1.01]"
      style={{ gridTemplateColumns: '96px 1fr 44px', gap: '10px' }}
    >
      <span className="min-w-0 truncate font-medium">{name}</span>
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

function NutritionMeter({ label, value, percent, colorClass = "" }) {
  return (
    <article className="min-w-0 bg-white rounded-2xl p-4 shadow-lg shadow-black/5 border-0 transition-all duration-300 ease-in-out hover:scale-[1.02]">
      <span className="block text-[#697872] text-[12px] font-[850]">{label}</span>
      <strong className="block my-[4px] mb-[9px] text-[#17231f] text-[17px]">{value}</strong>
      <div className={`nutrition-meter ${colorClass}`}>
        <span style={{ width: `${percent}%` }} />
      </div>
    </article>
  );
}

export default function ScanView({ onTabChange }) {
  return (
    <div
      id="scan"
      className="screen-scroll h-full overflow-y-auto px-[24px] pt-[24px] pb-[100px]"
    >
      {/* Header */}
      <header className="flex justify-between items-center gap-[16px] mb-[24px]">
        <div>
          <p className="m-0 mb-[5px] uppercase text-[11px] leading-[1.15] text-[#61716c] font-[850] tracking-[0]">
            Food nutrition scanner
          </p>
          <h1 className="text-[24px] leading-[1.05] font-[800]">Scan-to-plan AI</h1>
        </div>
        <button
          onClick={() => onTabChange('home')}
          className="min-w-[48px] min-h-[48px] px-[16px] rounded-[24px] bg-[#eaf0ec] text-[#25453e] text-[13px] font-[800] border-0 transition-all duration-300 ease-in-out active:scale-95"
        >
          Done
        </button>
      </header>

      {/* Scanner card with food image and overlay labels */}
      <section className="relative rounded-3xl overflow-hidden bg-[#dde7df] min-h-[280px] shadow-lg shadow-black/10 transition-all duration-300 ease-in-out hover:scale-[1.01]">
        <div className="w-full h-[280px] flex items-center justify-center bg-[linear-gradient(135deg,#c8d8c4_0%,#b0c4b0_100%)]">
          <div className="relative w-[200px] h-[200px]">
            <div className="absolute inset-0 rounded-full bg-[#e8dcc8] border-4 border-[#c4b090] overflow-hidden flex items-end justify-center pb-4">
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[120px] h-[60px] rounded-[50%] bg-[#f5f0e0]" />
              <div className="absolute top-10 right-8 w-[60px] h-[50px] rounded-[12px] bg-[#c97840] rotate-12" />
              <div className="absolute top-8 left-6 w-[50px] h-[40px] rounded-full bg-[#5a9e5a]" />
            </div>
          </div>
        </div>
        <div className="absolute right-[30px] top-[84px] px-[12px] py-[10px] rounded-[12px] bg-[#a84f35] text-white font-[900] text-[12px] shadow-lg shadow-[#a84f35]/30">
          Chicken 120g
        </div>
        <div className="absolute left-[30px] top-[122px] px-[12px] py-[10px] rounded-[12px] bg-[#b88b28] text-white font-[900] text-[12px] shadow-lg shadow-[#b88b28]/30">
          Rice 180g
        </div>
        <div className="absolute right-[52px] bottom-[72px] px-[12px] py-[10px] rounded-[12px] bg-[#347c4d] text-white font-[900] text-[12px] shadow-lg shadow-[#347c4d]/30">
          Greens 90g
        </div>
      </section>

      {/* Nutrition Summary */}
      <section className="grid grid-cols-4 gap-3 my-6">
        {[
          { value: '612', unit: 'kcal' },
          { value: '42g', unit: 'protein' },
          { value: '67g', unit: 'carbs' },
          { value: '18g', unit: 'fat' },
        ].map(({ value, unit }) => (
          <div
            key={unit}
            className="bg-white rounded-2xl p-3 text-center shadow-lg shadow-black/5 border-0 transition-all duration-300 ease-in-out hover:-translate-y-1"
          >
            <strong className="block text-[#1f6e64] text-[17px] font-[800]">{value}</strong>
            <span className="text-[#6b7a75] text-[11px] font-[800]">{unit}</span>
          </div>
        ))}
      </section>

      {/* Detected items */}
      <section className="mt-6">
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="text-[18px] leading-[1.16] font-[800]">Detected items</h2>
          <span className="text-[#7a8a84] text-[12px] font-[800]">Confirm weights</span>
        </div>
        <IngredientRow name="Chicken breast"  min={60}  max={240} defaultValue={120} />
        <IngredientRow name="Cooked rice"     min={80}  max={320} defaultValue={180} />
        <IngredientRow name="Broccoli & greens" min={40} max={200} defaultValue={90} />
      </section>

      {/* Nutrition list (Detailed) */}
      <section className="mt-6">
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="text-[18px] leading-[1.16] font-[800]">Nutrition list</h2>
          <span className="text-[#7a8a84] text-[12px] font-[800]">From scan</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <NutritionMeter label="Fiber" value="8g" percent={42} />
          <NutritionMeter label="Sugar" value="6g" percent={24} colorClass="amber" />
          <NutritionMeter label="Sodium" value="640mg" percent={58} colorClass="red" />
          <NutritionMeter label="Iron" value="3.2mg" percent={35} />
          <NutritionMeter label="Vitamin C" value="41mg" percent={62} />
          <NutritionMeter label="Potassium" value="720mg" percent={51} />
        </div>
      </section>

      {/* CTA */}
      <button
        onClick={() => onTabChange('plan')}
        className="w-full min-h-[56px] border-0 rounded-2xl bg-[#1f6e64] text-white font-[900] mt-6 hover:bg-[#196059] shadow-lg shadow-[#1f6e64]/30 transition-all duration-300 ease-in-out active:scale-95"
      >
        Create meal plan from scan
      </button>
    </div>
  );
}
