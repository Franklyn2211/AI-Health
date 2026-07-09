import { useState } from 'react';

const goalProfiles = {
  'lose-weight': {
    label: 'Lose Weight',
    summary: 'Workout + meal plan + hydration + weekly review.',
    questions: ['Age', 'Height', 'Weight', 'Target weight', 'Daily activity', 'Disease history', 'Food preferences', 'Gym access'],
    outputs: [
      { label: 'Workout Plan', detail: '3 strength + 2 light cardio sessions weekly' },
      { label: 'Meal Plan', detail: 'High-protein, calorie-aware meals with simple prep' },
      { label: 'Water Intake', detail: '2.2L target with hydration reminder' },
      { label: 'Sleep Target', detail: '7.5 hours with wind-down routine' },
      { label: 'Weekly Goal', detail: '1-2kg healthy progress pace' },
    ],
    meals: [
      { label: 'Breakfast', title: 'Egg banana toast', meta: '410 kcal · 24g protein' },
      { label: 'Lunch', title: 'Chicken rice bowl', meta: '612 kcal · 42g protein' },
      { label: 'Dinner', title: 'Tofu veggie stir fry', meta: '520 kcal · 31g protein' },
    ],
    suggestions: [
      { label: 'Lunch', title: 'Chicken broccoli rice bowl', desc: 'Uses chicken, rice, broccoli, carrots. Add lemon if available.', cals: '612 kcal' },
      { label: 'Dinner', title: 'Tofu spinach stir fry', desc: 'Uses tofu, spinach, rice. Iron-friendly and low cost.', cals: '520 kcal' },
      { label: 'Breakfast', title: 'Egg rice breakfast bowl', desc: 'Uses eggs, rice, carrots. Fast option before work.', cals: '410 kcal' },
    ],
    groceryItems: [
      { name: 'Lemon or orange', detail: 'helps iron absorption' },
      { name: 'Spinach', detail: '2 servings' },
      { name: 'Greek yogurt', detail: 'snack option' },
    ],
  },
  'build-muscle': {
    label: 'Build Muscle',
    summary: 'Progressive overload + protein-rich meals + recovery guidance.',
    questions: ['Training experience', 'Gym access', 'Protein target', 'Sleep habit', 'Food preference'],
    outputs: [
      { label: 'Workout Plan', detail: 'Upper/lower split with progressive overload' },
      { label: 'Meal Plan', detail: 'Protein-first meals with snack support' },
      { label: 'Water Intake', detail: '2.5L target and electrolytes if needed' },
      { label: 'Sleep Target', detail: '8 hours recovery target' },
      { label: 'Weekly Goal', detail: 'Increase load or reps slowly' },
    ],
    meals: [
      { label: 'Breakfast', title: 'Greek yogurt bowl', meta: '350 kcal · 30g protein' },
      { label: 'Lunch', title: 'Chicken pasta plate', meta: '690 kcal · 48g protein' },
      { label: 'Dinner', title: 'Salmon rice bowl', meta: '610 kcal · 38g protein' },
    ],
    suggestions: [
      { label: 'Lunch', title: 'Turkey quinoa bowl', desc: 'High protein and easy to batch prep.', cals: '650 kcal' },
      { label: 'Dinner', title: 'Salmon sweet potato plate', desc: 'Good protein and recovery support.', cals: '620 kcal' },
      { label: 'Breakfast', title: 'Oats with whey', desc: 'Fast breakfast before training.', cals: '380 kcal' },
    ],
    groceryItems: [
      { name: 'Chicken breast', detail: '2 packs' },
      { name: 'Greek yogurt', detail: 'daily protein' },
      { name: 'Sweet potato', detail: 'recovery carb' },
    ],
  },
  'sleep-better': {
    label: 'Sleep Better',
    summary: 'Sleep analysis + bedtime reminders + easier recovery habits.',
    questions: ['Bedtime', 'Wake time', 'Screen hours', 'Stress level', 'Sleep disturbance'],
    outputs: [
      { label: 'Sleep Analysis', detail: 'Review your bedtime, wake time, and interruptions' },
      { label: 'Sleep Score', detail: 'Track progress every week' },
      { label: 'AI Recommendation', detail: 'Night routine adapted to your schedule' },
      { label: 'Reminder', detail: 'Screen off and lights dim before bed' },
    ],
    meals: [
      { label: 'Evening', title: 'Herbal tea + light snack', meta: '180 kcal · calm digestion' },
      { label: 'Dinner', title: 'Soup + rice bowl', meta: '480 kcal · lighter night meal' },
      { label: 'Breakfast', title: 'Oatmeal with banana', meta: '320 kcal · steady energy' },
    ],
    suggestions: [
      { label: 'Evening', title: 'Tea and stretching', desc: 'Support calm before sleeping.', cals: '120 kcal' },
      { label: 'Dinner', title: 'Light soup bowl', desc: 'Avoid heavy meals late at night.', cals: '420 kcal' },
      { label: 'Breakfast', title: 'Banana oatmeal', desc: 'Easy start to a calmer day.', cals: '310 kcal' },
    ],
    groceryItems: [
      { name: 'Chamomile tea', detail: 'night routine' },
      { name: 'Banana', detail: 'pre-bed snack' },
      { name: 'Oats', detail: 'steady breakfast' },
    ],
  },
};

export default function PlanView({
  onTabChange,
  selectedGoal = 'lose-weight',
  onGoalChange = () => {},
  planTier = 'free',
  onPlanTierChange = () => {},
}) {
  const [activeGoal, setActiveGoal] = useState('protein');
  const [pantryInputValue, setPantryInputValue] = useState('');
  const [pantryItems, setPantryItems] = useState([
    { name: 'Chicken breast', amount: '420g' },
    { name: 'Eggs', amount: '3 pcs' },
    { name: 'Tofu', amount: '300g' },
    { name: 'Rice', amount: '1.2kg' },
    { name: 'Broccoli', amount: '250g' },
    { name: 'Carrots', amount: '180g' },
    { name: 'Spinach', amount: '120g' },
  ]);

  const goalData = goalProfiles[selectedGoal] || goalProfiles['lose-weight'];
  const tierLabel = planTier === 'premium' ? 'Premium' : 'Free';

  const meals = goalData.meals;
  const menuSuggestions = goalData.suggestions;
  const groceryItems = goalData.groceryItems;

  const handleAddPantry = (e) => {
    e.preventDefault();
    const item = pantryInputValue.trim();
    if (!item) return;

    const parts = item.match(/^(.*?)(\s+\d+.*)$/);
    const name = parts ? parts[1].trim() : item;
    const amount = parts ? parts[2].trim() : 'new';

    setPantryItems((prev) => [...prev, { name, amount }]);
    setPantryInputValue('');
  };

  return (
    <div
      id="plan"
      className="screen-scroll h-full overflow-y-auto px-[24px] pt-[24px] pb-[100px]"
    >
      <header className="flex justify-between items-center gap-[16px] mb-[24px]">
        <div>
          <p className="m-0 mb-[5px] uppercase text-[11px] leading-[1.15] text-[#61716c] font-[850] tracking-[0]">
            AI plan assistant
          </p>
          <h1 className="text-[24px] leading-[1.05] font-[800]">{goalData.label} plan</h1>
        </div>
        <button
          onClick={() => onTabChange('scan')}
          className="min-w-[48px] min-h-[48px] px-[16px] rounded-[24px] bg-[#eaf0ec] text-[#25453e] text-[13px] font-[800] border-0 transition-all duration-300 ease-in-out active:scale-95"
        >
          Scan
        </button>
      </header>

      <section className="rounded-3xl bg-[#fff8ea] p-4 shadow-lg shadow-black/5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="m-0 mb-[4px] uppercase text-[10px] leading-[1.15] text-[#61716c] font-[850] tracking-[0]">
              Current goal
            </p>
            <h2 className="text-[16px] leading-[1.16] font-[800]">{goalData.label}</h2>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-[800] text-[#d9893f]">{tierLabel}</span>
        </div>
        <p className="mt-2 text-[13px] leading-[1.38] text-[#5f6f69]">{goalData.summary}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => onGoalChange('lose-weight')}
            className="rounded-full bg-[#1f6e64] px-3 py-1 text-[11px] font-[800] text-white"
          >
            Lose Weight
          </button>
          <button
            onClick={() => onGoalChange('build-muscle')}
            className="rounded-full bg-white px-3 py-1 text-[11px] font-[800] text-[#25453e]"
          >
            Build Muscle
          </button>
          <button
            onClick={() => onGoalChange('sleep-better')}
            className="rounded-full bg-white px-3 py-1 text-[11px] font-[800] text-[#25453e]"
          >
            Sleep Better
          </button>
        </div>
      </section>

      <section className="mt-6 rounded-3xl p-6 flex flex-col gap-4 bg-[#fff2d7] shadow-lg shadow-[#e39b45]/10 border-0 transition-all duration-300 ease-in-out hover:scale-[1.01]">
        <div>
          <p className="m-0 mb-[5px] uppercase text-[11px] leading-[1.15] text-[#61716c] font-[850] tracking-[0]">
            Onboarding detail
          </p>
          <h2 className="text-[18px] leading-[1.16] font-[800] mb-[6px]">AI will ask these inputs first</h2>
          <ul className="m-0 list-none p-0 text-[13px] leading-[1.4] text-[#5f6f69]">
            {goalData.questions.map((item) => (
              <li key={item} className="mt-1">• {item}</li>
            ))}
          </ul>
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

      <section className="mt-8">
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="text-[18px] leading-[1.16] font-[800]">Plan output</h2>
          <span className="text-[#7a8a84] text-[12px] font-[800]">AI-generated</span>
        </div>
        <div className="grid grid-cols-2 gap-2" aria-label="Meal planner goals">
          {[
            { id: 'protein', label: 'Workout plan' },
            { id: 'weight', label: 'Meal plan' },
            { id: 'iron', label: 'Sleep target' },
            { id: 'budget', label: 'Reminder' },
          ].map((goal) => (
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
        <div className="mt-3 rounded-3xl bg-[#e6f2ec] p-4 shadow-lg shadow-[#1f6e64]/5">
          <p className="m-0 mb-[5px] uppercase text-[10px] leading-[1.15] text-[#61716c] font-[850] tracking-[0]">
            Suggested output
          </p>
          <h3 className="text-[15px] leading-[1.2] font-[700]">
            {activeGoal === 'weight' ? 'Meal plan' : activeGoal === 'iron' ? 'Sleep target' : activeGoal === 'budget' ? 'Reminder' : 'Workout plan'}
          </h3>
          <p className="mt-2 text-[13px] leading-[1.38] text-[#5f6f69]">
            {activeGoal === 'weight'
              ? 'A nutrition plan that fits your goal, budget, and pantry.'
              : activeGoal === 'iron'
                ? 'A recovery-focused bedtime and wake-up plan to improve rest.'
                : activeGoal === 'budget'
                  ? 'Timed reminders for movement, meal prep, and progress check-in.'
                  : 'A personalized workout schedule based on your available time and equipment.'}
          </p>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="text-[18px] leading-[1.16] font-[800]">AI meal suggestions</h2>
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
