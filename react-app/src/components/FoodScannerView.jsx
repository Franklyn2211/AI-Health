import { useState } from 'react';
import { useHealth } from '../context/healthContextCore';
import { ArrowLeft, Camera, Zap, CheckCircle2, RotateCcw, Utensils, Minus, Plus, PlusCircle, X, Flame, Clock } from 'lucide-react';
import { buildAdaptiveTargets } from '../lib/adaptiveTargets';
import FoodDiaryCard from './FoodDiaryCard';

const SUGGESTED_FOODS = [
    { id: 1, name: 'Nasi Padang ayam pop', calories: 650, protein: 38, carbs: 72, fat: 22, tag: 'Halal', goal: 'default', time: 'Siap saji', priceRange: 'Rp 25-35rb', ingredients: ['Nasi putih', 'Ayam pop', 'Daun singkong', 'Sambal sedikit', 'Kuah dipisah'], steps: ['Pilih ayam pop atau ayam bakar.', 'Minta kuah santan dipisah.', 'Ambil daun singkong untuk serat.', 'Gunakan sambal secukupnya.'] },
    { id: 2, name: 'Soto ayam bening', calories: 470, protein: 28, carbs: 52, fat: 14, tag: 'Ringan', goal: 'default', time: 'Siap saji', priceRange: 'Rp 18-25rb', ingredients: ['Soto ayam', 'Nasi setengah', 'Telur', 'Jeruk nipis'], steps: ['Pilih kuah bening.', 'Gunakan nasi setengah porsi.', 'Tambah telur untuk protein.', 'Batasi kerupuk bila sedang menjaga kalori.'] },
    { id: 3, name: 'Gado-gado telur', calories: 520, protein: 24, carbs: 50, fat: 24, tag: 'Sayur', goal: 'default', time: 'Siap saji', priceRange: 'Rp 18-25rb', ingredients: ['Sayuran rebus', 'Telur', 'Lontong sedikit', 'Bumbu kacang setengah'], steps: ['Minta bumbu kacang setengah dulu.', 'Tambah telur untuk protein.', 'Kurangi lontong bila sudah makan nasi sebelumnya.'] },
    { id: 4, name: 'Paket warteg ayam sayur', calories: 640, protein: 40, carbs: 72, fat: 20, tag: 'Seimbang', goal: 'build-strength', time: 'Siap saji', priceRange: 'Rp 20-28rb', ingredients: ['Nasi', 'Ayam bakar', 'Tempe', 'Sayur bening'], steps: ['Pilih satu protein utama.', 'Tambah satu lauk nabati seperti tempe.', 'Pilih sayur bening atau tumis ringan.', 'Sesuaikan porsi nasi dengan aktivitas hari ini.'] },
    { id: 7, name: 'Nasi ayam telur tempe', calories: 760, protein: 48, carbs: 86, fat: 24, tag: 'Naik BB', goal: 'gain-weight', time: 'Siap saji', priceRange: 'Rp 24-32rb', ingredients: ['Nasi', 'Ayam bakar', 'Telur', 'Tempe', 'Sayur'], steps: ['Ambil nasi porsi normal.', 'Pilih dua sumber protein.', 'Tambah tempe untuk kalori dan protein murah.', 'Tetap ambil sayur agar pencernaan nyaman.'] },
    { id: 5, name: 'Mie ayam porsi normal', calories: 560, protein: 28, carbs: 70, fat: 16, tag: 'Kontrol porsi', goal: 'default', time: 'Siap saji', priceRange: 'Rp 15-22rb', ingredients: ['Mie ayam', 'Ayam cincang', 'Sawi', 'Pangsit rebus'], steps: ['Pilih pangsit rebus dibanding goreng.', 'Tambah sawi bila tersedia.', 'Minum air putih, bukan minuman manis.'] },
    { id: 6, name: 'Bakso kuah', calories: 430, protein: 24, carbs: 46, fat: 16, tag: 'Kuah hangat', goal: 'default', time: 'Siap saji', priceRange: 'Rp 15-25rb', ingredients: ['Bakso sapi', 'Bihun sedikit', 'Sawi', 'Kuah kaldu'], steps: ['Pilih bakso kuah tanpa gorengan tambahan.', 'Minta bihun sedikit.', 'Tambah sawi untuk serat.', 'Batasi saus dan kecap bila sensitif garam.'] }
];

function MacroBar({ label, value, max, color }) {
    const percent = Math.min((value / max) * 100, 100);
    return (
        <div>
            <div className="flex justify-between items-end mb-1">
                <span className="text-[11px] font-[800] text-[#253532]">{label}</span>
                <span className="text-[10px] font-[850]" style={{ color }}>{value.toFixed(1)}g / {max}g</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#f0f4f2] overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percent}%`, backgroundColor: color }} />
            </div>
        </div>
    );
}

export default function FoodScannerView({ onBack }) {
    const { userProfile, todayRecord, dailyRecords, addLoggedMeal } = useHealth();
    const goals = userProfile.goals || [];
    const focus = userProfile.focus || '';
    const adaptivePlan = buildAdaptiveTargets(userProfile, todayRecord, dailyRecords);
    const isPregnancy = goals.includes('pregnancy');
    const goals_cal = adaptivePlan.nutrition.calorieTarget;
    const proteinGoal = adaptivePlan.nutrition.proteinTarget;
    const carbGoal = adaptivePlan.nutrition.carbTarget;
    const dietLabel = userProfile.diet || 'Halal (default)';
    const scanAdvice = adaptivePlan.direction === 'gain'
        ? 'Cari tambahan kalori berkualitas: telur, tempe, susu, kacang, atau nasi porsi normal.'
        : adaptivePlan.direction === 'lose'
            ? 'Utamakan protein dan sayur. Kurangi kuah santan, gorengan tambahan, dan minuman manis.'
            : ['stress', 'mood', 'burnout', 'sleep'].includes(focus)
                ? 'Pilih makanan hangat dan stabil energi. Jangan skip makan saat mood turun.'
                : 'Gunakan hasil scan untuk menjaga porsi tetap sesuai target harian.';

    const [scanning, setScanning] = useState(false);
    const [scanned, setScanned] = useState([]);
    const [lastAdded, setLastAdded] = useState(null);
    const [selectedFood, setSelectedFood] = useState(null);

    const simulateScan = () => {
        setScanning(true);
        setTimeout(() => {
            const mockDetect = { name: 'Nasi Padang ayam pop', calories: 650, protein: 38, carbs: 72, fat: 22, qty: 1, priceRange: 'Rp 25-35rb' };
            setScanned(prev => [mockDetect, ...prev]);
            setScanning(false);
            setLastAdded(mockDetect.name);
            setTimeout(() => setLastAdded(null), 3000);
        }, 2000);
    };

    const addFood = (food) => {
        const item = { ...food, qty: 1 };
        setScanned(prev => [item, ...prev]);
        setLastAdded(food.name);
        setTimeout(() => setLastAdded(null), 3000);
    };

    const totals = scanned.reduce((acc, f) => {
        return {
            cal: acc.cal + (f.calories * f.qty),
            prot: acc.prot + (f.protein * f.qty),
            carbs: acc.carbs + (f.carbs * f.qty),
            fat: acc.fat + (f.fat * f.qty),
        };
    }, { cal: 0, prot: 0, carbs: 0, fat: 0 });

    const handleAddToDiary = () => {
        addLoggedMeal({ 
            name: "Pindaian Kamera", 
            cal: Math.round(totals.cal),
            prot: Math.round(totals.prot),
            carbs: Math.round(totals.carbs),
            fat: Math.round(totals.fat)
        });
        setScanned([]);
        setLastAdded('Total kalori ke Diary');
        setTimeout(() => setLastAdded(null), 3000);
    };

    const suggestedFoods = SUGGESTED_FOODS.filter((food) => (
        food.goal === 'default' || goals.includes(food.goal) || focus === food.goal
    ));

    return (
        <div className="screen-scroll h-full overflow-y-auto px-5 pt-4 pb-24 bg-slate-50 relative">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
                <button onClick={onBack} className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 transition-all active:scale-95 shadow-sm">
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Scan</p>
                    <h1 className="text-xl font-extrabold text-slate-900">Pemindai Makanan</h1>
                    <p className="mt-0.5 text-[11px] font-bold text-teal-700">{dietLabel} · porsi & harga Indonesia</p>
                </div>
            </div>

            {/* Camera Mockup */}
            <div className="relative rounded-3xl overflow-hidden mb-5 shadow-sm" style={{ height: '220px', background: 'linear-gradient(135deg, #0f2a26 0%, #1f6e64 60%, #2c9e8e 100%)' }}>
                {/* Corner guides */}
                {['top-5 left-5', 'top-5 right-5', 'bottom-5 left-5', 'bottom-5 right-5'].map((pos, i) => (
                    <div key={i} className={`absolute ${pos} w-8 h-8`}>
                        <div className="w-full h-full border-white/60"
                            style={{ borderTopWidth: i < 2 ? '3px' : 0, borderBottomWidth: i >= 2 ? '3px' : 0, borderLeftWidth: i % 2 === 0 ? '3px' : 0, borderRightWidth: i % 2 === 1 ? '3px' : 0, borderRadius: '4px' }} />
                    </div>
                ))}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    {scanning ? (
                        <>
                            <div className="w-16 h-16 rounded-full border-4 border-white/30 border-t-white animate-spin" />
                            <p className="text-white text-sm font-bold tracking-wide">Memindai...</p>
                        </>
                    ) : (
                        <>
                            <Camera size={48} className="text-white/80 drop-shadow-md mb-2" />
                            <p className="text-white text-xs font-bold">Arahkan kamera ke makanan</p>
                        </>
                    )}
                </div>
                {/* Red scan line animation */}
                {scanning && (
                    <div className="absolute left-6 right-6 h-0.5 bg-red-400/80 animate-pulse top-1/2 shadow-[0_0_10px_rgba(248,113,113,0.8)]" />
                )}
                <button
                    onClick={simulateScan}
                    disabled={scanning}
                    className="absolute bottom-5 right-5 flex items-center gap-2 bg-white text-teal-700 text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                    <Zap size={16} fill="currentColor" /> Pindai
                </button>
            </div>

            {/* Success toast */}
            {lastAdded && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-5 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                    <p className="text-sm font-bold text-emerald-800">{lastAdded} ditambahkan!</p>
                </div>
            )}

            {/* Macro Summary Card */}
            <section className="rounded-3xl bg-white shadow-sm border border-slate-100 p-6 mb-6">
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Nutrisi Dideteksi</h2>
                        <p className="mt-1 text-[11px] font-bold text-slate-500">Target {goals_cal} kcal · Protein {proteinGoal}g</p>
                    </div>
                    {totals.cal > 0 && (
                        <button onClick={handleAddToDiary} className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm">
                            <PlusCircle size={16} /> Tambah ke Diary
                        </button>
                    )}
                </div>
                <p className="mb-4 rounded-2xl bg-teal-50 px-3 py-2 text-[11px] font-bold leading-relaxed text-teal-800">
                    {scanAdvice}
                </p>

                {/* Calorie ring */}
                <div className="flex items-center gap-5 mb-6">
                    <div className="relative w-24 h-24 shrink-0">
                        <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90 drop-shadow-sm">
                            <circle cx="36" cy="36" r="30" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                            <circle cx="36" cy="36" r="30" fill="none" stroke="#0d9488" strokeWidth="8" strokeLinecap="round"
                                strokeDasharray={`${Math.min((totals.cal / goals_cal) * 188.5, 188.5)} 188.5`} />
                        </svg>
                        <span className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-lg font-extrabold text-teal-700 leading-tight">{Math.round(totals.cal)}</span>
                            <span className="text-[10px] font-bold text-slate-400">kcal</span>
                        </span>
                    </div>
                    <div className="flex-1 space-y-3">
                        <MacroBar label="Protein" value={totals.prot} max={proteinGoal} color="#f97316" />
                        <MacroBar label="Karbo" value={totals.carbs} max={carbGoal} color="#eab308" />
                        <MacroBar label="Lemak" value={totals.fat} max={65} color="#8b5cf6" />
                    </div>
                </div>

                {/* 4-macro grid */}
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { label: 'Kalori', val: Math.round(totals.cal), unit: 'kcal', color: '#0d9488' },
                        { label: 'Protein', val: totals.prot.toFixed(1), unit: 'g', color: '#f97316' },
                        { label: 'Karbo', val: totals.carbs.toFixed(1), unit: 'g', color: '#eab308' },
                        { label: 'Lemak', val: totals.fat.toFixed(1), unit: 'g', color: '#8b5cf6' },
                    ].map(m => (
                        <div key={m.label} className="rounded-2xl bg-slate-50 border border-slate-100 p-3 text-center">
                            <p className="text-base font-extrabold mb-0.5" style={{ color: m.color }}>{m.val}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">{m.unit}</p>
                            <p className="text-[10px] font-medium text-slate-400 mt-0.5">{m.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Scanned Items */}
            {scanned.length > 0 && (
                <section className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Makanan Dicatat</h2>
                        <button onClick={() => setScanned([])} className="flex items-center gap-1.5 text-xs text-red-500 font-bold px-2 py-1 hover:bg-red-50 rounded-lg transition-colors">
                            <RotateCcw size={14} /> Reset
                        </button>
                    </div>
                    <div className="space-y-3">
                        {scanned.map((f, i) => (
                            <div key={i} className="flex items-center gap-4 rounded-3xl bg-white border border-slate-100 p-4 shadow-sm transition-all">
                                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                                    <Utensils size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate mb-1">{f.name}</p>
                                    <p className="text-[11px] font-semibold text-slate-500">
                                        {f.calories * f.qty} kcal · P:{(f.protein * f.qty).toFixed(0)}g · K:{(f.carbs * f.qty).toFixed(0)}g
                                        {f.priceRange ? ` · ${f.priceRange}` : ''}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                                    <button onClick={() => setScanned(p => p.map((s, j) => j === i ? { ...s, qty: Math.max(1, s.qty - 1) } : s))}
                                        className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center active:scale-95 text-slate-600">
                                        <Minus size={14} />
                                    </button>
                                    <span className="text-xs font-bold w-4 text-center">{f.qty}</span>
                                    <button onClick={() => setScanned(p => p.map((s, j) => j === i ? { ...s, qty: s.qty + 1 } : s))}
                                        className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center active:scale-95 text-slate-600">
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="mb-6">
                <FoodDiaryCard compact />
            </div>

            {/* Suggested Foods for Goal */}
            <section>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    Rekomendasi Makanan
                    {isPregnancy && <span className="text-[10px] bg-pink-100 text-pink-600 px-2.5 py-1 rounded-xl normal-case font-bold">Kehamilan</span>}
                </h2>
                <div className="space-y-3">
                    {suggestedFoods.map(food => (
                        <div key={food.id} onClick={() => setSelectedFood(food)} className="flex items-center gap-4 rounded-3xl bg-white border border-slate-100 p-4 shadow-sm cursor-pointer transition-all active:scale-[0.98] hover:border-teal-100">
                            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                                <Utensils size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-bold text-slate-900 truncate">{food.name}</p>
                                    <span className="text-[10px] bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded-lg shrink-0 border border-teal-100">{food.tag}</span>
                                </div>
                                <p className="text-[11px] font-medium text-slate-500">
                                    {food.calories} kcal · P:{food.protein}g · K:{food.carbs}g · L:{food.fat}g · {food.priceRange}
                                </p>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); addFood(food); }}
                                className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center transition-all active:scale-90 shrink-0 hover:bg-teal-600 hover:text-white">
                                <Plus size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Detail View Modal */}
            {selectedFood && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[32px] w-full max-w-md p-6 shadow-2xl animate-in slide-in-from-bottom-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-5">
                            <h2 className="text-xl font-extrabold text-slate-900 pr-4 leading-tight">{selectedFood.name}</h2>
                            <button onClick={() => setSelectedFood(null)} className="p-2 bg-slate-100 rounded-full text-slate-500 transition-all active:scale-95"><X size={20}/></button>
                        </div>
                        
                        <div className="flex flex-wrap gap-3 mb-4">
                            <span className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-xl text-sm font-bold flex items-center gap-1.5"><Flame size={16}/> {selectedFood.calories} kcal</span>
                            <span className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold flex items-center gap-1.5"><Clock size={16}/> {selectedFood.time || '15 mnt'}</span>
                            {selectedFood.priceRange && (
                                <span className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-xl text-sm font-bold">{selectedFood.priceRange}</span>
                            )}
                        </div>

                        {selectedFood.ingredients && (
                            <div className="mb-4">
                                <h3 className="text-xs font-bold text-slate-900 uppercase mb-2">Bahan-Bahan</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    {selectedFood.ingredients.map((ing, idx) => (
                                        <li key={idx} className="text-sm text-slate-600 font-medium">{ing}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {selectedFood.steps && (
                            <div className="mb-6">
                                <h3 className="text-xs font-bold text-slate-900 uppercase mb-2">Cara Membuat</h3>
                                <div className="space-y-3">
                                    {selectedFood.steps.map((step, idx) => (
                                        <div key={idx} className="flex gap-3">
                                            <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 font-bold text-xs flex items-center justify-center shrink-0">
                                                {idx + 1}
                                            </div>
                                            <p className="text-sm text-slate-600 font-medium leading-relaxed">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <button onClick={() => { addFood(selectedFood); setSelectedFood(null); }} className="w-full h-14 bg-teal-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm">
                            <PlusCircle size={20}/> Tambahkan ke Scan
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
