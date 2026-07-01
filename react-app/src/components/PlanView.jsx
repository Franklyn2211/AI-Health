import { useState } from 'react';

export default function PlanView({ onTabChange }) {
  const [activeGoal, setActiveGoal] = useState('protein');
  const [pantryInputValue, setPantryInputValue] = useState('');
  const [pantryItems, setPantryItems] = useState([
    { name: 'Chicken breast', amount: '420g' },
    { name: 'Eggs', amount: '3 pcs' },
    { name: 'Tofu', amount: '300g' },
    { name: 'Rice', amount: '1.2kg' },
    { name: 'Broccoli', amount: '250g' },
    { name: 'Carrots', amount: '180g' },
    { name: 'Spinach', amount: '120g' }
  ]);

  const meals = [
    { label: 'Breakfast', title: 'Egg banana toast',      meta: '410 kcal · 24g protein' },
    { label: 'Lunch',     title: 'Chicken rice bowl',     meta: '612 kcal · 42g protein' },
    { label: 'Dinner',    title: 'Tofu veggie stir fry',  meta: '520 kcal · 31g protein' },
  ];

  const menuSuggestions = [
    { label: 'Lunch', title: 'Chicken broccoli rice bowl', desc: 'Uses chicken, rice, broccoli, carrots. Add lemon if available.', cals: '612 kcal' },
    { label: 'Dinner', title: 'Tofu spinach stir fry', desc: 'Uses tofu, spinach, rice. Iron-friendly and low cost.', cals: '520 kcal' },
    { label: 'Breakfast', title: 'Egg rice breakfast bowl', desc: 'Uses eggs, rice, carrots. Fast option before work.', cals: '410 kcal' }
  ];

  const groceryItems = [
    { name: 'Lemon or orange', detail: 'helps iron absorption' },
    { name: 'Spinach',         detail: '2 servings' },
    { name: 'Greek yogurt',    detail: 'snack option' },
  ];

  const handleAddPantry = (e) => {
    e.preventDefault();
    const item = pantryInputValue.trim();
    if (!item) return;

    const parts = item.match(/^(.*?)(\s+\d+.*)$/);
    const name = parts ? parts[1].trim() : item;
    const amount = parts ? parts[2].trim() : "new";

    setPantryItems(prev => [...prev, { name, amount }]);
    setPantryInputValue("");
  };

  return (
    <div
      id="plan"
      className="screen-scroll h-full overflow-y-auto px-[24px] pt-[24px] pb-[100px]"
    >
      <header className="flex justify-between items-center gap-[16px] mb-[24px]">
        <div>
          <p className="m-0 mb-[5px] uppercase text-[11px] leading-[1.15] text-[#61716c] font-[850] tracking-[0]">
            AI meal planner
          </p>
          <h1 className="text-[24px] leading-[1.05] font-[800]">Plan from what you have</h1>
        </div>
        <button
          onClick={() => onTabChange('scan')}
          className="min-w-[48px] min-h-[48px] px-[16px] rounded-[24px] bg-[#eaf0ec] text-[#25453e] text-[13px] font-[800] border-0 transition-all duration-300 ease-in-out active:scale-95"
        >
          Scan
        </button>
      </header>

      {/* Pantry Card */}
      <section className="mt-6 rounded-3xl p-6 flex flex-col gap-4 bg-[#fff2d7] shadow-lg shadow-[#e39b45]/10 border-0 transition-all duration-300 ease-in-out hover:scale-[1.01]">
        <div>
          <p className="m-0 mb-[5px] uppercase text-[11px] leading-[1.15] text-[#61716c] font-[850] tracking-[0]">
            Home ingredients
          </p>
          <h2 className="text-[18px] leading-[1.16] font-[800] mb-[6px]">Scan or list raw items you already have</h2>
          <p className="text-[#5f6f69] text-[13px] leading-[1.38]">
            AI turns your pantry into menus that match your goal, budget, and nutrition needs.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button className="min-h-[44px] rounded-2xl bg-[#1f6e64] text-white font-[900] text-[13px] border-0 shadow-lg shadow-[#1f6e64]/30 transition-all duration-300 ease-in-out active:scale-95" id="addPantryItem">
            Add item
          </button>
          <button className="min-h-[44px] rounded-2xl bg-white text-[#25453e] font-[800] text-[13px] border-0 shadow-lg shadow-black/5 transition-all duration-300 ease-in-out active:scale-95">
            Scan raw items
          </button>
        </div>
      </section>

      {/* Available at home */}
      <section className="mt-8">
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="text-[18px] leading-[1.16] font-[800]">Available at home</h2>
          <span className="text-[#7a8a84] text-[12px] font-[800]">{pantryItems.length} items</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {pantryItems.map((item, i) => (
            <article key={i} className="flex justify-between items-center gap-2 rounded-2xl p-3 bg-white shadow-lg shadow-black/5 border-0 transition-all duration-300 ease-in-out hover:scale-[1.02]">
              <span className="text-[#253532] text-[12px] font-[850] truncate">{item.name}</span>
              <strong className="text-[#2c7a70] text-[12px] shrink-0">{item.amount}</strong>
            </article>
          ))}
        </div>
        <form className="grid grid-cols-[1fr_64px] gap-2 mt-3" onSubmit={handleAddPantry}>
          <input
            type="text"
            value={pantryInputValue}
            onChange={(e) => setPantryInputValue(e.target.value)}
            aria-label="Add raw ingredient"
            placeholder="Add raw item, e.g. salmon 250g"
            className="min-h-[48px] rounded-2xl bg-white text-[#17231f] px-[16px] outline-none shadow-lg shadow-black/5 border-0 focus:shadow-md focus:shadow-[#2c7a70]/20 transition-all duration-300"
          />
          <button type="submit" className="min-h-[48px] rounded-2xl bg-[#1f6e64] text-white font-[900] text-[12px] border-0 shadow-lg shadow-[#1f6e64]/30 transition-all duration-300 ease-in-out active:scale-95">Add</button>
        </form>
      </section>

      {/* Menu goal selector */}
      <section className="mt-8">
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="text-[18px] leading-[1.16] font-[800]">Menu goal</h2>
          <span className="text-[#7a8a84] text-[12px] font-[800]">Tap to switch</span>
        </div>
        <div className="grid grid-cols-2 gap-2" aria-label="Meal planner goals">
          {[
            { id: 'protein', label: 'High protein' },
            { id: 'weight', label: 'Weight loss' },
            { id: 'iron', label: 'Iron support' },
            { id: 'budget', label: 'Budget meals' }
          ].map(goal => (
            <button
              key={goal.id}
              className={`min-h-[48px] rounded-2xl text-[12px] font-[850] border-0 transition-all duration-300 ease-in-out active:scale-95 ${
                activeGoal === goal.id 
                  ? 'bg-[#1f6e64] text-white shadow-lg shadow-[#1f6e64]/30' 
                  : 'bg-white text-[#28514a] shadow-lg shadow-black/5'
              }`}
              onClick={() => setActiveGoal(goal.id)}
            >
              {goal.label}
            </button>
          ))}
        </div>
      </section>

      {/* Goal Card */}
      <section className="rounded-3xl p-6 flex items-start gap-4 justify-between bg-[#e6f2ec] mt-6 shadow-lg shadow-[#1f6e64]/5 transition-all duration-300 ease-in-out hover:scale-[1.01]">
        <div>
          <p className="m-0 mb-[5px] uppercase text-[11px] leading-[1.15] text-[#61716c] font-[850] tracking-[0]">
            Goal
          </p>
          <h2 className="text-[18px] leading-[1.16] font-[800] max-w-[250px]">
            High-protein, iron-aware, budget friendly
          </h2>
        </div>
        <button className="min-w-[48px] min-h-[48px] px-[16px] rounded-[24px] bg-white text-[#25453e] text-[13px] font-[800] border-0 shadow-lg shadow-black/5 transition-all duration-300 ease-in-out active:scale-95">
          Edit
        </button>
      </section>

      {/* Meal Grid */}
      <section className="grid grid-cols-1 gap-3 my-6">
        {meals.map(({ label, title, meta }) => (
          <article
            key={label}
            className="bg-white rounded-2xl p-5 border-l-[6px] border-l-[#e39b45] shadow-lg shadow-black/5 transition-all duration-300 ease-in-out hover:scale-[1.02]"
          >
            <span className="text-[#6e7e78] font-[850] text-[12px] block mb-[4px]">{label}</span>
            <h3 className="text-[15px] leading-[1.2] font-[700]">{title}</h3>
            <p className="text-[#5f6f69] text-[13px] leading-[1.38] mt-[2px]">{meta}</p>
          </article>
        ))}
      </section>

      {/* AI menu suggestions */}
      <section className="mt-8">
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="text-[18px] leading-[1.16] font-[800]">AI menu suggestions</h2>
          <span className="text-[#7a8a84] text-[12px] font-[800]">From pantry</span>
        </div>
        <div className="grid gap-3">
          {menuSuggestions.map(({ label, title, desc, cals }, i) => (
            <article key={i} className="grid grid-cols-[1fr_74px] gap-3 items-center bg-white rounded-2xl p-5 border-l-[6px] border-l-[#2c7a70] shadow-lg shadow-black/5 transition-all duration-300 ease-in-out hover:scale-[1.02]">
              <div className="min-w-0">
                <span className="text-[#6e7e78] font-[850] text-[12px] block mb-[4px]">{label}</span>
                <h3 className="text-[15px] leading-[1.2] font-[700] mb-[2px]">{title}</h3>
                <p className="text-[#5f6f69] text-[13px] leading-[1.38]">{desc}</p>
              </div>
              <strong className="text-[#e39b45] text-[13px] text-right">{cals}</strong>
            </article>
          ))}
        </div>
      </section>

      {/* Smart Grocery Gaps */}
      <section className="mt-8">
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="text-[18px] leading-[1.16] font-[800]">Smart grocery gaps</h2>
          <span className="text-[#7a8a84] text-[12px] font-[800]">3 items</span>
        </div>
        <ul className="p-0 m-0 list-none bg-white rounded-3xl p-5 shadow-lg shadow-black/5">
          {groceryItems.map(({ name, detail }, i) => (
            <li
              key={name}
              className={[
                'flex justify-between gap-[12px] py-[12px] px-[2px] text-[13px]',
                i < groceryItems.length - 1 ? 'border-b border-[#e4eae6]' : '',
              ].join(' ')}
            >
              <span className="font-medium">{name}</span>
              <strong className="text-[#236a61] text-right">{detail}</strong>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
