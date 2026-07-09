import { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { ArrowLeft, Camera, Plus, X, ChefHat, Sparkles, Clock, Flame, Utensils, Coffee, Sun, Moon, Apple, CalendarDays } from 'lucide-react';

/* ─── Mock Data for Daily Meal Schedule ──────────────────────── */
const MEAL_PLANS = {
  'pregnancy': {
    dailyCal: 2200,
    meals: {
      breakfast: {
        title: 'Sarapan Tinggi Asam Folat',
        time: '07:30',
        foods: [{ name: 'Oatmeal + Pisang + Bayam', cal: 350, prot: 12, carbs: 55, fat: 8 }],
      },
      lunch: {
        title: 'Makan Siang Kaya Zat Besi',
        time: '12:30',
        foods: [{ name: 'Nasi Merah + Hati Ayam + Brokoli', cal: 550, prot: 35, carbs: 60, fat: 15 }],
      },
      dinner: {
        title: 'Makan Malam Ringan',
        time: '19:00',
        foods: [{ name: 'Ikan Salmon Panggang + Kentang', cal: 450, prot: 40, carbs: 30, fat: 18 }],
      },
      snack: {
        title: 'Camilan Sehat',
        time: '15:30',
        foods: [{ name: 'Yogurt + Kacang Almond', cal: 200, prot: 10, carbs: 15, fat: 12 }],
      },
    },
  },
  'build-muscle': {
    dailyCal: 2800,
    meals: {
      breakfast: {
        title: 'Sarapan Padat Protein',
        time: '07:00',
        foods: [{ name: 'Telur Orak-Arik (4 butir) + Roti Gandum', cal: 450, prot: 32, carbs: 35, fat: 20 }],
      },
      lunch: {
        title: 'Makan Siang Post-Workout',
        time: '13:00',
        foods: [{ name: 'Dada Ayam (200g) + Nasi Putih', cal: 600, prot: 55, carbs: 70, fat: 8 }],
      },
      dinner: {
        title: 'Makan Malam Pemulihan',
        time: '19:30',
        foods: [{ name: 'Daging Sapi Tanpa Lemak + Pasta', cal: 700, prot: 45, carbs: 80, fat: 15 }],
      },
      snack: {
        title: 'Camilan Tinggi Protein',
        time: '16:00',
        foods: [{ name: 'Protein Shake + Pisang', cal: 300, prot: 25, carbs: 40, fat: 2 }],
      },
    },
  },
  'lose-weight': {
    dailyCal: 1500,
    meals: {
      breakfast: {
        title: 'Sarapan Rendah Kalori',
        time: '08:00',
        foods: [{ name: 'Smoothie Hijau (Bayam, Apel, Chia)', cal: 200, prot: 5, carbs: 30, fat: 6 }],
      },
      lunch: {
        title: 'Makan Siang Mengenyangkan',
        time: '12:30',
        foods: [{ name: 'Salad Dada Ayam Rebus + Minyak Zaitun', cal: 350, prot: 30, carbs: 15, fat: 18 }],
      },
      dinner: {
        title: 'Makan Malam Ringan',
        time: '18:30',
        foods: [{ name: 'Sup Bening Sayuran + Tahu', cal: 250, prot: 15, carbs: 20, fat: 10 }],
      },
      snack: {
        title: 'Camilan Sehat',
        time: '15:00',
        foods: [{ name: 'Apel / Pir Segar', cal: 80, prot: 1, carbs: 20, fat: 0 }],
      },
    },
  },
  'default': {
    dailyCal: 2000,
    meals: {
      breakfast: {
        title: 'Sarapan Seimbang',
        time: '07:30',
        foods: [{ name: 'Roti Gandum + Telur Dadar', cal: 300, prot: 15, carbs: 30, fat: 12 }],
      },
      lunch: {
        title: 'Makan Siang Penuh Energi',
        time: '12:30',
        foods: [{ name: 'Nasi + Ikan + Sayur Sop', cal: 500, prot: 28, carbs: 60, fat: 12 }],
      },
      dinner: {
        title: 'Makan Malam Sehat',
        time: '19:00',
        foods: [{ name: 'Ayam Panggang + Salad', cal: 450, prot: 35, carbs: 20, fat: 15 }],
      },
      snack: {
        title: 'Camilan',
        time: '15:30',
        foods: [{ name: 'Buah Segar', cal: 150, prot: 2, carbs: 35, fat: 1 }],
      },
    },
  },
};

const MEAL_ORDER = ['breakfast', 'snack', 'lunch', 'dinner'];
const MEAL_ICONS = { 
  breakfast: <Coffee size={18} />, 
  snack: <Apple size={18} />, 
  lunch: <Sun size={18} />, 
  dinner: <Moon size={18} /> 
};

export default function MealPlannerView({ onBack }) {
  const { userProfile } = useHealth();
  
  // Tab State: 'schedule' or 'scanner'
  const [activeTab, setActiveTab] = useState('schedule');

  // Daily Schedule State
  const goals = userProfile.goals || [];
  const getPlan = () => {
    if (goals.includes('pregnancy')) return MEAL_PLANS['pregnancy'];
    if (goals.includes('build-muscle')) return MEAL_PLANS['build-muscle'];
    if (goals.includes('lose-weight')) return MEAL_PLANS['lose-weight'];
    return MEAL_PLANS['default'];
  };
  const plan = getPlan();

  // Scanner State
  const [ingredients, setIngredients] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [scanning, setScanning] = useState(false);
  const [recipes, setRecipes] = useState([]);

  // Mock recipe database generator
  const generateRecipes = (ingList) => {
    const isPregnancy = goals.includes('pregnancy');
    const isMuscle = goals.includes('build-muscle');
    return [
      {
        id: 1,
        name: isMuscle ? 'Dada Ayam Panggang Protein' : 'Tumis Sehat Rumahan',
        match: '90%',
        time: '20 mnt',
        cal: isMuscle ? 450 : 320,
        missing: ['Bawang Putih'],
        tags: [isPregnancy ? 'Asam Folat' : 'Tinggi Protein', 'Rendah Gula'],
      },
      {
        id: 2,
        name: 'Sup Bening Praktis',
        match: '75%',
        time: '15 mnt',
        cal: 180,
        missing: ['Kaldu Jamur', 'Seledri'],
        tags: ['Cepat', 'Rendah Kalori'],
      }
    ];
  };

  const handleAddIng = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const newIng = [...ingredients, inputVal.trim()];
    setIngredients(newIng);
    setInputVal('');
    setRecipes(generateRecipes(newIng));
  };

  const removeIngredient = (idx) => {
    const newIng = ingredients.filter((_, i) => i !== idx);
    setIngredients(newIng);
    if (newIng.length === 0) setRecipes([]);
    else setRecipes(generateRecipes(newIng));
  };

  const simulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      const detected = ['Telur', 'Bayam', 'Ayam', 'Tomat'];
      setIngredients(detected);
      setRecipes(generateRecipes(detected));
      setScanning(false);
    }, 1500);
  };

  return (
    <div className="screen-scroll h-full overflow-y-auto px-5 pt-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-[#f0f9f7] border border-[#d4e8e4] flex items-center justify-center text-[#1f6e64] transition-all active:scale-95">
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-[10px] font-[850] text-[#61716c] uppercase tracking-widest">Meal Planner</p>
          <h1 className="text-[20px] font-[800] text-[#253532]">Nutrisi & Resep</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#e6f2ec] rounded-xl p-1 mb-6">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] font-[800] transition-all ${
            activeTab === 'schedule' ? 'bg-white text-[#1f6e64] shadow-sm' : 'text-[#61716c]'
          }`}
        >
          <CalendarDays size={14} /> Jadwal Harian
        </button>
        <button
          onClick={() => setActiveTab('scanner')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] font-[800] transition-all ${
            activeTab === 'scanner' ? 'bg-white text-[#1f6e64] shadow-sm' : 'text-[#61716c]'
          }`}
        >
          <Camera size={14} /> Scan Bahan
        </button>
      </div>

      {activeTab === 'schedule' ? (
        /* ─── TAB 1: DAILY SCHEDULE ────────────────────────── */
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[14px] font-[850] text-[#253532] uppercase">Rekomendasi Hari Ini</h2>
            <div className="text-right">
              <span className="text-[16px] font-[900] text-[#1f6e64]">{plan.dailyCal}</span>
              <span className="text-[10px] font-[800] text-[#61716c] uppercase ml-1">Kcal</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {MEAL_ORDER.map(mealType => {
              const meal = plan.meals[mealType];
              if (!meal) return null;
              
              return (
                <div key={mealType} className="bg-white rounded-2xl p-4 shadow-sm shadow-black/5 border border-[#e6f2ec]">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#f0f9f7] text-[#1f6e64] flex items-center justify-center">
                        {MEAL_ICONS[mealType]}
                      </div>
                      <div>
                        <h3 className="text-[13px] font-[850] text-[#253532] leading-tight">{meal.title}</h3>
                        <p className="text-[11px] font-[700] text-[#1f6e64]">{meal.time}</p>
                      </div>
                    </div>
                  </div>
                  
                  {meal.foods.map((food, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-[13px] font-[700] text-[#253532] leading-snug">{food.name}</p>
                        <span className="text-[12px] font-[800] text-[#1f6e64] shrink-0 bg-[#f0f9f7] px-2 py-0.5 rounded-lg">
                          {food.cal} kcal
                        </span>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                          <span className="text-[10px] font-[700] text-[#61716c] uppercase">P: {food.prot}g</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          <span className="text-[10px] font-[700] text-[#61716c] uppercase">K: {food.carbs}g</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                          <span className="text-[10px] font-[700] text-[#61716c] uppercase">L: {food.fat}g</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ─── TAB 2: INGREDIENT SCANNER ──────────────────────── */
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* AI Scanner Mockup */}
          <div className="relative rounded-3xl overflow-hidden mb-5 border-2 border-[#1f6e64]/10" style={{ height: '160px', background: 'linear-gradient(135deg, #f0f9f7 0%, #e6f2ec 100%)' }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              {scanning ? (
                <>
                  <div className="w-12 h-12 rounded-full border-4 border-[#1f6e64]/30 border-t-[#1f6e64] animate-spin" />
                  <p className="text-[#1f6e64] text-[13px] font-[800]">AI memindai isi kulkas...</p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center">
                    <Camera size={24} className="text-[#1f6e64]" />
                  </div>
                  <p className="text-[#253532] text-[12px] font-[700]">Foto isi kulkas atau bahan makanan Anda</p>
                </>
              )}
            </div>
            {!scanning && (
              <button
                onClick={simulateScan}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[#1f6e64] text-white text-[11px] font-[800] px-3 py-2 rounded-xl shadow-lg transition-all active:scale-95"
              >
                <Sparkles size={14} /> Scan Kulkas
              </button>
            )}
          </div>

          {/* Manual Input */}
          <form onSubmit={handleAddIng} className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ketik bahan (contoh: Ayam, Telur...)"
                className="w-full px-4 py-3.5 rounded-2xl border border-[#e6f2ec] bg-white text-[13px] font-[700] text-[#253532] outline-none focus:border-[#1f6e64] focus:ring-2 focus:ring-[#1f6e64]/20 transition-all"
              />
            </div>
            <button type="submit" disabled={!inputVal.trim()} className="w-[52px] rounded-2xl bg-[#1f6e64] text-white flex items-center justify-center disabled:opacity-50 active:scale-95 transition-all">
              <Plus size={20} />
            </button>
          </form>

          {/* Ingredient Tags */}
          {ingredients.length > 0 && (
            <div className="mb-6">
              <p className="text-[11px] font-[850] text-[#61716c] uppercase mb-2">Bahan Tersedia ({ingredients.length})</p>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ing, i) => (
                  <span key={i} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#e6f2ec] text-[12px] font-[800] text-[#253532] shadow-sm">
                    {ing}
                    <button onClick={() => removeIngredient(i)} className="ml-1 text-[#a0b0ab] hover:text-red-500">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AI Suggested Recipes */}
          {recipes.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <ChefHat size={18} className="text-[#1f6e64]" />
                <h2 className="text-[13px] font-[850] text-[#253532] uppercase">Rekomendasi AI</h2>
              </div>
              <div className="space-y-3">
                {recipes.map(recipe => (
                  <div key={recipe.id} className="rounded-2xl bg-white shadow-sm border border-[#e6f2ec] p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-[15px] font-[800] text-[#253532] pr-2">{recipe.name}</h3>
                      <span className="shrink-0 bg-[#f0f9f7] text-[#1f6e64] text-[10px] font-[900] px-2 py-1 rounded-lg">
                        Cocok {recipe.match}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center gap-1 text-[11px] text-[#61716c] font-[700]">
                        <Clock size={12} /> {recipe.time}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-[#61716c] font-[700]">
                        <Flame size={12} /> {recipe.cal} kcal
                      </span>
                    </div>

                    {recipe.missing.length > 0 && (
                      <div className="mb-3">
                        <p className="text-[10px] font-[700] text-red-500 mb-1 uppercase">Bahan Kurang:</p>
                        <p className="text-[12px] text-[#61716c]">{recipe.missing.join(', ')}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[#f0f4f2]">
                      {recipe.tags.map((tag, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-600 text-[9px] font-[800] px-2 py-0.5 rounded-full uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button className="w-full mt-3 py-2.5 rounded-xl bg-[#1f6e64] text-white text-[12px] font-[800] active:scale-95 transition-all">
                      Lihat Resep
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {ingredients.length === 0 && !scanning && (
            <div className="text-center py-10 opacity-60">
              <Utensils size={48} className="mx-auto mb-3 text-[#1f6e64]" />
              <p className="text-[14px] font-[800] text-[#253532]">Belum ada bahan</p>
              <p className="text-[12px] text-[#61716c]">Scan kulkas atau ketik bahan yang Anda miliki untuk mulai.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
