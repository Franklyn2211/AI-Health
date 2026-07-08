import { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { ArrowLeft, Camera, Plus, X, ChefHat, Sparkles, Clock, Flame, Utensils, Coffee, Sun, Moon, Apple, CalendarDays, CheckCircle } from 'lucide-react';

const MEAL_PLANS = {
  'pregnancy': {
    dailyCal: 2200,
    meals: {
      breakfast: { title: 'Sarapan Tinggi Asam Folat', time: '07:30', foods: [{ name: 'Oatmeal + Pisang + Bayam', cal: 350, prot: 12, carbs: 55, fat: 8 }] },
      lunch: { title: 'Makan Siang Kaya Zat Besi', time: '12:30', foods: [{ name: 'Nasi Merah + Hati Ayam + Brokoli', cal: 550, prot: 35, carbs: 60, fat: 15 }] },
      dinner: { title: 'Makan Malam Ringan', time: '19:00', foods: [{ name: 'Ikan Salmon Panggang + Kentang', cal: 450, prot: 40, carbs: 30, fat: 18 }] },
      snack: { title: 'Camilan Sehat', time: '15:30', foods: [{ name: 'Yogurt + Kacang Almond', cal: 200, prot: 10, carbs: 15, fat: 12 }] },
    },
  },
  'build-muscle': {
    dailyCal: 2800,
    meals: {
      breakfast: { title: 'Sarapan Padat Protein', time: '07:00', foods: [{ name: 'Telur Orak-Arik (4 butir) + Roti Gandum', cal: 450, prot: 32, carbs: 35, fat: 20 }] },
      lunch: { title: 'Makan Siang Post-Workout', time: '13:00', foods: [{ name: 'Dada Ayam (200g) + Nasi Putih', cal: 600, prot: 55, carbs: 70, fat: 8 }] },
      dinner: { title: 'Makan Malam Pemulihan', time: '19:30', foods: [{ name: 'Daging Sapi Tanpa Lemak + Pasta', cal: 700, prot: 45, carbs: 80, fat: 15 }] },
      snack: { title: 'Camilan Tinggi Protein', time: '16:00', foods: [{ name: 'Protein Shake + Pisang', cal: 300, prot: 25, carbs: 40, fat: 2 }] },
    },
  },
  'body-goals': {
    dailyCal: 2000,
    meals: {
      breakfast: { title: 'Sarapan Rendah Kalori', time: '08:00', foods: [{ name: 'Smoothie Hijau (Bayam, Apel, Chia)', cal: 200, prot: 5, carbs: 30, fat: 6 }] },
      lunch: { title: 'Makan Siang Mengenyangkan', time: '12:30', foods: [{ name: 'Salad Dada Ayam Rebus + Minyak Zaitun', cal: 350, prot: 30, carbs: 15, fat: 18 }] },
      dinner: { title: 'Makan Malam Ringan', time: '18:30', foods: [{ name: 'Sup Bening Sayuran + Tahu', cal: 250, prot: 15, carbs: 20, fat: 10 }] },
      snack: { title: 'Camilan Sehat', time: '15:00', foods: [{ name: 'Apel / Pir Segar', cal: 80, prot: 1, carbs: 20, fat: 0 }] },
    },
  },
  'default': {
    dailyCal: 2000,
    meals: {
      breakfast: { title: 'Sarapan Seimbang', time: '07:30', foods: [{ name: 'Roti Gandum + Telur Dadar', cal: 300, prot: 15, carbs: 30, fat: 12 }] },
      lunch: { title: 'Makan Siang Penuh Energi', time: '12:30', foods: [{ name: 'Nasi + Ikan + Sayur Sop', cal: 500, prot: 28, carbs: 60, fat: 12 }] },
      dinner: { title: 'Makan Malam Sehat', time: '19:00', foods: [{ name: 'Ayam Panggang + Salad', cal: 450, prot: 35, carbs: 20, fat: 15 }] },
      snack: { title: 'Camilan', time: '15:30', foods: [{ name: 'Buah Segar', cal: 150, prot: 2, carbs: 35, fat: 1 }] },
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
  const { userProfile, addConsumedCalories } = useHealth();
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedMeal, setSelectedMeal] = useState(null);

  const goals = userProfile.goals || [];
  const getPlan = () => {
    if (goals.includes('pregnancy')) return MEAL_PLANS['pregnancy'];
    if (goals.includes('build-muscle')) return MEAL_PLANS['build-muscle'];
    if (goals.includes('lose-weight') || goals.includes('body-goals')) return MEAL_PLANS['body-goals'];
    return MEAL_PLANS['default'];
  };
  const plan = getPlan();

  const [ingredients, setIngredients] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [scanning, setScanning] = useState(false);
  const [recipes, setRecipes] = useState([]);

  const generateRecipes = (ingList) => {
    const isMuscle = goals.includes('build-muscle');
    return [
      {
        id: 1,
        name: isMuscle ? 'Dada Ayam Panggang Protein' : 'Tumis Sehat Rumahan',
        match: '90%',
        time: '20 mnt',
        cal: isMuscle ? 450 : 320,
        missing: ['Bawang Putih'],
        tags: [isMuscle ? 'Tinggi Protein' : 'Rendah Gula'],
      },
      {
        id: 2,
        name: 'Sup Bening Praktis',
        match: '75%',
        time: '15 mnt',
        cal: 180,
        missing: ['Kaldu Jamur'],
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
    <div className="screen-scroll h-full overflow-y-auto px-5 pt-4 pb-24 bg-slate-50 relative">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 transition-all active:scale-95 shadow-sm">
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Meal Planner</p>
          <h1 className="text-xl font-extrabold text-slate-900">Nutrisi & Resep</h1>
        </div>
      </div>

      <div className="flex bg-white border border-slate-100 shadow-sm rounded-2xl p-1 mb-6">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'schedule' ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-slate-500'
          }`}
        >
          <CalendarDays size={16} /> Jadwal Harian
        </button>
        <button
          onClick={() => setActiveTab('scanner')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'scanner' ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-slate-500'
          }`}
        >
          <Camera size={16} /> Scan Bahan
        </button>
      </div>

      {activeTab === 'schedule' ? (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase">Rekomendasi Hari Ini</h2>
            <div className="text-right">
              <span className="text-lg font-extrabold text-teal-600">{plan.dailyCal}</span>
              <span className="text-xs font-bold text-slate-500 uppercase ml-1">Kcal</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {MEAL_ORDER.map(mealType => {
              const meal = plan.meals[mealType];
              if (!meal) return null;
              
              return (
                <div key={mealType} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                        {MEAL_ICONS[mealType]}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">{meal.title}</h3>
                        <p className="text-xs font-bold text-teal-600 mt-0.5">{meal.time}</p>
                      </div>
                    </div>
                  </div>
                  
                  {meal.foods.map((food, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setSelectedMeal(food)}
                      className="w-full text-left bg-slate-50 rounded-2xl p-4 transition-all active:scale-[0.98] border border-transparent hover:border-teal-100 hover:bg-teal-50/50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-bold text-slate-900 leading-snug">{food.name}</p>
                        <span className="text-xs font-bold text-teal-700 shrink-0 bg-teal-100/50 px-2.5 py-1 rounded-xl">
                          {food.cal} kcal
                        </span>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-red-400" />
                          <span className="text-[10px] font-bold text-slate-600 uppercase">P: {food.prot}g</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-orange-400" />
                          <span className="text-[10px] font-bold text-slate-600 uppercase">K: {food.carbs}g</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-indigo-400" />
                          <span className="text-[10px] font-bold text-slate-600 uppercase">L: {food.fat}g</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="relative rounded-3xl overflow-hidden mb-5 border border-slate-100 shadow-sm bg-white" style={{ height: '160px' }}>
            <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center gap-3">
              {scanning ? (
                <>
                  <div className="w-12 h-12 rounded-full border-4 border-teal-200 border-t-teal-600 animate-spin" />
                  <p className="text-teal-700 text-xs font-bold">AI memindai isi kulkas...</p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                    <Camera size={24} className="text-teal-600" />
                  </div>
                  <p className="text-slate-600 text-xs font-bold">Foto isi kulkas atau bahan makanan Anda</p>
                </>
              )}
            </div>
            {!scanning && (
              <button
                onClick={simulateScan}
                className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-teal-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95"
              >
                <Sparkles size={14} /> Scan Kulkas
              </button>
            )}
          </div>

          <form onSubmit={handleAddIng} className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ketik bahan (contoh: Ayam, Telur...)"
                className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all shadow-sm"
              />
            </div>
            <button type="submit" disabled={!inputVal.trim()} className="w-[52px] rounded-2xl bg-teal-600 text-white flex items-center justify-center disabled:opacity-50 active:scale-95 transition-all shadow-sm">
              <Plus size={20} />
            </button>
          </form>

          {ingredients.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-bold text-slate-500 uppercase mb-3">Bahan Tersedia ({ingredients.length})</p>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ing, i) => (
                  <span key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
                    {ing}
                    <button onClick={() => removeIngredient(i)} className="text-slate-400 hover:text-red-500">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {recipes.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <ChefHat size={18} className="text-teal-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase">Rekomendasi AI</h2>
              </div>
              <div className="space-y-3">
                {recipes.map(recipe => (
                  <button 
                    key={recipe.id} 
                    onClick={() => setSelectedMeal(recipe)}
                    className="w-full text-left rounded-3xl bg-white shadow-sm border border-slate-100 p-5 transition-all active:scale-[0.98] hover:border-teal-100"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-sm font-bold text-slate-900 pr-2 leading-snug">{recipe.name}</h3>
                      <span className="shrink-0 bg-teal-50 text-teal-700 text-[10px] font-extrabold px-2 py-1 rounded-lg">
                        Cocok {recipe.match}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <span className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                        <Clock size={14} /> {recipe.time}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                        <Flame size={14} /> {recipe.cal} kcal
                      </span>
                    </div>

                    {recipe.missing.length > 0 && (
                      <div className="mb-4 bg-red-50 p-3 rounded-xl">
                        <p className="text-[10px] font-bold text-red-600 mb-1 uppercase">Bahan Kurang:</p>
                        <p className="text-xs font-semibold text-red-700">{recipe.missing.join(', ')}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {recipe.tags.map((tag, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {ingredients.length === 0 && !scanning && (
            <div className="text-center py-12 opacity-80">
              <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils size={32} className="text-teal-600" />
              </div>
              <p className="text-base font-bold text-slate-900 mb-1">Belum ada bahan</p>
              <p className="text-sm text-slate-500">Scan kulkas atau ketik bahan yang Anda miliki untuk mulai.</p>
            </div>
          )}
        </div>
      )}

      {/* Detail View Modal */}
      {selectedMeal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in slide-in-from-bottom-8">
            <div className="flex justify-between items-start mb-5">
              <h2 className="text-xl font-extrabold text-slate-900 pr-4 leading-tight">{selectedMeal.name}</h2>
              <button onClick={() => setSelectedMeal(null)} className="p-2 bg-slate-100 rounded-full text-slate-500 transition-all active:scale-95"><X size={20}/></button>
            </div>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-xl text-sm font-bold flex items-center gap-1.5"><Flame size={16}/> {selectedMeal.cal} kcal</span>
              <span className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold flex items-center gap-1.5"><Clock size={16}/> 15 min</span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Cara Membuat</h3>
              <ol className="list-decimal pl-5 text-sm text-slate-700 mb-2 space-y-2 font-medium">
                <li>Siapkan bahan-bahan segar sesuai resep.</li>
                <li>Panaskan wajan dengan sedikit minyak zaitun.</li>
                <li>Masak hingga matang merata dan bumbui sesuai selera.</li>
                <li>Angkat dan sajikan selagi hangat.</li>
              </ol>
            </div>

            <button 
              onClick={() => {
                addConsumedCalories(selectedMeal.cal);
                setSelectedMeal(null);
              }}
              className="w-full h-14 bg-teal-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
            >
              <CheckCircle size={20}/> Add to Diary
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
