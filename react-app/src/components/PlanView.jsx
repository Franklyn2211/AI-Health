export default function PlanView({ onTabChange }) {
  const meals = [
    { label: 'Breakfast', title: 'Egg banana toast',      meta: '410 kcal · 24g protein' },
    { label: 'Lunch',     title: 'Chicken rice bowl',     meta: '612 kcal · 42g protein' },
    { label: 'Dinner',    title: 'Tofu veggie stir fry',  meta: '520 kcal · 31g protein' },
  ];

  const groceryItems = [
    { name: 'Lemon or orange', detail: 'helps iron absorption' },
    { name: 'Spinach',         detail: '2 servings' },
    { name: 'Greek yogurt',    detail: 'snack option' },
  ];

  return (
    <div
      id="plan"
      className="screen-scroll h-full overflow-y-auto px-[18px] pt-[16px] pb-[92px]"
    >
      {/* Header */}
      <header className="flex justify-between items-center gap-[16px] mb-[14px]">
        <div>
          <p className="m-0 mb-[5px] uppercase text-[11px] leading-[1.15] text-[#61716c] font-[850] tracking-[0]">
            AI meal planner
          </p>
          <h1 className="text-[24px] leading-[1.05] font-[800]">Plan from what you have</h1>
        </div>
        <button
          onClick={() => onTabChange('scan')}
          className="min-w-[44px] min-h-[44px] px-[14px] rounded-[22px] bg-[#eaf0ec] text-[#25453e] text-[13px] font-[800] border-0"
        >
          Scan
        </button>
      </header>

      {/* Goal Card */}
      <section className="rounded-[8px] p-[18px] flex items-start gap-[16px] justify-between bg-[#e6f2ec]">
        <div>
          <p className="m-0 mb-[5px] uppercase text-[11px] leading-[1.15] text-[#61716c] font-[850] tracking-[0]">
            Goal
          </p>
          <h2 className="text-[18px] leading-[1.16] font-[800] max-w-[250px]">
            High-protein, iron-aware, budget friendly
          </h2>
        </div>
        <button className="min-w-[44px] min-h-[44px] px-[14px] rounded-[22px] bg-[#eaf0ec] text-[#25453e] text-[13px] font-[800] border-0">
          Edit
        </button>
      </section>

      {/* Meal Grid */}
      <section className="grid grid-cols-1 gap-[9px] my-[14px]">
        {meals.map(({ label, title, meta }) => (
          <article
            key={label}
            className="bg-white border border-[#e2e8e4] rounded-[8px] p-[14px] border-l-[5px] border-l-[#e39b45]"
            style={{ borderLeftWidth: '5px', borderLeftColor: '#e39b45' }}
          >
            <span className="text-[#6e7e78] font-[850] text-[12px] block mb-[4px]">{label}</span>
            <h3 className="text-[15px] leading-[1.2] font-[700]">{title}</h3>
            <p className="text-[#5f6f69] text-[13px] leading-[1.38] mt-[2px]">{meta}</p>
          </article>
        ))}
      </section>

      {/* Smart Grocery Gaps */}
      <section className="mt-[16px]">
        <div className="flex justify-between items-baseline mb-[10px]">
          <h2 className="text-[18px] leading-[1.16] font-[800]">Smart grocery gaps</h2>
          <span className="text-[#7a8a84] text-[12px] font-[800]">3 items</span>
        </div>
        <ul className="p-0 m-0 list-none">
          {groceryItems.map(({ name, detail }, i) => (
            <li
              key={name}
              className={[
                'flex justify-between gap-[12px] py-[12px] px-[2px] text-[13px]',
                i < groceryItems.length - 1 ? 'border-b border-[#e4eae6]' : '',
              ].join(' ')}
            >
              <span>{name}</span>
              <strong className="text-[#236a61] text-right">{detail}</strong>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
