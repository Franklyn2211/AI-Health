import { useMemo, useState } from 'react';
import { useHealth } from '../context/healthContextCore';
import { ArrowLeft, Camera, Plus, X, ChefHat, Sparkles, Clock, Flame, Utensils, Coffee, Sun, Moon, Apple, CalendarDays, CheckCircle, Stethoscope } from 'lucide-react';
import { buildAdaptiveTargets } from '../lib/adaptiveTargets';
import FoodDiaryCard from './FoodDiaryCard';

const MEAL_DATABASE = {
  'body-goals': {
    'Halal (default)': {
      dailyCal: 2150,
      meals: {
        breakfast: { title: 'Sarapan warteg ringan', time: '07:30', foods: [{ name: 'Nasi uduk porsi kecil + telur balado + timun', cal: 480, prot: 18, carbs: 58, fat: 18, estimatedPrice: 18000, note: 'Pilih porsi nasi setengah bila target turun berat badan.' }] },
        lunch: { title: 'Makan siang Padang seimbang', time: '12:30', foods: [{ name: 'Nasi Padang ayam pop + daun singkong + kuah sedikit', cal: 650, prot: 38, carbs: 72, fat: 22, estimatedPrice: 28000, note: 'Minta kuah dipisah agar lemak dan garam lebih terkendali.' }] },
        dinner: { title: 'Malam tinggi protein', time: '19:00', foods: [{ name: 'Soto ayam bening + nasi setengah + telur', cal: 520, prot: 34, carbs: 56, fat: 16, estimatedPrice: 22000, note: 'Pilih kuah bening dan tambah jeruk nipis, bukan kerupuk banyak.' }] },
        snack: { title: 'Camilan lokal', time: '15:30', foods: [{ name: 'Pisang + kacang tanah sangrai', cal: 230, prot: 8, carbs: 32, fat: 8, estimatedPrice: 12000, note: 'Camilan murah untuk energi sebelum aktivitas.' }] },
      }
    },
    'Halal': null,
    'Tidak ada pantangan': null,
    'Carnivore/High protein': {
      dailyCal: 2300,
      meals: {
        breakfast: { title: 'Protein praktis', time: '07:30', foods: [{ name: 'Telur dadar 3 butir + tempe + lalap', cal: 520, prot: 36, carbs: 18, fat: 32, estimatedPrice: 20000 }] },
        lunch: { title: 'Warteg tinggi protein', time: '12:30', foods: [{ name: 'Nasi setengah + ayam bakar + tahu + sayur asem', cal: 620, prot: 45, carbs: 55, fat: 20, estimatedPrice: 26000 }] },
        dinner: { title: 'Makan malam pemulihan', time: '19:00', foods: [{ name: 'Ikan bakar + lalap + nasi setengah', cal: 540, prot: 42, carbs: 45, fat: 18, estimatedPrice: 30000 }] },
        snack: { title: 'Camilan', time: '15:30', foods: [{ name: 'Susu tinggi protein lokal', cal: 180, prot: 20, carbs: 12, fat: 5, estimatedPrice: 15000 }] },
      }
    },
    'Vegan': {
      dailyCal: 2200,
      meals: {
        breakfast: { title: 'Sarapan nabati', time: '07:30', foods: [{ name: 'Bubur kacang hijau tanpa santan kental + pisang', cal: 390, prot: 14, carbs: 68, fat: 7, estimatedPrice: 14000 }] },
        lunch: { title: 'Warteg nabati', time: '12:30', foods: [{ name: 'Nasi merah + tempe orek + sayur lodeh kuah sedikit', cal: 560, prot: 24, carbs: 78, fat: 16, estimatedPrice: 22000 }] },
        dinner: { title: 'Makan malam vegan', time: '19:00', foods: [{ name: 'Gado-gado tanpa telur + bumbu kacang setengah', cal: 470, prot: 22, carbs: 52, fat: 18, estimatedPrice: 20000 }] },
        snack: { title: 'Camilan', time: '15:30', foods: [{ name: 'Tahu kukus + sambal kecap sedikit', cal: 180, prot: 14, carbs: 12, fat: 8, estimatedPrice: 10000 }] },
      }
    },
    'default': {
      dailyCal: 2150,
      meals: {
        breakfast: { title: 'Sarapan lokal', time: '07:30', foods: [{ name: 'Lontong sayur porsi kecil + telur', cal: 500, prot: 19, carbs: 62, fat: 18, estimatedPrice: 18000 }] },
        lunch: { title: 'Makan siang warteg', time: '12:30', foods: [{ name: 'Nasi + ayam bakar + sayur bening + tempe', cal: 640, prot: 40, carbs: 72, fat: 20, estimatedPrice: 26000 }] },
        dinner: { title: 'Malam sederhana', time: '19:00', foods: [{ name: 'Mie ayam porsi normal + pangsit rebus', cal: 560, prot: 28, carbs: 70, fat: 16, estimatedPrice: 22000 }] },
        snack: { title: 'Camilan', time: '15:30', foods: [{ name: 'Buah potong + yogurt plain', cal: 210, prot: 9, carbs: 35, fat: 4, estimatedPrice: 16000 }] },
      }
    }
  },
  'mental-health': {
    'Halal (default)': {
      dailyCal: 1900,
      meals: {
        breakfast: { title: 'Sarapan stabil energi', time: '07:30', foods: [{ name: 'Bubur ayam tanpa cakwe + telur', cal: 430, prot: 24, carbs: 55, fat: 12, estimatedPrice: 18000, note: 'Lebih ringan saat mood atau tidur sedang turun.' }] },
        lunch: { title: 'Makan siang anti lemas', time: '12:30', foods: [{ name: 'Gado-gado telur + lontong sedikit', cal: 520, prot: 24, carbs: 50, fat: 24, estimatedPrice: 22000, note: 'Minta bumbu kacang setengah agar tidak terlalu berat.' }] },
        dinner: { title: 'Malam menenangkan', time: '19:00', foods: [{ name: 'Soto ayam bening + nasi setengah', cal: 470, prot: 28, carbs: 52, fat: 14, estimatedPrice: 20000, note: 'Kuah hangat dan protein cukup membantu rutinitas malam.' }] },
        snack: { title: 'Camilan tenang', time: '15:30', foods: [{ name: 'Pisang + teh tawar hangat', cal: 130, prot: 2, carbs: 30, fat: 0, estimatedPrice: 8000 }] },
      }
    },
    'Halal': null,
    'Tidak ada pantangan': null,
    'default': {
      dailyCal: 1900,
      meals: {
        breakfast: { title: 'Sarapan mood stabil', time: '07:30', foods: [{ name: 'Roti gandum telur + pisang', cal: 410, prot: 18, carbs: 56, fat: 12, estimatedPrice: 18000 }] },
        lunch: { title: 'Makan siang lokal', time: '12:30', foods: [{ name: 'Nasi pecel + telur + tempe', cal: 540, prot: 25, carbs: 62, fat: 20, estimatedPrice: 22000 }] },
        dinner: { title: 'Makan malam ringan', time: '19:00', foods: [{ name: 'Sup ayam sayur + nasi setengah', cal: 430, prot: 28, carbs: 45, fat: 12, estimatedPrice: 20000 }] },
        snack: { title: 'Camilan relaxing', time: '15:30', foods: [{ name: 'Pisang atau pepaya potong', cal: 120, prot: 1, carbs: 28, fat: 0, estimatedPrice: 8000 }] },
      }
    }
  },
  'immune-booster': {
    'Halal (default)': {
      dailyCal: 2000,
      meals: {
        breakfast: { title: 'Mulai hari', time: '07:30', foods: [{ name: 'Nasi kuning porsi kecil + telur + timun', cal: 480, prot: 18, carbs: 58, fat: 18, estimatedPrice: 18000 }] },
        lunch: { title: 'Makan siang hangat', time: '12:30', foods: [{ name: 'Soto ayam + nasi setengah + jeruk', cal: 520, prot: 32, carbs: 56, fat: 15, estimatedPrice: 22000 }] },
        dinner: { title: 'Makan malam rumah', time: '19:00', foods: [{ name: 'Nasi + ikan kembung + sayur asem', cal: 560, prot: 34, carbs: 60, fat: 18, estimatedPrice: 26000 }] },
        snack: { title: 'Camilan imun', time: '15:30', foods: [{ name: 'Jambu biji potong', cal: 90, prot: 2, carbs: 20, fat: 1, estimatedPrice: 10000 }] },
      }
    },
    'Halal': null,
    'Tidak ada pantangan': null,
    'default': {
      dailyCal: 2000,
      meals: {
        breakfast: { title: 'Vitamin C lokal', time: '07:30', foods: [{ name: 'Bubur ayam + jeruk', cal: 460, prot: 24, carbs: 58, fat: 12, estimatedPrice: 20000 }] },
        lunch: { title: 'Makan siang antioksidan', time: '12:30', foods: [{ name: 'Nasi merah + ayam kunyit + sayur bening', cal: 560, prot: 35, carbs: 65, fat: 12, estimatedPrice: 26000 }] },
        dinner: { title: 'Makan malam hangat', time: '19:00', foods: [{ name: 'Sup ayam jahe + tahu + nasi setengah', cal: 430, prot: 30, carbs: 35, fat: 14, estimatedPrice: 22000 }] },
        snack: { title: 'Camilan imun', time: '15:30', foods: [{ name: 'Kacang tanah sangrai + teh tawar', cal: 190, prot: 8, carbs: 10, fat: 13, estimatedPrice: 10000 }] },
      }
    }
  }
};

const MEAL_ORDER = ['breakfast', 'snack', 'lunch', 'dinner'];
const MEAL_ICONS = { breakfast: <Coffee size={18} />, snack: <Apple size={18} />, lunch: <Sun size={18} />, dinner: <Moon size={18} /> };
const formatRupiah = (value) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
}).format(value);

const normalizeDietKey = (diet) => {
  if (!diet || diet === 'Halal') return 'Halal (default)';
  if (diet === 'Tidak ada pantangan') return 'default';
  return diet;
};

const getPlanTone = (direction, focus) => {
  if (direction === 'gain') return {
    label: 'Surplus sehat',
    title: 'Naik berat badan sehat',
    note: 'Porsi dibuat lebih padat kalori dengan protein tinggi, bukan sekadar makanan manis.',
  };
  if (direction === 'lose') return {
    label: 'Defisit ringan',
    title: 'Diet realistis',
    note: 'Porsi menjaga protein tinggi, kuah/saus dikontrol, dan karbo dibuat lebih sadar.',
  };
  if (focus === 'stress' || focus === 'mood' || focus === 'burnout' || focus === 'sleep') return {
    label: 'Stabil energi',
    title: 'Makan anti lemas',
    note: 'Menu dibuat ringan, hangat, dan cukup protein agar mood dan energi tidak naik turun tajam.',
  };
  return {
    label: 'Seimbang',
    title: 'Rutinitas sehat',
    note: 'Menu menjaga protein, sayur, hidrasi, dan porsi lokal yang mudah dicari.',
  };
};

const scaleFood = (food, calorieFactor, proteinBoost = 0) => ({
  ...food,
  cal: Math.round(food.cal * calorieFactor),
  prot: Math.round(food.prot + proteinBoost),
  carbs: Math.round(food.carbs * calorieFactor),
  fat: Math.round(food.fat * Math.min(calorieFactor, 1.15)),
});

function adaptMealPlan(basePlan, adaptivePlan, userProfile) {
  const direction = adaptivePlan.direction;
  const tone = getPlanTone(direction, userProfile.focus);
  const factor = direction === 'gain' ? 1.18 : direction === 'lose' ? 0.82 : 1;
  const proteinBoost = direction === 'gain' || direction === 'lose' || direction === 'strength' ? 6 : 0;
  const meals = Object.fromEntries(Object.entries(basePlan.meals).map(([key, meal]) => [
    key,
    {
      ...meal,
      title: direction === 'gain' && key === 'snack' ? 'Camilan tambah kalori' : direction === 'lose' && key === 'dinner' ? 'Malam ringan tinggi protein' : meal.title,
      foods: meal.foods.map((food) => ({
        ...scaleFood(food, factor, proteinBoost),
        note: direction === 'gain'
          ? 'Tambah telur, tempe, alpukat, atau susu bila target kalori belum tercapai.'
          : direction === 'lose'
            ? 'Utamakan lauk protein, sayur, dan kurangi kuah santan/minuman manis.'
            : food.note || tone.note,
      })),
    },
  ]));

  if (direction === 'gain') {
    meals.snack = {
      title: 'Camilan surplus',
      time: '15:30',
      foods: [{
        name: 'Pisang + susu tinggi protein + kacang sangrai',
        cal: 420,
        prot: 28,
        carbs: 52,
        fat: 12,
        estimatedPrice: 22000,
        note: 'Cara murah menaikkan kalori tanpa membuat makan utama terlalu besar.',
      }],
    };
  }

  if (direction === 'lose') {
    meals.breakfast = {
      title: 'Sarapan kenyang ringan',
      time: '07:30',
      foods: [{
        name: 'Bubur ayam tanpa cakwe + telur + teh tawar',
        cal: 390,
        prot: 30,
        carbs: 45,
        fat: 10,
        estimatedPrice: 18000,
        note: 'Protein tinggi membantu kenyang lebih lama tanpa defisit ekstrem.',
      }],
    };
  }

  return {
    ...basePlan,
    ...tone,
    dailyCal: adaptivePlan.nutrition.calorieTarget,
    proteinTarget: adaptivePlan.nutrition.proteinTarget,
    carbTarget: adaptivePlan.nutrition.carbTarget,
    fatTarget: adaptivePlan.nutrition.fatTarget,
    meals,
  };
}

export default function MealPlannerView({ onBack, onTabChange }) {
  const { userProfile, todayRecord, dailyRecords, addLoggedMeal } = useHealth();
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const adaptivePlan = useMemo(() => (
    buildAdaptiveTargets(userProfile, todayRecord, dailyRecords)
  ), [dailyRecords, todayRecord, userProfile]);

  const [ingredients, setIngredients] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [scanning, setScanning] = useState(false);
  const [recipes, setRecipes] = useState([]);

  const generateRecipes = (_ingList) => {
    return [
      {
        id: 1,
        name: 'Dada Ayam Panggang Protein',
        match: '90%',
        time: '20 mnt',
        cal: 450,
        missing: ['Bawang Putih'],
        tags: ['Tinggi Protein'],
        ingredients: ['200g Dada Ayam', '1 sdm Minyak Zaitun', 'Garam & Merica', '1 siung Bawang Putih (Opsional)'],
        steps: ['Panaskan wajan dengan minyak zaitun.', 'Bumbui dada ayam dengan garam, merica, dan bawang putih halus.', 'Panggang ayam selama 7-10 menit tiap sisi hingga matang sempurna.', 'Sajikan selagi hangat.']
      },
      {
        id: 2,
        name: 'Sup Bening Praktis',
        match: '75%',
        time: '15 mnt',
        cal: 180,
        missing: ['Kaldu Jamur'],
        tags: ['Cepat', 'Rendah Kalori'],
        ingredients: ['1 ikat Bayam', '2 butir Telur rebus', '1 buah Tomat', 'Kaldu Jamur'],
        steps: ['Rebus air hingga mendidih.', 'Masukkan tomat potong dan bayam segar.', 'Tambahkan kaldu jamur secukupnya.', 'Sajikan bersama irisan telur rebus di atasnya.']
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

  // Filter logic based on goals and diet methods
  const getPlan = () => {
    const goals = userProfile.goals || [];
    const diet = normalizeDietKey(userProfile.diet);
    
    let goalKey = 'body-goals'; // Default
    if (goals.includes('mental-health')) goalKey = 'mental-health';
    if (goals.includes('immune-booster')) goalKey = 'immune-booster';
    if (goals.includes('body-goals')) goalKey = 'body-goals';

    const goalPlans = MEAL_DATABASE[goalKey] || MEAL_DATABASE['body-goals'];
    const basePlan = goalPlans[diet] || goalPlans['default'] || MEAL_DATABASE['body-goals']['default'];
    return adaptMealPlan(basePlan, adaptivePlan, userProfile);
  };

  const plan = getPlan();

  const handleAddToDiary = () => {
    if (selectedMeal) {
      addLoggedMeal({
        name: selectedMeal.name,
        cal: selectedMeal.cal || 0,
        prot: selectedMeal.prot || 0,
        carbs: selectedMeal.carbs || 0,
        fat: selectedMeal.fat || 0,
        source: 'meal-planner',
      });
      setSelectedMeal(null);
    }
  };

  return (
    <div className="screen-scroll h-full overflow-y-auto px-5 pt-4 pb-24 bg-slate-50 relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 transition-all active:scale-95 shadow-sm">
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Meal Planner Indonesia</p>
          <h1 className="text-xl font-extrabold text-slate-900">Nutrisi & Resep</h1>
        </div>
      </div>

      <div className="flex bg-white border border-slate-100 shadow-sm rounded-2xl p-1 mb-6">
        <button onClick={() => setActiveTab('schedule')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'schedule' ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-slate-500'}`}>
          <CalendarDays size={16} /> Jadwal Harian
        </button>
        <button onClick={() => setActiveTab('scanner')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'scanner' ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-slate-500'}`}>
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
          <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold uppercase text-teal-700">Mode nutrisi AI</p>
                <h2 className="mt-1 text-base font-extrabold text-slate-900">{plan.title}</h2>
              </div>
              <span className="rounded-lg bg-teal-50 px-2 py-1 text-[10px] font-extrabold text-teal-700">{plan.label}</span>
            </div>
            <p className="mt-2 text-xs font-bold leading-relaxed text-slate-600">{plan.note}</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                ['Protein', `${plan.proteinTarget}g`],
                ['Karbo', `${plan.carbTarget}g`],
                ['Lemak', `${plan.fatTarget}g`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-slate-50 px-3 py-2">
                  <p className="text-[9px] font-extrabold uppercase text-slate-400">{label}</p>
                  <p className="mt-1 text-sm font-extrabold text-slate-900">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4 rounded-2xl border border-teal-100 bg-teal-50 p-3">
            <p className="text-[10px] font-extrabold uppercase text-teal-700">Preferensi lokal</p>
            <p className="mt-1 text-xs font-bold leading-relaxed text-teal-900">
              {userProfile.diet || 'Halal (default)'} · estimasi harga Indonesia · porsi nasi bisa disesuaikan.
            </p>
          </div>
          <div className="mb-4">
            <FoodDiaryCard compact />
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
                    <button key={idx} onClick={() => setSelectedMeal(food)} className="w-full text-left bg-slate-50 rounded-2xl p-4 transition-all active:scale-[0.98] border border-transparent hover:border-teal-100 hover:bg-teal-50/50">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-bold text-slate-900 leading-snug">{food.name}</p>
                        <span className="text-xs font-bold text-teal-700 shrink-0 bg-teal-100/50 px-2.5 py-1 rounded-xl">{food.cal} kcal</span>
                      </div>
                      <div className="mb-2 flex flex-wrap gap-2">
                        {food.estimatedPrice && (
                          <span className="rounded-lg bg-white px-2 py-1 text-[10px] font-extrabold text-slate-600">
                            Est. {formatRupiah(food.estimatedPrice)}
                          </span>
                        )}
                        {food.note && (
                          <span className="rounded-lg bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">
                            {food.note}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-400" /><span className="text-[10px] font-bold text-slate-600 uppercase">P: {food.prot}g</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-400" /><span className="text-[10px] font-bold text-slate-600 uppercase">K: {food.carbs}g</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-400" /><span className="text-[10px] font-bold text-slate-600 uppercase">L: {food.fat}g</span></div>
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
                placeholder="Ketik bahan (contoh: ayam, tempe, bayam...)"
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
            
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-xl text-sm font-bold flex items-center gap-1.5"><Flame size={16}/> {selectedMeal.cal} kcal</span>
              <span className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold flex items-center gap-1.5"><Clock size={16}/> {selectedMeal.time || '15 mnt'}</span>
              {selectedMeal.estimatedPrice && (
                <span className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-xl text-sm font-bold">
                  Est. {formatRupiah(selectedMeal.estimatedPrice)}
                </span>
              )}
            </div>
            {selectedMeal.note && (
              <p className="mb-4 rounded-2xl bg-amber-50 p-3 text-xs font-bold leading-relaxed text-amber-800">
                {selectedMeal.note}
              </p>
            )}

            <div className="mb-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase mb-2">Bahan-Bahan</h3>
              <ul className="list-disc pl-5 space-y-1">
                {(selectedMeal.ingredients || ['Bahan protein utama', 'Sayuran segar pelengkap', 'Bumbu masakan sehat', 'Sumber karbohidrat']).map((ing, idx) => (
                  <li key={idx} className="text-sm text-slate-600 font-medium">{ing}</li>
                ))}
              </ul>
            </div>

            <div className="mb-6 max-h-40 overflow-y-auto pr-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase mb-2">Cara Membuat</h3>
              <div className="space-y-3">
                {(selectedMeal.steps || ['Siapkan semua bahan yang dibutuhkan.', 'Masak bahan utama hingga tingkat kematangan yang diinginkan.', 'Tambahkan bumbu secukupnya.', 'Sajikan selagi hangat.']).map((step, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <button onClick={handleAddToDiary} className="w-full h-14 bg-teal-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm">
              <CheckCircle size={20}/> Tambahkan ke Diary
            </button>
          </div>
        </div>
      )}
      {/* FAB */}
      <button 
        onClick={() => onTabChange && onTabChange('clinic', { category: 'Ahli Gizi' })}
        className="fixed bottom-24 right-5 w-14 h-14 bg-teal-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-teal-600/30 transition-all active:scale-90 z-40"
        title="Tanya Ahli Gizi"
      >
        <Stethoscope size={24} />
      </button>
    </div>
  );
}
